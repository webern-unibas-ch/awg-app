import {
    ResultGraph,
    ResultGraphEdge,
    ResultGraphNode,
    ResultGraphNodeKind,
} from '@awg-graph/graph-visualizer/models/result-graph.model';

import {
    ForceGraphBounds,
    ForceGraphData,
    ForceGraphEdge,
    ForceGraphNode,
    ForceGraphPoint,
    ForceGraphVisibleNode,
} from './force-graph.model';

/**
 * Constant: FORCE_GRAPH_LARGE_NODE_COUNT.
 *
 * It keeps the number of nodes (including the middle nodes of edges) from which a force graph is large
 * (denser forces, always laid out behind the spinner).
 */
export const FORCE_GRAPH_LARGE_NODE_COUNT = 1000;

/**
 * Object constant: FORCE_GRAPH_NODE_RADIUS.
 *
 * It keeps the radius of the visible nodes per kind (middle nodes of edges get the radius of a `resource`).
 */
export const FORCE_GRAPH_NODE_RADIUS: Readonly<Record<ResultGraphNodeKind, number>> = Object.freeze({
    blank: 8,
    class: 10,
    instance: 11,
    literal: 9,
    resource: 9,
});

/**
 * Private utils method: _nodePairKey.
 *
 * It creates a key of the pair of nodes of an edge, regardless of the direction of the edge.
 *
 * @param {string} sourceId The given id of the source node.
 * @param {string} targetId The given id of the target node.
 * @returns {string} The key of the node pair.
 */
function _nodePairKey(sourceId: string, targetId: string): string {
    return sourceId < targetId ? `${sourceId}\n${targetId}` : `${targetId}\n${sourceId}`;
}

/**
 * Private utils method: _toMidNode.
 *
 * It creates the invisible middle node (without position) of the given edge number between the given node pair,
 * keyed by both (stable when the graph grows or shrinks).
 *
 * @param {string} pairKey The given key of the node pair.
 * @param {number} edgeNumber The given number of the edge between the node pair (counting from 0).
 * @returns {ForceGraphNode} The middle node.
 */
function _toMidNode(pairKey: string, edgeNumber: number): ForceGraphNode {
    return { id: `${pairKey}#mid${edgeNumber}`, radius: FORCE_GRAPH_NODE_RADIUS.resource, x: NaN, y: NaN };
}

/**
 * Private utils method: _toVisibleNode.
 *
 * It creates the visible node of the given node of the result graph (without position).
 *
 * @param {ResultGraphNode} resultNode The given node of the result graph.
 * @returns {ForceGraphVisibleNode} The visible node.
 */
function _toVisibleNode(resultNode: ResultGraphNode): ForceGraphVisibleNode {
    return { id: resultNode.id, radius: FORCE_GRAPH_NODE_RADIUS[resultNode.kind], resultNode, x: NaN, y: NaN };
}

/**
 * Utils method: edgePath.
 *
 * It gets the nodes along an edge: source, middle node (if any) and target.
 *
 * @param {ForceGraphEdge} edge The given edge.
 * @returns {ForceGraphNode[]} The nodes along the edge.
 */
export function edgePath(edge: ForceGraphEdge): ForceGraphNode[] {
    const { source, mid, target } = edge;
    return mid ? [source, mid, target] : [source, target];
}

/**
 * Utils method: isLargeGraph.
 *
 * It checks if a force graph with the given number of nodes is large (from `FORCE_GRAPH_LARGE_NODE_COUNT`).
 *
 * @param {number} nodeCount The given number of nodes (including the middle nodes of edges).
 * @returns {boolean} The result of the check.
 */
export function isLargeGraph(nodeCount: number): boolean {
    return nodeCount >= FORCE_GRAPH_LARGE_NODE_COUNT;
}

/**
 * Utils method: isPositioned.
 *
 * It checks if a given point (or node) has a position, i.e. finite coordinates (NaN until it is laid out).
 *
 * @param {ForceGraphPoint} point The given point or node.
 * @returns {boolean} The result of the check.
 */
export function isPositioned(point: ForceGraphPoint): boolean {
    return Number.isFinite(point.x) && Number.isFinite(point.y);
}

/**
 * Utils method: isRelayout.
 *
 * It checks if a layout of the given nodes is a relayout: at least half of them (and at least one) have a position.
 *
 * @param {readonly ForceGraphNode[]} nodes The given nodes.
 * @returns {boolean} The result of the check.
 */
export function isRelayout(nodes: readonly ForceGraphNode[]): boolean {
    const positionedCount = nodes.filter(isPositioned).length;
    return positionedCount > 0 && positionedCount >= nodes.length / 2;
}

