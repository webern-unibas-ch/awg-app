/**
 * The ResultNodeKind type.
 *
 * It represents the kind of a graph node, derived from the RDF terms:
 * - `class`: object of an `rdf:type` statement,
 * - `instance`: subject of an `rdf:type` statement,
 * - `blank`: blank node,
 * - `literal`: literal value,
 * - `resource`: any other IRI.
 */
export type ResultNodeKind = 'resource' | 'class' | 'instance' | 'blank' | 'literal';

/**
 * The ResultGraphNode interface.
 *
 * It represents a node of the result graph,
 * independent of the RDF source and the D3 rendering.
 */
export interface ResultGraphNode {
    /**
     * The unique key of the node (IRI, blank node or literal key).
     */
    readonly id: string;

    /**
     * The short name of the node to be displayed (compacted IRI or formatted literal).
     */
    readonly shortName: string;

    /**
     * The label of the node (its `rdfs:label`, if given, otherwise its short name).
     */
    readonly label: string;

    /**
     * The kind of the node.
     */
    readonly kind: ResultNodeKind;
}

/**
 * The ResultGraphEdge interface.
 *
 * It represents a directed edge (a statement) of the result graph.
 */
export interface ResultGraphEdge {
    /**
     * The unique key of the edge.
     */
    readonly id: string;

    /**
     * The id of the source node (subject).
     */
    readonly source: string;

    /**
     * The id of the target node (object).
     */
    readonly target: string;

    /**
     * The label of the edge (compacted predicate or its `rdfs:label`).
     */
    readonly label: string;
}

/**
 * The ResultGraph interface.
 *
 * It represents the node-link graph of the triples of a CONSTRUCT query result,
 * used as view model for the force graph.
 */
export interface ResultGraph {
    /**
     * The nodes of the graph.
     */
    readonly nodes: readonly ResultGraphNode[];

    /**
     * The edges of the graph.
     */
    readonly edges: readonly ResultGraphEdge[];

    /**
     * The total number of triples before applying a limit.
     */
    readonly tripleCount: number;
}
