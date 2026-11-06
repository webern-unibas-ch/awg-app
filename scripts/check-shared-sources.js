#!/usr/bin/env node
/**
 * check-shared-sources.js
 *
 * Reports the sources that are described in more than one edition complex (one document,
 * e.g. a sketch leaf, used by several complexes) and compares their descriptions.
 *
 * 1) Groups: two descriptions from different complexes describe the same document if they have
 *    the same conditions and writing material text, or the same content items (item label with
 *    its folios). Empty texts and items without a label do not count. Matches are joined into
 *    groups. Content overlaps of at least 50 % outside a group are listed as near matches.
 *
 * 2) Differences: for each field of the physical description (and the folios of the folio convolute)
 *    that differs within a group, the copies are grouped into variants by value, most copies first.
 *    Every other variant is compared with the most frequent one. The complex-specific fields
 *    (siglum, type, corrections) are not compared. Format differences (deprecated keys, an empty
 *    string instead of an empty list, whitespace, folio segments without position) are listed
 *    apart from content differences.
 *
 * 3) Sigla in shared text: references to a complex-specific siglum (bold sigla, links to report
 *    fragments) in the compared fields are listed as warnings.
 *
 * With --since <ref>, the report also lists the changed fields of the descriptions since a git ref
 * (commit, branch or tag), each with the copies of the same document that have the new value.
 *
 * The report is written to reports/shared-sources.html; its file URL is printed at the end.
 * With --open, the report is also opened in the default browser.
 *
 * Usage:  node scripts/check-shared-sources.js
 *         yarn check:sources
 *         yarn check:sources --since develop
 *         yarn check:sources --open
 *
 * Exit code 0 = report written (differences do not fail the check)
 * Exit code 1 = the edition data or the git ref could not be read
 */

'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const { ROOT, EDITION_DATA_DIR, relPath, editionJsonFiles, readJson } = require('./check-utils');

const PACKAGE = require(path.join(ROOT, 'package.json'));
const PROJECT_LABEL = 'Anton Webern Gesamtausgabe · Online Edition';
const OUTLINE_FILE = path.join(EDITION_DATA_DIR, 'edition-outline.json');
const REPORT_FILE = path.join(ROOT, 'reports', 'shared-sources.html');
const SOURCE_DESC_FILE = 'source-description.json';
const SOURCE_LIST_FILE = 'source-list.json';
const FOLIO_CONVOLUTE_FILE = 'folio-convolute.json';
const SINCE_INDEX = process.argv.indexOf('--since');
const SINCE_ARG = SINCE_INDEX === -1 ? null : process.argv[SINCE_INDEX + 1];
const SINCE_REF = SINCE_ARG?.startsWith('--') ? null : SINCE_ARG;
const OPEN = process.argv.includes('--open');

const DEPRECATED_KEYS = {
    title: 'titles',
    date: 'dates',
    pagination: 'paginations',
    instrumentation: 'instrumentations',
    annotationss: 'annotations',
};
const LIST_KEYS = [
    'conditions',
    'writingMaterialStrings',
    'titles',
    'dates',
    'paginations',
    'measureNumbers',
    'instrumentations',
    'annotations',
];
const LOCAL_KEYS = new Set(['corrections']);
const NEAR_MATCH_THRESHOLD = 0.5;
const DIFF_CONTEXT_LINES = 1;
// Words, runs of whitespace and single other characters (punctuation, markup) as diff units
const WORD_PATTERN = /[\p{L}\p{N}_]+|\s+|[^\p{L}\p{N}_\s]/gu;
const MAX_WORD_ALIGNMENT = 1_000_000;
const SIGLUM_REFERENCE_PATTERN =
    /<strong>[A-Z](?:<sup>[^<]*<\/sup>)?<\/strong>|data-report-fragment-id='source_[^']*'/g;
const MISSING = '<missing>';

function readJsonIfExists(filePath, fallback) {
    return fs.existsSync(filePath) ? readJson(filePath) : fallback;
}

function appendTo(map, key, value) {
    if (!map.has(key)) {
        map.set(key, []);
    }
    map.get(key).push(value);
}

// Text without tags (line breaks as spaces); \s also matches non-breaking spaces.
// Tags are removed until none is left, as removing one can join the rest into a new one (e.g. <<b>x>).
// Plain text for comparisons; the report escapes it like every other value.
function stripTags(text) {
    let result = (text ?? '').replace(/<br\s*\/?>/g, ' ');
    let previous;
    do {
        previous = result;
        result = result.replace(/<[^>]*>/g, '');
    } while (result !== previous);
    return result.replace(/\s+/g, ' ').trim();
}

function escapeHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// JSON with sorted object keys, so that equal values compare equal regardless of key order
function stableStringify(value) {
    if (Array.isArray(value)) {
        return `[${value.map(stableStringify).join(',')}]`;
    }
    if (value !== null && typeof value === 'object') {
        const entries = Object.keys(value)
            .sort()
            .map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
        return `{${entries.join(',')}}`;
    }
    return JSON.stringify(value) ?? 'undefined';
}

function isEqual(a, b) {
    return stableStringify(a) === stableStringify(b);
}

function normalizeSpace(value) {
    if (typeof value === 'string') {
        return value.replace(/\s+/g, ' ').trim();
    }
    if (Array.isArray(value)) {
        return value.map(normalizeSpace);
    }
    if (value !== null && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalizeSpace(child)]));
    }
    return value;
}

// ── Read the complexes in edition order ──────────────────────────────────────

function readComplexOrder() {
    const order = [];
    for (const series of readJson(OUTLINE_FILE).editionOutline ?? []) {
        for (const section of series.sections ?? []) {
            const complexTypes = section.content?.complexTypes ?? {};
            for (const complexType of ['opus', 'mnr']) {
                for (const entry of complexTypes[complexType] ?? []) {
                    order.push(entry.complex);
                }
            }
        }
    }
    return order;
}

// The folders of the complexes with a source description (named by complex id, under series/)
function findComplexDirs() {
    return editionJsonFiles()
        .filter(file => relPath(file, EDITION_DATA_DIR).startsWith('series/'))
        .filter(file => path.basename(file) === SOURCE_DESC_FILE)
        .map(file => {
            const dir = path.dirname(file);
            return { complexId: path.basename(dir), dir };
        });
}

// ── Read all source descriptions as copies (keyed by complex:siglum) ─────────

function readCopies() {
    const rank = new Map(readComplexOrder().map((complexId, index) => [complexId, index]));
    const copies = [];
    for (const { complexId, dir } of findComplexDirs()) {
        const sourceList = readJsonIfExists(path.join(dir, SOURCE_LIST_FILE), { sources: [] });
        const sourcesByLink = new Map(sourceList.sources.map(source => [source.linkTo, source]));
        const convolutes = readJsonIfExists(path.join(dir, FOLIO_CONVOLUTE_FILE), { convolutes: [] }).convolutes;
        const convolutesById = new Map(convolutes.map(convolute => [convolute.convoluteId, convolute]));

        for (const source of readJson(path.join(dir, SOURCE_DESC_FILE)).sources) {
            const listEntry = sourcesByLink.get(source.id) ?? source;
            // The convolute id is the full siglum (with addendum, e.g. Aa, FR1)
            const siglum = `${source.siglum}${source.siglumAddendum ?? ''}`;
            copies.push({
                key: `${complexId}:${siglum}`,
                complexId,
                rank: rank.get(complexId) ?? Number.MAX_SAFE_INTEGER,
                type: stripTags(listEntry.type),
                location: stripTags(listEntry.location),
                physDesc: source.physDesc ?? {},
                folios: convolutesById.get(siglum)?.folios ?? null,
            });
        }
    }
    return copies.sort((a, b) => a.rank - b.rank || a.key.localeCompare(b.key));
}

// ── Normalize the compared fields (format notes apart from content) ──────────

// Deprecated keys are read as their replacements (the current key wins if both hold values),
// strings in list fields as lists
function normalizePhysDesc(physDesc) {
    const fields = {};
    const notes = [];
    const isDeprecated = key => key in DEPRECATED_KEYS;
    const entries = Object.entries(physDesc).sort(([a], [b]) => isDeprecated(a) - isDeprecated(b));
    for (const [key, value] of entries) {
        if (LOCAL_KEYS.has(key)) continue;
        const normalizedKey = DEPRECATED_KEYS[key] ?? key;
        let normalizedValue = value;
        if (isDeprecated(key)) {
            notes.push(`deprecated key <code>${key}</code>`);
        }
        if (LIST_KEYS.includes(normalizedKey) && typeof value === 'string') {
            normalizedValue = value ? [value] : [];
            notes.push(`<code>${key}</code> as string instead of list`);
        }
        if (normalizedKey in fields) {
            if (!normalizedValue.length) continue;
            if (fields[normalizedKey].length) {
                notes.push(`<code>${normalizedKey}</code> and <code>${key}</code> both with values`);
                continue;
            }
        }
        fields[normalizedKey] = normalizedValue;
    }
    for (const key of LIST_KEYS) {
        fields[key] ??= [];
    }
    return { fields, notes };
}

