import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { ResultGraph } from '@awg-graph/graph-visualizer/models/result-graph.model';

import { ForceGraphData, ForceGraphPoint } from '../force-graph.model';
import { FORCE_GRAPH_UTILS } from '../force-graph.utils';

import {
    FORCE_GRAPH_SIMULATION_TRANSFER_UTILS,
    getPosition,
    packPositions,
    setPosition,
    toSimulationInput,
    unpackPositions,
} from './force-graph-simulation-transfer.utils';

describe('ForceGraphSimulationTransferUtils (DONE)', () => {
    let forceGraphData: ForceGraphData;

    const resultGraph: ResultGraph = {
        nodes: [
            { id: 'a', shortName: 'ex:a', label: 'A', kind: 'instance' },
            { id: 'b', shortName: 'ex:b', label: 'ex:b', kind: 'class' },
            { id: 'c', shortName: 'ex:c', label: 'ex:c', kind: 'blank' },
        ],
        edges: [
            { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
            { id: 'e1', source: 'a', target: 'c', label: 'ex:has' },
            { id: 'e2', source: 'c', target: 'a', label: 'ex:back' },
        ],
        tripleCount: 3,
    };

    beforeEach(() => {
        // Nodes a, b, c and the middle node of the repeated edge e2
        forceGraphData = FORCE_GRAPH_UTILS.toForceGraphData(resultGraph);
    });

    describe('FORCE_GRAPH_SIMULATION_TRANSFER_UTILS', () => {
        it('... should reference all force graph simulation transfer utils methods', () => {
            expectToEqual(FORCE_GRAPH_SIMULATION_TRANSFER_UTILS, {
                getPosition,
                packPositions,
                setPosition,
                toSimulationInput,
                unpackPositions,
            });
        });
    });

    describe('METHODS', () => {
        describe('#getPosition()', () => {
            it('... should have a method `getPosition`', () => {
                expect(getPosition).toBeDefined();
            });

            it('... should return the position of the node with the given index', () => {
                const positions = Float32Array.from([1, 2, 3, 4]);

                expectToEqual(getPosition(positions, 0), { x: 1, y: 2 });
                expectToEqual(getPosition(positions, 1), { x: 3, y: 4 });
            });
        });

        describe('#packPositions()', () => {
            it('... should have a method `packPositions`', () => {
                expect(packPositions).toBeDefined();
            });

            it('... should return the positions of the given nodes as pairs and NaN for unknown (missing or NaN) positions', () => {
                const nodes: Partial<ForceGraphPoint>[] = [{ x: 1, y: 2 }, {}, { x: NaN, y: NaN }, { x: 5, y: 6 }];

                expectToEqual(Array.from(packPositions(nodes)), [1, 2, NaN, NaN, NaN, NaN, 5, 6]);
            });

            it('... should return empty positions for no nodes', () => {
                expectToBe(packPositions([]).length, 0);
            });
        });

        describe('#setPosition()', () => {
            it('... should have a method `setPosition`', () => {
                expect(setPosition).toBeDefined();
            });

            it('... should set the given position at the node with the given index', () => {
                const positions = new Float32Array(4);

                setPosition(positions, 1, { x: 3, y: 4 });

                expectToEqual(Array.from(positions), [0, 0, 3, 4]);
            });
        });

        describe('#toSimulationInput()', () => {
            it('... should have a method `toSimulationInput`', () => {
                expect(toSimulationInput).toBeDefined();
            });

            it('... should return the radius of each force graph node', () => {
                const { radii } = toSimulationInput(forceGraphData);

                expectToEqual(Array.from(radii), [11, 10, 8, 9]);
            });

            it('... should return the links derived from the edges as pairs of node indices (two via a middle node)', () => {
                const { links } = toSimulationInput(forceGraphData);

                // Links a -> b, a -> c, c -> middle node of a/c, middle node of a/c -> a
                expectToEqual(Array.from(links), [0, 1, 0, 2, 2, 3, 3, 0]);
            });

            it('... should return the known positions and NaN for unknown positions', () => {
                forceGraphData.nodes[1].x = 5;
                forceGraphData.nodes[1].y = 6;

                const { positions } = toSimulationInput(forceGraphData);

                expectToEqual(Array.from(positions), [NaN, NaN, 5, 6, NaN, NaN, NaN, NaN]);
            });

            it('... should return the relayout flag if at least half of the nodes have a position', () => {
                // One of four force graph nodes with a position: a new layout
                forceGraphData.nodes[0].x = 1;
                forceGraphData.nodes[0].y = 2;
                const inputOfNewLayout = toSimulationInput(forceGraphData);

                // Two of four force graph nodes with a position: a relayout
                forceGraphData.nodes[1].x = 5;
                forceGraphData.nodes[1].y = 6;
                const inputOfRelayout = toSimulationInput(forceGraphData);

                expectToBe(inputOfNewLayout.isRelayout, false);
                expectToBe(inputOfRelayout.isRelayout, true);
            });

            it('... should throw for an edge with an unknown node', () => {
                const invalidData: ForceGraphData = {
                    ...forceGraphData,
                    edges: [
                        {
                            ...forceGraphData.edges[0],
                            target: {
                                id: 'x',
                                radius: 9,
                                resultNode: { id: 'x', shortName: 'x', label: 'x', kind: 'resource' },
                                x: NaN,
                                y: NaN,
                            },
                        },
                    ],
                };

                expect(() => toSimulationInput(invalidData)).toThrow(
                    '[FORCE_GRAPH_SIMULATION_TRANSFER_UTILS] Unknown node of an edge: x.'
                );
            });
        });

        describe('#unpackPositions()', () => {
            it('... should have a method `unpackPositions`', () => {
                expect(unpackPositions).toBeDefined();
            });

            it('... should set the given positions in the force graph nodes of the same index', () => {
                unpackPositions(Float32Array.from([1, 2, 3, 4, 5, 6, 7, 8]), forceGraphData.nodes);

                const nodePositions = forceGraphData.nodes.map(node => [node.x, node.y]);

                expectToEqual(nodePositions, [
                    [1, 2],
                    [3, 4],
                    [5, 6],
                    [7, 8],
                ]);
            });
        });
    });
});
