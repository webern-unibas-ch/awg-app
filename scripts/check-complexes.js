#!/usr/bin/env node
/**
 * check-complexes.js
 *
 * Checks the edition complexes (edition-complexes.json) against the edition outline and row tables,
 * and the parts of composite complexes (e.g. the songs of an opus).
 *
 * 1) Outline: every complex of the outline (edition-outline.json) is listed there once (the app
 *    keeps one entry per complex). It and every enabled row table (rowtables.json) need exactly
 *    one entry in the edition complexes. Complexes that are neither
 *    in the outline nor in the row tables are listed as a note.
 *
 * 2) Parts: a composite complex lists its parts in their order (parts: [{ complex, textVersion }]).
 *    Every part needs an entry in the edition complexes and is listed once, not as the complex
 *    itself. The Werkedition names a valid text version for all parts or for none, and its
 *    protection period (pubStatement.availability) is a year.
 *
 * 3) Types: source list types that number the parts (I, II, … with tab marks, e.g. in the print of
 *    an opus) need to name the M numbers of the parts in the same order. Differences are warnings.
 *
 * Usage:  node scripts/check-complexes.js
 *         yarn check:complexes
 *
 * Exit code 0 = outline, complexes and parts match (warnings do not fail the check)
 * Exit code 1 = at least one error was found, or the edition data could not be read
 */

'use strict';

const fs = require('fs');
const path = require('path');

const { EDITION_DATA_DIR, relPath, readJson } = require('./check-utils');

const COMPLEXES_FILE = path.join(EDITION_DATA_DIR, 'edition-complexes.json');
const OUTLINE_FILE = path.join(EDITION_DATA_DIR, 'edition-outline.json');
const ROWTABLES_FILE = path.join(EDITION_DATA_DIR, 'rowtables.json');
// Short forms of the catalogue types (as EDITION_CATALOGUE_TYPE_CONSTANTS in the app)
const CATALOGUE_SHORT = { OPUS: 'op.', MNR: 'M', MNR_X: 'M*' };
// The mark of a numbered part in a type (roman numeral between tab marks) and the M number after it
const NUMBERED_PART_MARK = /<span class="tab"><\/span>[IVX]+<span class="tab"><\/span>/;
const MNR_PATTERN = /\bM\*? \d+(?:\/\d+)?/;

// The catalogue label of a complex (e.g. M 317, op. 25)
function catalogueLabel(complex) {
    const { catalogueType, catalogueNumber } = complex.titleStatement;
    return `${CATALOGUE_SHORT[catalogueType] ?? catalogueType} ${catalogueNumber}`;
}

// The M numbers of the numbered parts of a type, one per part (each part up to the next mark)
function numberedMnrs(type) {
    return type
        .split(NUMBERED_PART_MARK)
        .slice(1)
        .map(part => part.match(MNR_PATTERN)?.[0] ?? '(no M number)');
}

// ── Read the complexes, the outline and the row tables ───────────────────────

function readComplexes(errors) {
    const complexes = new Map();
    for (const entry of readJson(COMPLEXES_FILE).editionComplexes) {
        for (const [complexId, complex] of Object.entries(entry)) {
            if (complexes.has(complexId)) {
                errors.push(`${complexId} is listed twice in the edition complexes`);
            }
            complexes.set(complexId, complex);
        }
    }
    return complexes;
}

function readOutlineComplexes() {
    const complexIds = [];
    for (const series of readJson(OUTLINE_FILE).editionOutline ?? []) {
        for (const section of series.sections ?? []) {
            for (const complexType of ['opus', 'mnr']) {
                for (const entry of section.content?.complexTypes?.[complexType] ?? []) {
                    complexIds.push(entry.complex);
                }
            }
        }
    }
    return complexIds;
}

