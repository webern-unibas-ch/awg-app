/*
 * The simulation transfer utils convert the force graph data into the transferable input of a simulation
 * and unpack its results into the force graph data (main thread). The positions format is shared
 * with the simulation (web worker): they must only depend on pure utils and types.
 */

import type { ForceGraphData, ForceGraphEdge, ForceGraphNode, ForceGraphPoint } from '../force-graph.model';
import { FORCE_GRAPH_UTILS } from '../force-graph.utils';

import type { ForceGraphSimulationInput } from './force-graph-simulation.model';

/**
 * Private utils method: _toLinkIndices.
 *
 * It converts the given force graph edges into links between consecutive force graph nodes of their paths
 * (two links via the middle node of an edge that has one), as pairs of node indices.
 *
 * @param {readonly ForceGraphEdge[]} edges The given force graph edges.
 * @param {readonly ForceGraphNode[]} nodes The given force graph nodes (defining the indices).
 * @returns {Int32Array} The links as pairs of node indices (source, target, ...).
 */
function _toLinkIndices(edges: readonly ForceGraphEdge[], nodes: readonly ForceGraphNode[]): Int32Array {
    const nodeIndices = new Map<ForceGraphNode, number>(nodes.map((node, index) => [node, index]));

    const getNodeIndex = (node: ForceGraphNode): number => {
        const index = nodeIndices.get(node);
        if (index === undefined) {
            throw new Error(`[FORCE_GRAPH_SIMULATION_TRANSFER_UTILS] Unknown node of an edge: ${node.id}.`);
        }
        return index;
    };

    const linkIndices: number[] = [];
    edges.forEach(edge => {
        const path = FORCE_GRAPH_UTILS.edgePath(edge);
        // A link between each two consecutive nodes of the path
        for (let index = 1; index < path.length; index++) {
            const sourceIndex = getNodeIndex(path[index - 1]);
            const targetIndex = getNodeIndex(path[index]);
            linkIndices.push(sourceIndex, targetIndex);
        }
    });
    return Int32Array.from(linkIndices);
}

/**
 * Utils method: getPosition.
 *
 * It gets the position of the node with the given index from the given positions (pairs: x, y, x, y, ...).
 *
 * @param {Float32Array} positions The given positions.
 * @param {number} index The given index of the node.
 * @returns {ForceGraphPoint} The position of the node.
 */
export function getPosition(positions: Float32Array, index: number): ForceGraphPoint {
    return { x: positions[2 * index], y: positions[2 * index + 1] };
}

/**
 * Utils method: setPosition.
 *
 * It sets the position of the node with the given index in the given positions (pairs: x, y, x, y, ...).
 *
 * @param {Float32Array} positions The given positions.
 * @param {number} index The given index of the node.
 * @param {ForceGraphPoint} point The given position of the node.
 * @returns {void} Sets the position.
 */
export function setPosition(positions: Float32Array, index: number, point: ForceGraphPoint): void {
    positions[2 * index] = point.x;
    positions[2 * index + 1] = point.y;
}

/**
 * Utils method: packPositions.
 *
 * It packs the positions of the given force graph or D3 simulation nodes into pairs (x, y, x, y, ...);
 * NaN for unknown positions.
 *
 * @param {readonly Partial<ForceGraphPoint>[]} nodes The given force graph or D3 simulation nodes.
 * @returns {Float32Array} The packed positions.
 */
export function packPositions(nodes: readonly Partial<ForceGraphPoint>[]): Float32Array {
    const positions = new Float32Array(nodes.length * 2);
    nodes.forEach((node, index) => {
        setPosition(positions, index, { x: node.x ?? Number.NaN, y: node.y ?? Number.NaN });
    });
    return positions;
}

/**
 * Utils method: unpackPositions.
 *
 * It unpacks the given positions (pairs: x, y, x, y, ...) into the given force graph nodes of the same index.
 *
 * @param {Float32Array} positions The given packed positions.
 * @param {readonly ForceGraphNode[]} nodes The given force graph nodes.
 * @returns {void} Sets the positions of the nodes.
 */
export function unpackPositions(positions: Float32Array, nodes: readonly ForceGraphNode[]): void {
    nodes.forEach((node, index) => {
        Object.assign(node, getPosition(positions, index));
    });
}

/**
 * Utils method: toSimulationInput.
 *
 * It converts the given force graph data into the structured-cloneable input of a simulation:
 * radii, positions and links (as node indices, via middle nodes) of the force graph nodes.
 *
 * @param {ForceGraphData} graphData The given force graph data.
 * @returns {ForceGraphSimulationInput} The simulation input.
 */
export function toSimulationInput(graphData: ForceGraphData): ForceGraphSimulationInput {
    const { nodes, edges } = graphData;

    const radii = Float32Array.from(nodes, node => node.radius);
    const positions = packPositions(nodes);
    const links = _toLinkIndices(edges, nodes);
    const isRelayout = FORCE_GRAPH_UTILS.isRelayout(nodes);

    return { radii, links, positions, isRelayout };
}

/**
 * Utils constants: FORCE_GRAPH_SIMULATION_TRANSFER_UTILS.
 *
 * It keeps a namespace reference to the force graph simulation transfer utils methods.
 */
export const FORCE_GRAPH_SIMULATION_TRANSFER_UTILS = {
    getPosition,
    packPositions,
    setPosition,
    toSimulationInput,
    unpackPositions,
} as const;