function normalizeFolios(folios) {
    const notes = new Set();
    if (!folios) {
        return { folios: null, notes };
    }
    const normalized = structuredClone(folios);
    for (const folio of normalized) {
        for (const content of folio.content ?? []) {
            for (const segment of content.segments ?? []) {
                if (!('position' in segment)) {
                    segment.position = 1;
                    notes.add('folio segment without <code>position</code>');
                }
            }
        }
    }
    return { folios: normalized, notes };
}

function contentItems(physDesc) {
    const items = new Set();
    for (const content of physDesc.contents ?? []) {
        const label = stripTags(content.item);
        if (!label) continue;
        const folios = (content.folios ?? []).map(folio => folio.folio ?? '').join(',');
        items.add(`${label}|${folios}`);
    }
    return items;
}

// ── Group the copies of the same document ────────────────────────────────────

function groupCopies(copies) {
    const parent = new Map(copies.map(copy => [copy.key, copy.key]));
    const find = key => {
        while (parent.get(key) !== key) {
            parent.set(key, parent.get(parent.get(key)));
            key = parent.get(key);
        }
        return key;
    };
    // The criteria a copy was matched by (a group's criteria are those of its copies)
    const criteriaByCopy = new Map();

    const buckets = { 'same text': new Map(), 'same contents': new Map() };
    for (const copy of copies) {
        const { conditions, writingMaterialStrings } = copy.physDesc;
        if (stripTags((conditions ?? []).join(' '))) {
            const textKey = stableStringify(normalizeSpace([conditions, writingMaterialStrings]));
            appendTo(buckets['same text'], textKey, copy);
        }
        const items = contentItems(copy.physDesc);
        if (items.size) {
            appendTo(buckets['same contents'], [...items].sort().join('\n'), copy);
        }
    }
    // A match needs copies from at least two complexes; then all copies of the bucket join one group
    for (const [label, bucket] of Object.entries(buckets)) {
        for (const members of bucket.values()) {
            if (new Set(members.map(copy => copy.complexId)).size < 2) continue;
            for (const copy of members) {
                parent.set(find(copy.key), find(members[0].key));
                appendTo(criteriaByCopy, copy.key, label);
            }
        }
    }

    const groupsByRoot = new Map();
    for (const copy of copies) {
        appendTo(groupsByRoot, find(copy.key), copy);
    }
    const groups = [...groupsByRoot.values()]
        .filter(group => group.length > 1)
        .map(group => ({
            copies: group,
            criteria: [...new Set(group.flatMap(copy => criteriaByCopy.get(copy.key) ?? []))].sort(),
        }));

    const nearMatches = [];
    const withItems = copies.map(copy => ({ copy, items: contentItems(copy.physDesc) })).filter(e => e.items.size);
    for (let i = 0; i < withItems.length; i++) {
        for (let j = i + 1; j < withItems.length; j++) {
            const a = withItems[i];
            const b = withItems[j];
            if (a.copy.complexId === b.copy.complexId || find(a.copy.key) === find(b.copy.key)) continue;
            const shared = [...a.items].filter(item => b.items.has(item)).length;
            const overlap = shared / new Set([...a.items, ...b.items]).size;
            if (shared && overlap >= NEAR_MATCH_THRESHOLD) {
                nearMatches.push({
                    a: a.copy.key,
                    b: b.copy.key,
                    overlap,
                    shared,
                    sizes: [a.items.size, b.items.size],
                });
            }
        }
    }
    nearMatches.sort((x, y) => y.overlap - x.overlap);

    return { groups, nearMatches, find };
}

// ── Compare the copies of a group: the variants of each field ────────────────

// The variants of a value across copies, most copies first (on equal counts in edition order);
// values that differ only in whitespace count as one variant
function collectVariants(entries) {
    const variants = new Map();
    for (const entry of entries) {
        appendTo(variants, stableStringify(normalizeSpace(entry.value)), entry);
    }
    return [...variants.values()]
        .map(variantEntries => {
            // The spelling of most copies is the variant's value; the other spellings differ in whitespace only
            const spellings = new Map();
            for (const entry of variantEntries) {
                appendTo(spellings, stableStringify(entry.value), entry);
            }
            const [mainSpelling] = [...spellings.values()].sort((a, b) => b.length - a.length);
            return {
                value: mainSpelling[0].value,
                copies: variantEntries.map(entry => entry.copy),
                whitespaceOnly: variantEntries.filter(entry => !mainSpelling.includes(entry)).map(entry => entry.copy),
            };
        })
        .sort((a, b) => b.copies.length - a.copies.length);
}

