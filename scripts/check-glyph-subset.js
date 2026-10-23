#!/usr/bin/env node
/**
 * check-glyph-subset.js
 *
 * Checks that the glyph font subset (AWG Edition Glyphs) matches the glyphs of EDITION_GLYPHS_DATA.
 *
 * The subset is created in the awg-utils repository (create_glyph_subset), which also writes
 * a manifest with the codepoints of the subset. This script compares the manifest with the
 * codepoints of the glyph data, and checks that the font and license files exist.
 *
 * Parsing logic mirrors create_glyph_subset (awg-utils):
 *   - only \uXXXX escapes inside `hex` string values (single, double or backtick quotes) count
 *   - a value with several escapes adds all of them (e.g. '\uE524\uE520')
 *   - literal characters (e.g. a space) are ignored
 *
 * Glyphs the subset tool would skip are reported as errors: literal Private Use Area characters
 * and \u{XXXX} escapes in `hex` values (the font would have no glyph for them).
 *
 * Usage:  node scripts/check-glyph-subset.js
 *         yarn check:glyph-subset
 *
 * Exit code 0 = subset matches the glyph data
 * Exit code 1 = codepoints missing, outdated or unsupported, manifest invalid, or font/license files missing
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GLYPHS_DATA_FILE = path.join(ROOT, 'src', 'app', 'views', 'edition-view', 'data', 'edition-glyphs.data.ts');
const FONT_DIR = path.join(ROOT, 'src', 'assets', 'themes', 'fonts', 'awg-edition-glyphs');
const MANIFEST_FILE = path.join(FONT_DIR, 'AWGEditionGlyphs.json');
const HEX_VALUE_PATTERN = /\bhex:\s*(['"`])(.*?)\1/g;
const UNICODE_ESCAPE_PATTERN = /\\u([0-9A-Fa-f]{4})/g;
const UNSUPPORTED_GLYPH_PATTERN = /[\uE000-\uF8FF]|\\u\{[0-9A-Fa-f]+\}/gu;
const UTILS_HINT =
    'Create the subset again with create_glyph_subset in awg-utils and copy its output into this folder.';

function relPath(filePath) {
    return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

// ── Read the codepoints of the glyph data (in Unicode notation, e.g. U+E264) ─

function readDataCodepoints() {
    const content = fs.readFileSync(GLYPHS_DATA_FILE, 'utf8');
    const codepoints = new Set();
    const unsupported = new Set();
    for (const hexMatch of content.matchAll(HEX_VALUE_PATTERN)) {
        for (const escapeMatch of hexMatch[2].matchAll(UNICODE_ESCAPE_PATTERN)) {
            codepoints.add(`U+${escapeMatch[1].toUpperCase()}`);
        }
        for (const unsupportedMatch of hexMatch[2].matchAll(UNSUPPORTED_GLYPH_PATTERN)) {
            const value = unsupportedMatch[0];
            unsupported.add(value.startsWith('\\') ? value : `U+${value.codePointAt(0).toString(16).toUpperCase()}`);
        }
    }
    return { codepoints, unsupported };
}

// ── Read the manifest of the subset (null if missing or invalid) ─────────────

function readManifest(errors) {
    let manifest;
    try {
        manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
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

// ── Run ──────────────────────────────────────────────────────────────────────

const errors = [];

const { codepoints: dataCodepoints, unsupported } = readDataCodepoints();
if (dataCodepoints.size === 0) {
    errors.push(`No \\uXXXX escapes found in any hex value of ${relPath(GLYPHS_DATA_FILE)}.`);
}
if (unsupported.size) {
    errors.push(`Use \\uXXXX escapes in hex values, not: ${[...unsupported].join(', ')}`);
}

const manifest = readManifest(errors);
const subsetCodepoints = new Set(manifest?.codepoints ?? []);

if (manifest) {
    if (subsetCodepoints.size !== manifest.codepoints.length || manifest.count !== manifest.codepoints.length) {
        errors.push(
            `The manifest is inconsistent: count ${manifest.count}, ${manifest.codepoints.length} entries, ${subsetCodepoints.size} unique.`
        );
    }

    const missing = [...dataCodepoints].filter(codepoint => !subsetCodepoints.has(codepoint)).sort();
    const outdated = [...subsetCodepoints].filter(codepoint => !dataCodepoints.has(codepoint)).sort();

    if (missing.length) {
        errors.push(`Missing in the subset: ${missing.join(', ')}`);
    }
    if (outdated.length) {
        errors.push(`In the subset, but no longer in the glyph data: ${outdated.join(', ')}`);
    }

    for (const file of [manifest.file, manifest.license]) {
        if (!file || !fs.existsSync(path.join(FONT_DIR, file))) {
            errors.push(`File listed in the manifest is missing: ${file ?? '(none)'}`);
        }
    }
}

console.log(`Glyph data: ${dataCodepoints.size} codepoint(s) in ${relPath(GLYPHS_DATA_FILE)}`);
if (manifest) {
    console.log(`Subset:     ${subsetCodepoints.size} codepoint(s) in ${relPath(MANIFEST_FILE)}`);
}

if (errors.length) {
    console.error(`\n${'─'.repeat(60)}`);
    for (const error of errors) {
        console.error(`ERROR  ${error}`);
    }
    console.error(`\n${UTILS_HINT}`);
    process.exit(1);
}

console.log('\n[OK  ] Glyph subset matches the glyph data');
