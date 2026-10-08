import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { ResultGraph, ResultGraphEdge, ResultGraphNode } from '../../../models/result-graph.model';
import { SimEdge, SimNode } from './force-graph.model';
import {
    FORCE_GRAPH_UTILS,
    linkLabelPosition,
    linkPath,
    NODE_RADIUS,
    nodeCssClass,
    nodeRadius,
    toSimulationData,
} from './force-graph.utils';

/**
 * Helper function: createSimEdge.
 *
 * It creates a simulation edge with nodes at the given positions.
 */
const createSimEdge = (
    source: { x?: number; y?: number },
    mid: { x?: number; y?: number },
    target: { x?: number; y?: number }
): SimEdge => ({
    edge: { id: 'e0', source: 's', target: 't', label: 'p' },
    source: { id: 's', r: 9, ...source } as SimNode,
    mid: { id: 'e0#mid', r: 9, ...mid } as SimNode,
    target: { id: 't', r: 9, ...target } as SimNode,
});

/**
 * Helper function: createSelfSimEdge.
 *
 * It creates a simulation edge from a node at the given position to itself.
 */
const createSelfSimEdge = (node: { x?: number; y?: number }, mid: { x?: number; y?: number }): SimEdge => {
    const simNode = { id: 's', r: 9, ...node } as SimNode;
    return {
        edge: { id: 'e0', source: 's', target: 's', label: 'p' },
        source: simNode,
        mid: { id: 'e0#mid', r: 9, ...mid } as SimNode,
        target: simNode,
    };
};

