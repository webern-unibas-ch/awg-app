#!/usr/bin/env node
/**
 * check-glyphs.js
 *
 * Checks the chain of the edition glyphs: edition data → EDITION_GLYPHS_DATA → glyph font subset.
 *
 * 1) Edition data: every glyph placeholder `{{ref.getGlyph('[name]')}}` in the edition JSON data
 *    needs an entry with that `alt` in EDITION_GLYPHS_DATA, otherwise the glyph is rendered empty.
 *    Like the CompileHtmlDirective, the check works on the parsed JSON string values.
 *    Entries of EDITION_GLYPHS_DATA that the edition data does not use are listed as a note.
 *
 * 2) Glyph data: every entry needs a unique `alt` and a `hex` value with \uXXXX escapes.
 *
 * 3) Glyph font subset (AWG Edition Glyphs): the subset is created in the awg-utils repository
 *    (create_glyph_subset), which also writes a manifest. The manifest has to match the codepoints
 *    of EDITION_GLYPHS_DATA, and the font file has to match the sha256 of the manifest.
 *
 * Parsing logic mirrors create_glyph_subset (awg-utils):
 *   - only \uXXXX escapes inside `hex` string values (single, double or backtick quotes) count
 *   - a value with several escapes adds all of them (e.g. '\uE524\uE520')
 *   - literal characters (e.g. a space) are ignored
 * Glyphs the subset tool would skip (literal Private Use Area characters, \u{XXXX} escapes) are reported.
 *
 * Usage:  node scripts/check-glyphs.js
 *         yarn check:glyphs
 *
 * Exit code 0 = edition data, glyph data and subset match
 * Exit code 1 = at least one error was found
 */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const { ROOT, EDITION_DATA_DIR, relPath, editionJsonFiles, readJson } = require('./check-utils');

