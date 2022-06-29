/**
 * The Namespace interface.
 *
 * It represents an RDF namespace.
 */
export interface Namespace {
    [qname: string]: string;
}

/**
 * The NamespaceType enumeration.
 *
 * It stores the possible types of a namespace
 * specific to Turtle or SPARQL prefix clause.
 */
export enum NamespaceType {
    TURTLE = 'TURTLE',
    SPARQL = 'SPARQL',
}
