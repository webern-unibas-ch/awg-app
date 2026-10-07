import type { BlankNode, Literal, NamedNode } from '@rdfjs/types';

/**
 * The RdfTerm type.
 *
 * It represents an RDF term of a triple or a SPARQL binding,
 * based on the RDF/JS data model (https://rdf.js.org/data-model-spec/).
 * Variables and the default graph are not part of query results, so they are excluded.
 */
export type RdfTerm = NamedNode | BlankNode | Literal;

/**
 * The PrefixMap type.
 *
 * It represents a map of prefix names to namespace IRIs,
 * e.g. `{ awg: 'https://edition.anton-webern.ch/webern-onto#' }`.
 */
export type PrefixMap = Readonly<Record<string, string>>;

/**
 * The SparqlBinding type.
 *
 * It represents a single solution of a SPARQL SELECT query
 * as a map of variable names to RDF terms.
 * Unbound variables (e.g. from OPTIONAL) are missing.
 */
export type SparqlBinding = Readonly<Record<string, RdfTerm>>;
