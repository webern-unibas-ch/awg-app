import { SparqlBinding } from '../models/rdf.model';

/**
 * The RdfStoreGlobal interface.
 *
 * It represents the global `rdfstore` object (loaded as script via angular.json).
 * Only the {@link RdfStoreService} may use it.
 */
export interface RdfStoreGlobal {
    /**
     * It creates a new in-memory store.
     */
    create(callback: (err: unknown, store: RdfStore) => void): void;
}

/**
 * The RdfStore interface.
 *
 * It represents an in-memory store instance of rdfstore.
 */
export interface RdfStore {
    /**
     * It loads serialized triples of the given media type into the store.
     */
    load(mimeType: string, data: string, callback: (err: unknown, size: number) => void): void;

    /**
     * It executes a SPARQL query against the store.
     */
    execute(query: string, callback: (err: unknown, result: unknown) => void): void;
}

/**
 * The RdfStoreNode interface.
 *
 * It represents an RDF node of a CONSTRUCT response of rdfstore.
 */
export interface RdfStoreNode {
    /**
     * The type of the node.
     */
    interfaceName: 'NamedNode' | 'BlankNode' | 'Literal';

    /**
     * The value of the node (`_:id` for blank nodes).
     */
    nominalValue: string;

    /**
     * The id of a blank node (without `_:`).
     */
    bnodeId?: string | number;

    /**
     * The language tag of a literal.
     */
    language?: string;

    /**
     * The datatype IRI of a literal.
     */
    datatype?: string | { nominalValue: string };
}

/**
 * The RdfStoreTriple interface.
 *
 * It represents a triple of a CONSTRUCT response of rdfstore.
 */
export interface RdfStoreTriple {
    /**
     * The subject of the triple.
     */
    subject: RdfStoreNode;

    /**
     * The predicate of the triple.
     */
    predicate: RdfStoreNode;

    /**
     * The object of the triple.
     */
    object: RdfStoreNode;
}

/**
 * The RdfStoreConstructResponse interface.
 *
 * It represents the CONSTRUCT response (a graph) of rdfstore.
 */
export interface RdfStoreConstructResponse {
    /**
     * The constructed triples.
     */
    triples?: RdfStoreTriple[];
}

/**
 * The RdfStoreToken interface.
 *
 * It represents a bound value of a SELECT response of rdfstore.
 */
export interface RdfStoreToken {
    /**
     * The type of the value.
     */
    token: 'uri' | 'literal' | 'blank';

    /**
     * The value (`_:id` for blank nodes; numbers for some aggregates).
     */
    value: string | number;

    /**
     * The language tag of a literal.
     */
    lang?: string;

    /**
     * The datatype IRI of a literal.
     */
    type?: string;
}

/**
 * The RdfStoreSelectResponse type.
 *
 * It represents the SELECT response of rdfstore:
 * one row per solution, with `null` for unbound variables.
 */
export type RdfStoreSelectResponse = Record<string, RdfStoreToken | null>[];

/**
 * The RdfStoreSelectResult interface.
 *
 * It represents the converted result of a SELECT query
 * (the output of the {@link RdfStoreService}, with RDF/JS terms).
 */
export interface RdfStoreSelectResult {
    /**
     * The variable names of the solutions.
     */
    readonly variables: readonly string[];

    /**
     * The solutions of the query (without unbound variables).
     */
    readonly bindings: readonly SparqlBinding[];
}