const GLYPHS_DATA_FILE = path.join(ROOT, 'src', 'app', 'views', 'edition-view', 'data', 'edition-glyphs.data.ts');
const FONT_DIR = path.join(ROOT, 'src', 'assets', 'themes', 'fonts', 'awg-edition-glyphs');
const MANIFEST_FILE = path.join(FONT_DIR, 'AWGEditionGlyphs.json');
const GLYPH_ENTRY_PATTERN = /\balt:\s*(['"`])(.*?)\1\s*,\s*hex:\s*(['"`])(.*?)\3/g;
const HEX_VALUE_PATTERN = /\bhex:\s*(['"`])(.*?)\1/g;
const UNICODE_ESCAPE_PATTERN = /\\u([0-9A-Fa-f]{4})/g;
const UNSUPPORTED_GLYPH_PATTERN = /[\uE000-\uF8FF]|\\u\{[0-9A-Fa-f]+\}/gu;
// Mirrors CompileHtmlDirective._replaceGlyphPlaceholders()
const GLYPH_PLACEHOLDER_PATTERN = /\{\{ref\.getGlyph\('([^']+)'\)\}\}/g;
const GLYPH_CALL_PATTERN = /ref\.getGlyph/g;
const DATA_HINT = 'Add the glyph to EDITION_GLYPHS_DATA, or fix the placeholder in the edition data.';
const GLYPHS_HINT = `Fix the entry in ${path.basename(GLYPHS_DATA_FILE)} (and create the subset again).`;
const SUBSET_HINT =
    'Create the subset again with create_glyph_subset in awg-utils and copy its output into the font folder.';

// The sorted entries of an iterable that are not in a set (or map)
function without(entries, excluded) {
    return [...entries].filter(entry => !excluded.has(entry)).sort();
}

// All string values of a parsed JSON value
function* stringValues(value) {
    if (typeof value === 'string') {
        yield value;
    } else if (value !== null && typeof value === 'object') {
        for (const child of Object.values(value)) {
            yield* stringValues(child);
        }
    }
}

// ── Read the glyph data: names (alt) and codepoints (in Unicode notation, e.g. U+E264) ──

function readGlyphsData(errors) {
    const content = fs.readFileSync(GLYPHS_DATA_FILE, 'utf8');

    const names = new Set();
    for (const [, , name, , hex] of content.matchAll(GLYPH_ENTRY_PATTERN)) {
        if (names.has(name)) {
            errors.push(`Duplicate alt ${name} (only the first entry is used)`);
        }
        if (!hex.match(UNICODE_ESCAPE_PATTERN)) {
            errors.push(`No \\uXXXX escape in the hex value of ${name}`);
        }
        names.add(name);
    }

    const codepoints = new Set();
    const unsupported = new Set();
    for (const [, , hex] of content.matchAll(HEX_VALUE_PATTERN)) {
        for (const [, escape] of hex.matchAll(UNICODE_ESCAPE_PATTERN)) {
            codepoints.add(`U+${escape.toUpperCase()}`);
        }
        for (const [value] of hex.matchAll(UNSUPPORTED_GLYPH_PATTERN)) {
            unsupported.add(value.startsWith('\\') ? value : `U+${value.codePointAt(0).toString(16).toUpperCase()}`);
        }
    }
    if (unsupported.size) {
        errors.push(`Use \\uXXXX escapes in hex values, not: ${[...unsupported].join(', ')}`);
    }

    return { names, codepoints };
}

// ── Read the glyph placeholders of the edition data (by name, with the files using them) ──

function readEditionPlaceholders(errors) {
    const placeholders = new Map();
    let total = 0;
    let fileCount = 0;

    for (const filePath of editionJsonFiles()) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('ref.getGlyph')) continue;

        const file = relPath(filePath);
        let data;
        try {
            data = JSON.parse(content);
        } catch (e) {
            errors.push(`Cannot parse ${file}: ${e.message}`);
            continue;
        }

        let calls = 0;
        let matches = 0;
        for (const value of stringValues(data)) {
            calls += value.match(GLYPH_CALL_PATTERN)?.length ?? 0;
            for (const [, name] of value.matchAll(GLYPH_PLACEHOLDER_PATTERN)) {
                matches++;
                placeholders.set(name, (placeholders.get(name) ?? new Set()).add(file));
            }
        }
        fileCount++;
        total += matches;
        if (matches !== calls) {
            errors.push(
                `${calls - matches} glyph placeholder(s) in ${file} not in the form {{ref.getGlyph('[name]')}} (would be shown as text)`
            );
        }
    }

    return { placeholders, total, fileCount };
}

// ── Read the manifest of the subset (null if missing or invalid) ─────────────

function readManifest(errors) {
    let manifest;
    try {
        manifest = readJson(MANIFEST_FILE);
    } catch (e) {
        errors.push(`Cannot read the manifest ${relPath(MANIFEST_FILE)}: ${e.message}`);
        return null;
    }
    if (manifest === null || typeof manifest !== 'object' || !Array.isArray(manifest.codepoints)) {
        errors.push(`The manifest ${relPath(MANIFEST_FILE)} has no list of codepoints.`);
        return null;
    }
    return manifest;
}

// ── Check the manifest and font files of the subset against the glyph codepoints ──

function checkSubset(manifest, glyphCodepoints, errors) {
    const subsetCodepoints = new Set(manifest.codepoints);
    if (subsetCodepoints.size !== manifest.codepoints.length || manifest.count !== manifest.codepoints.length) {
        errors.push(
            `The manifest is inconsistent: count ${manifest.count}, ${manifest.codepoints.length} entries, ${subsetCodepoints.size} unique.`
        );
    }

    const missing = without(glyphCodepoints, subsetCodepoints);
    const outdated = without(subsetCodepoints, glyphCodepoints);
    if (missing.length) {
        errors.push(`Missing in the subset: ${missing.join(', ')}`);
    }
    if (outdated.length) {
        errors.push(`In the subset, but no longer in the glyph data: ${outdated.join(', ')}`);
    }

    const existsInFontDir = file => typeof file === 'string' && file !== '' && fs.existsSync(path.join(FONT_DIR, file));
    if (!existsInFontDir(manifest.license)) {
        errors.push(`License listed in the manifest is missing: ${manifest.license ?? '(none)'}`);
    }
    if (!existsInFontDir(manifest.file)) {
        errors.push(`Font listed in the manifest is missing: ${manifest.file ?? '(none)'}`);
    } else if (typeof manifest.sha256 !== 'string' || !manifest.sha256) {
        errors.push('The manifest has no sha256 of the font.');
    } else {
        const fontHash = crypto
            .createHash('sha256')
            .update(fs.readFileSync(path.join(FONT_DIR, manifest.file)))
            .digest('hex');
        if (fontHash !== manifest.sha256.toLowerCase()) {
            errors.push(
                `The font ${manifest.file} does not match the sha256 of the manifest (font and manifest are from different runs).`
            );
        }
    }

    return subsetCodepoints;
}

// ── Print a group of errors with its hint ────────────────────────────────────

function printErrors(errors, hint) {
    if (!errors.length) return;
    console.error(`\n${'─'.repeat(60)}`);
    for (const error of errors) {
        console.error(`ERROR  ${error}`);
    }
    console.error(`\n${hint}`);
}

// ── Run ──────────────────────────────────────────────────────────────────────

const dataErrors = [];
const glyphsErrors = [];
const subsetErrors = [];

const glyphs = readGlyphsData(glyphsErrors);
const edition = readEditionPlaceholders(dataErrors);

for (const name of without(edition.placeholders.keys(), glyphs.names)) {
    dataErrors.push(`Unknown glyph ${name} in ${[...edition.placeholders.get(name)].sort().join(', ')}`);
}
const unusedNames = without(glyphs.names, edition.placeholders);

if (glyphs.codepoints.size === 0) {
    subsetErrors.push(`No \\uXXXX escapes found in any hex value of ${relPath(GLYPHS_DATA_FILE)}.`);
}
const manifest = readManifest(subsetErrors);
const subsetCodepoints = manifest ? checkSubset(manifest, glyphs.codepoints, subsetErrors) : null;

console.log(
    `Edition data: ${edition.total} glyph placeholder(s) in ${edition.fileCount} file(s) of ${relPath(EDITION_DATA_DIR)}`
);
console.log(
    `Glyph data:   ${glyphs.names.size} glyph(s), ${glyphs.codepoints.size} codepoint(s) in ${relPath(GLYPHS_DATA_FILE)}`
);
if (subsetCodepoints) {
    console.log(`Subset:       ${subsetCodepoints.size} codepoint(s) in ${relPath(MANIFEST_FILE)}`);
}
if (unusedNames.length) {
    console.log(`\n[NOTE] Not used in the edition data: ${unusedNames.join(', ')}`);
}

printErrors(dataErrors, DATA_HINT);
printErrors(glyphsErrors, GLYPHS_HINT);
printErrors(subsetErrors, SUBSET_HINT);

if (dataErrors.length || glyphsErrors.length || subsetErrors.length) {
    // exitCode instead of process.exit(), so the output is flushed completely
    process.exitCode = 1;
} else {
    console.log('\n[OK  ] Edition data, glyph data and glyph subset match');
}