describe('ForceGraphUtils (DONE)', () => {
    describe('FORCE_GRAPH_UTILS', () => {
        it('... should reference all force graph utils methods', () => {
            expectToEqual(FORCE_GRAPH_UTILS, {
                linkLabelPosition,
                linkPath,
                nodeCssClass,
                nodeRadius,
                toSimulationData,
            });
        });
    });

    describe('NODE_RADIUS', () => {
        it('... should hold the radius per kind', () => {
            expectToEqual(NODE_RADIUS, { blank: 8, class: 10, instance: 11, literal: 9, resource: 9 });
        });

        it('... should be frozen', () => {
            expectToBe(Object.isFrozen(NODE_RADIUS), true);
        });
    });

    describe('METHODS', () => {
        describe('#nodeRadius()', () => {
            it('... should have a method `nodeRadius`', () => {
                expect(nodeRadius).toBeDefined();
            });

            it('... should hold the radius of the given kind', () => {
                expectToBe(nodeRadius('instance'), 11);
                expectToBe(nodeRadius('blank'), 8);
            });
        });

        describe('#nodeCssClass()', () => {
            it('... should have a method `nodeCssClass`', () => {
                expect(nodeCssClass).toBeDefined();
            });

            it('... should hold the kind as class for classes, instances and blank nodes', () => {
                expectToBe(nodeCssClass('class'), 'class');
                expectToBe(nodeCssClass('instance'), 'instance');
                expectToBe(nodeCssClass('blank'), 'blank');
            });

            it('... should hold the default class `node` for literals and resources', () => {
                expectToBe(nodeCssClass('literal'), 'node');
                expectToBe(nodeCssClass('resource'), 'node');
            });
        });

        describe('#toSimulationData()', () => {
            const nodes: ResultGraphNode[] = [
                { id: 'a', shortName: 'ex:a', label: 'A', kind: 'instance' },
                { id: 'b', shortName: 'ex:b', label: 'ex:b', kind: 'class' },
            ];
            const edges: ResultGraphEdge[] = [
                { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
                { id: 'e1', source: 'a', target: 'a', label: 'ex:self' },
            ];
            const graph: ResultGraph = { nodes, edges, tripleCount: 2 };

            it('... should have a method `toSimulationData`', () => {
                expect(toSimulationData).toBeDefined();
            });

            it('... should hold a simulation node per graph node with its radius, followed by a middle node per edge', () => {
                const { nodes: simNodes } = toSimulationData(graph);

                expectToEqual(
                    simNodes.map(simNode => [simNode.id, simNode.graphNode?.id, simNode.r]),
                    [
                        ['a', 'a', 11],
                        ['b', 'b', 10],
                        ['e0#mid', undefined, 9],
                        ['e1#mid', undefined, 9],
                    ]
                );
            });

            it('... should hold an edge with the simulation nodes of source, middle node and target', () => {
                const { nodes: simNodes, edges: simEdges } = toSimulationData(graph);

                expectToBe(simEdges[0].edge, edges[0]);
                expectToBe(simEdges[0].source, simNodes[0]);
                expectToBe(simEdges[0].mid, simNodes[2]);
                expectToBe(simEdges[0].target, simNodes[1]);
            });

            it('... should share the simulation node of a graph node between its edges (also self edges)', () => {
                const { edges: simEdges } = toSimulationData(graph);

                expectToBe(simEdges[1].source, simEdges[0].source);
                expectToBe(simEdges[1].target, simEdges[1].source);
            });

            it('... should hold two links per edge via its middle node', () => {
                const { links, edges: simEdges } = toSimulationData(graph);

                expectToEqual(links, [
                    { source: simEdges[0].source, target: simEdges[0].mid },
                    { source: simEdges[0].mid, target: simEdges[0].target },
                    { source: simEdges[1].source, target: simEdges[1].mid },
                    { source: simEdges[1].mid, target: simEdges[1].target },
                ]);
            });

            it('... should throw for an edge with an unknown node', () => {
                const invalidGraph: ResultGraph = {
                    ...graph,
                    edges: [{ id: 'e0', source: 'a', target: 'x', label: 'p' }],
                };

                expect(() => toSimulationData(invalidGraph)).toThrow('[FORCE_GRAPH_UTILS] Unknown node of an edge: x.');
            });

            it('... should hold empty simulation data for an empty graph', () => {
                expectToEqual(toSimulationData({ nodes: [], edges: [], tripleCount: 0 }), {
                    nodes: [],
                    links: [],
                    edges: [],
                });
            });
        });

        describe('#linkPath()', () => {
            it('... should have a method `linkPath`', () => {
                expect(linkPath).toBeDefined();
            });

            it('... should hold a straight path from source to target', () => {
                const simEdge = createSimEdge({ x: 10, y: 20 }, {}, { x: 30, y: 40 });

                expectToBe(linkPath(simEdge), 'M10,20A0,0 0,0,1 30,40');
            });

            it('... should hold a loop for a self edge', () => {
                const simEdge = createSelfSimEdge({ x: 10, y: 20 }, {});

                expectToBe(linkPath(simEdge), 'M10,20A30,20 -45,1,1 11,21');
            });

            it('... should hold a straight path for different nodes at the same position', () => {
                const simEdge = createSimEdge({ x: 10, y: 20 }, {}, { x: 10, y: 20 });

                expectToBe(linkPath(simEdge), 'M10,20A0,0 0,0,1 10,20');
            });

            it('... should use the origin for nodes without position', () => {
                expectToBe(linkPath(createSimEdge({}, {}, { x: 5, y: 5 })), 'M0,0A0,0 0,0,1 5,5');
                expectToBe(linkPath(createSimEdge({ x: 5, y: 5 }, {}, {})), 'M5,5A0,0 0,0,1 0,0');
            });
        });

        describe('#linkLabelPosition()', () => {
            it('... should have a method `linkLabelPosition`', () => {
                expect(linkLabelPosition).toBeDefined();
            });

            it('... should hold the center of source, middle node and target, shifted to the right', () => {
                const simEdge = createSimEdge({ x: 0, y: 0 }, { x: 30, y: 30 }, { x: 60, y: 0 });

                expectToEqual(linkLabelPosition(simEdge), { x: 40, y: 14 });
            });

            it('... should hold a position above the loop for a self edge', () => {
                const simEdge = createSelfSimEdge({ x: 10, y: 10 }, { x: 40, y: 40 });

                expectToEqual(linkLabelPosition(simEdge), { x: 40, y: -20 });
            });

            it('... should hold a position shifted to the right for different nodes at the same position', () => {
                const simEdge = createSimEdge({ x: 10, y: 10 }, { x: 40, y: 40 }, { x: 10, y: 10 });

                expectToEqual(linkLabelPosition(simEdge), { x: 30, y: 24 });
            });

            it('... should use the origin for nodes without position', () => {
                expectToEqual(linkLabelPosition(createSimEdge({}, {}, {})), { x: 10, y: 4 });
                expectToEqual(linkLabelPosition(createSelfSimEdge({}, {})), { x: 20, y: -40 });
            });
        });
    });
});
