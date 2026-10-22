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
 *   - a value with several escapes adds all of them (e.g. '')
 *   - literal characters (e.g. a space) are ignored
 *
 * Usage:  node scripts/check-glyph-subset.js
 *         yarn check:glyph-subset
 *
 * Exit code 0 = subset matches the glyph data
 * Exit code 1 = codepoints missing or outdated, or font/license files missing
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
const UTILS_HINT =
    'Create the subset again with create_glyph_subset in awg-utils and copy its output into this folder.';

// ── Format a codepoint in Unicode notation ───────────────────────────────────

function formatCodepoint(codepoint) {
    return `U+${codepoint.toString(16).toUpperCase().padStart(4, '0')}`;
}

// ── Read the codepoints of the glyph data ────────────────────────────────────

function readDataCodepoints() {
    const content = fs.readFileSync(GLYPHS_DATA_FILE, 'utf8');
    const codepoints = new Set();
    for (const hexMatch of content.matchAll(HEX_VALUE_PATTERN)) {
        for (const escapeMatch of hexMatch[2].matchAll(UNICODE_ESCAPE_PATTERN)) {
            codepoints.add(formatCodepoint(parseInt(escapeMatch[1], 16)));
        }
    }
    return codepoints;
}

// ── Run ──────────────────────────────────────────────────────────────────────

const errors = [];
const relPath = filePath => path.relative(ROOT, filePath).replace(/\\/g, '/');

const dataCodepoints = readDataCodepoints();
if (dataCodepoints.size === 0) {
    errors.push(`No \\uXXXX escapes found in any hex value of ${relPath(GLYPHS_DATA_FILE)}.`);
}

let manifest = null;
try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
} catch (e) {
    errors.push(`Cannot read the manifest ${relPath(MANIFEST_FILE)}: ${e.message}`);
}

if (manifest) {
    const subsetCodepoints = new Set(manifest.codepoints ?? []);
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
    console.log(`Subset:     ${manifest.codepoints?.length ?? 0} codepoint(s) in ${relPath(MANIFEST_FILE)}`);
}

if (errors.length) {
    console.log(`\n${'─'.repeat(60)}`);
    for (const error of errors) {
        console.error(`MISS   ${error}`);
    }
    console.error(`\n${UTILS_HINT}`);
    process.exit(1);
}

console.log('\n[OK  ] Glyph subset matches the glyph data');
