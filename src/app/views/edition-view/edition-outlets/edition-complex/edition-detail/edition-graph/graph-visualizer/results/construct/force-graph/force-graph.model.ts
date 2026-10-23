import type { ResultGraphEdge, ResultGraphNode } from '@awg-graph/graph-visualizer/models/result-graph.model';

/**
 * The ForceGraphBounds interface.
 *
 * It represents an area in graph coordinates (e.g., the area in view) by its smallest and largest corner.
 */
export interface ForceGraphBounds {
    /**
     * The corner with the smallest coordinates (top left).
     */
    readonly min: ForceGraphPoint;

    /**
     * The corner with the largest coordinates (bottom right).
     */
    readonly max: ForceGraphPoint;
}

/**
 * The ForceGraphData interface.
 *
 * It represents the data of a force graph: the nodes (with their positions) and edges to be laid out and drawn.
 */
export interface ForceGraphData {
    /**
     * All nodes (the visible nodes and the middle nodes of edges that have one).
     */
    readonly nodes: ForceGraphNode[];

    /**
     * The visible nodes, i.e. the nodes of the result graph (without the middle nodes of edges).
     */
    readonly visibleNodes: ForceGraphVisibleNode[];

    /**
     * The edges with their nodes.
     */
    readonly edges: ForceGraphEdge[];
}

/**
 * The ForceGraphEdge interface.
 *
 * It represents an edge of the result graph with its force graph nodes.
 */
export interface ForceGraphEdge {
    /**
     * The edge of the result graph.
     */
    readonly resultEdge: ResultGraphEdge;

    /**
     * The visible node of the source.
     */
    readonly source: ForceGraphVisibleNode;

    /**
     * The invisible middle node of the edge
     * (only for self edges and repeated edges between the same two nodes).
     */
    readonly mid?: ForceGraphNode;

    /**
     * The visible node of the target.
     */
    readonly target: ForceGraphVisibleNode;
}

/**
 * The ForceGraphNode interface.
 *
 * It represents a node of the force simulation: a visible node or the invisible middle node of an edge.
 */
export interface ForceGraphNode extends ForceGraphPoint {
    /**
     * The unique id of the node.
     */
    readonly id: string;

    /**
     * The radius of the node (drawn for a visible node); the charge force of the simulation uses `radius - 1`.
     */
    readonly radius: number;

    /**
     * The x coordinate (writable, unlike that of a point; NaN until the node is laid out).
     */
    x: number;

    /**
     * The y coordinate (writable, unlike that of a point; NaN until the node is laid out).
     */
    y: number;
}

/**
 * The ForceGraphVisibleNode interface.
 *
 * It represents a drawn node of the force graph that stands for a node of the result graph.
 */
export interface ForceGraphVisibleNode extends ForceGraphNode {
    /**
     * The node of the result graph that the visible node stands for.
     */
    readonly resultNode: ResultGraphNode;
}

/**
 * The ForceGraphPoint interface.
 *
 * It represents a point in graph coordinates (origin in the center of the graph).
 */
export interface ForceGraphPoint {
    /**
     * The x coordinate.
     */
    readonly x: number;

    /**
     * The y coordinate.
     */
    readonly y: number;
}
