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
 * Regex constant: QUERY_FORM_REGEX.
 *
 * It keeps a regex for the keywords of the SPARQL query forms and updates.
 */
const QUERY_FORM_REGEX = /\b(select|construct|ask|describe|insert|delete)\b/i;

/**
 * Utils method: stripNonCode.
 *
 * It replaces IRIs, string literals and comments of a given SPARQL query with spaces,
 * so that the remaining code can be analyzed without false matches.
 *
 * @param {string} query The given SPARQL query.
 * @returns {string} The query without IRIs, string literals and comments.
 */
export function stripNonCode(query: string): string {
    return query.replaceAll(NON_CODE_REGEX, ' ');
}

/**
 * Utils method: getQueryType.
 *
 * It gets the type of a given SPARQL query from its first query form keyword,
 * ignoring prefix declarations, IRIs, string literals and comments.
 * INSERT and DELETE are mapped to `update`.
 *
 * @param {string} query The given SPARQL query.
 * @returns {GraphQueryType} The type of the query, or null if none was found.
 */
export function getQueryType(query: string): GraphQueryType {
    const match = QUERY_FORM_REGEX.exec(stripNonCode(query));
    if (!match) {
        return null;
    }

    const keyword = match[1].toLowerCase();

    return (keyword === 'insert' || keyword === 'delete' ? 'update' : keyword) as GraphQueryType;
}

/**
 * Utils constants: SPARQL_UTILS.
 *
 * It keeps a namespace reference to the SPARQL utils methods.
 */
export const SPARQL_UTILS = {
    getQueryType,
    stripNonCode,
} as const;
