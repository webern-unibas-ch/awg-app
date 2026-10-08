import { GraphSparqlQuery, GraphSparqlQueryType } from '@awg-views/edition-view/models/graph.model';

import { SparqlResult } from '../models/sparql-result.model';
import { DEFAULT_PREFIXES } from './prefix.utils';
import { SPARQL_UTILS } from './sparql.utils';

/**
 * Utils method: initialQuery.
 *
 * It gets a copy of the initial query (the first query of a given query list)
 * with the query type derived from its query string.
 *
 * @param {GraphSparqlQuery[]} queryList The given query list.
 * @returns {GraphSparqlQuery} The initial query.
 */
export function initialQuery(queryList: GraphSparqlQuery[]): GraphSparqlQuery {
    const query = queryList[0] ?? new GraphSparqlQuery();
    return { ...query, queryType: SPARQL_UTILS.getQueryType(query.queryString) };
}

/**
 * Utils method: findQuery.
 *
 * It finds the query of a given query list with the same label and type as a given query.
 * If the given query is not in the list, it is returned as is;
 * if no query is given, the first query of the list is returned.
 *
 * @param {GraphSparqlQuery[]} queryList The given query list.
 * @param {GraphSparqlQuery} [query] The optional given query.
 * @returns {GraphSparqlQuery} The found query.
 */
export function findQuery(queryList: GraphSparqlQuery[], query?: GraphSparqlQuery): GraphSparqlQuery {
    if (!query) {
        return queryList[0];
    }

    return (
        queryList.find(
            listQuery => query.queryLabel === listQuery.queryLabel && query.queryType === listQuery.queryType
        ) ?? query
    );
}

/**
 * Utils method: isRunnableQueryType.
 *
 * It checks if queries of a given query type can be run
 * (only construct and select queries for now).
 *
 * @param {GraphSparqlQueryType} queryType The given query type.
 * @returns {boolean} The boolean value of the check result.
 */
export function isRunnableQueryType(queryType: GraphSparqlQueryType): boolean {
    return queryType === 'construct' || queryType === 'select';
}

/**
 * Utils method: emptyResult.
 *
 * It creates an empty result of a given query type.
 *
 * @param {GraphSparqlQueryType} queryType The given query type.
 * @returns {SparqlResult} The empty result.
 */
export function emptyResult(queryType: GraphSparqlQueryType): SparqlResult {
    switch (queryType) {
        case 'construct':
            return { kind: 'construct', quads: [], prefixes: DEFAULT_PREFIXES };
        case 'select':
            return { kind: 'select', variables: [], bindings: [], prefixes: DEFAULT_PREFIXES };
        default:
            return { kind: 'unsupported', queryType };
    }
}

/**
 * Utils constants: GRAPH_QUERY_UTILS.
 *
 * It keeps a namespace reference to the graph query utils methods.
 */
export const GRAPH_QUERY_UTILS = {
    emptyResult,
    findQuery,
    initialQuery,
    isRunnableQueryType,
} as const;