function compareGroup(group) {
    const notesByCopy = new Map();
    const addNote = (copy, note) => notesByCopy.set(copy, [...new Set([...(notesByCopy.get(copy) ?? []), note])]);
    const siglumWarnings = [];

    const normalized = group.copies.map(copy => {
        const { fields, notes } = normalizePhysDesc(copy.physDesc);
        const folioResult = normalizeFolios(copy.folios);
        [...notes, ...folioResult.notes].forEach(note => addNote(copy.key, note));
        const sigla = [...new Set(JSON.stringify(fields).match(SIGLUM_REFERENCE_PATTERN) ?? [])];
        if (sigla.length) {
            siglumWarnings.push({ copy: copy.key, sigla });
        }
        return { copy: copy.key, fields, folios: folioResult.folios };
    });

    const comparisons = [...new Set(normalized.flatMap(entry => Object.keys(entry.fields)))].map(field => ({
        field,
        entries: normalized.map(entry => ({ copy: entry.copy, value: entry.fields[field] })),
    }));
    const withFolios = normalized.filter(entry => entry.folios);
    if (withFolios.length && withFolios.length < normalized.length) {
        normalized.filter(entry => !entry.folios).forEach(entry => addNote(entry.copy, 'no folio convolute'));
    }
    comparisons.push({
        field: 'folio convolute',
        entries: withFolios.map(entry => ({ copy: entry.copy, value: entry.folios })),
    });

    const differences = [];
    for (const { field, entries } of comparisons) {
        const variants = collectVariants(entries);
        if (variants.length > 1) {
            differences.push({ field, variants });
        }
        for (const copy of variants.flatMap(variant => variant.whitespaceOnly)) {
            addNote(copy, `whitespace only in <code>${field}</code>`);
        }
    }
    const formatNotes = [...notesByCopy].map(([copy, notes]) => ({ copy, notes }));
    return { differences, formatNotes, siglumWarnings };
}

function formatDistribution(variants) {
    return variants.map(variant => variant.copies.length).join('/');
}

// ── Diff of two values (lines of the pretty-printed JSON, words within a line) ──

