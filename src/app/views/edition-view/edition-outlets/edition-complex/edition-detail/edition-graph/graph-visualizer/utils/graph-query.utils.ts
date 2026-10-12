import { ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';
import { GraphQuery, GraphQueryType } from '@awg-views/edition-view/models/graph.model';

import { SparqlResult } from '../models/sparql-result.model';
import { DEFAULT_PREFIXES } from './prefix.utils';
import { SPARQL_UTILS } from './sparql.utils';

/**
 * The QueryTypeConversion interface.
 *
 * It represents the conversion of a query of one type into another type.
 */
interface QueryTypeConversion {
    /**
     * The query type to convert from.
     */
    readonly from: GraphQueryType;

    /**
     * The query type to convert to.
     */
    readonly to: GraphQueryType;

    /**
     * The function converting the query string (null if it cannot be converted).
     */
    readonly convert: (queryString: string) => string | null;
}

/**
 * Object constant: VIEW_QUERY_TYPE_CONVERSIONS.
 *
 * It keeps the query type conversion of each view type (null if the view needs no conversion).
 */
const VIEW_QUERY_TYPE_CONVERSIONS: Readonly<Record<ViewHandleTypes, QueryTypeConversion | null>> = {
    [ViewHandleTypes.GRAPH]: { from: 'select', to: 'construct', convert: SPARQL_UTILS.toConstructQuery },
    [ViewHandleTypes.GRID]: null,
    [ViewHandleTypes.TABLE]: { from: 'construct', to: 'select', convert: SPARQL_UTILS.toSelectQuery },
};

/**
 * Utils method: initialQuery.
 *
 * It gets a copy of the initial query (the first query of a given query list)
 * with the query type derived from its query string.
 *
 * @param {GraphQuery[]} queryList The given query list.
 * @returns {GraphQuery} The initial query.
 */
export function initialQuery(queryList: GraphQuery[]): GraphQuery {
    const query = queryList[0] ?? new GraphQuery();
    return { ...query, queryType: SPARQL_UTILS.getQueryType(query.queryString) };
}

/**
 * Utils method: findQuery.
 *
 * It finds the query of a given query list with the same label and type as a given query.
 * If the given query is not in the list, it is returned as is;
 * if no query is given, the first query of the list is returned.
 *
 * @param {GraphQuery[]} queryList The given query list.
 * @param {GraphQuery} [query] The optional given query.
 * @returns {GraphQuery} The found query.
 */
export function findQuery(queryList: GraphQuery[], query?: GraphQuery): GraphQuery {
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
 * @param {GraphQueryType} queryType The given query type.
 * @returns {boolean} The boolean value of the check result.
 */
export function isRunnableQueryType(queryType: GraphQueryType): boolean {
    return queryType === 'construct' || queryType === 'select';
}

/**
 * Utils method: emptyResult.
 *
 * It creates an empty result of a given query type.
 *
 * @param {GraphQueryType} queryType The given query type.
 * @returns {SparqlResult} The empty result.
 */
export function emptyResult(queryType: GraphQueryType): SparqlResult {
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
 * Utils method: switchQueryType.
 *
 * It switches the type and string of a given query according to a given view type
 * (a CONSTRUCT query to a SELECT query for the table view and vice versa for the graph view).
 * Queries that need no or allow no conversion are returned unchanged.
 *
 * @param {GraphQuery} query The given query.
 * @param {ViewHandleTypes} viewType The given view type.
 * @returns {GraphQuery} The switched query (or the given query if nothing is to switch).
 */
export function switchQueryType(query: GraphQuery, viewType: ViewHandleTypes): GraphQuery {
    const conversion = VIEW_QUERY_TYPE_CONVERSIONS[viewType];
    if (conversion?.from !== query.queryType) {
        return query;
    }

    const queryString = conversion.convert(query.queryString);
    return queryString ? { ...query, queryString, queryType: conversion.to } : query;
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
    switchQueryType,
} as const;
