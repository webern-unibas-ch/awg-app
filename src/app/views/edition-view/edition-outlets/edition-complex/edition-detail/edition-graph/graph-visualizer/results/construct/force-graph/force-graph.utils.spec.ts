import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { ResultGraph, ResultGraphEdge, ResultGraphNode } from '@awg-graph/graph-visualizer/models/result-graph.model';

import { ForceGraphEdge, ForceGraphNode, ForceGraphPoint, ForceGraphVisibleNode } from './force-graph.model';
import {
    edgePath,
    FORCE_GRAPH_LARGE_NODE_COUNT,
    FORCE_GRAPH_NODE_RADIUS,
    FORCE_GRAPH_UTILS,
    isLargeGraph,
    isPositioned,
    isRelayout,
    isSelfEdge,
    nodeBounds,
    restorePositions,
    toForceGraphData,
} from './force-graph.utils';

/**
 * Helper function: createVisibleNode.
 *
 * It creates a visible force graph node with the given id at the given position (NaN if not given).
 */
const createVisibleNode = (id: string, point: Partial<ForceGraphPoint>): ForceGraphVisibleNode => ({
    id,
    radius: 9,
    resultNode: { id, shortName: id, label: id, kind: 'resource' },
    x: NaN,
    y: NaN,
    ...point,
});

/**
 * Helper function: createEdge.
 *
 * It creates a force graph edge with nodes at the given positions (NaN if not given).
 */
const createEdge = (
    source: Partial<ForceGraphPoint>,
    mid: Partial<ForceGraphPoint> | undefined,
    target: Partial<ForceGraphPoint>
): ForceGraphEdge => ({
    resultEdge: { id: 'e0', source: 's', target: 't', label: 'p' },
    source: createVisibleNode('s', source),
    mid: mid && { id: 's\nt#mid1', radius: 9, x: NaN, y: NaN, ...mid },
    target: createVisibleNode('t', target),
});

/**
 * Helper function: createSelfEdge.
 *
 * It creates a force graph edge from a node at the given position to itself.
 */
const createSelfEdge = (node: Partial<ForceGraphPoint>, mid: Partial<ForceGraphPoint>): ForceGraphEdge => {
    const selfNode = createVisibleNode('s', node);
    return {
        resultEdge: { id: 'e0', source: 's', target: 's', label: 'p' },
        source: selfNode,
        mid: { id: 's\ns#mid0', radius: 9, x: NaN, y: NaN, ...mid },
        target: selfNode,
    };
};