/**
 * Utils method: isSelfEdge.
 *
 * It checks if source and target of an edge are the same node.
 *
 * @param {ForceGraphEdge} edge The given edge.
 * @returns {boolean} The result of the check.
 */
export function isSelfEdge(edge: ForceGraphEdge): boolean {
    return edge.source === edge.target;
}

/**
 * Utils method: nodeBounds.
 *
 * It gets the area covered by the given nodes with a position (including their radius).
 *
 * @param {readonly ForceGraphNode[]} nodes The given nodes.
 * @returns {ForceGraphBounds | undefined} The covered area, or undefined without positioned nodes.
 */
export function nodeBounds(nodes: readonly ForceGraphNode[]): ForceGraphBounds | undefined {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
        if (!isPositioned(node)) {
            return;
        }
        const { x, y, radius } = node;
        minX = Math.min(minX, x - radius);
        minY = Math.min(minY, y - radius);
        maxX = Math.max(maxX, x + radius);
        maxY = Math.max(maxY, y + radius);
    });

    return minX === Infinity ? undefined : { min: { x: minX, y: minY }, max: { x: maxX, y: maxY } };
}

/**
 * Utils method: restorePositions.
 *
 * It copies the positions of the given previous nodes to the nodes with the same id
 * (e.g., to keep the layout of a graph when it grows or shrinks).
 *
 * @param {ForceGraphNode[]} nodes The given nodes to be positioned.
 * @param {readonly ForceGraphNode[]} previousNodes The given previous nodes.
 * @returns {void} Sets the positions of the nodes.
 */
export function restorePositions(nodes: ForceGraphNode[], previousNodes: readonly ForceGraphNode[]): void {
    const previousById = new Map(previousNodes.map(node => [node.id, node]));

    nodes.forEach(node => {
        const previous = previousById.get(node.id);
        if (previous && isPositioned(previous)) {
            node.x = previous.x;
            node.y = previous.y;
        }
    });
}

/**
 * Utils method: toForceGraphData.
 *
 * It converts the given result graph into force graph data (a node per node, an edge per edge, no positions yet);
 * self edges and repeated edges get an invisible middle node that spaces them and their labels out.
 * The middle nodes are keyed by their node pair and edge number, so that restored positions
 * only match middle nodes between the same nodes.
 *
 * @param {ResultGraph} graph The given result graph.
 * @returns {ForceGraphData} The force graph data.
 */
export function toForceGraphData(graph: ResultGraph): ForceGraphData {
    const visibleNodes = graph.nodes.map(_toVisibleNode);

    const visibleNodesById = new Map(visibleNodes.map(node => [node.id, node]));
    const getVisibleNode = (id: string): ForceGraphVisibleNode => {
        const node = visibleNodesById.get(id);
        if (!node) {
            throw new Error(`[FORCE_GRAPH_UTILS] Unknown node of an edge: ${id}.`);
        }
        return node;
    };

    const edgeCountsByNodePair = new Map<string, number>();
    // The number of the edge between its node pair (counting from 0)
    const nextEdgeNumber = (pairKey: string): number => {
        const edgeNumber = edgeCountsByNodePair.get(pairKey) ?? 0;
        edgeCountsByNodePair.set(pairKey, edgeNumber + 1);
        return edgeNumber;
    };

    const toForceGraphEdge = (resultEdge: ResultGraphEdge): ForceGraphEdge => {
        const source = getVisibleNode(resultEdge.source);
        const target = getVisibleNode(resultEdge.target);

        const pairKey = _nodePairKey(resultEdge.source, resultEdge.target);
        const edgeNumber = nextEdgeNumber(pairKey);

        // A self edge (a loop) or a repeated edge between the same two nodes gets a middle node
        const isLoop = source === target;
        const isRepeatedEdge = edgeNumber > 0;

        if (!isLoop && !isRepeatedEdge) {
            return { resultEdge, source, target };
        }
        return { resultEdge, source, mid: _toMidNode(pairKey, edgeNumber), target };
    };

    const edges = graph.edges.map(toForceGraphEdge);
    // The middle nodes in the order of their edges
    const midNodes = edges.flatMap(edge => (edge.mid ? [edge.mid] : []));

    return { nodes: [...visibleNodes, ...midNodes], visibleNodes, edges };
}

/**
 * Utils constants: FORCE_GRAPH_UTILS.
 *
 * It keeps a namespace reference to the force graph utils methods.
 */
export const FORCE_GRAPH_UTILS = {
    edgePath,
    isLargeGraph,
    isPositioned,
    isRelayout,
    isSelfEdge,
    nodeBounds,
    restorePositions,
    toForceGraphData,
} as const;