// The alignment of two sequences by their longest common subsequence, as equal, removed and added steps
function alignSequences(left, right) {
    const lengths = Array.from({ length: left.length + 1 }, () => new Uint32Array(right.length + 1));
    for (let i = left.length - 1; i >= 0; i--) {
        for (let j = right.length - 1; j >= 0; j--) {
            lengths[i][j] =
                left[i] === right[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
        }
    }
    const steps = [];
    let i = 0;
    let j = 0;
    while (i < left.length || j < right.length) {
        if (i < left.length && j < right.length && left[i] === right[j]) {
            steps.push({ kind: 'equal', value: left[i] });
            i++;
            j++;
        } else if (j < right.length && (i === left.length || lengths[i][j + 1] >= lengths[i + 1][j])) {
            steps.push({ kind: 'added', value: right[j++] });
        } else {
            steps.push({ kind: 'removed', value: left[i++] });
        }
    }
    return steps;
}

// Rows of [left line, right line, kind]; removed and added lines next to each other share a row
function diffLines(a, b) {
    const toLines = value => JSON.stringify(value ?? MISSING, null, 1).split('\n');
    const rows = [];
    let removed = [];
    let added = [];
    const flush = () => {
        for (let k = 0; k < Math.max(removed.length, added.length); k++) {
            rows.push([removed[k] ?? '', added[k] ?? '', 'changed']);
        }
        removed = [];
        added = [];
    };
    for (const { kind, value } of alignSequences(toLines(a), toLines(b))) {
        if (kind === 'equal') {
            flush();
            rows.push([value, value, 'equal']);
        } else if (kind === 'removed') {
            removed.push(value);
        } else {
            added.push(value);
        }
    }
    flush();

    return rows.filter((row, index) =>
        rows
            .slice(Math.max(0, index - DIFF_CONTEXT_LINES), index + DIFF_CONTEXT_LINES + 1)
            .some(([, , kind]) => kind !== 'equal')
    );
}

// Both texts as HTML with their differing words (and spaces, punctuation) marked; the indentation stays unmarked
function markChangedWords(left, right) {
    const [leftIndent] = left.match(/^\s*/);
    const [rightIndent] = right.match(/^\s*/);
    const leftWords = left.slice(leftIndent.length).match(WORD_PATTERN) ?? [];
    const rightWords = right.slice(rightIndent.length).match(WORD_PATTERN) ?? [];
    let leftHtml = leftIndent;
    let rightHtml = rightIndent;
    // Very long texts are marked as a whole (the alignment table grows with the product of their lengths)
    const steps =
        leftWords.length * rightWords.length > MAX_WORD_ALIGNMENT
            ? [
                  { kind: 'removed', value: leftWords.join('') },
                  { kind: 'added', value: rightWords.join('') },
              ]
            : alignSequences(leftWords, rightWords);
    for (const { kind, value } of steps) {
        const text = escapeHtml(value);
        if (kind === 'equal') {
            leftHtml += text;
            rightHtml += text;
        } else if (kind === 'removed') {
            leftHtml += `<span class="change">${text}</span>`;
        } else {
            rightHtml += `<span class="change">${text}</span>`;
        }
    }
    return [leftHtml, rightHtml];
}

function renderDiff(leftLabel, rightLabel, a, b) {
    const rows = diffLines(a, b)
        .map(([left, right, kind]) => {
            if (kind === 'equal') {
                return `<tr><td>${escapeHtml(left)}</td><td>${escapeHtml(right)}</td></tr>`;
            }
            // A line on one side only is marked as a whole
            const [leftHtml, rightHtml] = markChangedWords(left, right);
            return `<tr><td class="removed">${leftHtml}</td><td class="added">${rightHtml}</td></tr>`;
        })
        .join('');
    return `<table class="diff"><tr><th>${escapeHtml(leftLabel)}</th><th>${escapeHtml(rightLabel)}</th></tr>${rows}</table>`;
}

// ── Changes since a git ref ──────────────────────────────────────────────────

function git(args) {
    // stderr is captured: failures are reported by the callers
    return childProcess.execFileSync('git', args, {
        cwd: ROOT,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
}

// The JSON of a file at a git ref, or null if the file does not exist there
function readJsonAtRef(ref, filePath) {
    const spec = `${ref}:${relPath(filePath)}`;
    try {
        git(['cat-file', '-e', spec]);
    } catch {
        return null;
    }
    try {
        return JSON.parse(git(['show', spec]));
    } catch (error) {
        throw new Error(`Cannot read ${spec}: ${error.message}`, { cause: error });
    }
}

// The changed leaves of two values. Array elements are aligned by value, so that an added or removed
// element is reported on its own; a removed element followed by an added one is compared in depth.
function walkChanges(a, b, fieldPath, changes) {
    const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    if (isObject(a) && isObject(b)) {
        for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
            walkChanges(key in a ? a[key] : MISSING, key in b ? b[key] : MISSING, [...fieldPath, key], changes);
        }
    } else if (Array.isArray(a) && Array.isArray(b)) {
        let i = 0;
        let j = 0;
        let removed = [];
        let added = [];
        const flush = () => {
            for (let k = 0; k < Math.max(removed.length, added.length); k++) {
                const before = k < removed.length ? removed[k].value : MISSING;
                const after = k < added.length ? added[k].value : MISSING;
                const index = k < added.length ? added[k].index : removed[k].index;
                walkChanges(before, after, [...fieldPath, index], changes);
            }
            removed = [];
            added = [];
        };
        for (const { kind } of alignSequences(a.map(stableStringify), b.map(stableStringify))) {
            if (kind === 'equal') {
                flush();
                i++;
                j++;
            } else if (kind === 'removed') {
                removed.push({ value: a[i], index: i++ });
            } else {
                added.push({ value: b[j], index: j++ });
            }
        }
        flush();
    } else if (!isEqual(a, b)) {
        changes.push({ fieldPath, before: a, after: b });
    }
}

function valueAt(value, fieldPath) {
    for (const step of fieldPath) {
        if (value === null || typeof value !== 'object' || !(step in value)) return MISSING;
        value = value[step];
    }
    return value;
}

function formatFieldPath(fieldPath) {
    return fieldPath
        .map((step, index) => (typeof step === 'number' ? `[${step}]` : `${index ? '.' : ''}${step}`))
        .join('');
}

// The copies of the same document that have the new value at the same place
// (content items are looked up by their label, as their order may differ between copies)
function copiesWithValue(otherCopies, read, ownValue, fieldPath, value) {
    const isContentItem = fieldPath[0] === 'contents' && typeof fieldPath[1] === 'number';
    const label = isContentItem ? valueAt(ownValue, [...fieldPath.slice(0, 2), 'item']) : null;
    return otherCopies
        .filter(other => {
            if (isEqual(valueAt(read(other), fieldPath), value)) return true;
            if (!isContentItem) return false;
            const contents = read(other).contents ?? [];
            return contents.some(
                content => content.item === label && isEqual(valueAt(content, fieldPath.slice(2)), value)
            );
        })
        .map(other => other.key);
}

function readChangesSince(ref, groups, find) {
    try {
        git(['rev-parse', '--verify', `${ref}^{commit}`]);
    } catch {
        throw new Error(`Unknown git ref: ${ref}`);
    }
    const groupByRoot = new Map(groups.map(group => [find(group.copies[0].key), group.copies]));
    const othersOf = key => (groupByRoot.get(find(key)) ?? []).filter(copy => copy.key !== key);

    // Changed files since the ref, and new files not yet added to git
    const listFiles = args => git([...args, '--', relPath(EDITION_DATA_DIR)]).split('\n');
    const changedFiles = [
        ...new Set([
            ...listFiles(['diff', '--name-only', ref]),
            ...listFiles(['ls-files', '--others', '--exclude-standard']),
        ]),
    ].filter(file => file.endsWith(SOURCE_DESC_FILE) || file.endsWith(FOLIO_CONVOLUTE_FILE));

    const changes = [];
    for (const file of changedFiles) {
        const filePath = path.join(ROOT, file);
        const complexId = path.basename(path.dirname(filePath));
        const before = readJsonAtRef(ref, filePath);
        const after = readJsonIfExists(filePath, null);
        if (!before || !after) {
            changes.push({
                copy: complexId,
                file,
                field: '(whole file)',
                before: before ? 'present' : MISSING,
                after: after ? 'present' : MISSING,
                sameIn: [],
            });
            continue;
        }
        // A source description is compared by its physical description, a folio convolute by its folios
        const kind = file.endsWith(SOURCE_DESC_FILE)
            ? {
                  entries: data => data.sources,
                  id: source => source.id,
                  key: source => `${complexId}:${source.siglum}${source.siglumAddendum ?? ''}`,
                  label: '',
                  field: 'physDesc',
                  read: copy => copy.physDesc,
              }
            : {
                  entries: data => data.convolutes,
                  id: convolute => convolute.convoluteId,
                  key: convolute => `${complexId}:${convolute.convoluteId}`,
                  label: ' (folio convolute)',
                  field: 'folios',
                  read: copy => copy.folios ?? [],
              };
        // Entries in both versions, new entries and removed entries
        const beforeById = new Map(kind.entries(before).map(entry => [kind.id(entry), entry]));
        const afterById = new Map(kind.entries(after).map(entry => [kind.id(entry), entry]));
        for (const id of new Set([...afterById.keys(), ...beforeById.keys()])) {
            const key = kind.key(afterById.get(id) ?? beforeById.get(id));
            const beforeValue = beforeById.has(id) ? beforeById.get(id)[kind.field] : MISSING;
            const afterValue = afterById.has(id) ? afterById.get(id)[kind.field] : MISSING;
            const fieldChanges = [];
            walkChanges(beforeValue, afterValue, [], fieldChanges);
            for (const { fieldPath, before: a, after: b } of fieldChanges) {
                changes.push({
                    copy: `${key}${kind.label}`,
                    file,
                    field: formatFieldPath([kind.field, ...fieldPath]),
                    before: a,
                    after: b,
                    sameIn: b === MISSING ? [] : copiesWithValue(othersOf(key), kind.read, afterValue, fieldPath, b),
                });
            }
        }
    }
    return changes;
}

// ── Render the report ────────────────────────────────────────────────────────

const STYLE = `
:root { --bg: #fff; --fg: #1d1d1f; --muted: #666; --line: #ddd; --ok: #2e7d32; --drift: #b26a00; --add: #acf2bd; --sub: #fdb8c0; }
@media (prefers-color-scheme: dark) { :root { --bg: #1b1b1d; --fg: #e8e8ea; --muted: #a0a0a5; --line: #3a3a3e; --ok: #81c784; --drift: #ffb74d; --add: #2e6b3f; --sub: #7a2e38; } }
body { background: var(--bg); color: var(--fg); font: 14px/1.45 system-ui, sans-serif; margin: 0 auto; max-width: 1200px; padding: 16px; }
.masthead { border-bottom: 1px solid var(--line); margin-bottom: 12px; padding-bottom: 8px; }
.project { margin: 0; font-weight: 600; } .project a { color: var(--muted); text-decoration: none; } .project a:hover { text-decoration: underline; }
h1 { font-size: 1.5rem; margin: 4px 0; } h2 { font-size: 1.1rem; margin: 0 0 4px; } h3 { font-size: .95rem; margin: 12px 0 4px; }
.meta { color: var(--muted); margin: 0 0 8px; }
.group { border: 1px solid var(--line); border-left: 4px solid var(--ok); border-radius: 6px; padding: 12px; margin: 12px 0; }
.group.drift { border-left-color: var(--drift); }
.drift .status { color: var(--drift); font-weight: 600; } .ok .status { color: var(--ok); font-weight: 600; }
table { border-collapse: collapse; } .list td, .list th { border-bottom: 1px solid var(--line); padding: 3px 8px; text-align: left; vertical-align: top; }
details { margin: 4px 0; } summary { cursor: pointer; }
table.diff { font: 12px/1.35 ui-monospace, monospace; margin: 6px 0; width: 100%; table-layout: fixed; }
table.diff td, table.diff th { padding: 0 4px; white-space: pre-wrap; word-break: break-word; text-align: left; vertical-align: top; }
table.diff th { color: var(--muted); font-weight: normal; }
.added .change { background: var(--add); } .removed .change { background: var(--sub); }
.overflow { overflow-x: auto; }
`;

function renderGroup(group, index, result) {
    const { differences, formatNotes, siglumWarnings } = result;
    const status = differences.length ? `${differences.length} field(s) with differences` : 'identical';
    const members = group.copies
        .map(
            copy =>
                `<tr><td><b>${escapeHtml(copy.key)}</b></td><td>${escapeHtml(copy.type)}</td><td>${escapeHtml(copy.location)}</td></tr>`
        )
        .join('');
    // Plain text; renderDiff escapes its labels
    const variantLabel = variant => `${variant.copies.length} × ${variant.copies.join(', ')}`;
    const differenceItems = differences
        .map(({ field, variants }) => {
            const [majority, ...others] = variants;
            const variantList = variants.map(variant => `<li>${escapeHtml(variantLabel(variant))}</li>`).join('');
            const diffs = others
                .map(variant =>
                    renderDiff(variantLabel(majority), variantLabel(variant), majority.value, variant.value)
                )
                .join('');
            return `<details><summary><code>${escapeHtml(field)}</code>: ${formatDistribution(variants)}</summary><ul>${variantList}</ul>${diffs}</details>`;
        })
        .join('');
    const noteItems = formatNotes
        .map(({ copy, notes }) => `<li><b>${escapeHtml(copy)}</b>: ${notes.join(', ')}</li>`)
        .join('');
    const warningItems = siglumWarnings
        .map(({ copy, sigla }) => `<li><b>${escapeHtml(copy)}</b>: ${sigla.map(escapeHtml).join(', ')}</li>`)
        .join('');

    return `
<section class="group ${differences.length ? 'drift' : 'ok'}">
<h2>${index + 1}. ${escapeHtml(group.copies.map(copy => copy.key).join(' = '))}</h2>
<p class="meta">Matched by: ${group.criteria.join(', ')} · <span class="status">${status}</span></p>
<table class="list"><tr><th>Copy</th><th>Type (complex-specific)</th><th>Location</th></tr>${members}</table>
${differenceItems ? `<h3>Content differences</h3>${differenceItems}` : ''}
${noteItems ? `<h3>Format only</h3><ul>${noteItems}</ul>` : ''}
${warningItems ? `<h3>Sigla in shared text</h3><ul>${warningItems}</ul>` : ''}
</section>`;
}

function renderChanges(ref, changes) {
    const toText = value => (typeof value === 'string' ? value : (JSON.stringify(value) ?? String(value)));
    const rows = changes
        .map(({ copy, field, before, after, sameIn }) => {
            const [beforeHtml, afterHtml] = markChangedWords(toText(before), toText(after));
            return `<tr><td><b>${escapeHtml(copy)}</b></td><td><code>${escapeHtml(field)}</code></td><td class="removed">${beforeHtml}</td><td class="added">${afterHtml}</td><td>${escapeHtml(sameIn.join(', ')) || '—'}</td></tr>`;
        })
        .join('');
    return `
<h2>Changes since ${escapeHtml(ref)}</h2>
<p class="meta">${changes.length} changed field(s). "Same value in" lists the copies of the same document that have the new value.</p>
<div class="overflow"><table class="list"><tr><th>Copy</th><th>Field</th><th>Before</th><th>After</th><th>Same value in</th></tr>${rows || '<tr><td colspan="5">none</td></tr>'}</table></div>`;
}

// Branch, short commit and whether the edition data has uncommitted changes (null outside git)
function readGitState() {
    try {
        return {
            branch: git(['rev-parse', '--abbrev-ref', 'HEAD']).trim(),
            commit: git(['rev-parse', '--short', 'HEAD']).trim(),
            dirty: git(['status', '--porcelain', '--', relPath(EDITION_DATA_DIR)]).trim() !== '',
        };
    } catch {
        return null;
    }
}

function renderReport({ groups, results, nearMatches, changes, copyCount }) {
    const identical = results.filter(result => !result.differences.length).length;
    const nearRows = nearMatches
        .map(
            ({ a, b, overlap, shared, sizes }) =>
                `<tr><td>${escapeHtml(a)}</td><td>${escapeHtml(b)}</td><td>${Math.round(overlap * 100)} %</td><td>${shared} of ${sizes.join(' / ')}</td></tr>`
        )
        .join('');

    const gitState = readGitState();
    const meta = [
        `${PACKAGE.name} ${PACKAGE.version}`,
        gitState &&
            `${escapeHtml(gitState.branch)} @ ${gitState.commit}${gitState.dirty ? ' (edition data with uncommitted changes)' : ''}`,
        `generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    ].filter(Boolean);

    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shared sources report · ${PROJECT_LABEL}</title><style>${STYLE}</style></head><body>
<header class="masthead">
<p class="project"><a href="${PACKAGE.homepage}">${PROJECT_LABEL}</a></p>
<h1>Shared sources report</h1>
<p class="meta">${meta.join(' · ')}</p>
</header>
<p>Sources described in several edition complexes (<code>${relPath(EDITION_DATA_DIR)}</code>):
${groups.length} groups with ${copyCount} copies; ${identical} identical, ${groups.length - identical} with content differences.
For each field that differs, the copies are grouped into variants by value (counts most first, e.g. 4/2/1),
and every other variant is compared with the most frequent one (on equal counts, the first in edition order).
Complex-specific fields (siglum, type, corrections) are not compared.</p>
${changes ? renderChanges(SINCE_REF, changes) : ''}
${groups.map((group, index) => renderGroup(group, index, results[index])).join('')}
<h2>Near matches (contents overlap ≥ ${NEAR_MATCH_THRESHOLD * 100} %, not grouped)</h2>
<div class="overflow"><table class="list"><tr><th>A</th><th>B</th><th>Overlap</th><th>Shared items</th></tr>${nearRows || '<tr><td colspan="4">none</td></tr>'}</table></div>
</body></html>
`;
}

// ── Open the report in the default browser ───────────────────────────────────

// Opens the file with its default program (explorer.exe on Windows passes the path on without cmd parsing)
function openInBrowser(filePath) {
    const commands = { win32: 'explorer.exe', darwin: 'open' };
    childProcess
        .spawn(commands[process.platform] ?? 'xdg-open', [filePath], {
            detached: true,
            stdio: 'ignore',
            windowsHide: true,
        })
        .on('error', error => console.error(`ERROR  Could not open the report: ${error.message}`))
        .unref();
}

// ── Run ──────────────────────────────────────────────────────────────────────

function main() {
    let changes = null;
    let grouping;
    try {
        if (SINCE_INDEX !== -1 && !SINCE_REF) {
            throw new Error('--since needs a git ref (commit, branch or tag)');
        }
        grouping = groupCopies(readCopies());
        if (SINCE_REF) {
            changes = readChangesSince(SINCE_REF, grouping.groups, grouping.find);
        }
    } catch (error) {
        console.error(`ERROR  ${error.message}`);
        // exitCode instead of exit(), so that the output is flushed (as in check-glyphs.js)
        process.exitCode = 1;
        return;
    }

    const { groups, nearMatches } = grouping;
    const results = groups.map(compareGroup);
    const copyCount = groups.reduce((sum, group) => sum + group.copies.length, 0);

    fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
    fs.writeFileSync(REPORT_FILE, renderReport({ groups, results, nearMatches, changes, copyCount }));

    const drifting = groups
        .map((group, index) => ({ group, result: results[index], index }))
        .filter(entry => entry.result.differences.length);
    const formatCopies = results.flatMap(result => result.formatNotes.map(note => note.copy));
    const siglumCopies = results.flatMap(result => result.siglumWarnings.map(warning => warning.copy));

    console.log(`Shared sources: ${groups.length} group(s) with ${copyCount} copies`);
    console.log(`[OK  ] ${groups.length - drifting.length} identical`);
    for (const { group, result, index } of drifting) {
        const fields = result.differences
            .map(({ field, variants }) => `${field} ${formatDistribution(variants)}`)
            .join(', ');
        console.log(`[DIFF] ${index + 1}. ${group.copies.map(copy => copy.key).join(' = ')}  (${fields})`);
    }
    if (formatCopies.length) {
        console.log(`[NOTE] Format differences in ${formatCopies.join(', ')}`);
    }
    if (siglumCopies.length) {
        console.log(`[WARN] Sigla in shared text in ${siglumCopies.join(', ')}`);
    }
    if (nearMatches.length) {
        console.log(`[NOTE] ${nearMatches.length} near match(es) outside the groups`);
    }
    if (changes) {
        console.log(`[INFO] ${changes.length} changed field(s) since ${SINCE_REF}`);
    }
    console.log(`\nReport: ${pathToFileURL(REPORT_FILE).href}`);

    if (OPEN) {
        openInBrowser(REPORT_FILE);
    }
}

main();
