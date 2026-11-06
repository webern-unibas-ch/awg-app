#!/usr/bin/env node
/**
 * check-source-data.js
 *
 * Checks single values of the source descriptions and source lists (the writing instruments, the
 * locations and the types) and the writing instruments named in the texts. Complements
 * check-shared-sources.js, which compares the copies of one document across complexes.
 *
 * Errors (exit code 1):
 * 1) A writing instrument entry is one instrument: no "und" or "sowie" outside of brackets.
 * 2) The brackets () and [] of an entry are balanced (a split at a comma inside brackets is a typical break).
 * 3) An entry has more than one word, except Bleistift and Kopierstift (e.g. "schwarze Tinte", not "Tinte").
 * 4) An entry is not empty (only the main writing instrument of a print is empty).
 * 5) A location names the Moldenhauer folders as "Box-Folder 59/10", not "Box-Folder: 59/10".
 * 8) The source list and the source description have the same type and location (compared as text,
 *    without markup such as links). A description without a type is fine if its source is described
 *    by sub-sources (A with Aa, Ab, ...).
 *
 * Hints (exit code 0, as long as the rule is listed in SOFT_RULES):
 * 6) A writing instrument named in the description of a source (corrections, titles, annotations,
 *    contents, ...) is declared in the writing instruments of that source. Sources without
 *    writing instruments (which refer to another source) are not checked.
 * 7) A writing instrument named in the textcritics of a complex is declared by a source of the complex.
 *
 * Further hint (exit code 0): a secondary writing instrument that is never named in the description
 * of its source. It is listed for the volumes in LISTED_VOLUMES (all with --all) and counted for the others.
 *
 * Writing instruments are found by their name: a colour (schwarz, rot, ...) with Buntstift, Tinte,
 * Kugelschreiber or Stempelabdruck (in any declension), Bleistift and Kopierstift. Text in brackets
 * of an entry (e.g. "rote Tinte [Teile des Titels]") explains the entry and names no further instrument.
 *
 * Usage:  node scripts/check-source-data.js
 *         yarn check:source-data
 *         yarn check:source-data --all
 *
 * Exit code 0 = no errors (hints do not fail the check)
 * Exit code 1 = at least one error was found, or the edition data could not be read
 */

'use strict';

const fs = require('fs');
const path = require('path');

const { EDITION_DATA_DIR, relPath, editionJsonFiles, readJson } = require('./check-utils');

const SOURCE_DESCRIPTION_FILE = 'source-description.json';
const SOURCE_LIST_FILE = 'source-list.json';
const TEXTCRITICS_FILE = 'textcritics.json';
const SHOW_ALL = process.argv.includes('--all');

// Rules that only report hints, while the data has open cases. Remove a rule to make it an error.
const SOFT_RULES = new Set([6, 7]);
// Volumes whose secondary writing instrument hints are listed one by one (the others are counted)
const LISTED_VOLUMES = new Set(['I/5']);
const SERIES_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const BARE_INSTRUMENTS = new Set(['Bleistift', 'Kopierstift']);
const COLOURS = ['schwarz', 'rot', 'blau', 'grün', 'braun', 'türkis', 'violett', 'orange', 'gelb', 'grau'];
const COLOURED_INSTRUMENT = new RegExp(
    `(?<![\\p{L}])(${COLOURS.join('|')})\\p{L}*\\s+(Buntstift(?:es|s|e)?|Tinten?|Kugelschreibers?|Stempelabdrucks?)(?![\\p{L}])`,
    'giu'
);
const BARE_INSTRUMENT = /(?<![\p{L}])(Bleistift|Kopierstift)(?:es|s)?(?![\p{L}])/giu;
const CONJUNCTION = /(?<![\p{L}])(?:und|sowie)(?![\p{L}])/iu;
const BRACKET_PAIRS = { ')': '(', ']': '[' };
// The key of the declared writing instruments, which is not searched for instruments named in the text
const DECLARATION_KEY = 'writingInstruments';

// ── Text helpers ─────────────────────────────────────────────────────────────

// Text without tags (line breaks as spaces); \s also matches non-breaking spaces.
// Tags are removed until none is left, as removing one can join the rest into a new one (e.g. <<b>x>).
function stripTags(text) {
    let result = (text ?? '').replace(/<br\s*\/?>/g, ' ').replace(/&nbsp;/g, ' ');
    let previous;
    do {
        previous = result;
        result = result.replace(/<[^>]*>/g, '');
    } while (result !== previous);
    return result.replace(/\s+/g, ' ').trim();
}

// Text without the content of brackets (also nested ones), which only explains the text before
function stripBrackets(text) {
    let result = text;
    let previous;
    do {
        previous = result;
        result = result.replace(/\([^()[\]]*\)|\[[^()[\]]*\]/g, '');
    } while (result !== previous);
    return result;
}

