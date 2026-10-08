import type { Quad } from '@rdfjs/types';

import { GraphQuery, GraphQueryType } from '@awg-views/edition-view/models/graph.model';

import { PrefixMap, SparqlBinding } from './rdf.model';

/**
 * The SparqlConstructResult interface.
 *
 * It represents the result of a SPARQL CONSTRUCT query.
 */
export interface SparqlConstructResult {
    /**
     * The kind of the result.
     */
    readonly kind: 'construct';

    /**
     * The constructed quads.
     */
    readonly quads: readonly Quad[];

    /**
     * The prefixes to compact the IRIs of the result.
     */
    readonly prefixes: PrefixMap;
}

/**
 * The SparqlSelectResult interface.
 *
 * It represents the result of a SPARQL SELECT query.
 */
export interface SparqlSelectResult {
    /**
     * The kind of the result.
     */
    readonly kind: 'select';

    /**
     * The projected variable names.
     */
    readonly variables: readonly string[];

    /**
     * The solutions of the query.
     */
    readonly bindings: readonly SparqlBinding[];

    /**
     * The prefixes to compact the IRIs of the result.
     */
    readonly prefixes: PrefixMap;
}

/**
 * The SparqlUnsupportedResult interface.
 *
 * It represents the result of a SPARQL query of a type that is not supported (yet).
 */
export interface SparqlUnsupportedResult {
    /**
     * The kind of the result.
     */
    readonly kind: 'unsupported';

    /**
     * The type of the unsupported query.
     */
    readonly queryType: GraphQueryType;
}

/**
 * The SparqlResult type.
 *
 * It represents the result of a SPARQL query, discriminated by its `kind`.
 * Empty results are represented by empty arrays; errors are thrown.
 */
export type SparqlResult = SparqlConstructResult | SparqlSelectResult | SparqlUnsupportedResult;

/**
 * The SparqlQueryRequest type.
 *
 * It represents a request to run a SPARQL query against given triples.
 */
export type SparqlQueryRequest = Readonly<Pick<GraphQuery, 'queryType' | 'queryString'>> & {
    /**
     * The triples to run the query against (as turtle string).
     */
    readonly triples: string;
};

/**
 * The SparqlQueryRun interface.
 *
 * It represents a performed SPARQL query with its result and duration.
 */
export interface SparqlQueryRun {
    /**
     * The performed query (completed with the declarations of missing prefixes).
     */
    readonly query: string;

    /**
     * The result of the query.
     */
    readonly result: SparqlResult;

    /**
     * The duration of the query in milliseconds.
     */
    readonly durationMs: number;
}
