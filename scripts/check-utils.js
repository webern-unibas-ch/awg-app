/**
 * check-utils.js
 *
 * Shared paths and helpers of the check scripts (scripts/check-*.js).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EDITION_DATA_DIR = path.join(ROOT, 'src', 'assets', 'data', 'edition');

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

module.exports = { ROOT, EDITION_DATA_DIR, relPath, editionJsonFiles, readJson };