function hasBalancedBrackets(text) {
    const open = [];
    for (const char of text) {
        if (char === '(' || char === '[') {
            open.push(char);
        } else if (char in BRACKET_PAIRS && open.pop() !== BRACKET_PAIRS[char]) {
            return false;
        }
    }
    return !open.length;
}

// The strings of a value with their path, without the entries of the given keys
function* textEntries(value, location = '', skippedKeys = new Set()) {
    if (typeof value === 'string') {
        yield [location, value];
    } else if (Array.isArray(value)) {
        for (const [index, item] of value.entries()) {
            yield* textEntries(item, `${location}[${index}]`, skippedKeys);
        }
    } else if (value !== null && typeof value === 'object') {
        for (const [key, item] of Object.entries(value)) {
            if (!skippedKeys.has(key)) {
                yield* textEntries(item, location ? `${location}.${key}` : key, skippedKeys);
            }
        }
    }
}

// The first difference of two texts with some context
function excerptOfDifference(listText, descriptionText) {
    let index = 0;
    while (index < listText.length && listText[index] === descriptionText[index]) {
        index++;
    }
    const excerpt = text =>
        `${index > 20 ? '…' : ''}${text.slice(Math.max(0, index - 20), index + 40)}${text.length > index + 40 ? '…' : ''}`;
    return `list "${excerpt(listText)}" ≠ description "${excerpt(descriptionText)}"`;
}

// ── Writing instruments ──────────────────────────────────────────────────────

// The writing instruments named in a text: a normalized key (colour stem and kind) with the name as written
function instrumentsIn(text) {
    const instruments = new Map();
    for (const [name, colour, kind] of text.matchAll(COLOURED_INSTRUMENT)) {
        instruments.set(`${colour.toLowerCase()} ${kind.slice(0, 3).toLowerCase()}`, name);
    }
    for (const [name, kind] of text.matchAll(BARE_INSTRUMENT)) {
        instruments.set(kind.toLowerCase(), name);
    }
    return instruments;
}

// The writing instruments named in the texts [location, text]: key → { name, location } of the first mention
function namedInstruments(entries) {
    const named = new Map();
    for (const [location, text] of entries) {
        for (const [key, name] of instrumentsIn(stripTags(text))) {
            if (!named.has(key)) {
                named.set(key, { name, location });
            }
        }
    }
    return named;
}

// The entries of the writing instruments of a source: the main one (empty for prints) and the secondary ones
function instrumentEntries(writingInstruments) {
    const { main, secondary } = writingInstruments ?? {};
    return [main === '' ? undefined : main, ...(secondary ?? [])].filter(entry => typeof entry === 'string');
}

// The keys of the writing instruments declared by the entries
function declaredInstruments(entries) {
    return new Set(entries.flatMap(entry => [...instrumentsIn(stripBrackets(entry)).keys()]));
}

// ── Read the complexes ───────────────────────────────────────────────────────

// The complexes with source descriptions, with their source list and textcritics
function readComplexes() {
    const readSources = (file, key) => (fs.existsSync(file) ? (readJson(file)[key] ?? []) : []);
    return editionJsonFiles()
        .filter(file => path.basename(file) === SOURCE_DESCRIPTION_FILE)
        .map(file => {
            const dir = path.dirname(file);
            const [, series, , section, id] = relPath(dir, EDITION_DATA_DIR).split('/');
            return {
                id,
                volume: `${SERIES_NUMERALS[Number(series) - 1] ?? series}/${section}`,
                sources: readSources(file, 'sources'),
                list: readSources(path.join(dir, SOURCE_LIST_FILE), 'sources'),
                textcritics: readSources(path.join(dir, TEXTCRITICS_FILE), 'textcritics'),
            };
        });
}

function sourceLabel(complex, source) {
    return `${complex.id}:${source.siglum}${source.siglumAddendum ?? ''}`;
}

function siglumKey(source) {
    return `${source.siglum}|${source.siglumAddendum ?? ''}`;
}

// ── Check ────────────────────────────────────────────────────────────────────

function checkInstrumentEntries(label, entries, add) {
    for (const entry of entries) {
        const text = entry.trim();
        if (!text) {
            add(4, label, 'has an empty writing instrument');
            continue;
        }
        if (CONJUNCTION.test(stripBrackets(text))) {
            add(1, label, `has more than one writing instrument in "${text}"`);
        }
        if (!hasBalancedBrackets(text)) {
            add(2, label, `has unbalanced brackets in the writing instrument "${text}"`);
        }
        if (!/\s/.test(text) && !BARE_INSTRUMENTS.has(text)) {
            add(3, label, `has the single-word writing instrument "${text}"`);
        }
    }
}

function checkLocation(label, source, kind, add) {
    if (/Box-Folder:/.test(source.location ?? '')) {
        add(5, label, `has "Box-Folder:" with a colon in the location of the ${kind}`);
    }
}

