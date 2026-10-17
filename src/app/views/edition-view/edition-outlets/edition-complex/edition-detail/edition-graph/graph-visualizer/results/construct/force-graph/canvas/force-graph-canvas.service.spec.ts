import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as D3_ZOOM from 'd3-zoom';

import { createFakeCanvasContext, FakeCanvasContext } from '@testing/canvas-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { CanvasViewport } from '@awg-shared/canvas/canvas.model';

import { ResultGraph, ResultGraphEdge, ResultGraphNode } from '@awg-graph/graph-visualizer/models/result-graph.model';

import { ForceGraphData, ForceGraphEdge, ForceGraphPoint, ForceGraphVisibleNode } from '../force-graph.model';
import { FORCE_GRAPH_LARGE_NODE_COUNT, FORCE_GRAPH_UTILS } from '../force-graph.utils';

import { ForceGraphCanvasEdgeLabel, ForceGraphCanvasView } from './force-graph-canvas.model';
import { ForceGraphCanvasService } from './force-graph-canvas.service';
import {
    FORCE_GRAPH_CANVAS_LIMITS,
    FORCE_GRAPH_CANVAS_STYLES,
    FORCE_GRAPH_CANVAS_UTILS,
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
 * Helper function: toSquareArgs.
 *
 * It gets the expected arguments of `rect` for the square of a node at the given center with the given radius
 * (the square with the area of the circle, side r * √π).
 */
const toSquareArgs = (x: number, y: number, radius: number): number[] => {
    const halfSide = (radius * Math.sqrt(Math.PI)) / 2;
    return [x - halfSide, y - halfSide, 2 * halfSide, 2 * halfSide];
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

describe('ForceGraphCanvasService (DONE)', () => {
    let service: ForceGraphCanvasService;
    let ctx: FakeCanvasContext;
    let forceGraphData: ForceGraphData;

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
    const draw = (transform = D3_ZOOM.zoomIdentity): void => service.drawGraph(ctx, forceGraphData, view(transform));
    // The test data made a large graph by nodes far outside the view (only the test nodes are drawn)
    const createLargeForceGraphData = (): ForceGraphData => {
        const farNodes: ResultGraphNode[] = Array.from({ length: FORCE_GRAPH_LARGE_NODE_COUNT }, (_, index) => ({
            id: `far${index}`,
            shortName: `far${index}`,
            label: `far${index}`,
            kind: 'resource',
        }));
        const farPositions = farNodes.map((): [number, number] => [100000, 100000]);
        return createForceGraphData({ nodes: [...nodes, ...farNodes], edges, tripleCount: edges.length }, [
            [0, 0],
            [100, 0],
            [0, 50],
            [0, 80],
            ...farPositions,
        ]);
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ForceGraphCanvasService],
        });
        service = TestBed.inject(ForceGraphCanvasService);

        // Test data: a at the origin, b to the right, c below, x below c (self edge e3 has a middle node)
        ctx = createFakeCanvasContext({ width: 800, height: 400 });
        forceGraphData = createForceGraphData(graph, [
            [0, 0],
            [100, 0],
            [0, 50],
            [0, 80],
            [20, -20],
        ]);
    });

    afterEach(() => {
        // The spies on the utils namespace outlive the service instance
        vi.restoreAllMocks();
    });

    it('... should inject', () => {
        expect(service).toBeTruthy();
    });

    describe('#drawGraph()', () => {
        // The given edges and nodes by their ids
        const edgesById = (...ids: string[]): ForceGraphEdge[] =>
            forceGraphData.edges.filter(edge => ids.includes(edge.resultEdge.id));
        const nodesById = (...ids: string[]): ForceGraphVisibleNode[] =>
            forceGraphData.visibleNodes.filter(node => ids.includes(node.id));
        // Predicates for mocked view checks: true only for the edges, nodes or edge labels with the given ids
        const isEdgeOf =
            (...ids: string[]) =>
            (edge: ForceGraphEdge): boolean =>
                ids.includes(edge.resultEdge.id);
        const isNodeOf =
            (...ids: string[]) =>
            (node: ForceGraphVisibleNode): boolean =>
                ids.includes(node.id);
        const isEdgeLabelOf =
            (...ids: string[]) =>
            ({ edge }: ForceGraphCanvasEdgeLabel): boolean =>
                ids.includes(edge.resultEdge.id);

        it('... should have a method `drawGraph`', () => {
            expect(service.drawGraph).toBeDefined();
        });

        it('... should prepare the canvas with the given view before drawing', () => {
            const prepareCanvasSpy = vi.spyOn(service, '_prepareCanvas' as any);
            const transform = D3_ZOOM.zoomIdentity.translate(10, 20).scale(2);

            draw(transform);

            expectSpyCall(prepareCanvasSpy, 1, [ctx, view(transform)]);
            expectToEqual(ctx.calls[0].method, 'setTransform');
        });

        it('... should draw the edges, arrowheads, nodes, edge labels and node labels in this order', () => {
            const drawSpies = ['_drawEdges', '_drawArrows', '_drawNodes', '_drawEdgeLabels', '_drawNodeLabels'].map(
                method => vi.spyOn(service, method as any)
            );

            draw();

            const callOrders = drawSpies.map(spy => spy.mock.invocationCallOrder[0]);

            expectToEqual(
                callOrders,
                [...callOrders].sort((a, b) => a - b)
            );
        });

        describe('... edges', () => {
            it('... should draw the edges in view', () => {
                const isEdgeInViewSpy = vi
                    .spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isEdgeInView')
                    .mockImplementation(isEdgeOf('e0', 'e2'));
                const drawEdgesSpy = vi.spyOn(service, '_drawEdges' as any);

                draw();

                expectSpyCall(isEdgeInViewSpy, 4, [
                    forceGraphData.edges[3],
                    FORCE_GRAPH_CANVAS_UTILS.toViewBounds(view()),
                ]);
                expectSpyCall(drawEdgesSpy, 1, [ctx, edgesById('e0', 'e2')]);
            });
        });

        describe('... arrowheads', () => {
            it('... should draw the arrowheads in view of the edges in view', () => {
                vi.spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isEdgeInView').mockImplementation(isEdgeOf('e0', 'e2'));
                const isArrowInViewSpy = vi
                    .spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isArrowInView')
                    .mockImplementation(isEdgeOf('e2'));
                const drawArrowsSpy = vi.spyOn(service, '_drawArrows' as any);

                draw();

                expectSpyCall(isArrowInViewSpy, 2);
                expectSpyCall(drawArrowsSpy, 1, [ctx, edgesById('e2')]);
            });

            it('... should not draw arrowheads if too many edges with a target are in view', () => {
                const manyEdges: ResultGraphEdge[] = Array.from(
                    { length: FORCE_GRAPH_CANVAS_LIMITS.MAX_ARROWS + 1 },
                    (_, index) => ({ id: `e${index}`, source: 'a', target: 'b', label: 'p' })
                );
                forceGraphData = createForceGraphData({ nodes: nodes.slice(0, 2), edges: manyEdges, tripleCount: 1 }, [
                    [0, 0],
                    [100, 0],
                ]);
                const drawArrowsSpy = vi.spyOn(service, '_drawArrows' as any);

                draw();

                expectSpyCall(drawArrowsSpy, 0);
            });

            it('... should not draw arrowheads below the minimum screen length', () => {
                const isArrowInViewSpy = vi.spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isArrowInView');
                const drawArrowsSpy = vi.spyOn(service, '_drawArrows' as any);

                // Arrow length 6 at zoom 0.4: 2.4 css pixels on the screen
                draw(D3_ZOOM.zoomIdentity.scale(0.4));

                expectSpyCall(isArrowInViewSpy, 0);
                expectSpyCall(drawArrowsSpy, 0);
            });

            it('... should draw arrowheads from the minimum screen length', () => {
                const drawArrowsSpy = vi.spyOn(service, '_drawArrows' as any);

                // Arrow length 6 at zoom 0.5: 3 css pixels on the screen
                draw(D3_ZOOM.zoomIdentity.scale(0.5));

                expectSpyCall(drawArrowsSpy, 1);
            });
        });

        describe('... nodes', () => {
            it('... should draw the visible nodes in view (without the middle nodes)', () => {
                const isNodeInViewSpy = vi
                    .spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isNodeInView')
                    .mockImplementation(isNodeOf('a'));
                const drawNodesSpy = vi.spyOn(service, '_drawNodes' as any);

                draw();

                expectSpyCall(isNodeInViewSpy, forceGraphData.visibleNodes.length);
                expectSpyCall(drawNodesSpy, 1, [ctx, nodesById('a'), 0]);
            });

            it('... should draw the nodes with the minimum circle radius for the node count and zoom', () => {
                forceGraphData = createLargeForceGraphData();
                const minCircleRadiusSpy = vi.spyOn(FORCE_GRAPH_CANVAS_UTILS, 'minCircleRadius');
                const drawNodesSpy = vi.spyOn(service, '_drawNodes' as any);

                draw(D3_ZOOM.zoomIdentity.scale(0.3));

                expectSpyCall(minCircleRadiusSpy, 1, [forceGraphData.nodes.length, 0.3]);
                expectToBe(drawNodesSpy.mock.lastCall?.[2], minCircleRadiusSpy.mock.results[0].value);
            });
        });

        describe('... labels', () => {
            it('... should label the nodes whose label touches the view', () => {
                // Node b outside the view, but its label reaching into it
                vi.spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isNodeInView').mockImplementation(isNodeOf('a'));
                vi.spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isNodeLabelInView').mockImplementation(isNodeOf('a', 'b'));
                const drawNodeLabelsSpy = vi.spyOn(service, '_drawNodeLabels' as any);

                draw();

                expectSpyCall(drawNodeLabelsSpy, 1, [ctx, nodesById('a', 'b')]);
            });

            it('... should label the edges whose label touches the view at their label position', () => {
                // Edge e1 outside the view, but its label reaching into it
                vi.spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isEdgeInView').mockReturnValue(false);
                vi.spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isEdgeLabelInView').mockImplementation(isEdgeLabelOf('e1'));
                const drawEdgeLabelsSpy = vi.spyOn(service, '_drawEdgeLabels' as any);

                draw();

                const [edge] = edgesById('e1');

                expectSpyCall(drawEdgeLabelsSpy, 1, [
                    ctx,
                    [{ edge, position: FORCE_GRAPH_CANVAS_UTILS.edgeLabelPosition(edge) }],
                ]);
            });

            it('... should not label nodes if too many nodes are in view', () => {
                const manyNodes: ResultGraphNode[] = Array.from(
                    { length: FORCE_GRAPH_CANVAS_LIMITS.MAX_LABELS + 1 },
                    (_, index) => ({ id: `n${index}`, shortName: `n${index}`, label: `n${index}`, kind: 'resource' })
                );
                forceGraphData = createForceGraphData({ nodes: manyNodes, edges: [], tripleCount: 0 }, []);
                const drawNodeLabelsSpy = vi.spyOn(service, '_drawNodeLabels' as any);

                draw();

                expectSpyCall(drawNodeLabelsSpy, 0);
            });

            it('... should not label the edges if too many edges are in view, even above the minimum screen size', () => {
                const manyEdges: ResultGraphEdge[] = Array.from(
                    { length: FORCE_GRAPH_CANVAS_LIMITS.MAX_LABELS + 1 },
                    (_, index) => ({ id: `e${index}`, source: 'a', target: 'b', label: 'p' })
                );
                forceGraphData = createForceGraphData({ nodes: nodes.slice(0, 2), edges: manyEdges, tripleCount: 1 }, [
                    [0, 0],
                    [100, 0],
                ]);
                const drawEdgeLabelsSpy = vi.spyOn(service, '_drawEdgeLabels' as any);
                const drawNodeLabelsSpy = vi.spyOn(service, '_drawNodeLabels' as any);

                draw();

                expectSpyCall(drawEdgeLabelsSpy, 0);
                expectSpyCall(drawNodeLabelsSpy, 1);
            });

            it('... should not label the edges below the minimum screen size, but still the nodes', () => {
                const isEdgeLabelInViewSpy = vi.spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isEdgeLabelInView');
                const drawEdgeLabelsSpy = vi.spyOn(service, '_drawEdgeLabels' as any);
                const drawNodeLabelsSpy = vi.spyOn(service, '_drawNodeLabels' as any);

                // Edge label font 13 at zoom 0.4: 5.2 css pixels on the screen
                draw(D3_ZOOM.zoomIdentity.scale(0.4));

                expectSpyCall(isEdgeLabelInViewSpy, 0);
                expectSpyCall(drawEdgeLabelsSpy, 0);
                expectSpyCall(drawNodeLabelsSpy, 1);
            });

            it('... should label the edges from the minimum screen size', () => {
                const drawEdgeLabelsSpy = vi.spyOn(service, '_drawEdgeLabels' as any);

                // Edge label font 13 at zoom 0.5: 6.5 css pixels on the screen
                draw(D3_ZOOM.zoomIdentity.scale(0.5));

                expectSpyCall(drawEdgeLabelsSpy, 1);
            });

            it('... should not label the nodes below the minimum screen size', () => {
                const isNodeLabelInViewSpy = vi.spyOn(FORCE_GRAPH_CANVAS_UTILS, 'isNodeLabelInView');
                const drawNodeLabelsSpy = vi.spyOn(service, '_drawNodeLabels' as any);

                // Node label font 15 at zoom 0.25: 3.75 css pixels on the screen
                draw(D3_ZOOM.zoomIdentity.scale(0.25));

                expectSpyCall(isNodeLabelInViewSpy, 0);
                expectSpyCall(drawNodeLabelsSpy, 0);
            });

            it('... should label the nodes from the minimum screen size', () => {
                const drawNodeLabelsSpy = vi.spyOn(service, '_drawNodeLabels' as any);

                // Node label font 15 at zoom 4 / 15: 4 css pixels on the screen
                draw(D3_ZOOM.zoomIdentity.scale(4 / 15));

                expectSpyCall(drawNodeLabelsSpy, 1);
            });
        });

        it('... should draw no items without position (before the first layout result)', () => {
            forceGraphData = FORCE_GRAPH_UTILS.toForceGraphData(graph);
            const drawSpies = ['_drawEdges', '_drawArrows', '_drawEdgeLabels', '_drawNodeLabels'].map(method =>
                vi.spyOn(service, method as any)
            );
            const drawNodesSpy = vi.spyOn(service, '_drawNodes' as any);

            draw();

            drawSpies.forEach(spy => expectSpyCall(spy, 1, [ctx, []]));
            expectSpyCall(drawNodesSpy, 1, [ctx, [], 0]);
        });
    });

    describe('#_drawArrows()', () => {
        it('... should have a method `_drawArrows`', () => {
            expect(service['_drawArrows']).toBeDefined();
        });

        it('... should draw one arrowhead per edge as one filled path, touching the target circle', () => {
            // Targets with radius 9: the tips at 91, the bases (arrow length 6, half width 3) at 85
            const edgeToRight = createEdge({ x: 0, y: 0 }, undefined, { x: 100, y: 0 });
            const edgeDown = createEdge({ x: 0, y: 0 }, undefined, { x: 0, y: 100 });

            service['_drawArrows'](ctx, [edgeToRight, edgeDown]);

            const fillCalls = ctx.callsOf('fill');
            const moveToArgs = ctx.callsOf('moveTo').map(call => call.args);
            const lineToArgs = ctx.callsOf('lineTo').map(call => call.args);

            expectToBe(ctx.callsOf('beginPath').length, 1);
            expectToEqual(moveToArgs, [
                [91, 0],
                [0, 91],
            ]);
            expectToEqual(lineToArgs, [
                [85, 3],
                [85, -3],
                [-3, 85],
                [3, 85],
            ]);
            expectToBe(ctx.callsOf('closePath').length, 2);
            expectToBe(fillCalls.length, 1);
            expectToBe(fillCalls[0].fillStyle, FORCE_GRAPH_CANVAS_STYLES.ARROW_FILL);
        });

        it('... should not draw arrowheads of self edges and of edges whose source lies within the target circle', () => {
            const selfEdge = createSelfEdge({ x: 0, y: 0 }, {});
            const shortEdge = createEdge({ x: 0, y: 0 }, undefined, { x: 5, y: 0 });

            service['_drawArrows'](ctx, [selfEdge, shortEdge]);

            expectToBe(ctx.callsOf('moveTo').length, 0);
            expectToBe(ctx.callsOf('closePath').length, 0);
        });
    });

    describe('#_drawEdges()', () => {
        it('... should have a method `_drawEdges`', () => {
            expect(service['_drawEdges']).toBeDefined();
        });

        it('... should draw all straight edges as one stroked path from source to target', () => {
            const edgeToRight = createEdge({ x: 0, y: 0 }, undefined, { x: 100, y: 0 });
            const edgeDown = createEdge({ x: 0, y: 0 }, undefined, { x: 0, y: 50 });

            service['_drawEdges'](ctx, [edgeToRight, edgeDown]);

            const strokeCalls = ctx.callsOf('stroke');
            const moveToArgs = ctx.callsOf('moveTo').map(call => call.args);
            const lineToArgs = ctx.callsOf('lineTo').map(call => call.args);

            expectToBe(ctx.callsOf('beginPath').length, 1);
            expectToEqual(moveToArgs, [
                [0, 0],
                [0, 0],
            ]);
            expectToEqual(lineToArgs, [
                [100, 0],
                [0, 50],
            ]);
            expectToBe(strokeCalls.length, 1);
            expectToBe(strokeCalls[0].strokeStyle, FORCE_GRAPH_CANVAS_STYLES.EDGE_STROKE);
            expectToBe(strokeCalls[0].lineWidth, FORCE_GRAPH_CANVAS_STYLES.EDGE_STROKE_WIDTH);
        });

        it('... should draw a self edge as a loop starting and ending at the node', () => {
            const selfEdge = createSelfEdge({ x: 0, y: 0 }, {});

            service['_drawEdges'](ctx, [selfEdge]);

            const ellipseCalls = ctx.callsOf('ellipse');
            const { LOOP_RADIUS_X, LOOP_RADIUS_Y, LOOP_ROTATION } = FORCE_GRAPH_CANVAS_STYLES;

            expectToBe(ctx.callsOf('lineTo').length, 0);
            expectToBe(ellipseCalls.length, 1);
            expectToEqual(ellipseCalls[0].args, [
                LOOP_RADIUS_X * Math.cos(LOOP_ROTATION),
                LOOP_RADIUS_X * Math.sin(LOOP_ROTATION),
                LOOP_RADIUS_X,
                LOOP_RADIUS_Y,
                LOOP_ROTATION,
                Math.PI,
                3 * Math.PI,
            ]);
        });
    });

    describe('#_drawEdgeLabels()', () => {
        it('... should have a method `_drawEdgeLabels`', () => {
            expect(service['_drawEdgeLabels']).toBeDefined();
        });

        it('... should label each given edge at its given position', () => {
            const edgeLabel = { edge: createEdge({}, undefined, {}), position: { x: 10, y: 20 } };

            service['_drawEdgeLabels'](ctx, [edgeLabel]);

            const fillTextCalls = ctx.callsOf('fillText');

            expectToEqual(
                fillTextCalls.map(call => call.args),
                [['p', 10, 20]]
            );
            expectToBe(fillTextCalls[0].font, FORCE_GRAPH_CANVAS_STYLES.EDGE_LABEL_FONT);
            expectToBe(fillTextCalls[0].fillStyle, FORCE_GRAPH_CANVAS_STYLES.EDGE_LABEL_FILL);
        });
    });

    describe('#_drawNodes()', () => {
        // The ids of the nodes per call of the given spy
        const nodeIdsPerCall = (spy: { mock: { calls: unknown[][] } }): string[][] =>
            spy.mock.calls.map(([, callNodes]) => (callNodes as ForceGraphVisibleNode[]).map(node => node.id));

        it('... should have a method `_drawNodes`', () => {
            expect(service['_drawNodes']).toBeDefined();
        });

        it('... should draw the nodes as circles once per fill color with the stroke style of the nodes', () => {
            const drawNodeCirclesSpy = vi.spyOn(service, '_drawNodeCircles' as any);
            const drawNodeSquaresSpy = vi.spyOn(service, '_drawNodeSquares' as any);

            service['_drawNodes'](ctx, forceGraphData.visibleNodes, 0);

            const fillCalls = ctx.callsOf('fill');
            const strokeCalls = ctx.callsOf('stroke');

            expectToEqual(nodeIdsPerCall(drawNodeCirclesSpy), [['_:c'], ['b'], ['a'], ['"x"']]);
            expectSpyCall(drawNodeSquaresSpy, 0);
            expectToEqual(
                fillCalls.map(call => call.fillStyle),
                ['#000', 'rgb(158, 0, 0)', 'rgb(32, 178, 170)', '#ddd']
            );
            expectToBe(strokeCalls[0].strokeStyle, FORCE_GRAPH_CANVAS_STYLES.NODE_STROKE);
            expectToBe(strokeCalls[0].lineWidth, FORCE_GRAPH_CANVAS_STYLES.NODE_STROKE_WIDTH);
        });

        it('... should draw the nodes from the minimum circle radius as circles and smaller ones as squares', () => {
            const drawNodeCirclesSpy = vi.spyOn(service, '_drawNodeCircles' as any);
            const drawNodeSquaresSpy = vi.spyOn(service, '_drawNodeSquares' as any);

            // Radii: c 8, x 9 (squares), b 10, a 11 (circles)
            service['_drawNodes'](ctx, forceGraphData.visibleNodes, 10);

            expectToEqual(nodeIdsPerCall(drawNodeCirclesSpy), [['b'], ['a']]);
            expectToEqual(nodeIdsPerCall(drawNodeSquaresSpy), [['_:c'], ['"x"']]);
        });

        it('... should draw neither circles nor squares without nodes', () => {
            const drawNodeCirclesSpy = vi.spyOn(service, '_drawNodeCircles' as any);
            const drawNodeSquaresSpy = vi.spyOn(service, '_drawNodeSquares' as any);

            service['_drawNodes'](ctx, [], 0);

            expectSpyCall(drawNodeCirclesSpy, 0);
            expectSpyCall(drawNodeSquaresSpy, 0);
        });
    });

    describe('#_drawNodeCircles()', () => {
        it('... should have a method `_drawNodeCircles`', () => {
            expect(service['_drawNodeCircles']).toBeDefined();
        });

        it('... should draw the given nodes as one filled and stroked path of circles', () => {
            // Nodes a at (0, 0) with radius 11 and b at (100, 0) with radius 10
            service['_drawNodeCircles'](ctx, forceGraphData.visibleNodes.slice(0, 2));

            const moveToArgs = ctx.callsOf('moveTo').map(call => call.args);
            const arcArgs = ctx.callsOf('arc').map(call => call.args);

            expectToBe(ctx.callsOf('beginPath').length, 1);
            expectToEqual(moveToArgs, [
                [11, 0],
                [110, 0],
            ]);
            expectToEqual(arcArgs, [
                [0, 0, 11, 0, 2 * Math.PI],
                [100, 0, 10, 0, 2 * Math.PI],
            ]);
            expectToBe(ctx.callsOf('fill').length, 1);
            expectToBe(ctx.callsOf('stroke').length, 1);
        });
    });

    describe('#_drawNodeLabels()', () => {
        it('... should have a method `_drawNodeLabels`', () => {
            expect(service['_drawNodeLabels']).toBeDefined();
        });

        it('... should label each given node with its short name next to it', () => {
            service['_drawNodeLabels'](ctx, forceGraphData.visibleNodes);

            const fillTextCalls = ctx.callsOf('fillText');

            expectToEqual(
                fillTextCalls.map(call => call.args),
                [
                    ['awg:a', 12, 3],
                    ['awg:B', 112, 3],
                    ['_:c', 12, 53],
                    ['x', 12, 83],
                ]
            );
            expectToBe(fillTextCalls[0].font, FORCE_GRAPH_CANVAS_STYLES.NODE_LABEL_FONT);
            expectToBe(fillTextCalls[0].fillStyle, FORCE_GRAPH_CANVAS_STYLES.NODE_LABEL_FILL);
        });
    });

    describe('#_drawNodeSquares()', () => {
        it('... should have a method `_drawNodeSquares`', () => {
            expect(service['_drawNodeSquares']).toBeDefined();
        });

        it('... should draw the given nodes as one filled path of squares with the area of their circles (without stroke)', () => {
            // Nodes a at (0, 0) with radius 11 and b at (100, 0) with radius 10
            service['_drawNodeSquares'](ctx, forceGraphData.visibleNodes.slice(0, 2));

            const squares = ctx.callsOf('rect').map(call => call.args);

            expectToBe(ctx.callsOf('beginPath').length, 1);
            expectToEqual(squares, [toSquareArgs(0, 0, 11), toSquareArgs(100, 0, 10)]);
            expectToBe(ctx.callsOf('fill').length, 1);
            expectToBe(ctx.callsOf('stroke').length, 0);
        });
    });

    describe('#_prepareCanvas()', () => {
        it('... should have a method `_prepareCanvas`', () => {
            expect(service['_prepareCanvas']).toBeDefined();
        });

        it('... should clear the whole backing store', () => {
            service['_prepareCanvas'](ctx, view());

            const [resetCall, clearCall] = ctx.calls;

            expectToEqual(resetCall.method, 'setTransform');
            expectToEqual(resetCall.args, [1, 0, 0, 1, 0, 0]);
            expectToEqual(clearCall.method, 'clearRect');
            expectToEqual(clearCall.args, [0, 0, 800, 400]);
        });

        it('... should clear the whole rounded backing store at a fractional device pixel ratio', () => {
            const fractionalCtx = createFakeCanvasContext({ width: 1004, height: 502 });
            const fractionalView: ForceGraphCanvasView = {
                transform: D3_ZOOM.zoomIdentity,
                viewport: { width: 803, height: 401, dpr: 1.25 },
            };
            service['_prepareCanvas'](fractionalCtx, fractionalView);

            const [clearCall] = fractionalCtx.callsOf('clearRect');

            expectToEqual(clearCall.args, [0, 0, 1004, 502]);
        });

        it('... should set the origin of the graph in the center of the canvas (scaled by the device pixel ratio)', () => {
            service['_prepareCanvas'](ctx, view());

            const [, drawTransformCall] = ctx.callsOf('setTransform');

            expectToEqual(drawTransformCall.args, [2, 0, 0, 2, 400, 200]);
        });

        it('... should apply the zoom transform around the centered origin', () => {
            service['_prepareCanvas'](ctx, view(D3_ZOOM.zoomIdentity.translate(10, 20).scale(2)));

            const [, drawTransformCall] = ctx.callsOf('setTransform');

            // Dpr * (t + k * center)
            expectToEqual(drawTransformCall.args, [4, 0, 0, 4, 820, 440]);
        });
    });
});
