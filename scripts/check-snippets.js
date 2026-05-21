#!/usr/bin/env node
/**
 * check-snippets.js
 *
 * Scans all edition JSON data files for ##Abbildung## placeholders
 * and reports whether the corresponding snippet PNG images exist.
 *
 * The script now has two result categories:
 *   1) snippet file checks (runtime parity)
 *   2) data quality issues (missing/unsafe svgGroupId)
 *
 * Suffix logic mirrors EditionSnippetService.getComment():
 *   - single placeholder  → id = svgGroupId          → svgGroupId.png
 *   - multiple placeholders → id = svgGroupId + 'a'  → svgGroupIda.png, etc.
 *
 * Safety logic mirrors EditionSnippetService.getComment():
 *   - missing svgGroupId → comment is ignored for snippet rendering
 *   - unsafe svgGroupId  → comment is ignored for snippet rendering
 *
 * Unsafe IDs are tracked as data issues instead of snippet file misses.
 *
 * Usage:  node scripts/check-snippets.js
 *         yarn check:snippets
 *         node scripts/check-snippets.js --strict-data
 *         node scripts/check-snippets.js --verbose
 *
 * Exit code 0 = all renderable images present
 * Exit code 1 = one or more renderable images missing
 * With --strict-data, data issues also set exit code 1.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'assets', 'data', 'edition');
const SNIPPETS_DIR = path.join(ROOT, 'src', 'assets', 'img', 'edition', 'snippets');
const DATA_PREFIX_REL = path.relative(ROOT, DATA_DIR).replace(/\\/g, '/');
const STRICT_DATA = process.argv.includes('--strict-data');
const VERBOSE = process.argv.includes('--verbose');
const SAFE_SNIPPET_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

// Results keyed by section label, e.g. "series/1/section/5"
const sections = new Map();
const dataIssuesBySection = new Map();

// ── Convert series number to Roman numeral ───────────────────────────────────

const ROMAN = { 1: 'I', 2: 'II', 3: 'III' };

function sectionOf(filePath) {
    const m = filePath.replace(/\\/g, '/').match(/series\/([^/]+)\/section\/([^/]+)/);
    if (!m) return 'other';
    const series = ROMAN[Number(m[1])] ?? m[1];
    return `AWG ${series}/${m[2]}`;
}

function displayDataPath(relFile) {
    const normalized = relFile.replace(/\\/g, '/');
    if (normalized.startsWith(`${DATA_PREFIX_REL}/`)) {
        return normalized.slice(DATA_PREFIX_REL.length + 1);
    }
    return normalized;
}

function recordResult(section, entry) {
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section).push(entry);
}

function recordDataIssue(section, entry) {
    if (!dataIssuesBySection.has(section)) dataIssuesBySection.set(section, []);
    dataIssuesBySection.get(section).push(entry);
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

function checkValue(value, filePath, jsonPath = '$') {
    if (value === null || typeof value !== 'object') return;

    if (Array.isArray(value)) {
        value.forEach((item, index) => checkValue(item, filePath, `${jsonPath}[${index}]`));
        return;
    }

    // A comment field with placeholders is treated like a block-comment entry.
    if (typeof value.comment === 'string') {
        checkBlockComment(value.svgGroupId, value.comment, filePath, {
            jsonPath,
            measure: value.measure,
            system: value.system,
            position: value.position,
        });
    }

    for (const [key, child] of Object.entries(value)) {
        if (child !== null && typeof child === 'object') {
            checkValue(child, filePath, `${jsonPath}.${key}`);
        }
    }
}

// ── Check one block-comment entry ────────────────────────────────────────────

function checkBlockComment(svgGroupId, comment, filePath, context) {
    const matches = comment.match(/##Abbildung##/g);
    if (!matches) return;

    const count = matches.length;
    const section = sectionOf(filePath);
    const relFile = path.relative(ROOT, filePath);

    // Runtime parity with EditionSnippetService.getComment():
    // skip snippet checks if svgGroupId is missing or unsafe.
    if (typeof svgGroupId !== 'string' || svgGroupId.length === 0) {
        recordDataIssue(section, {
            type: 'MISSING_ID',
            placeholders: count,
            file: relFile,
            jsonPath: context.jsonPath,
            measure: context.measure,
            system: context.system,
            position: context.position,
        });
        return;
    }

    if (!SAFE_SNIPPET_ID_PATTERN.test(svgGroupId)) {
        recordDataIssue(section, {
            type: 'UNSAFE_ID',
            svgGroupId,
            placeholders: count,
            file: relFile,
            jsonPath: context.jsonPath,
            measure: context.measure,
            system: context.system,
            position: context.position,
        });
        return;
    }

    for (let i = 0; i < count; i++) {
        const suffix = count > 1 ? String.fromCharCode(97 + i) : '';
        const id = `${svgGroupId}${suffix}`;
        const imgPath = path.join(SNIPPETS_DIR, `${id}.png`);
        const ok = fs.existsSync(imgPath);
        recordResult(section, {
            ok,
            id,
            file: relFile,
            jsonPath: context.jsonPath,
            measure: context.measure,
            system: context.system,
            position: context.position,
        });
    }
}

// ── Run ──────────────────────────────────────────────────────────────────────

walkDir(DATA_DIR);

let totalFound = 0;
let totalMissing = 0;
let totalDataIssues = 0;
const sectionSummaries = [];
const dataSummaries = [];

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
            console.error(`       ERROR  ${displayDataPath(e.file)}: ${e.error}`);
        } else if (e.ok) {
            console.log(`         OK   ${e.id}.png   (${displayDataPath(e.file)})`);
        } else {
            console.error(`       MISS   ${e.id}.png   (${displayDataPath(e.file)})`);
            if (VERBOSE) {
                const contextParts = [];
                if (e.measure) contextParts.push(`measure=${e.measure}`);
                if (e.system) contextParts.push(`system=${e.system}`);
                if (e.position) contextParts.push(`position=${e.position}`);
                const contextText = contextParts.length > 0 ? `; ${contextParts.join(', ')}` : '';
                console.error(`             detail: ${e.jsonPath}${contextText}`);
            }
        }
    }
}

for (const [section, issues] of [...dataIssuesBySection.entries()].sort()) {
    totalDataIssues += issues.length;
    const summaryLine = `[DATA] ${section}  (${issues.length} issue${issues.length === 1 ? '' : 's'})`;
    dataSummaries.push(summaryLine);
    console.log(`\n${summaryLine}`);

    for (const issue of issues) {
        if (issue.type === 'MISSING_ID') {
            console.warn(
                `      WARN   missing svgGroupId for ${issue.placeholders} placeholder(s)   (${displayDataPath(issue.file)} @ ${issue.jsonPath})`
            );
        } else {
            console.warn(
                `      WARN   unsafe svgGroupId "${issue.svgGroupId}" for ${issue.placeholders} placeholder(s)   (${displayDataPath(issue.file)} @ ${issue.jsonPath})`
            );
        }

        if (VERBOSE && (issue.measure || issue.system || issue.position || issue.jsonPath)) {
            console.warn(`             detail: ${issue.jsonPath}`);
            console.warn(
                `             context: measure=${issue.measure ?? ''}, system=${issue.system ?? ''}, position=${issue.position ?? ''}`
            );
        }
    }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`Total: ${totalFound + totalMissing} placeholder(s) — ${totalFound} OK, ${totalMissing} missing`);
for (const line of sectionSummaries) {
    console.log(line);
}
if (totalDataIssues > 0) {
    console.log(`Data issues: ${totalDataIssues}`);
    for (const line of dataSummaries) {
        console.log(line);
    }
}

if (totalMissing > 0) {
    process.exit(1);
}

if (STRICT_DATA && totalDataIssues > 0) {
    process.exit(1);
}