// The type and location of the source list and the source description are the same
function checkListAgainstDescriptions(complex, add) {
    const descriptions = new Map(complex.sources.map(source => [siglumKey(source), source]));
    for (const entry of complex.list.filter(listEntry => listEntry.hasDescription)) {
        const label = sourceLabel(complex, entry);
        const description = descriptions.get(siglumKey(entry));
        if (!description) {
            add(8, label, 'is described in the source list, but has no description');
            continue;
        }
        const hasSubSources = complex.sources.some(
            source => source.siglum === description.siglum && (source.siglumAddendum ?? '') !== ''
        );
        for (const field of ['type', 'location']) {
            const listText = stripTags(entry[field]);
            const descriptionText = stripTags(description[field]);
            if (listText !== descriptionText && !(field === 'type' && !descriptionText && hasSubSources)) {
                add(
                    8,
                    label,
                    `has a different ${field} in the list and the description: ${excerptOfDifference(listText, descriptionText)}`
                );
            }
        }
    }
}

// The writing instruments of a source: the entries, the instruments named in its description
function checkSource(complex, source, add, secondaryHints) {
    const label = sourceLabel(complex, source);
    const { writingInstruments } = source.physDesc ?? {};
    checkInstrumentEntries(label, instrumentEntries(writingInstruments), add);
    checkLocation(label, source, 'description', add);

    // A source without writing instruments refers to another source (e.g. "Siehe E") and declares nothing
    if (!writingInstruments) {
        return new Set();
    }
    const declared = declaredInstruments(instrumentEntries(writingInstruments));
    const named = namedInstruments(textEntries(source.physDesc, '', new Set([DECLARATION_KEY])));
    for (const [key, { name, location }] of named) {
        if (!declared.has(key)) {
            add(6, label, `names "${name}" (${location}), but does not declare it in the writing instruments`);
        }
    }
    const unnamed = (writingInstruments.secondary ?? []).filter(entry =>
        [...declaredInstruments([entry])].some(key => !named.has(key))
    );
    if (unnamed.length) {
        secondaryHints.push({ volume: complex.volume, label, entries: unnamed });
    }
    return declared;
}

// The writing instruments named in the textcritics are declared by a source of the complex
function checkTextcritics(complex, declared, add) {
    const named = new Map();
    for (const entry of complex.textcritics) {
        for (const [key, { name }] of namedInstruments(textEntries(entry))) {
            named.set(key, { name, ids: [...(named.get(key)?.ids ?? []), entry.id] });
        }
    }
    for (const [key, { name, ids }] of named) {
        if (!declared.has(key)) {
            add(7, complex.id, `names "${name}" in the textcritics (${ids.join(', ')}), but no source declares it`);
        }
    }
}

function check() {
    const complexes = readComplexes();
    const hits = [];
    const secondaryHints = [];
    let sourceCount = 0;
    for (const complex of complexes) {
        const add = (rule, where, message) => hits.push({ rule, where, message });
        const declared = new Set();
        for (const source of complex.sources) {
            sourceCount++;
            for (const key of checkSource(complex, source, add, secondaryHints)) {
                declared.add(key);
            }
        }
        for (const entry of complex.list) {
            checkLocation(sourceLabel(complex, entry), entry, 'list', add);
        }
        checkListAgainstDescriptions(complex, add);
        checkTextcritics(complex, declared, add);
    }
    hits.sort((a, b) => a.rule - b.rule);
    return {
        errors: hits.filter(hit => !SOFT_RULES.has(hit.rule)),
        hints: hits.filter(hit => SOFT_RULES.has(hit.rule)),
        secondaryHints,
        sourceCount,
        complexCount: complexes.length,
    };
}

// ── Run ──────────────────────────────────────────────────────────────────────

// The secondary hints: listed for the volumes in LISTED_VOLUMES (or all with --all), counted for the others
function printSecondaryHints(secondaryHints) {
    const counts = new Map();
    for (const { volume, label, entries } of secondaryHints) {
        if (SHOW_ALL || LISTED_VOLUMES.has(volume)) {
            console.log(
                `[HINT] secondary  ${volume} ${label}: ${entries.map(entry => `"${entry}"`).join(', ')} never named in the description`
            );
        } else {
            counts.set(volume, (counts.get(volume) ?? 0) + 1);
        }
    }
    for (const [volume, count] of counts) {
        console.log(
            `[HINT] secondary  ${volume}: ${count} source(s) with secondary writing instruments never named (--all lists them)`
        );
    }
}

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
    const { errors, hints, secondaryHints, sourceCount, complexCount } = result;

    console.log(`Source data: ${sourceCount} sources in ${complexCount} complexes`);
    for (const { rule, where, message } of hints) {
        console.log(`[HINT] rule ${rule}  ${where}: ${message}`);
    }
    printSecondaryHints(secondaryHints);
    for (const { rule, where, message } of errors) {
        console.error(`[ERR ] rule ${rule}  ${where}: ${message}`);
    }
    if (errors.length) {
        process.exitCode = 1;
    } else {
        console.log('[OK  ] Writing instruments, locations and types of the sources are consistent');
    }
}

main();
