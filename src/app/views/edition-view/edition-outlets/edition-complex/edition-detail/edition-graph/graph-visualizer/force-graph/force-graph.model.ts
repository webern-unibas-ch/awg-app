import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';

import { GraphEdge, GraphNode } from '../models/graph-data.model';

/**
 * The SimNode interface.
 *
 * It represents a node of the D3 force simulation.
 * Besides the visible graph nodes, the simulation contains an invisible
 * middle node per edge (without `graphNode`) to space out parallel edges
 * and to position the edge labels.
 */
export interface SimNode extends SimulationNodeDatum {
    /**
     * The unique id of the node.
     */
    readonly id: string;

    /**
     * The graph node (undefined for the middle node of an edge).
     */
    readonly graphNode?: GraphNode;

    /**
     * The radius of the drawn node; the charge force uses `r - 1`.
     */
    readonly r: number;
}

/**
 * The SimLink type.
 *
 * It represents a link of the D3 force simulation
 * (from the source to the middle node or from the middle node to the target of an edge).
 */
export type SimLink = SimulationLinkDatum<SimNode>;

/**
 * The SimEdge interface.
 *
 * It represents a graph edge with its simulation nodes.
 */
export interface SimEdge {
    /**
     * The graph edge.
     */
    readonly edge: GraphEdge;

    /**
     * The simulation node of the source.
     */
    readonly source: SimNode;

    /**
     * The invisible middle node of the edge.
     */
    readonly mid: SimNode;

    /**
     * The simulation node of the target.
     */
    readonly target: SimNode;
}

/**
 * The SimulationData interface.
 *
 * It represents the data of the D3 force simulation of a graph.
 */
export interface SimulationData {
    /**
     * All simulation nodes (graph nodes and middle nodes).
     */
    readonly nodes: SimNode[];

    /**
     * All simulation links (two per edge).
     */
    readonly links: SimLink[];

    /**
     * The edges with their simulation nodes.
     */
    readonly edges: SimEdge[];
}

/**
 * The Point interface.
 *
 * It represents a point in the coordinate system of the graph.
 */
export interface Point {
    /**
     * The x coordinate.
     */
    readonly x: number;

    /**
     * The y coordinate.
     */
    readonly y: number;
}
