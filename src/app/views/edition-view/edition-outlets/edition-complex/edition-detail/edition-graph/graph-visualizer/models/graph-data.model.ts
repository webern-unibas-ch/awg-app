/**
 * The GraphNodeKind type.
 *
 * It represents the kind of a graph node, derived from the RDF terms:
 * - `class`: object of an `rdf:type` statement,
 * - `instance`: subject of an `rdf:type` statement,
 * - `blank`: blank node,
 * - `literal`: literal value,
 * - `resource`: any other IRI.
 */
export type GraphNodeKind = 'resource' | 'class' | 'instance' | 'blank' | 'literal';

/**
 * The GraphNode interface.
 *
 * It represents a node of the graph view model,
 * independent of the RDF source and the D3 rendering.
 */
export interface GraphNode {
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
    readonly kind: GraphNodeKind;
}

/**
 * The GraphEdge interface.
 *
 * It represents a directed edge (a statement) of the graph view model.
 */
export interface GraphEdge {
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
 * The GraphData interface.
 *
 * It represents the graph view model of a set of triples.
 */
export interface GraphData {
    /**
     * The nodes of the graph.
     */
    readonly nodes: readonly GraphNode[];

    /**
     * The edges of the graph.
     */
    readonly edges: readonly GraphEdge[];

    /**
     * The total number of triples before applying a limit.
     */
    readonly tripleCount: number;
}
