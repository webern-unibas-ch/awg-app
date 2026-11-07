/**
 * check-utils.js
 *
 * Shared paths and helpers of the check scripts (scripts/check-*.js), and the page, word diff and
 * file helpers of their HTML reports.
 */

'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EDITION_DATA_DIR = path.join(ROOT, 'src', 'assets', 'data', 'edition');
const OUTLINE_FILE = path.join(EDITION_DATA_DIR, 'edition-outline.json');
const REPORT_DIR = path.join(ROOT, 'reports');
const PACKAGE = require(path.join(ROOT, 'package.json'));
const PROJECT_LABEL = 'Anton Webern Gesamtausgabe · Online Edition';
// Words, runs of whitespace and single other characters (punctuation, markup) as diff units
const WORD_PATTERN = /[\p{L}\p{N}_]+|\s+|[^\p{L}\p{N}_\s]/gu;
const MAX_WORD_ALIGNMENT = 1_000_000;

// The path of a file relative to a base folder (default: the repository root), with forward slashes
function relPath(filePath, base = ROOT) {
    return path.relative(base, filePath).replace(/\\/g, '/');
}

// The absolute paths of all JSON files of the edition data,
// sorted by their forward-slash form (the same order on every platform)
function editionJsonFiles() {
    return fs
        .readdirSync(EDITION_DATA_DIR, { recursive: true, withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
        .map(entry => {
            const filePath = path.join(entry.parentPath, entry.name);
            return { filePath, sortKey: relPath(filePath) };
        })
        .sort((a, b) => (a.sortKey < b.sortKey ? -1 : a.sortKey > b.sortKey ? 1 : 0))
        .map(entry => entry.filePath);
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// ── HTML reports ─────────────────────────────────────────────────────────────

function escapeHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

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

function git(args) {
    // stderr is captured: failures are reported by the callers
    return childProcess.execFileSync('git', args, {
        cwd: ROOT,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
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

const REPORT_STYLE = `
:root { --bg: #fff; --fg: #1d1d1f; --muted: #666; --line: #ddd; --ok: #2e7d32; --drift: #b26a00; --err: #c62828; --add: #acf2bd; --sub: #fdb8c0; }
@media (prefers-color-scheme: dark) { :root { --bg: #1b1b1d; --fg: #e8e8ea; --muted: #a0a0a5; --line: #3a3a3e; --ok: #81c784; --drift: #ffb74d; --err: #ef9a9a; --add: #2e6b3f; --sub: #7a2e38; } }
body { background: var(--bg); color: var(--fg); font: 14px/1.45 system-ui, sans-serif; margin: 0 auto; max-width: 1200px; padding: 16px; }
.masthead { border-bottom: 1px solid var(--line); margin-bottom: 12px; padding-bottom: 8px; }
.project { margin: 0; font-weight: 600; } .project a { color: var(--muted); text-decoration: none; } .project a:hover { text-decoration: underline; }
h1 { font-size: 1.5rem; margin: 4px 0; } h2 { font-size: 1.1rem; margin: 0 0 4px; } h3 { font-size: .95rem; margin: 12px 0 4px; }
.meta { color: var(--muted); margin: 0 0 8px; }
table { border-collapse: collapse; } .list td, .list th { border-bottom: 1px solid var(--line); padding: 3px 8px; text-align: left; vertical-align: top; }
details { margin: 4px 0; } summary { cursor: pointer; }
table.diff { font: 12px/1.35 ui-monospace, monospace; margin: 6px 0; width: 100%; table-layout: fixed; }
table.diff td, table.diff th { padding: 0 4px; white-space: pre-wrap; word-break: break-word; text-align: left; vertical-align: top; }
table.diff th { color: var(--muted); font-weight: normal; }
.added .change { background: var(--add); } .removed .change { background: var(--sub); }
.overflow { overflow-x: auto; }
`;

// A complete report page: the masthead with the project, the repository state and the time, then the body.
// The title and intro are HTML, style adds rules to the shared ones.
function renderReportPage({ title, intro, body, style = '' }) {
    const gitState = readGitState();
    const meta = [
        `${PACKAGE.name} ${PACKAGE.version}`,
        gitState &&
            `${escapeHtml(gitState.branch)} @ ${gitState.commit}${gitState.dirty ? ' (edition data with uncommitted changes)' : ''}`,
        `generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    ].filter(Boolean);

    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · ${PROJECT_LABEL}</title><style>${REPORT_STYLE}${style}</style></head><body>
<header class="masthead">
<p class="project"><a href="${PACKAGE.homepage}">${PROJECT_LABEL}</a></p>
<h1>${title}</h1>
<p class="meta">${meta.join(' · ')}</p>
</header>
${intro}
${body}
</body></html>
`;
}

// Writes the report into the (ignored) reports folder and returns its path
function writeReport(fileName, html) {
    const filePath = path.join(REPORT_DIR, fileName);
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(filePath, html);
    return filePath;
}

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

// The ids of the complexes in edition order (the order of the edition outline)
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

module.exports = {
    ROOT,
    EDITION_DATA_DIR,
    relPath,
    editionJsonFiles,
    readJson,
    readComplexOrder,
    escapeHtml,
    markChangedWords,
    renderReportPage,
    writeReport,
    openInBrowser,
};
