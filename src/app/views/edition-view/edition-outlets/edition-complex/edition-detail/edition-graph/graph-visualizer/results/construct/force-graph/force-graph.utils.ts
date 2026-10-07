import { GraphData, GraphNodeKind } from '../../../models/graph-data.model';
import { Point, SimEdge, SimLink, SimNode, SimulationData } from './force-graph.model';

/**
 * Object constant: NODE_RADIUS.
 *
 * It keeps the radius of the drawn nodes per kind.
 */
export const NODE_RADIUS: Readonly<Record<GraphNodeKind, number>> = Object.freeze({
    blank: 8,
    class: 10,
    instance: 11,
    literal: 9,
    resource: 9,
});

/**
 * The NodeCssClass type.
 *
 * It represents the css class of a drawn node.
 */
export type NodeCssClass = 'blank' | 'class' | 'instance' | 'node';

/**
 * Private utils method: _isSelfEdge.
 *
 * It checks if source and target of an edge are at the same position.
 *
 * @param {SimEdge} simEdge The given edge with its simulation nodes.
 * @returns {boolean} The result of the check.
 */
function _isSelfEdge(simEdge: SimEdge): boolean {
    return (simEdge.source.x ?? 0) === (simEdge.target.x ?? 0) && (simEdge.source.y ?? 0) === (simEdge.target.y ?? 0);
}

/**
 * Utils method: nodeRadius.
 *
 * It gets the radius of a drawn node of the given kind.
 *
 * @param {GraphNodeKind} kind The given kind.
 * @returns {number} The radius.
 */
export function nodeRadius(kind: GraphNodeKind): number {
    return NODE_RADIUS[kind];
}

/**
 * Utils method: nodeCssClass.
 *
 * It gets the css class of a drawn node of the given kind
 * (literals and other resources share the default class `node`).
 *
 * @param {GraphNodeKind} kind The given kind.
 * @returns {NodeCssClass} The css class.
 */
export function nodeCssClass(kind: GraphNodeKind): NodeCssClass {
    return kind === 'literal' || kind === 'resource' ? 'node' : kind;
}

/**
 * Utils method: toSimulationData.
 *
 * It converts the given graph data into the data of the D3 force simulation:
 * a simulation node per graph node, an invisible middle node per edge
 * and two links per edge (source to middle node, middle node to target).
 *
 * @param {GraphData} graph The given graph data.
 * @returns {SimulationData} The simulation data.
 */
export function toSimulationData(graph: GraphData): SimulationData {
    const graphSimNodes = new Map<string, SimNode>(
        graph.nodes.map(node => [node.id, { id: node.id, graphNode: node, r: nodeRadius(node.kind) }])
    );

    const getSimNode = (id: string): SimNode => {
        const simNode = graphSimNodes.get(id);
        if (!simNode) {
            throw new Error(`[FORCE_GRAPH_UTILS] Unknown node of an edge: ${id}.`);
        }
        return simNode;
    };

    const edges: SimEdge[] = graph.edges.map(edge => ({
        edge,
        source: getSimNode(edge.source),
        mid: { id: `${edge.id}#mid`, r: NODE_RADIUS.resource },
        target: getSimNode(edge.target),
    }));

    const links: SimLink[] = edges.flatMap(({ source, mid, target }) => [
        { source, target: mid },
        { source: mid, target },
    ]);

    const nodes: SimNode[] = [...graphSimNodes.values(), ...edges.map(edge => edge.mid)];

    return { nodes, links, edges };
}

/**
 * Utils method: linkPath.
 *
 * It creates the svg path of an edge from its source to its target.
 * A self edge (source and target at the same position) is drawn as a loop.
 *
 * @param {SimEdge} simEdge The given edge with its simulation nodes.
 * @returns {string} The svg path.
 */
export function linkPath(simEdge: SimEdge): string {
    const x1 = simEdge.source.x ?? 0;
    const y1 = simEdge.source.y ?? 0;
    let x2 = simEdge.target.x ?? 0;
    let y2 = simEdge.target.y ?? 0;

    // Defaults for a straight edge
    let radiusX = 0;
    let radiusY = 0;
    let xRotation = 0;
    let largeArc = 0;
    const sweep = 1;

    if (_isSelfEdge(simEdge)) {
        // A loop: an elliptic large arc, rotated by -45 degrees
        xRotation = -45;
        largeArc = 1;
        radiusX = 30;
        radiusY = 20;
        // The arc collapses to a point if start and end are identical
        x2 = x2 + 1;
        y2 = y2 + 1;
    }

    return `M${x1},${y1}A${radiusX},${radiusY} ${xRotation},${largeArc},${sweep} ${x2},${y2}`;
}

/**
 * Utils method: linkLabelPosition.
 *
 * It gets the position of the label of an edge:
 * the center of source, middle node and target, shifted
 * to the right (and above a loop for self edges).
 *
 * @param {SimEdge} simEdge The given edge with its simulation nodes.
 * @returns {Point} The position of the label.
 */
export function linkLabelPosition(simEdge: SimEdge): Point {
    const { source, mid, target } = simEdge;
    const centerX = ((source.x ?? 0) + (mid.x ?? 0) + (target.x ?? 0)) / 3;
    const centerY = ((source.y ?? 0) + (mid.y ?? 0) + (target.y ?? 0)) / 3;

    return _isSelfEdge(simEdge) ? { x: centerX + 20, y: centerY - 40 } : { x: centerX + 10, y: centerY + 4 };
}

/**
 * Utils constants: FORCE_GRAPH_UTILS.
 *
 * It keeps a namespace reference to the force graph utils methods.
 */
export const FORCE_GRAPH_UTILS = {
    linkLabelPosition,
    linkPath,
    nodeCssClass,
    nodeRadius,
    toSimulationData,
} as const;
