import { beforeEach, describe, expect, it } from 'vitest';

import * as D3_ZOOM from 'd3-zoom';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { CanvasViewport } from '@awg-shared/canvas/canvas.model';

import { ResultGraph, ResultGraphEdge, ResultGraphNode } from '@awg-graph/graph-visualizer/models/result-graph.model';

import {
    ForceGraphBounds,
    ForceGraphData,
    ForceGraphEdge,
    ForceGraphPoint,
    ForceGraphVisibleNode,
} from '../force-graph.model';
import { FORCE_GRAPH_LARGE_NODE_COUNT, FORCE_GRAPH_UTILS } from '../force-graph.utils';

import { ForceGraphCanvasView } from './force-graph-canvas.model';

import {
    edgeLabelPosition,
    findVisibleNode,
    FORCE_GRAPH_CANVAS_HIT_TOLERANCE,
    FORCE_GRAPH_CANVAS_LIMITS,
    FORCE_GRAPH_CANVAS_STYLES,
    FORCE_GRAPH_CANVAS_UTILS,
    isArrowInView,
    isBoxInView,
    isEdgeInView,
    isEdgeLabelInView,
    isHit,
    isLabelInView,
    isNodeInView,
    isNodeLabelInView,
    isSquareInView,
    minCircleRadius,
    toCanvasBounds,
    toCanvasPoint,
    toGraphPoint,
    toViewBounds,
} from './force-graph-canvas.utils';

/**
 * Helper function: createForceGraphData.
 *
 * It creates the force graph data of the given result graph with the given positions of its nodes
 * (middle nodes at the origin).
 */
const createForceGraphData = (graph: ResultGraph, positions: [number, number][]): ForceGraphData => {
    const forceGraphData = FORCE_GRAPH_UTILS.toForceGraphData(graph);
    forceGraphData.nodes.forEach((node, index) => {
        [node.x, node.y] = positions[index] ?? [0, 0];
    });
    return forceGraphData;
};

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