describe('ForceGraphUtils (DONE)', () => {
    describe('FORCE_GRAPH_UTILS', () => {
        it('... should reference all force graph utils methods', () => {
            expectToEqual(FORCE_GRAPH_UTILS, {
                edgePath,
                isLargeGraph,
                isPositioned,
                isRelayout,
                isSelfEdge,
                nodeBounds,
                restorePositions,
                toForceGraphData,
            });
        });
    });

    describe('FORCE_GRAPH_LARGE_NODE_COUNT', () => {
        it('... should hold the number of force graph nodes from which a force graph is large', () => {
            expectToBe(FORCE_GRAPH_LARGE_NODE_COUNT, 1000);
        });
    });

    describe('FORCE_GRAPH_NODE_RADIUS', () => {
        it('... should hold the radius per kind', () => {
            expectToEqual(FORCE_GRAPH_NODE_RADIUS, { blank: 8, class: 10, instance: 11, literal: 9, resource: 9 });
        });

        it('... should be frozen', () => {
            expectToBe(Object.isFrozen(FORCE_GRAPH_NODE_RADIUS), true);
        });
    });

    describe('METHODS', () => {
        describe('#edgePath()', () => {
            it('... should have a method `edgePath`', () => {
                expect(edgePath).toBeDefined();
            });

            it('... should hold source, middle node and target for an edge with middle node', () => {
                const edge = createEdge({}, {}, {});

                expectToEqual(edgePath(edge), [edge.source, edge.mid, edge.target]);
            });

            it('... should hold source and target for an edge without middle node', () => {
                const edge = createEdge({}, undefined, {});

                expectToEqual(edgePath(edge), [edge.source, edge.target]);
            });

            it('... should hold the same node as source and target for a self edge', () => {
                const edge = createSelfEdge({}, {});
                const [source, , target] = edgePath(edge);

                expectToBe(source, target);
            });
        });

        describe('#isLargeGraph()', () => {
            it('... should have a method `isLargeGraph`', () => {
                expect(isLargeGraph).toBeDefined();
            });

            it('... should hold true from FORCE_GRAPH_LARGE_NODE_COUNT force graph nodes', () => {
                expectToBe(isLargeGraph(FORCE_GRAPH_LARGE_NODE_COUNT - 1), false);
                expectToBe(isLargeGraph(FORCE_GRAPH_LARGE_NODE_COUNT), true);
            });
        });

        describe('#isPositioned()', () => {
            it('... should have a method `isPositioned`', () => {
                expect(isPositioned).toBeDefined();
            });

            it('... should hold true for a point with finite coordinates', () => {
                expectToBe(isPositioned({ x: 0, y: -3.5 }), true);
            });

            it('... should hold false for a point with a NaN or infinite coordinate', () => {
                expectToBe(isPositioned({ x: NaN, y: 0 }), false);
                expectToBe(isPositioned({ x: 0, y: NaN }), false);
                expectToBe(isPositioned({ x: Infinity, y: 0 }), false);
            });
        });

        describe('#isRelayout()', () => {
            /**
             * Creates the given number of force graph nodes with and without position.
             */
            const createNodes = (positionedCount: number, unpositionedCount: number): ForceGraphNode[] => [
                ...Array.from({ length: positionedCount }, (_, i) => ({ id: `p${i}`, radius: 9, x: i, y: i })),
                ...Array.from({ length: unpositionedCount }, (_, i) => ({ id: `u${i}`, radius: 9, x: NaN, y: NaN })),
            ];

            it('... should have a method `isRelayout`', () => {
                expect(isRelayout).toBeDefined();
            });

            it('... should hold true if at least half of the nodes have a position', () => {
                expectToBe(isRelayout(createNodes(2, 2)), true);
                expectToBe(isRelayout(createNodes(3, 1)), true);
            });

            it('... should hold false if less than half of the nodes have a position', () => {
                expectToBe(isRelayout(createNodes(1, 3)), false);
            });

            it('... should hold false without positioned nodes', () => {
                expectToBe(isRelayout(createNodes(0, 2)), false);
                expectToBe(isRelayout([]), false);
            });

            it('... should count only nodes with both coordinates as positioned', () => {
                const nodes: ForceGraphNode[] = [{ id: 'a', radius: 9, x: 1, y: NaN }];

                expectToBe(isRelayout(nodes), false);
            });
        });

        describe('#isSelfEdge()', () => {
            it('... should have a method `isSelfEdge`', () => {
                expect(isSelfEdge).toBeDefined();
            });

            it('... should hold true for an edge from a node to itself', () => {
                const edge = createSelfEdge({}, {});

                expectToBe(isSelfEdge(edge), true);
            });

            it('... should hold false for an edge between two nodes (also at the same position)', () => {
                const edge = createEdge({ x: 10, y: 10 }, undefined, { x: 10, y: 10 });

                expectToBe(isSelfEdge(edge), false);
            });
        });

        describe('#nodeBounds()', () => {
            it('... should have a method `nodeBounds`', () => {
                expect(nodeBounds).toBeDefined();
            });

            it('... should hold the area covered by the positioned nodes including their radius', () => {
                const nodes: ForceGraphNode[] = [
                    { id: 'a', radius: 10, x: 0, y: 0 },
                    { id: 'b', radius: 5, x: 100, y: -50 },
                    { id: 'c', radius: 9, x: NaN, y: NaN },
                ];

                expectToEqual(nodeBounds(nodes), { min: { x: -10, y: -55 }, max: { x: 105, y: 10 } });
            });

            it('... should hold undefined without positioned nodes', () => {
                const nodes: ForceGraphNode[] = [{ id: 'a', radius: 9, x: NaN, y: NaN }];

                expect(nodeBounds(nodes)).toBeUndefined();
                expect(nodeBounds([])).toBeUndefined();
            });
        });

        describe('#restorePositions()', () => {
            it('... should have a method `restorePositions`', () => {
                expect(restorePositions).toBeDefined();
            });

            it('... should copy the positions of previous nodes with the same id', () => {
                const nodes: ForceGraphNode[] = [
                    { id: 'a', radius: 9, x: NaN, y: NaN },
                    { id: 'b', radius: 9, x: NaN, y: NaN },
                ];
                const previousNodes: ForceGraphNode[] = [
                    { id: 'b', radius: 9, x: 3, y: 4 },
                    { id: 'c', radius: 9, x: 5, y: 6 },
                ];

                restorePositions(nodes, previousNodes);

                expect(nodes[0].x).toBeNaN();
                expect(nodes[0].y).toBeNaN();
                expectToBe(nodes[1].x, 3);
                expectToBe(nodes[1].y, 4);
            });

            it('... should keep the nodes without position without matching or positioned previous nodes', () => {
                const nodes: ForceGraphNode[] = [{ id: 'a', radius: 9, x: NaN, y: NaN }];

                restorePositions(nodes, []);
                restorePositions(nodes, [{ id: 'a', radius: 9, x: NaN, y: NaN }]);
                restorePositions(nodes, [{ id: 'x', radius: 9, x: 1, y: 1 }]);

                expect(nodes[0].x).toBeNaN();
                expect(nodes[0].y).toBeNaN();
            });
        });

        describe('#toForceGraphData()', () => {
            const nodes: ResultGraphNode[] = [
                { id: 'a', shortName: 'ex:a', label: 'A', kind: 'instance' },
                { id: 'b', shortName: 'ex:b', label: 'ex:b', kind: 'class' },
            ];
            const edges: ResultGraphEdge[] = [
                { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
                { id: 'e1', source: 'a', target: 'a', label: 'ex:self' },
                { id: 'e2', source: 'b', target: 'a', label: 'ex:back' },
            ];
            const graph: ResultGraph = { nodes, edges, tripleCount: 3 };

            it('... should have a method `toForceGraphData`', () => {
                expect(toForceGraphData).toBeDefined();
            });

            it('... should hold a force graph node per node of the result graph with its radius, followed by the middle nodes', () => {
                const { nodes: forceGraphNodes } = toForceGraphData(graph);
                const nodeSummaries = forceGraphNodes.map(node => [node.id, node.radius]);

                expectToEqual(nodeSummaries, [
                    ['a', 11],
                    ['b', 10],
                    ['a\na#mid0', 9],
                    ['a\nb#mid1', 9],
                ]);
                expectToBe('resultNode' in forceGraphNodes[2], false);
                expectToBe('resultNode' in forceGraphNodes[3], false);
            });

            it('... should hold the same id for the middle node of the same edge between two nodes at another index of the result graph', () => {
                const shiftedGraph: ResultGraph = {
                    nodes: [...nodes, { id: 'c', shortName: 'ex:c', label: 'ex:c', kind: 'resource' }],
                    edges: [{ id: 'e0', source: 'c', target: 'c', label: 'ex:other' }, edges[0], edges[2]],
                    tripleCount: 3,
                };
                const { edges: forceGraphEdges } = toForceGraphData(graph);
                const { edges: shiftedForceGraphEdges } = toForceGraphData(shiftedGraph);

                expectToBe(shiftedForceGraphEdges[2].mid?.id, forceGraphEdges[2].mid?.id);
            });

            it('... should hold different ids for the middle nodes of edges between other nodes at the same index of the result graph', () => {
                const otherGraph: ResultGraph = {
                    nodes,
                    edges: [edges[0], { id: 'e1', source: 'b', target: 'b', label: 'ex:self' }],
                    tripleCount: 2,
                };
                const { edges: forceGraphEdges } = toForceGraphData(graph);
                const { edges: otherForceGraphEdges } = toForceGraphData(otherGraph);

                expect(otherForceGraphEdges[1].mid?.id).not.toBe(forceGraphEdges[1].mid?.id);
            });

            it('... should hold the force graph nodes of the result graph (without the middle nodes) as visible nodes', () => {
                const { nodes: forceGraphNodes, visibleNodes } = toForceGraphData(graph);

                expectToEqual(visibleNodes, forceGraphNodes.slice(0, 2));
                expectToBe(visibleNodes[0], forceGraphNodes[0]);
                expectToBe(visibleNodes[0].resultNode, nodes[0]);
                expectToBe(visibleNodes[1].resultNode, nodes[1]);
            });

            it('... should hold an edge without middle node for the first edge between two nodes', () => {
                const { nodes: forceGraphNodes, edges: forceGraphEdges } = toForceGraphData(graph);

                expectToBe(forceGraphEdges[0].resultEdge, edges[0]);
                expectToBe(forceGraphEdges[0].source, forceGraphNodes[0]);
                expect(forceGraphEdges[0].mid).toBeUndefined();
                expectToBe(forceGraphEdges[0].target, forceGraphNodes[1]);
            });

            it('... should hold an edge with a middle node for a self edge', () => {
                const { nodes: forceGraphNodes, edges: forceGraphEdges } = toForceGraphData(graph);

                expectToBe(forceGraphEdges[1].mid, forceGraphNodes[2]);
            });

            it('... should hold an edge with a middle node for a repeated edge between two nodes (also in the other direction)', () => {
                const { nodes: forceGraphNodes, edges: forceGraphEdges } = toForceGraphData(graph);

                expectToBe(forceGraphEdges[2].source, forceGraphNodes[1]);
                expectToBe(forceGraphEdges[2].mid, forceGraphNodes[3]);
                expectToBe(forceGraphEdges[2].target, forceGraphNodes[0]);
            });

            it('... should share the force graph node of a node of the result graph between its edges (also self edges)', () => {
                const { edges: forceGraphEdges } = toForceGraphData(graph);

                expectToBe(forceGraphEdges[1].source, forceGraphEdges[0].source);
                expectToBe(forceGraphEdges[1].target, forceGraphEdges[1].source);
            });

            it('... should hold all nodes without position (NaN) until they are laid out', () => {
                const { nodes: forceGraphNodes } = toForceGraphData(graph);
                const hasNoPositions = forceGraphNodes.every(node => Number.isNaN(node.x) && Number.isNaN(node.y));

                expectToBe(hasNoPositions, true);
            });

            it('... should throw for an edge with an unknown node', () => {
                const invalidGraph: ResultGraph = {
                    ...graph,
                    edges: [{ id: 'e0', source: 'a', target: 'x', label: 'p' }],
                };

                expect(() => toForceGraphData(invalidGraph)).toThrow('[FORCE_GRAPH_UTILS] Unknown node of an edge: x.');
            });

            it('... should hold empty force graph data for an empty graph', () => {
                const emptyForceGraphData = toForceGraphData({ nodes: [], edges: [], tripleCount: 0 });

                expectToEqual(emptyForceGraphData, { nodes: [], visibleNodes: [], edges: [] });
            });
        });
    });
});
