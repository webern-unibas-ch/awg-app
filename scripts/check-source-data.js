#!/usr/bin/env node
/**
 * check-source-data.js
 *
 * Checks single values of the source lists and source descriptions (the writing instruments, the
 * locations and the types) and the writing instruments named in the texts. Complements
 * check-shared-sources.js, which compares the copies of one document across complexes.
 *
 * Terms (as in the models of src/app/views/edition-view/models/):
 *   source list         source-list.json, its sources are the list sources (Source) and the text sources (TextSource)
 *   source description  source-description.json, its sources are the descriptions (SourceDesc) with a physDesc
 *   textcritics         textcritics.json, its elements are items (e.g. SkRT, M145_TF1)
 *   writing instrument  a string of writingInstruments.main or writingInstruments.secondary
 *   named / declared    a writing instrument occurs in a text / is listed in writingInstruments
 *   ref                 the source of a hit (op3:E), or the complex if the hit belongs to no single source (op20)
 *   path                the position of a text in the JSON (corrections[0].label)
 *
 * Rules (an error fails the check with exit code 1; a warning, a rule listed in WARNING_RULES, does not):
 *   Writing instruments
 *   1) Error: A writing instrument names a single instrument: no "und" or "sowie" outside of brackets.
 *   2) Error: The brackets () and [] of a writing instrument are balanced (a split at a comma inside
 *      brackets is a typical break).
 *   3) Error: A writing instrument has more than one word outside of brackets, except Bleistift and
 *      Kopierstift (e.g. "schwarze Tinte", not "Tinte").
 *   4) Error: A writing instrument is not empty (only the main one of a print, a type "Druck von ...", is).
 *   5) Warning: A writing instrument named in the physDesc of a description (corrections, titles,
 *      annotations, contents, ...) is declared in the writingInstruments of that description.
 *   6) Warning: A writing instrument named in the textcritics of a complex is declared by a description
 *      of the complex.
 *   7) Warning: A description has writingInstruments (a print has an empty main one), unless it is a
 *      placeholder for sources that are described elsewhere: its conditions are only a note in brackets.
 *   8) Warning: A secondary writing instrument is named in the physDesc of its description. The hits are
 *      listed for the volumes in LISTED_VOLUMES (all with --all) and counted for the others.
 *   Locations and types
 *   9) Error: A location (of a description, list source or text source) names the Moldenhauer folders
 *      as "Box-Folder 59/10", not "Box-Folder: 59/10".
 *  10) Error: The source list and the source description have the same type and location (compared
 *      as text, without markup such as links). A description without a type is fine if the source is
 *      described by sources with a siglum addendum (A with Aa, Ab, ...).
 *
 * Writing instruments are found by their name: a colour (schwarz, rot, ...) with Buntstift, Tinte,
 * Kugelschreiber or Stempelabdruck (in any declension), Bleistift and Kopierstift. Text in brackets
 * of a writing instrument (e.g. "rote Tinte [Teile des Titels]") explains it and names no further one.
 *
 * With --open, an HTML report with all hits (and their context in the text) is written to
 * reports/source-data.html and opened in the default browser.
 *
 * Usage:  node scripts/check-source-data.js
 *         yarn check:source-data
 *         yarn check:source-data --all
 *         yarn check:source-data --open
 *
 * Exit code 0 = no errors (warnings do not fail the check)
 * Exit code 1 = at least one error was found, or the edition data could not be read
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const {
    EDITION_DATA_DIR,
    relPath,
    editionJsonFiles,
    readJson,
    escapeHtml,
    markChangedWords,
    renderReportPage,
    writeReport,
    openInBrowser,
} = require('./check-utils');

const SOURCE_DESCRIPTION_FILE = 'source-description.json';
const SOURCE_LIST_FILE = 'source-list.json';
const TEXTCRITICS_FILE = 'textcritics.json';
const REPORT_FILE_NAME = 'source-data.html';
const LIST_ALL = process.argv.includes('--all');
const OPEN = process.argv.includes('--open');
const CONTEXT_LENGTH = 40;

// The rules with their title, topic (grouping in the report) and the subject of their hits
const INSTRUMENTS = 'Writing instruments';
const LOCATIONS_AND_TYPES = 'Locations and types';
const defineRule = (title, topic, subject = 'Source') => ({ title, topic, subject });
const RULES = {
    1: defineRule('Writing instrument names a single instrument', INSTRUMENTS),
    2: defineRule('Writing instrument has balanced brackets', INSTRUMENTS),
    3: defineRule('Writing instrument has more than one word (except Bleistift, Kopierstift)', INSTRUMENTS),
    4: defineRule('Writing instrument is not empty (except the main one of a print)', INSTRUMENTS),
    5: defineRule('physDesc names only writing instruments that writingInstruments declares', INSTRUMENTS),
    6: defineRule(
        'Textcritics name only writing instruments that a description of the complex declares',
        INSTRUMENTS,
        'Complex'
    ),
    7: defineRule('Description has writingInstruments (except placeholders)', INSTRUMENTS),
    8: defineRule('Secondary writing instruments are named in physDesc', INSTRUMENTS),
    9: defineRule('Location writes Box-Folder without a colon', LOCATIONS_AND_TYPES),
    10: defineRule('Type and location are the same in the source list and the source description', LOCATIONS_AND_TYPES),
};
const SECONDARY_INSTRUMENTS_RULE = 8;
// Rules that only report warnings (exit code 0). The rules on named and declared writing instruments are
// temporary warnings while their open cases are decided: remove them here to make them errors.
// The secondary writing instruments stay a warning (an instrument is often only in the list).
const WARNING_RULES = new Set([5, 6, 7, SECONDARY_INSTRUMENTS_RULE]);
// Volumes whose warnings of the secondary writing instruments rule are listed one by one (the others are counted)
const LISTED_VOLUMES = new Set(['I/5']);
const SERIES_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const SINGLE_WORD_INSTRUMENTS = new Set(['Bleistift', 'Kopierstift']);
const COLOURS = ['schwarz', 'rot', 'blau', 'grün', 'braun', 'türkis', 'violett', 'orange', 'gelb', 'grau'];
const COLOUR_STEM = new RegExp(`(?<![\\p{L}])(${COLOURS.join('|')})`, 'giu');
// One or more colours ("blauem und braunem") with the kind of the instrument
const COLOURED_INSTRUMENT = new RegExp(
    `(?<![\\p{L}])((?:(?:${COLOURS.join('|')})\\p{L}*\\s*(?:,|und|sowie|oder)\\s*)*(?:${COLOURS.join('|')})\\p{L}*)\\s+(Buntstift(?:es|s|e)?|Tinten?|Kugelschreibers?|Stempelabdrucks?)(?![\\p{L}])`,
    'giu'
);
const UNCOLOURED_INSTRUMENT = /(?<![\p{L}])(Bleistift|Kopierstift)(?:es|s)?(?![\p{L}])/giu;
const CONJUNCTION = /(?<![\p{L}])(?:und|sowie)(?![\p{L}])/iu;
const BRACKET_PAIRS = { ')': '(', ']': '[' };
// The declared writing instruments are not searched for writing instruments named in the text
const WRITING_INSTRUMENTS_KEY = 'writingInstruments';

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

// The texts of a value as [path, text], without the values of the given keys
function* textsWithPaths(value, valuePath = '', skippedKeys = new Set()) {
    if (typeof value === 'string') {
        yield [valuePath, value];
    } else if (Array.isArray(value)) {
        for (const [index, item] of value.entries()) {
            yield* textsWithPaths(item, `${valuePath}[${index}]`, skippedKeys);
        }
    } else if (value !== null && typeof value === 'object') {
        for (const [key, item] of Object.entries(value)) {
            if (!skippedKeys.has(key)) {
                yield* textsWithPaths(item, valuePath ? `${valuePath}.${key}` : key, skippedKeys);
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
// and its position in the text
function findInstruments(text) {
    const instruments = new Map();
    for (const match of text.matchAll(COLOURED_INSTRUMENT)) {
        const [name, colours, kind] = match;
        for (const [, colour] of colours.matchAll(COLOUR_STEM)) {
            instruments.set(`${colour.toLowerCase()} ${kind.slice(0, 3).toLowerCase()}`, { name, index: match.index });
        }
    }
    for (const match of text.matchAll(UNCOLOURED_INSTRUMENT)) {
        const [name, kind] = match;
        instruments.set(kind.toLowerCase(), { name, index: match.index });
    }
    return instruments;
}

// The text around a mention, to judge it without the source
function contextAround(text, index, length) {
    return {
        before: `${index > CONTEXT_LENGTH ? '…' : ''}${text.slice(Math.max(0, index - CONTEXT_LENGTH), index)}`,
        match: text.slice(index, index + length),
        after: `${text.slice(index + length, index + length + CONTEXT_LENGTH)}${text.length > index + length + CONTEXT_LENGTH ? '…' : ''}`,
    };
}

// The writing instruments named in the texts [path, text]: key → { name, path, context } of the first mention
function findNamedInstruments(texts) {
    const named = new Map();
    for (const [textPath, text] of texts) {
        const plainText = stripTags(text);
        for (const [key, { name, index }] of findInstruments(plainText)) {
            if (!named.has(key)) {
                named.set(key, { name, path: textPath, context: contextAround(plainText, index, name.length) });
            }
        }
    }
    return named;
}

// A print has the type "Druck von ..."
function isPrint(description) {
    return /^Druck(?![\p{L}])/u.test(stripTags(description.type));
}

// The writing instruments of a description: the main one (empty for prints) and the secondary ones
function instrumentsOf(description) {
    const { main, secondary } = description.physDesc?.writingInstruments ?? {};
    const mainInstrument = main === '' && isPrint(description) ? undefined : main;
    return [mainInstrument, ...(secondary ?? [])].filter(instrument => typeof instrument === 'string');
}

// The keys of the writing instruments that the given writing instruments declare
function declaredKeys(instruments) {
    return new Set(instruments.flatMap(instrument => [...findInstruments(stripBrackets(instrument)).keys()]));
}

// ── Read the complexes ───────────────────────────────────────────────────────

// The complexes with a source list or source descriptions, with their textcritics
function readComplexes() {
    const readIfExists = file => (fs.existsSync(file) ? readJson(file) : {});
    // A missing file counts as empty, so that its absence shows in the checks (e.g. rule 10)
    const complexDirs = new Set(
        editionJsonFiles()
            .filter(file => [SOURCE_DESCRIPTION_FILE, SOURCE_LIST_FILE].includes(path.basename(file)))
            .map(file => path.dirname(file))
    );
    return [...complexDirs].map(dir => {
        const dirNames = relPath(dir, EDITION_DATA_DIR).split('/');
        if (dirNames.length !== 5) {
            throw new Error(`Unexpected complex folder: ${relPath(dir)}`);
        }
        const [, series, , section, id] = dirNames;
        const sourceList = readIfExists(path.join(dir, SOURCE_LIST_FILE));
        return {
            id,
            volume: `${SERIES_NUMERALS[Number(series) - 1] ?? series}/${section}`,
            descriptions: readIfExists(path.join(dir, SOURCE_DESCRIPTION_FILE)).sources ?? [],
            listSources: sourceList.sources ?? [],
            textSources: sourceList.textSources ?? [],
            textcritics: readIfExists(path.join(dir, TEXTCRITICS_FILE)).textcritics ?? [],
        };
    });
}

// The ref of a source (list source or description): complex and siglum with addendum
function sourceRef(complex, source) {
    return `${complex.id}:${source.siglum}${source.siglumAddendum ?? ''}`;
}

function siglumKey(source) {
    return `${source.siglum}|${source.siglumAddendum ?? ''}`;
}

// ── Check ────────────────────────────────────────────────────────────────────

function checkWritingInstruments(ref, instruments, add) {
    for (const instrument of instruments) {
        const text = instrument.trim();
        if (!text) {
            add(4, ref, 'writingInstruments: empty instrument');
            continue;
        }
        // Brackets only explain the instrument: they neither name another one nor make a word
        const name = stripBrackets(text).trim();
        if (CONJUNCTION.test(name)) {
            add(1, ref, `writingInstruments: "${text}" names more than one instrument`);
        }
        if (!hasBalancedBrackets(text)) {
            add(2, ref, `writingInstruments: unbalanced brackets in "${text}"`);
        }
        if (!/\s/.test(name) && !SINGLE_WORD_INSTRUMENTS.has(name)) {
            add(3, ref, `writingInstruments: "${text}" is a single word`);
        }
    }
}

// The origin is the file kind of the location (source description or source list)
function checkLocation(ref, location, origin, add) {
    if (/Box-Folder:/.test(location ?? '')) {
        add(9, ref, `location (${origin}): "Box-Folder:" with a colon`);
    }
}

// The type and location of a list source and its description are the same
function checkSourceList(complex, add) {
    const descriptions = new Map(complex.descriptions.map(description => [siglumKey(description), description]));
    for (const listSource of complex.listSources.filter(source => source.hasDescription)) {
        const ref = sourceRef(complex, listSource);
        const description = descriptions.get(siglumKey(listSource));
        if (!description) {
            add(10, ref, 'source list: hasDescription, but no source description');
            continue;
        }
        const hasAddendumSources = complex.descriptions.some(
            other => other.siglum === description.siglum && (other.siglumAddendum ?? '') !== ''
        );
        for (const field of ['type', 'location']) {
            const listText = stripTags(listSource[field]);
            const descriptionText = stripTags(description[field]);
            if (listText !== descriptionText && !(field === 'type' && !descriptionText && hasAddendumSources)) {
                add(10, ref, `${field} differs in the source list and the source description`, {
                    detail: excerptOfDifference(listText, descriptionText),
                    diff: { left: listText, right: descriptionText },
                });
            }
        }
    }
}

// A placeholder stands for sources that are described elsewhere: its conditions are only a note in brackets
function isPlaceholder(description) {
    const conditions = (description.physDesc?.conditions ?? []).map(stripTags);
    return conditions.length ? conditions.every(text => text.startsWith('[') && text.endsWith(']')) : false;
}

// The writing instruments of a description and the ones named in its physDesc; returns the declared keys
function checkDescription(complex, description, add) {
    const ref = sourceRef(complex, description);
    const { writingInstruments } = description.physDesc ?? {};
    checkWritingInstruments(ref, instrumentsOf(description), add);
    checkLocation(ref, description.location, 'source description', add);

    if (!writingInstruments && !isPlaceholder(description)) {
        add(7, ref, 'physDesc: no writingInstruments (a print has "main": "")');
    }
    const declared = declaredKeys(instrumentsOf(description));
    const named = findNamedInstruments(textsWithPaths(description.physDesc, '', new Set([WRITING_INSTRUMENTS_KEY])));
    for (const [key, { name, path: textPath, context }] of named) {
        if (!declared.has(key)) {
            add(5, ref, `physDesc.${textPath} names "${name}", but writingInstruments does not declare it`, {
                context,
            });
        }
    }
    const unnamed = (writingInstruments?.secondary ?? []).filter(instrument =>
        [...declaredKeys([instrument])].some(key => !named.has(key))
    );
    if (unnamed.length) {
        add(
            SECONDARY_INSTRUMENTS_RULE,
            ref,
            `writingInstruments.secondary: ${unnamed.map(instrument => `"${instrument}"`).join(', ')} never named in physDesc`
        );
    }
    return declared;
}

// The writing instruments named in the textcritics are declared by a description of the complex
function checkTextcritics(complex, declared, add) {
    const named = new Map();
    for (const item of complex.textcritics) {
        for (const [key, { name, context }] of findNamedInstruments(textsWithPaths(item))) {
            named.set(key, {
                name,
                context: named.get(key)?.context ?? context,
                ids: [...(named.get(key)?.ids ?? []), item.id],
            });
        }
    }
    for (const [key, { name, context, ids }] of named) {
        if (!declared.has(key)) {
            const message = `textcritics (${ids.join(', ')}) name "${name}", but no description of the complex declares it`;
            add(6, complex.id, message, { context });
        }
    }
}

// The number of items under the key (e.g. descriptions) in all complexes
function countAll(complexes, key) {
    return complexes.reduce((sum, complex) => sum + complex[key].length, 0);
}

function check() {
    const complexes = readComplexes();
    if (!complexes.length) {
        throw new Error(`No ${SOURCE_LIST_FILE} or ${SOURCE_DESCRIPTION_FILE} found in ${relPath(EDITION_DATA_DIR)}`);
    }
    const hits = [];
    for (const complex of complexes) {
        const add = (ruleNumber, ref, message, extra = {}) =>
            hits.push({ rule: ruleNumber, volume: complex.volume, ref, message, ...extra });
        const declared = new Set();
        for (const description of complex.descriptions) {
            for (const key of checkDescription(complex, description, add)) {
                declared.add(key);
            }
        }
        for (const listSource of complex.listSources) {
            checkLocation(sourceRef(complex, listSource), listSource.location, 'source list', add);
        }
        // Text sources have an id instead of a description; no description or writing instruments to check
        for (const textSource of complex.textSources) {
            checkLocation(`${complex.id}:${textSource.id}`, textSource.location, 'source list, text source', add);
        }
        checkSourceList(complex, add);
        checkTextcritics(complex, declared, add);
    }
    hits.sort((a, b) => a.rule - b.rule);
    return {
        hits,
        errors: hits.filter(hit => !WARNING_RULES.has(hit.rule)),
        warnings: hits.filter(hit => WARNING_RULES.has(hit.rule)),
        descriptionCount: countAll(complexes, 'descriptions'),
        listSourceCount: countAll(complexes, 'listSources'),
        textSourceCount: countAll(complexes, 'textSources'),
        complexCount: complexes.length,
    };
}

// ── Output ───────────────────────────────────────────────────────────────────

function formatHit({ message, detail }) {
    return detail ? `${message}: ${detail}` : message;
}

// The secondary writing instrument warnings outside of the listed volumes are only counted per volume
function isListed(hit) {
    return hit.rule !== SECONDARY_INSTRUMENTS_RULE || LIST_ALL || LISTED_VOLUMES.has(hit.volume);
}

function printWarningCounts(warnings) {
    const counts = new Map();
    for (const { volume } of warnings.filter(hit => !isListed(hit))) {
        counts.set(volume, (counts.get(volume) ?? 0) + 1);
    }
    for (const [volume, count] of counts) {
        console.log(
            `[WARN] rule ${SECONDARY_INSTRUMENTS_RULE}  ${volume}: ${count} source(s) with secondary writing instruments never named in physDesc (--all lists them)`
        );
    }
}

// ── Report ───────────────────────────────────────────────────────────────────

const REPORT_STYLE = `
.rule { border: 1px solid var(--line); border-left: 4px solid var(--ok); border-radius: 6px; padding: 12px; margin: 12px 0; }
.rule.error { border-left-color: var(--err); } .rule.warning { border-left-color: var(--drift); }
.rule h3 { font-size: 1.05rem; margin: 0 0 4px; } h2.topic { font-size: 1.25rem; margin: 24px 0 0; }
.error .status { color: var(--err); font-weight: 600; } .warning .status { color: var(--drift); font-weight: 600; } .clean .status { color: var(--ok); font-weight: 600; }
tr.topic th { padding-top: 12px; font-size: 1rem; }
.top { float: right; font-size: .8rem; font-weight: normal; color: var(--muted); text-decoration: none; }
.top:hover { text-decoration: underline; }
.context { color: var(--muted); } mark { background: var(--add); color: inherit; }
`;

function renderContext({ before, match, after }) {
    return `<div class="context">${escapeHtml(before)}<mark>${escapeHtml(match)}</mark>${escapeHtml(after)}</div>`;
}

function renderDiff({ left, right }) {
    const [leftHtml, rightHtml] = markChangedWords(left, right);
    return `<table class="diff"><tr><th>Source list</th><th>Source description</th></tr><tr><td class="removed">${leftHtml}</td><td class="added">${rightHtml}</td></tr></table>`;
}

function renderHit({ volume, ref, message, context, diff }) {
    const details = `${context ? renderContext(context) : ''}${diff ? renderDiff(diff) : ''}`;
    return `<tr><td>${escapeHtml(volume)}</td><td><b>${escapeHtml(ref)}</b></td><td>${escapeHtml(message)}${details}</td></tr>`;
}

function renderRule(rule, hits) {
    const { title, subject } = RULES[rule];
    const kind = WARNING_RULES.has(rule) ? 'warning' : 'error';
    const status = hits.length ? `${hits.length} ${kind === 'warning' ? 'warning(s)' : 'error(s)'}` : 'no hits';
    const table = hits.length
        ? `<div class="overflow"><table class="list"><tr><th>Volume</th><th>${subject}</th><th>Hit</th></tr>${hits.map(renderHit).join('')}</table></div>`
        : '';
    return `
<section class="rule ${hits.length ? kind : 'clean'}" id="rule-${rule}">
<h3>Rule ${rule} · ${escapeHtml(title)} <a class="top" href="#rules">↑ rules</a></h3>
<p class="meta"><span class="status">${status}</span></p>
${table}
</section>`;
}

function renderReport({ hits, descriptionCount, listSourceCount, textSourceCount, complexCount }) {
    const rules = Object.keys(RULES).map(Number);
    const topics = [...new Set(rules.map(rule => RULES[rule].topic))];
    const overviewRow = rule => {
        const count = hits.filter(hit => hit.rule === rule).length;
        return `<tr><td><a href="#rule-${rule}">${rule}</a></td><td>${escapeHtml(RULES[rule].title)}</td><td>${WARNING_RULES.has(rule) ? 'warning' : 'error'}</td><td>${count}</td></tr>`;
    };
    const overviewRows = topics
        .map(
            topic =>
                `<tr class="topic"><th colspan="4">${escapeHtml(topic)}</th></tr>${rules
                    .filter(rule => RULES[rule].topic === topic)
                    .map(overviewRow)
                    .join('')}`
        )
        .join('');
    const sections = topics
        .map(
            topic =>
                `<h2 class="topic">${escapeHtml(topic)}</h2>${rules
                    .filter(rule => RULES[rule].topic === topic)
                    .map(rule =>
                        renderRule(
                            rule,
                            hits.filter(hit => hit.rule === rule)
                        )
                    )
                    .join('')}`
        )
        .join('');
    return renderReportPage({
        title: 'Source data report',
        style: REPORT_STYLE,
        intro: `<p>${descriptionCount} descriptions, ${listSourceCount} list sources and ${textSourceCount} text sources in ${complexCount} edition complexes. Errors fail the check; warnings are open cases or tolerated findings.</p>
<div class="overflow" id="rules"><table class="list"><tr><th>Rule</th><th>Check</th><th>Kind</th><th>Hits</th></tr>${overviewRows}</table></div>`,
        body: sections,
    });
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
    const { errors, warnings, descriptionCount, listSourceCount, textSourceCount, complexCount } = result;

    console.log(
        `Source data: ${descriptionCount} descriptions, ${listSourceCount} list sources, ${textSourceCount} text sources in ${complexCount} complexes`
    );
    for (const hit of warnings.filter(isListed)) {
        console.log(`[WARN] rule ${hit.rule}  ${hit.ref}: ${formatHit(hit)}`);
    }
    printWarningCounts(warnings);
    for (const hit of errors) {
        console.error(`[ERR ] rule ${hit.rule}  ${hit.ref}: ${formatHit(hit)}`);
    }
    if (errors.length) {
        process.exitCode = 1;
    } else {
        console.log('[OK  ] Writing instruments, locations and types of the sources are consistent');
    }

    if (OPEN) {
        const reportFile = writeReport(REPORT_FILE_NAME, renderReport(result));
        console.log(`\nReport: ${pathToFileURL(reportFile).href}`);
        openInBrowser(reportFile);
    }
}

main();