describe('ForceGraphCanvasUtils (DONE)', () => {
    const viewport: CanvasViewport = { width: 400, height: 200, dpr: 2 };

    const nodes: ResultGraphNode[] = [
        { id: 'a', shortName: 'awg:a', label: 'A', kind: 'instance' },
        { id: 'b', shortName: 'awg:B', label: 'awg:B', kind: 'class' },
        { id: '_:c', shortName: '_:c', label: '_:c', kind: 'blank' },
        { id: '"x"', shortName: 'x', label: 'x', kind: 'literal' },
    ];
    const edges: ResultGraphEdge[] = [
        { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
        { id: 'e1', source: 'a', target: '_:c', label: 'awg:has' },
        { id: 'e2', source: '_:c', target: '"x"', label: 'awg:value' },
        { id: 'e3', source: 'a', target: 'a', label: 'awg:self' },
    ];
    const graph: ResultGraph = { nodes, edges, tripleCount: 4 };

    const view = (transform = D3_ZOOM.zoomIdentity): ForceGraphCanvasView => ({ transform, viewport });
    // A square view for the checks of single items
    const squareViewBounds: ForceGraphBounds = { min: { x: 0, y: 0 }, max: { x: 100, y: 100 } };

    describe('FORCE_GRAPH_CANVAS_UTILS', () => {
        it('... should reference all force graph canvas utils methods', () => {
            expectToEqual(FORCE_GRAPH_CANVAS_UTILS, {
                edgeLabelPosition,
                findVisibleNode,
                isArrowInView,
                isBoxInView,
                isEdgeInView,
                isEdgeLabelInView,
                isHit,
                isLabelInView,
                isNodeInView,
                isNodeLabelInView,
                isSquareInView,
                minCircleRadius,
                toCanvasBounds,
                toCanvasPoint,
                toGraphPoint,
                toViewBounds,
            });
        });
    });

    describe('FORCE_GRAPH_CANVAS_LIMITS', () => {
        it('... should hold the expected level-of-detail limits', () => {
            expectToEqual(FORCE_GRAPH_CANVAS_LIMITS, {
                MAX_LABELS: 300,
                MAX_ARROWS: 2000,
                MIN_NODE_CIRCLE_SCREEN_RADIUS: 3,
                MIN_ARROW_SCREEN_LENGTH: 3,
                MIN_NODE_LABEL_SCREEN_SIZE: 4,
                MIN_EDGE_LABEL_SCREEN_SIZE: 6.5,
            });
        });

        it('... should be frozen', () => {
            expectToBe(Object.isFrozen(FORCE_GRAPH_CANVAS_LIMITS), true);
        });
    });

    describe('FORCE_GRAPH_CANVAS_STYLES', () => {
        it('... should hold the fill color per kind of the nodes (literals and resources alike)', () => {
            expectToEqual(FORCE_GRAPH_CANVAS_STYLES.NODE_FILL, {
                blank: '#000',
                class: 'rgb(158, 0, 0)',
                instance: 'rgb(32, 178, 170)',
                literal: '#ddd',
                resource: '#ddd',
            });
        });

        it('... should be frozen', () => {
            expectToBe(Object.isFrozen(FORCE_GRAPH_CANVAS_STYLES), true);
            expectToBe(Object.isFrozen(FORCE_GRAPH_CANVAS_STYLES.NODE_FILL), true);
        });
    });

    describe('FORCE_GRAPH_CANVAS_HIT_TOLERANCE', () => {
        it('... should hold the tolerance around the circle of a node', () => {
            expectToBe(FORCE_GRAPH_CANVAS_HIT_TOLERANCE, 2);
        });
    });

    describe('METHODS', () => {
        describe('#edgeLabelPosition()', () => {
            it('... should have a method `edgeLabelPosition`', () => {
                expect(edgeLabelPosition).toBeDefined();
            });

            it('... should return the center of source, middle node and target, shifted to the right', () => {
                const edge = createEdge({ x: 0, y: 0 }, { x: 30, y: 30 }, { x: 60, y: 0 });
                const labelPosition = edgeLabelPosition(edge);

                expectToEqual(labelPosition, { x: 40, y: 14 });
            });

            it('... should return the center of source and target, shifted to the right, for an edge without middle node', () => {
                const edge = createEdge({ x: 0, y: 0 }, undefined, { x: 60, y: 20 });
                const labelPosition = edgeLabelPosition(edge);

                expectToEqual(labelPosition, { x: 40, y: 14 });
            });

            it('... should return a position above the loop for a self edge', () => {
                const edge = createSelfEdge({ x: 10, y: 10 }, { x: 40, y: 40 });
                const labelPosition = edgeLabelPosition(edge);

                expectToEqual(labelPosition, { x: 40, y: -20 });
            });

            it('... should return a position shifted to the right for different nodes at the same position', () => {
                const edge = createEdge({ x: 10, y: 10 }, { x: 40, y: 40 }, { x: 10, y: 10 });
                const labelPosition = edgeLabelPosition(edge);

                expectToEqual(labelPosition, { x: 30, y: 24 });
            });

            it('... should return NaN for nodes without position', () => {
                const unpositionedEdge = createEdge({}, {}, {});
                const unpositionedSelfEdge = createSelfEdge({}, {});
                const labelPosition = edgeLabelPosition(unpositionedEdge);
                const selfEdgeLabelPosition = edgeLabelPosition(unpositionedSelfEdge);

                expectToEqual(labelPosition, { x: NaN, y: NaN });
                expectToEqual(selfEdgeLabelPosition, { x: NaN, y: NaN });
            });
        });

        describe('#findVisibleNode()', () => {
            let forceGraphData: ForceGraphData;

            beforeEach(() => {
                // Test data: a at the origin, b to the right, c below, x below c (self edge e3 has a middle node)
                forceGraphData = createForceGraphData(graph, [
                    [0, 0],
                    [100, 0],
                    [0, 50],
                    [0, 80],
                    [20, -20],
                ]);
            });

            it('... should have a method `findVisibleNode`', () => {
                expect(findVisibleNode).toBeDefined();
            });

            it('... should find the graph node at a given point of the canvas', () => {
                // Node b at (100, 0) is drawn at (300, 100) of the canvas
                const found = findVisibleNode(forceGraphData, { x: 305, y: 104 }, view());

                expectToBe(found?.resultNode, nodes[1]);
            });

            it('... should find the graph node within the hit tolerance around its circle', () => {
                // Node b at (100, 0) with radius 10 is drawn at (300, 100) of the canvas
                const hitRadius = 10 + FORCE_GRAPH_CANVAS_HIT_TOLERANCE;
                const foundAtTolerance = findVisibleNode(forceGraphData, { x: 300 + hitRadius, y: 100 }, view());
                const foundBeyondTolerance = findVisibleNode(
                    forceGraphData,
                    { x: 300 + hitRadius + 1, y: 100 },
                    view()
                );

                expectToBe(foundAtTolerance?.resultNode, nodes[1]);
                expect(foundBeyondTolerance).toBeUndefined();
            });

            it('... should find the graph node with the zoom transform', () => {
                const transform = D3_ZOOM.zoomIdentity.translate(10, 20).scale(2);

                // Node b at (100, 0) is drawn at 2 * (100 + 200) + 10, 2 * (0 + 100) + 20
                const found = findVisibleNode(forceGraphData, { x: 610, y: 220 }, view(transform));

                expectToBe(found?.resultNode, nodes[1]);
            });

            it('... should find nothing in empty space and never a middle node', () => {
                const foundInEmptySpace = findVisibleNode(forceGraphData, { x: 10, y: 10 }, view());
                // The middle node of the self edge at (20, -20) is drawn at (220, 80)
                const foundAtMiddleNode = findVisibleNode(forceGraphData, { x: 220, y: 80 }, view());

                expect(foundInEmptySpace).toBeUndefined();
                expect(foundAtMiddleNode).toBeUndefined();
            });

            it('... should find the last node of overlapping nodes', () => {
                forceGraphData.nodes[1].x = 0;
                forceGraphData.nodes[1].y = 0;

                const found = findVisibleNode(forceGraphData, { x: 200, y: 100 }, view());

                expectToBe(found?.resultNode, nodes[1]);
            });
        });

        describe('#isArrowInView()', () => {
            it('... should have a method `isArrowInView`', () => {
                expect(isArrowInView).toBeDefined();
            });

            it('... should return true for an arrowhead reaching into the view from a target outside it', () => {
                // Target t with radius 9 and an arrow length of 6: the arrowhead reaches 15 to the right
                const edge = createEdge({ x: -100, y: 50 }, undefined, { x: -12, y: 50 });
                const isInView = isArrowInView(edge, squareViewBounds);

                expectToBe(isInView, true);
            });

            it('... should return false for an arrowhead entirely outside the view', () => {
                const edge = createEdge({ x: -100, y: 50 }, undefined, { x: -20, y: 50 });
                const isInView = isArrowInView(edge, squareViewBounds);

                expectToBe(isInView, false);
            });
        });

        describe('#isBoxInView()', () => {
            it('... should have a method `isBoxInView`', () => {
                expect(isBoxInView).toBeDefined();
            });

            it('... should return true for a box overlapping or touching the view', () => {
                const isOverlapping = isBoxInView(-10, -10, 10, 10, squareViewBounds);
                const isTouching = isBoxInView(-10, 40, 0, 60, squareViewBounds);

                expectToBe(isOverlapping, true);
                expectToBe(isTouching, true);
            });

            it('... should return false for a box outside the view', () => {
                const isInView = isBoxInView(101, 40, 120, 60, squareViewBounds);

                expectToBe(isInView, false);
            });

            it('... should return false for a box without position', () => {
                const isInView = isBoxInView(NaN, NaN, NaN, NaN, squareViewBounds);

                expectToBe(isInView, false);
            });
        });

        describe('#isEdgeInView()', () => {
            it('... should have a method `isEdgeInView`', () => {
                expect(isEdgeInView).toBeDefined();
            });

            it('... should return true for an edge crossing the view with both nodes outside', () => {
                const edge = createEdge({ x: -10, y: 50 }, undefined, { x: 110, y: 50 });
                const isInView = isEdgeInView(edge, squareViewBounds);

                expectToBe(isInView, true);
            });

            it('... should return false for an edge entirely outside the view', () => {
                const edge = createEdge({ x: -50, y: -50 }, undefined, { x: -10, y: -10 });
                const isInView = isEdgeInView(edge, squareViewBounds);

                expectToBe(isInView, false);
            });

            it('... should return true for the loop of a self edge reaching into the view from a node outside it', () => {
                const edge = createSelfEdge({ x: -40, y: 50 }, {});
                const isInView = isEdgeInView(edge, squareViewBounds);

                expectToBe(isInView, true);
            });

            it('... should return false for an edge without position', () => {
                const edge = createEdge({}, undefined, {});
                const isInView = isEdgeInView(edge, squareViewBounds);

                expectToBe(isInView, false);
            });
        });

        describe('#isEdgeLabelInView()', () => {
            it('... should have a method `isEdgeLabelInView`', () => {
                expect(isEdgeLabelInView).toBeDefined();
            });

            it('... should return true for an edge label reaching into the view from a position outside it', () => {
                // Label `p` with font size 13: an estimated width of 1 * 13 * 0.7 = 9.1
                const edgeLabel = { edge: createEdge({}, undefined, {}), position: { x: -5, y: 50 } };
                const isInView = isEdgeLabelInView(edgeLabel, squareViewBounds);

                expectToBe(isInView, true);
            });

            it('... should return false for an edge label entirely outside the view', () => {
                const edgeLabel = { edge: createEdge({}, undefined, {}), position: { x: -10, y: 50 } };
                const isInView = isEdgeLabelInView(edgeLabel, squareViewBounds);

                expectToBe(isInView, false);
            });
        });

        describe('#isHit()', () => {
            // Node b at (100, 0) with radius 10
            const nodeB: ForceGraphVisibleNode = { ...createVisibleNode('b', { x: 100, y: 0 }), radius: 10 };

            it('... should have a method `isHit`', () => {
                expect(isHit).toBeDefined();
            });

            it('... should hit a node at a point within its circle', () => {
                const isNodeHit = isHit(nodeB, { x: 105, y: 4 });

                expectToBe(isNodeHit, true);
            });

            it('... should hit a node within the hit tolerance around its circle, but not beyond', () => {
                const hitRadius = 10 + FORCE_GRAPH_CANVAS_HIT_TOLERANCE;
                const isHitAtTolerance = isHit(nodeB, { x: 100 + hitRadius, y: 0 });
                const isHitBeyondTolerance = isHit(nodeB, { x: 100 + hitRadius + 0.1, y: 0 });

                expectToBe(isHitAtTolerance, true);
                expectToBe(isHitBeyondTolerance, false);
            });

            it('... should never hit a node without position', () => {
                const unpositionedNode = createVisibleNode('s', {});
                const isNodeHit = isHit(unpositionedNode, { x: 0, y: 0 });

                expectToBe(isNodeHit, false);
            });
        });

        describe('#isLabelInView()', () => {
            it('... should have a method `isLabelInView`', () => {
                expect(isLabelInView).toBeDefined();
            });

            // An estimated width of 5 * 10 * LABEL_CHAR_WIDTH (0.7) = 35 for 'abcde', 70 for 'abcdefghij'
            describe('... should return', () => {
                it.each([
                    {
                        desc: 'true for a label reaching into the view from a start outside it',
                        x: -20,
                        label: 'abcde',
                        expected: true,
                    },
                    { desc: 'false for a label ending before the view', x: -40, label: 'abcde', expected: false },
                    {
                        desc: 'true for a longer label from the same start reaching into the view',
                        x: -40,
                        label: 'abcdefghij',
                        expected: true,
                    },
                ])('... $desc', ({ x, label, expected }) => {
                    const isInView = isLabelInView(x, 50, label, 10, squareViewBounds);

                    expectToBe(isInView, expected);
                });
            });
        });

        describe('#isNodeInView()', () => {
            it('... should have a method `isNodeInView`', () => {
                expect(isNodeInView).toBeDefined();
            });

            it('... should return true for a node whose circle reaches into the view from a center outside it', () => {
                // Radius 9
                const node = createVisibleNode('s', { x: -5, y: 50 });
                const isInView = isNodeInView(node, squareViewBounds);

                expectToBe(isInView, true);
            });

            it('... should return false for a node entirely outside the view', () => {
                const node = createVisibleNode('s', { x: -10, y: 50 });
                const isInView = isNodeInView(node, squareViewBounds);

                expectToBe(isInView, false);
            });

            it('... should return false for a node without position', () => {
                const node = createVisibleNode('s', {});
                const isInView = isNodeInView(node, squareViewBounds);

                expectToBe(isInView, false);
            });
        });

        describe('#isNodeLabelInView()', () => {
            it('... should have a method `isNodeLabelInView`', () => {
                expect(isNodeLabelInView).toBeDefined();
            });

            it('... should return true for the label of a node outside the view reaching into it', () => {
                // Node outside (circle up to -21), label `abcde` from -18 with an estimated width of 5 * 15 * 0.7 = 52.5
                const node = createVisibleNode('abcde', { x: -30, y: 50 });
                const isInView = isNodeLabelInView(node, squareViewBounds);

                expectToBe(isInView, true);
            });

            it('... should return false for the label of a node ending before the view', () => {
                const node = createVisibleNode('abcde', { x: -80, y: 50 });
                const isInView = isNodeLabelInView(node, squareViewBounds);

                expectToBe(isInView, false);
            });
        });

        describe('#isSquareInView()', () => {
            it('... should have a method `isSquareInView`', () => {
                expect(isSquareInView).toBeDefined();
            });

            it('... should return true for a square reaching into the view from a center outside it', () => {
                const isInView = isSquareInView(-5, 50, 10, squareViewBounds);

                expectToBe(isInView, true);
            });

            it('... should return false for a square entirely outside the view', () => {
                const isInView = isSquareInView(-15, 50, 10, squareViewBounds);

                expectToBe(isInView, false);
            });
        });

        describe('#minCircleRadius()', () => {
            it('... should have a method `minCircleRadius`', () => {
                expect(minCircleRadius).toBeDefined();
            });

            it('... should return 0 for a small graph (only circles)', () => {
                const circleRadius = minCircleRadius(FORCE_GRAPH_LARGE_NODE_COUNT - 1, 0.3);

                expectToBe(circleRadius, 0);
            });

            it('... should return the minimum screen radius in graph units for a large graph', () => {
                const circleRadius = minCircleRadius(FORCE_GRAPH_LARGE_NODE_COUNT, 0.3);

                expectToBe(circleRadius, FORCE_GRAPH_CANVAS_LIMITS.MIN_NODE_CIRCLE_SCREEN_RADIUS / 0.3);
            });

            it('... should return a larger minimum radius for a large graph at a smaller zoom', () => {
                const zoomedInRadius = minCircleRadius(FORCE_GRAPH_LARGE_NODE_COUNT, 0.3);
                const zoomedOutRadius = minCircleRadius(FORCE_GRAPH_LARGE_NODE_COUNT, 0.1);

                expect(zoomedOutRadius).toBeGreaterThan(zoomedInRadius);
            });
        });

        describe('#toCanvasBounds()', () => {
            it('... should have a method `toCanvasBounds`', () => {
                expect(toCanvasBounds).toBeDefined();
            });

            it('... should return the canvas bounds of given bounds in graph coordinates', () => {
                const zoomTransform = D3_ZOOM.zoomIdentity.translate(10, 20).scale(2);
                const bounds = { min: { x: -100, y: -50 }, max: { x: 100, y: 50 } };
                const canvasBounds = toCanvasBounds(bounds, view());
                const zoomedCanvasBounds = toCanvasBounds(bounds, view(zoomTransform));

                expectToEqual(canvasBounds, { min: { x: 100, y: 50 }, max: { x: 300, y: 150 } });
                expectToEqual(zoomedCanvasBounds, { min: { x: 210, y: 120 }, max: { x: 610, y: 320 } });
            });
        });

        describe('#toCanvasPoint()', () => {
            it('... should have a method `toCanvasPoint`', () => {
                expect(toCanvasPoint).toBeDefined();
            });

            it('... should return the canvas coordinates of a given point in graph coordinates', () => {
                const zoomTransform = D3_ZOOM.zoomIdentity.translate(10, 20).scale(2);
                const originPoint = toCanvasPoint({ x: 0, y: 0 }, view());
                const zoomedPoint = toCanvasPoint({ x: 100, y: 0 }, view(zoomTransform));

                expectToEqual(originPoint, { x: 200, y: 100 });
                expectToEqual(zoomedPoint, { x: 610, y: 220 });
            });
        });

        describe('#toGraphPoint()', () => {
            it('... should have a method `toGraphPoint`', () => {
                expect(toGraphPoint).toBeDefined();
            });

            it('... should return the graph coordinates of a given point of the canvas', () => {
                const zoomTransform = D3_ZOOM.zoomIdentity.translate(10, 20).scale(2);
                const centerPoint = toGraphPoint({ x: 200, y: 100 }, view());
                const zoomedPoint = toGraphPoint({ x: 610, y: 220 }, view(zoomTransform));

                expectToEqual(centerPoint, { x: 0, y: 0 });
                expectToEqual(zoomedPoint, { x: 100, y: 0 });
            });
        });

        describe('#toViewBounds()', () => {
            it('... should have a method `toViewBounds`', () => {
                expect(toViewBounds).toBeDefined();
            });

            it('... should return the area of the canvas in view in graph coordinates', () => {
                const viewBounds = toViewBounds(view());
                const zoomedViewBounds = toViewBounds(view(D3_ZOOM.zoomIdentity.translate(10, 20).scale(2)));

                expectToEqual(viewBounds, { min: { x: -200, y: -100 }, max: { x: 200, y: 100 } });
                expectToEqual(zoomedViewBounds, { min: { x: -205, y: -110 }, max: { x: -5, y: -10 } });
            });
        });
    });
});