// Row tables are listed by route (e.g. /op19)
function readRowtables() {
    return readJson(ROWTABLES_FILE).rowtables.map(rowtable => ({
        complexId: rowtable.route.replace(/^\//, ''),
        disabled: rowtable.disabled,
    }));
}

// The source list of a complex (empty if the complex has no data folder)
function readSourceList(complexId, complex) {
    const { series, section } = complex.pubStatement;
    const file = path.join(
        EDITION_DATA_DIR,
        'series',
        series,
        'section',
        section.toLowerCase(),
        complexId,
        'source-list.json'
    );
    return fs.existsSync(file) ? readJson(file).sources : [];
}

// ── Check ────────────────────────────────────────────────────────────────────

function check() {
    const errors = [];
    const warnings = [];
    const notes = [];
    const complexes = readComplexes(errors);
    const outline = readOutlineComplexes();
    const rowtables = readRowtables();
    const listed = new Set([...outline, ...rowtables.map(rowtable => rowtable.complexId)]);

    const outlineSeen = new Set();
    for (const complexId of outline) {
        if (!complexes.has(complexId)) {
            errors.push(`${complexId} is listed in the outline, but missing in the edition complexes`);
        }
        if (outlineSeen.has(complexId)) {
            errors.push(`${complexId} is listed twice in the outline`);
        }
        outlineSeen.add(complexId);
    }
    // Disabled row tables may wait for their complex
    for (const { complexId, disabled } of rowtables) {
        if (!disabled && !complexes.has(complexId)) {
            errors.push(`${complexId} is an enabled row table, but missing in the edition complexes`);
        }
    }
    const unlisted = [...complexes.keys()].filter(complexId => !listed.has(complexId));
    if (unlisted.length) {
        notes.push(
            `In the edition complexes, but not listed in the app (neither in the outline nor in the row tables): ${unlisted.join(', ')}`
        );
    }

    let partCount = 0;
    for (const [complexId, complex] of complexes) {
        const parts = (complex.parts ?? []).map(part => part.complex);
        partCount += parts.length;
        const textVersions = (complex.parts ?? []).filter(part => part.textVersion !== undefined).length;
        if (textVersions && textVersions < parts.length) {
            errors.push(`${complexId}: only ${textVersions} of ${parts.length} parts have a text version`);
        }
        const workEdition = complex.pubStatement?.availability?.workEdition;
        const protectedUntil = workEdition?.protectedUntil;
        if (workEdition && !/^\d{4}$/.test(protectedUntil ?? '')) {
            errors.push(`${complexId}: the Werkedition has an invalid protection period "${protectedUntil}"`);
        }
        const seen = new Set();
        for (const { complex: part, textVersion } of complex.parts ?? []) {
            if (textVersion !== undefined && !/^(\d+|einzige)$/.test(textVersion)) {
                errors.push(`${complexId}: part ${part} has an invalid text version "${textVersion}"`);
            }
            if (!complexes.has(part)) {
                errors.push(`${complexId}: part ${part} is missing in the edition complexes`);
            }
            if (part === complexId) {
                if (!seen.has(part)) {
                    errors.push(`${complexId} lists itself as a part`);
                }
            } else if (seen.has(part)) {
                errors.push(`${complexId} lists part ${part} twice`);
            }
            seen.add(part);
        }

        const sources = readSourceList(complexId, complex);
        const expected = parts.map(part => (complexes.has(part) ? catalogueLabel(complexes.get(part)) : part));
        for (const source of sources) {
            const numbered = numberedMnrs(source.type ?? '');
            if (numbered.length && numbered.join(', ') !== expected.join(', ')) {
                const siglum = `${source.siglum}${source.siglumAddendum ?? ''}`;
                warnings.push(
                    `${complexId}:${siglum}: the type in the source list numbers ${numbered.join(', ')}, but ${complexId} lists ${expected.length ? `${expected.join(', ')} as parts` : 'no parts'}`
                );
            }
        }
    }

    return { errors, warnings, notes, complexCount: complexes.size, partCount };
}

// ── Run ──────────────────────────────────────────────────────────────────────

function main() {
    let result;
    try {
        result = check();
    } catch (error) {
        console.error(`ERROR  ${error.message}`);
        // exitCode instead of exit(), so that the output is flushed (as in check-glyphs.js)
        process.exitCode = 1;
        return;
    }
    const { errors, warnings, notes, complexCount, partCount } = result;

    console.log(
        `Edition complexes: ${complexCount} in ${relPath(COMPLEXES_FILE)}, ${partCount} part(s) of composite complexes`
    );
    for (const note of notes) {
        console.log(`[NOTE] ${note}`);
    }
    for (const warning of warnings) {
        console.log(`[WARN] ${warning}`);
    }
    for (const error of errors) {
        console.error(`[ERR ] ${error}`);
    }
    if (errors.length) {
        process.exitCode = 1;
    } else {
        console.log('[OK  ] Outline, edition complexes and parts match');
    }
}

main();
