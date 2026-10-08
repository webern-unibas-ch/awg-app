import { GraphQueryType } from '@awg-views/edition-view/models/graph.model';

/**
 * Regex constant: NON_CODE_REGEX.
 *
 * It keeps a regex for the parts of a SPARQL query that are not code:
 * IRIs, string literals and comments (matched left to right,
 * so a `#` within an IRI or a string does not start a comment).
 */
const NON_CODE_REGEX = /<[^<>"{}|^`\\\s]*>|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|#[^\n]*/g;

/**
 * Regex constant: PROPERTY_PATH_REGEX.
 *
 * It keeps a regex for the operators of property paths (not allowed in the short form of a CONSTRUCT query).
 */
const PROPERTY_PATH_REGEX = /[/|^*+!]/;

/**
 * Set constant: UPDATE_KEYWORDS.
 *
 * It keeps the keywords of the SPARQL 1.1 update operations.
 */
const UPDATE_KEYWORDS: ReadonlySet<string> = new Set([
    'insert',
    'delete',
    'load',
    'clear',
    'create',
    'drop',
    'copy',
    'move',
    'add',
]);

/**
 * Private utils method: _keywordRegex.
 *
 * It creates a case-insensitive regex for the given keywords,
 * not being part of a (prefixed) name or a variable (e.g. `ex:load`, `?copy`, `PREFIX add:`).
 *
 * @param {readonly string[]} keywords The given keywords.
 * @param {string} [flags] The optional additional regex flags.
 * @returns {RegExp} The keyword regex (with the keyword as first group).
 */
function _keywordRegex(keywords: readonly string[], flags = ''): RegExp {
    return new RegExp(`(?<![\\w:?$.-])(${keywords.join('|')})(?![\\w:-])`, `i${flags}`);
}

/**
 * Regex constant: QUERY_FORM_REGEX.
 *
 * It keeps a regex for the keywords of the SPARQL query forms and update operations.
 */
const QUERY_FORM_REGEX = _keywordRegex(['select', 'construct', 'ask', 'describe', ...UPDATE_KEYWORDS]);

/**
 * Regex constant: NON_TRIPLES_PATTERN_REGEX.
 *
 * It keeps a regex for the keywords of a graph pattern that is not a plain triples pattern
 * (not allowed in the short form of a CONSTRUCT query, `CONSTRUCT WHERE { triples }`).
 */
const NON_TRIPLES_PATTERN_REGEX = _keywordRegex([
    'filter',
    'optional',
    'union',
    'minus',
    'bind',
    'values',
    'service',
    'graph',
    'exists',
]);

/**
 * Private utils method: _findKeyword.
 *
 * It finds the index of the first of the given keywords in a given masked query.
 *
 * @param {string} code The given masked query.
 * @param {readonly string[]} keywords The given keywords.
 * @param {number} [fromIndex] The optional index to start from.
 * @returns {number} The index of the keyword, or -1 if not found.
 */
function _findKeyword(code: string, keywords: readonly string[], fromIndex = 0): number {
    const keywordRegex = _keywordRegex(keywords, 'g');
    keywordRegex.lastIndex = fromIndex;
    return keywordRegex.exec(code)?.index ?? -1;
}

/**
 * Private utils method: _findClosingBrace.
 *
 * It finds the index of the brace closing the brace at a given index of a given masked query.
 *
 * @param {string} code The given masked query.
 * @param {number} openIndex The index of the opening brace.
 * @returns {number} The index of the closing brace, or -1 if not found.
 */
function _findClosingBrace(code: string, openIndex: number): number {
    let depth = 0;
    for (let i = openIndex; i < code.length; i++) {
        if (code[i] === '{') {
            depth++;
        } else if (code[i] === '}') {
            depth--;
            if (depth === 0) {
                return i;
            }
        }
    }
    return -1;
}

/**
 * Utils method: maskNonCode.
 *
 * It replaces IRIs (unless kept), string literals and comments of a given SPARQL query
 * with the same number of spaces, so that the remaining code can be analyzed
 * without false matches and positions in the masked query match the original.
 *
 * @param {string} query The given SPARQL query.
 * @param {{ keepIris?: boolean }} [options] The optional options (keep IRIs, e.g. for prefix declarations).
 * @returns {string} The masked query.
 */
export function maskNonCode(query: string, { keepIris = false }: { keepIris?: boolean } = {}): string {
    return query.replaceAll(NON_CODE_REGEX, match =>
        keepIris && match.startsWith('<') ? match : ' '.repeat(match.length)
    );
}

/**
 * Utils method: getQueryType.
 *
 * It gets the type of a given SPARQL query from its first query form keyword,
 * ignoring prefix declarations, IRIs, string literals, comments, names and variables.
 * The keywords of all update operations (INSERT, DELETE, LOAD, CLEAR, CREATE,
 * DROP, COPY, MOVE, ADD) are mapped to `update`.
 *
 * @param {string} query The given SPARQL query.
 * @returns {GraphQueryType} The type of the query, or null if none was found.
 */
export function getQueryType(query: string): GraphQueryType {
    const match = QUERY_FORM_REGEX.exec(maskNonCode(query));
    if (!match) {
        return null;
    }

    const keyword = match[1].toLowerCase();

    return (UPDATE_KEYWORDS.has(keyword) ? 'update' : keyword) as GraphQueryType;
}

/**
 * Utils method: toSelectQuery.
 *
 * It converts a given CONSTRUCT query into a SELECT query (`SELECT *`) with the same pattern,
 * dropping an explicit construct template (case-insensitive).
 *
 * @param {string} query The given CONSTRUCT query.
 * @returns {string | null} The SELECT query, or null if the query is no CONSTRUCT query
 * or its template is not closed.
 */
export function toSelectQuery(query: string): string | null {
    const code = maskNonCode(query);
    const start = _findKeyword(code, ['construct']);
    if (start === -1) {
        return null;
    }

    const keywordEnd = start + 'construct'.length;
    const templateStart = code.indexOf('{', keywordEnd);
    const hasTemplate = templateStart !== -1 && code.slice(keywordEnd, templateStart).trim() === '';
    const templateEnd = hasTemplate ? _findClosingBrace(code, templateStart) : keywordEnd - 1;
    if (templateEnd === -1) {
        return null;
    }

    return `${query.slice(0, start)}SELECT *${query.slice(templateEnd + 1)}`;
}

/**
 * Utils method: toConstructQuery.
 *
 * It converts a given SELECT query into the short form of a CONSTRUCT query
 * (`CONSTRUCT WHERE { triples }`) with the same pattern (case-insensitive).
 * The projection is dropped, solution modifiers (GROUP BY, ORDER BY, LIMIT etc.) are kept.
 * Queries whose pattern is not a plain triples pattern (with FILTER, OPTIONAL etc.,
 * nested groups or property paths) are not converted.
 *
 * @param {string} query The given SELECT query.
 * @returns {string | null} The CONSTRUCT query, or null if the query cannot be converted.
 */
export function toConstructQuery(query: string): string | null {
    const code = maskNonCode(query);
    const start = _findKeyword(code, ['select']);
    if (start === -1) {
        return null;
    }

    const keywordEnd = start + 'select'.length;
    const patternStart = code.indexOf('{', keywordEnd);
    const patternEnd = patternStart === -1 ? -1 : _findClosingBrace(code, patternStart);
    if (patternEnd === -1) {
        return null;
    }

    const pattern = code.slice(patternStart + 1, patternEnd);
    if (pattern.includes('{') || PROPERTY_PATH_REGEX.test(pattern) || NON_TRIPLES_PATTERN_REGEX.test(pattern)) {
        return null;
    }

    // The projection ends at the dataset clause (FROM), the WHERE keyword or the pattern
    const clauseIndex = _findKeyword(code, ['from', 'where'], keywordEnd);
    const projectionEnd = clauseIndex !== -1 && clauseIndex < patternStart ? clauseIndex : patternStart;
    const whereIndex = _findKeyword(code, ['where'], projectionEnd);
    const hasWhere = whereIndex !== -1 && whereIndex < patternStart;
    const whitespace = /\s*$/.exec(query.slice(start, projectionEnd))?.[0] || ' ';

    return (
        `${query.slice(0, start)}CONSTRUCT${whitespace}` +
        `${query.slice(projectionEnd, patternStart)}${hasWhere ? '' : 'WHERE '}${query.slice(patternStart)}`
    );
}

/**
 * Utils constants: SPARQL_UTILS.
 *
 * It keeps a namespace reference to the SPARQL utils methods.
 */
export const SPARQL_UTILS = {
    getQueryType,
    maskNonCode,
    toConstructQuery,
    toSelectQuery,
} as const;
