#!/usr/bin/env node
/**
 * check-snippets.js
 *
 * Scans all edition JSON data files for ##Abbildung## placeholders
 * and reports whether the corresponding snippet PNG images exist.
 *
 * Suffix logic mirrors EditionSnippetService.getComment():
 *   - single placeholder  → id = svgGroupId          → svgGroupId.png
 *   - multiple placeholders → id = svgGroupId + 'a'  → svgGroupIda.png, etc.
 *
 * Usage:  node scripts/check-snippets.js
 *         yarn check:snippets
 *
 * Exit code 0 = all images present, 1 = one or more missing.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'assets', 'data', 'edition');
const SNIPPETS_DIR = path.join(ROOT, 'src', 'assets', 'img', 'edition', 'snippets');

// Results keyed by section label, e.g. "series/1/section/5"
const sections = new Map();

// ── Convert series number to Roman numeral ───────────────────────────────────

const ROMAN = { 1: 'I', 2: 'II', 3: 'III' };

function sectionOf(filePath) {
    const m = filePath.replace(/\\/g, '/').match(/series\/([^/]+)\/section\/([^/]+)/);
    if (!m) return 'other';
    const series = ROMAN[Number(m[1])] ?? m[1];
    return `AWG ${series}/${m[2]}`;
}

function recordResult(section, entry) {
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section).push(entry);
}

// ── Recursive directory walk ─────────────────────────────────────────────────

function walkDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(full);
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            checkFile(full);
        }
    }
}

// ── Check a single JSON file ─────────────────────────────────────────────────

function checkFile(filePath) {
    let data;
    try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        const section = sectionOf(filePath);
        recordResult(section, { ok: false, id: '?', file: path.relative(ROOT, filePath), error: e.message });
        return;
    }
    checkValue(data, filePath);
}

// ── Recursively inspect parsed JSON values ───────────────────────────────────

function checkValue(value, filePath) {
    if (value === null || typeof value !== 'object') return;

    if (Array.isArray(value)) {
        for (const item of value) checkValue(item, filePath);
        return;
    }

    // An object with both svgGroupId and comment is a block-comment entry.
    if (typeof value.svgGroupId === 'string' && typeof value.comment === 'string') {
        checkBlockComment(value.svgGroupId, value.comment, filePath);
    }

    for (const child of Object.values(value)) {
        if (child !== null && typeof child === 'object') {
            checkValue(child, filePath);
        }
    }
}

// ── Check one block-comment entry ────────────────────────────────────────────

function checkBlockComment(svgGroupId, comment, filePath) {
    const matches = comment.match(/##Abbildung##/g);
    if (!matches) return;

    const count = matches.length;
    const section = sectionOf(filePath);
    const relFile = path.relative(ROOT, filePath);

    for (let i = 0; i < count; i++) {
        const suffix = count > 1 ? String.fromCharCode(97 + i) : '';
        const id = `${svgGroupId}${suffix}`;
        const imgPath = path.join(SNIPPETS_DIR, `${id}.png`);
        const ok = fs.existsSync(imgPath);
        recordResult(section, { ok, id, file: relFile });
    }
}

// ── Run ──────────────────────────────────────────────────────────────────────

walkDir(DATA_DIR);

let totalFound = 0;
let totalMissing = 0;
const sectionSummaries = [];

for (const [section, entries] of [...sections.entries()].sort()) {
    const sectionFound = entries.filter(e => e.ok).length;
    const sectionMissing = entries.filter(e => !e.ok).length;
    totalFound += sectionFound;
    totalMissing += sectionMissing;

    const badge = sectionMissing === 0 ? 'OK  ' : 'MISS';
    const summaryLine = `[${badge}] ${section}  (${sectionFound} OK, ${sectionMissing} missing)`;
    sectionSummaries.push(summaryLine);
    console.log(`\n${summaryLine}`);

    for (const e of entries) {
        if (e.error) {
            console.error(`       ERROR  ${e.file}: ${e.error}`);
        } else if (e.ok) {
            console.log(`         OK   ${e.id}.png`);
        } else {
            console.error(`       MISS   ${e.id}.png   (${path.basename(e.file)})`);
        }
    }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`Total: ${totalFound + totalMissing} placeholder(s) — ${totalFound} OK, ${totalMissing} missing`);
for (const line of sectionSummaries) {
    console.log(line);
}

if (totalMissing > 0) {
    process.exit(1);
}
