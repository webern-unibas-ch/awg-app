import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { Subject } from 'rxjs';

import { createFakeCanvasContext, FakeCanvasContext } from '@testing/canvas-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { MockResizeObserver, stubResizeObserver } from '@testing/svg-drawing-helper';

import { CanvasDragDirective } from '@awg-shared/canvas/drag/canvas-drag.directive';
import { CanvasTooltipComponent } from '@awg-shared/canvas/tooltip/canvas-tooltip.component';
import { CanvasViewportDirective } from '@awg-shared/canvas/viewport/canvas-viewport.directive';
import { CanvasZoomDirective } from '@awg-shared/canvas/zoom/canvas-zoom.directive';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { ResultGraph, ResultGraphNode } from '@awg-graph/graph-visualizer/models/result-graph.model';

import { ForceGraphData, ForceGraphVisibleNode } from '../force-graph.model';
import { FORCE_GRAPH_LARGE_NODE_COUNT, FORCE_GRAPH_UTILS } from '../force-graph.utils';
import { ForceGraphSimulationCommand, ForceGraphSimulationProgress } from '../simulation/force-graph-simulation.model';
import { ForceGraphSimulationService } from '../simulation/force-graph-simulation.service';

import { ForceGraphCanvasComponent } from './force-graph-canvas.component';
import { ForceGraphCanvasService } from './force-graph-canvas.service';

describe('ForceGraphCanvasComponent (DONE)', () => {
    let component: ForceGraphCanvasComponent;
    let fixture: ComponentFixture<ForceGraphCanvasComponent>;
    let compDe: DebugElement;

    let fakeContext: FakeCanvasContext;
    let simulationSubjects: Subject<ForceGraphSimulationProgress>[];
    let simulationCommands: ForceGraphSimulationCommand[];
    let frameCallbacks: FrameRequestCallback[];

    let drawGraphSpy: Mock<ForceGraphCanvasService['drawGraph']>;
    let simulateSpy: Mock<ForceGraphSimulationService['simulate']>;
    let zoomToFitSpy: Mock<CanvasZoomDirective['zoomToFit']>;
    let clickedNodeRequestSpy: Mock<(node: ResultGraphNode) => void>;

    let mockResizeObservers: MockResizeObserver[];

    let expectedZoomConfig: ZoomConfig;
    let expectedResultGraph: ResultGraph;
    let expectedNextResultGraph: ResultGraph;

    const expectedNodes: ResultGraphNode[] = [
        { id: 'a', shortName: 'awg:a', label: 'A', kind: 'instance' },
        { id: 'b', shortName: 'awg:B', label: 'awg:B', kind: 'class' },
        { id: '_:c', shortName: '_:c', label: '_:c', kind: 'blank' },
    ];

    // Positions of a, b and c (canvas 400 x 200: b is drawn at (300, 100))
    const expectedPositions = Float32Array.from([0, 0, 100, 0, 0, 50]);

    const getCanvasEl = (): HTMLCanvasElement =>
        getAndExpectDebugElementByCss(compDe, 'canvas.awg-force-graph-canvas', 1, 1)[0].nativeElement;

    const getCanvasDrag = (): CanvasDragDirective<ForceGraphVisibleNode> =>
        getAndExpectDebugElementByDirective(compDe, CanvasDragDirective, 1, 1)[0].injector.get(CanvasDragDirective);

    // Resizes the canvas and notifies the resize observer of the CanvasViewportDirective
    const resizeCanvas = (width: number, height: number): void => {
        Object.defineProperty(getCanvasEl(), 'clientWidth', { configurable: true, value: width });
        Object.defineProperty(getCanvasEl(), 'clientHeight', { configurable: true, value: height });
        mockResizeObservers[0].trigger();
    };
    const flushFrames = (): void => {
        const callbacks = frameCallbacks.splice(0);
        callbacks.forEach(callback => callback(0));
    };
    const emitLayout = (isCalm: boolean, index = 0, positions = expectedPositions): void => {
        simulationSubjects[index].next({ positions: positions.slice(), isCalm });
    };
    const mouseEvent = (type: string, x: number, y: number): MouseEvent =>
        new MouseEvent(type, { bubbles: true, clientX: x, clientY: y });

    // A chain of the nodes of a large graph with the given number of edges
    const createLargeGraph = (edgeCount: number): ResultGraph => ({
        nodes: Array.from({ length: FORCE_GRAPH_LARGE_NODE_COUNT }, (_, i) => ({
            id: `n${i}`,
            shortName: `ex:n${i}`,
            label: `ex:n${i}`,
            kind: 'instance' as const,
        })),
        edges: Array.from({ length: edgeCount }, (_, i) => ({
            id: `e${i}`,
            source: `n${i}`,
            target: `n${i + 1}`,
            label: 'ex:next',
        })),
        tripleCount: edgeCount,
    });
    const largeGraphPositions = new Float32Array(2 * FORCE_GRAPH_LARGE_NODE_COUNT).fill(1);

    beforeEach(async () => {
        // Stub the ResizeObserver and the 2D context of the canvas (missing in jsdom)
        mockResizeObservers = stubResizeObserver();
        fakeContext = createFakeCanvasContext();
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(fakeContext);

        // Collect animation frames to run them on demand
        frameCallbacks = [];
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => frameCallbacks.push(callback));
        vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);

        // Keep the identity zoom for the canvas coordinates of the tests (zoomToFit is tested with the CanvasZoomDirective)
        zoomToFitSpy = vi.spyOn(CanvasZoomDirective.prototype, 'zoomToFit').mockImplementation(() => undefined);

        // Layout: one subject per layout, the commands to all simulations are collected
        simulationSubjects = [];
        simulationCommands = [];
        simulateSpy = vi.fn((_graphData, commands$) => {
            commands$?.subscribe(command => simulationCommands.push(command));
            const subject = new Subject<ForceGraphSimulationProgress>();
            simulationSubjects.push(subject);
            return subject.asObservable();
        });

        // The CanvasTooltipComponent stays real: its effect reads a required view query (NgbTooltip, no mocks needed)
        await TestBed.configureTestingModule({
            imports: [ForceGraphCanvasComponent],
            providers: [{ provide: ForceGraphSimulationService, useValue: { simulate: simulateSpy } }],
        })
            .overrideComponent(TwelveToneSpinnerComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 3, 0.01);
        expectedResultGraph = {
            nodes: expectedNodes,
            edges: [
                { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
                { id: 'e1', source: 'a', target: '_:c', label: 'awg:has' },
            ],
            tripleCount: 2,
        };
        expectedNextResultGraph = {
            nodes: expectedNodes.slice(0, 2),
            edges: expectedResultGraph.edges.slice(0, 1),
            tripleCount: 1,
        };

        // Create component fixture
        fixture = TestBed.createComponent(ForceGraphCanvasComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        drawGraphSpy = vi.spyOn(TestBed.inject(ForceGraphCanvasService), 'drawGraph');
        clickedNodeRequestSpy = vi.fn();
        component.clickedNodeRequest.subscribe(clickedNodeRequestSpy);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `resultGraph`', () => {
            expectToBe(isSignal(component.resultGraph), true);

            expect(() => component.resultGraph()).toThrow();
        });

        it('... should throw due to missing required input signal `zoomConfig`', () => {
            expectToBe(isSignal(component.zoomConfig), true);

            expect(() => component.zoomConfig()).toThrow();
        });

        it('... should throw due to missing required model signal `zoomValue`', () => {
            expectToBe(isSignal(component.zoomValue), true);

            expect(() => component.zoomValue()).toThrow();
        });

        it('... should have signal `isLayoutLoading` to hold false', () => {
            expectToBe(component.isLayoutLoading(), false);
        });

        it('... should have signal `hoveredNode` to hold undefined', () => {
            expect(component.hoveredNode()).toBeUndefined();
        });

        it('... should not have started a simulation yet', () => {
            expectSpyCall(simulateSpy, 0);
        });

        describe('VIEW', () => {
            it('... should contain one canvas with one CanvasDragDirective, CanvasViewportDirective and CanvasZoomDirective', () => {
                const canvasDes = getAndExpectDebugElementByCss(compDe, 'canvas.awg-force-graph-canvas', 1, 1);
                const canvasDragDes = getAndExpectDebugElementByDirective(compDe, CanvasDragDirective, 1, 1);
                const canvasViewportDes = getAndExpectDebugElementByDirective(compDe, CanvasViewportDirective, 1, 1);
                const canvasZoomDes = getAndExpectDebugElementByDirective(compDe, CanvasZoomDirective, 1, 1);

                expectToBe(canvasDragDes[0].nativeElement, canvasDes[0].nativeElement);
                expectToBe(canvasViewportDes[0].nativeElement, canvasDes[0].nativeElement);
                expectToBe(canvasZoomDes[0].nativeElement, canvasDes[0].nativeElement);
            });

            it('... should contain one CanvasTooltipComponent', () => {
                getAndExpectDebugElementByDirective(compDe, CanvasTooltipComponent, 1, 1);
            });

            it('... should not contain a loading overlay yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-canvas-loading', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            fixture.componentRef.setInput('resultGraph', expectedResultGraph);
            fixture.componentRef.setInput('zoomConfig', expectedZoomConfig);
            fixture.componentRef.setInput('zoomValue', expectedZoomConfig.initial);
            await detectChangesOnPush(fixture);

            resizeCanvas(400, 200);
            await detectChangesOnPush(fixture);
            // The resize has drawn the graph at once
            drawGraphSpy.mockClear();
        });

        it('... should have input signal `resultGraph` to hold the provided graph data', () => {
            expectToEqual(component.resultGraph(), expectedResultGraph);
        });

        it('... should have input signal `zoomConfig` to hold the provided zoom config', () => {
            expectToEqual(component.zoomConfig(), expectedZoomConfig);
        });

        it('... should have model signal `zoomValue` to hold the provided zoom value', () => {
            expectToBe(component.zoomValue(), expectedZoomConfig.initial);
        });

        it('... should have computed signal `ariaLabel` to hold the number of nodes and edges', () => {
            expectToBe(
                component.ariaLabel(),
                'Graph mit 3 Knoten und 2 Kanten. Eine textuelle Darstellung bieten die RDF-Triples und die Tabellenansicht von SPARQL-SELECT-Abfragen.'
            );
        });

        it('... should have linked signal `forceGraphData` to hold the force graph data of the result graph', () => {
            const nodeIds = component.forceGraphData().nodes.map(node => node.id);
            const expectedNodeIds = FORCE_GRAPH_UTILS.toForceGraphData(expectedResultGraph).nodes.map(node => node.id);

            expectToEqual(nodeIds, expectedNodeIds);
        });

        it('... should have linked signal `forceGraphData` to hold the positions of the previous nodes after a graph data change', async () => {
            emitLayout(true, 0, Float32Array.from([10, 20, 100, 0, 0, 50]));

            fixture.componentRef.setInput('resultGraph', expectedNextResultGraph);
            await detectChangesOnPush(fixture);

            const nodePositions = component.forceGraphData().nodes.map(node => [node.x, node.y]);

            expectToEqual(nodePositions, [
                [10, 20],
                [100, 0],
            ]);
        });

        it('... should have signal `isLayoutLoading` to hold true while the new layout runs', () => {
            expectToBe(component.isLayoutLoading(), true);
        });

        it('... should have view child signals for canvas element, canvas viewport and canvas zoom', () => {
            const canvasDe = getAndExpectDebugElementByCss(compDe, 'canvas.awg-force-graph-canvas', 1, 1)[0];

            expectToBe(component.canvas().nativeElement, canvasDe.nativeElement);
            expectToBe(component.canvasViewport(), canvasDe.injector.get(CanvasViewportDirective));
            expectToBe(component.canvasZoom(), canvasDe.injector.get(CanvasZoomDirective));
        });

        describe('VIEW', () => {
            it('... should set role `img` and `ariaLabel` as aria-label on the canvas', () => {
                expectToBe(getCanvasEl().getAttribute('role'), 'img');
                expectToBe(getCanvasEl().getAttribute('aria-label'), component.ariaLabel());
            });

            it('... should contain a loading overlay with one TwelveToneSpinnerComponent (hollow) while a new layout runs', () => {
                const loadingDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-canvas-loading', 1, 1);

                expectToBe(loadingDes[0].attributes['role'], 'status');
                getAndExpectDebugElementByDirective(loadingDes[0], TwelveToneSpinnerComponent, 1, 1);
            });

            it('... should dim the canvas while a new layout runs', async () => {
                const isLoadingClassWhileLoading = getCanvasEl().classList.contains('is-loading');

                emitLayout(true);
                await detectChangesOnPush(fixture);
                const isLoadingClassWhenDone = getCanvasEl().classList.contains('is-loading');

                expectToBe(isLoadingClassWhileLoading, true);
                expectToBe(isLoadingClassWhenDone, false);
            });

            it('... should contain the loading overlay only until the new layout is calm', async () => {
                emitLayout(true);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-canvas-loading', 0, 0);
            });

            it('... should contain a loading overlay and a dimmed canvas while a known graph is laid out again', async () => {
                emitLayout(true);
                fixture.componentRef.setInput('resultGraph', expectedNextResultGraph);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-canvas-loading', 1, 1);
                expectToBe(getCanvasEl().classList.contains('is-loading'), true);
            });

            it('... should pass down the point and the label of the hovered node to the CanvasTooltipComponent', async () => {
                emitLayout(true);
                getCanvasEl().dispatchEvent(mouseEvent('mousemove', 300, 100));
                await detectChangesOnPush(fixture);

                const tooltipDes = getAndExpectDebugElementByDirective(compDe, CanvasTooltipComponent, 1, 1);
                const tooltip = tooltipDes[0].injector.get(CanvasTooltipComponent);

                expectToEqual(tooltip.point(), { x: 300, y: 100 });
                expectToBe(tooltip.text(), 'awg:B');
            });

            it('... should pass down no point and no text to the CanvasTooltipComponent without hovered node', async () => {
                emitLayout(true);
                getCanvasEl().dispatchEvent(mouseEvent('mousemove', 300, 100));
                await detectChangesOnPush(fixture);
                getCanvasEl().dispatchEvent(mouseEvent('mousemove', 10, 10));
                await detectChangesOnPush(fixture);

                const tooltipDes = getAndExpectDebugElementByDirective(compDe, CanvasTooltipComponent, 1, 1);
                const tooltip = tooltipDes[0].injector.get(CanvasTooltipComponent);

                expect(tooltip.point()).toBeUndefined();
                expect(tooltip.text()).toBeUndefined();
            });

            it('... should pass down `zoomConfig`, `zoomFilter` and `zoomValue` to the CanvasZoomDirective', () => {
                const canvasZoom = component.canvasZoom();

                expectToEqual(canvasZoom.zoomConfig(), expectedZoomConfig);
                expectToBe(canvasZoom.zoomFilter(), component.zoomFilter);
                expectToBe(canvasZoom.zoomValue(), expectedZoomConfig.initial);
            });

            it('... should pass down `dragSubject` to the CanvasDragDirective', () => {
                const canvasDrag = getCanvasDrag();

                expectToBe(canvasDrag.dragSubject(), component.dragSubject);
            });

            it('... should trigger `onNodeDrag` on a drag move of the CanvasDragDirective', () => {
                const onNodeDragSpy = vi.spyOn(component, 'onNodeDrag');
                const dragMove = { subject: component.forceGraphData().visibleNodes[1], point: { x: 250, y: 150 } };

                getCanvasDrag().dragMove.emit(dragMove);

                expectSpyCall(onNodeDragSpy, 1, dragMove);
            });

            it('... should trigger `onNodeDragEnd` on a drag end of the CanvasDragDirective', () => {
                const onNodeDragEndSpy = vi.spyOn(component, 'onNodeDragEnd');
                const nodeB = component.forceGraphData().visibleNodes[1];

                getCanvasDrag().dragEnd.emit(nodeB);

                expectSpyCall(onNodeDragEndSpy, 1, nodeB);
            });

            it('... should sync `zoomValue` with the CanvasZoomDirective', async () => {
                component.canvasZoom().zoomValue.set(2);
                await detectChangesOnPush(fixture);

                expectToBe(component.zoomValue(), 2);
            });

            it('... should trigger `onNodeClick` on a click on the canvas', () => {
                const onNodeClickSpy = vi.spyOn(component, 'onNodeClick');
                const event = mouseEvent('click', 0, 0);

                getCanvasEl().dispatchEvent(event);

                expectSpyCall(onNodeClickSpy, 1, event);
            });

            it('... should trigger `onMouseMove` on a mouse move over the canvas', () => {
                const onMouseMoveSpy = vi.spyOn(component, 'onMouseMove');
                const event = mouseEvent('mousemove', 0, 0);

                getCanvasEl().dispatchEvent(event);

                expectSpyCall(onMouseMoveSpy, 1, event);
            });

            it('... should trigger `onMouseLeave` when the mouse leaves the canvas', () => {
                const onMouseLeaveSpy = vi.spyOn(component, 'onMouseLeave');

                getCanvasEl().dispatchEvent(new MouseEvent('mouseleave'));

                expectSpyCall(onMouseLeaveSpy, 1);
            });
        });

        describe('... layout', () => {
            it('... should lay out the force graph data without positions the first time', () => {
                const { nodes } = component.forceGraphData();
                const hasNoPositions = nodes.every(node => Number.isNaN(node.x) && Number.isNaN(node.y));

                expectSpyCall(simulateSpy, 1, component.forceGraphData());
                expectToBe(hasNoPositions, true);
            });

            it('... should write the positions of each simulation result into the nodes and draw them', () => {
                emitLayout(false);
                flushFrames();

                const nodePositions = component.forceGraphData().nodes.map(node => [node.x, node.y]);

                expectToEqual(nodePositions, [
                    [0, 0],
                    [100, 0],
                    [0, 50],
                ]);
                expectSpyCall(drawGraphSpy, 1, [
                    fakeContext,
                    component.forceGraphData(),
                    { transform: component.canvasZoom().transform(), viewport: component.canvasViewport().viewport() },
                ]);
            });

            it('... should have signal `hoveredNode` to hold the hovered node at its position of each simulation result', () => {
                emitLayout(false);
                component.onMouseMove(mouseEvent('mousemove', 300, 100));

                // Node b moves from (100, 0) to (110, 10)
                emitLayout(false, 0, Float32Array.from([0, 0, 110, 10, 0, 50]));

                const hovered = component.hoveredNode();

                expectToBe(hovered?.node.resultNode, expectedNodes[1]);
                expectToEqual(hovered?.point, { x: 310, y: 110 });
            });

            it('... should have signal `isLayoutLoading` to hold false once the layout is calm', () => {
                emitLayout(false);
                expectToBe(component.isLayoutLoading(), true);

                emitLayout(true);
                expectToBe(component.isLayoutLoading(), false);
            });

            it('... should keep the zoom once a new layout of a small graph is calm', () => {
                const zoomToFitMethodSpy = vi.spyOn(component, 'zoomToFit');

                emitLayout(true);

                expectSpyCall(zoomToFitMethodSpy, 0);
            });

            it('... should zoom to fit a large graph once its new layout is calm', async () => {
                fixture.componentRef.setInput('resultGraph', createLargeGraph(FORCE_GRAPH_LARGE_NODE_COUNT - 1));
                await detectChangesOnPush(fixture);
                const zoomToFitMethodSpy = vi.spyOn(component, 'zoomToFit');

                emitLayout(false, 1, largeGraphPositions);
                expectSpyCall(zoomToFitMethodSpy, 0);

                emitLayout(true, 1, largeGraphPositions);
                expectSpyCall(zoomToFitMethodSpy, 1);
            });

            it('... should zoom to fit a large graph only once (not when it is calm again, e.g. after a drag)', async () => {
                fixture.componentRef.setInput('resultGraph', createLargeGraph(FORCE_GRAPH_LARGE_NODE_COUNT - 1));
                await detectChangesOnPush(fixture);
                const zoomToFitMethodSpy = vi.spyOn(component, 'zoomToFit');

                emitLayout(true, 1, largeGraphPositions);
                emitLayout(false, 1, largeGraphPositions);
                emitLayout(true, 1, largeGraphPositions);

                expectSpyCall(zoomToFitMethodSpy, 1);
            });

            it('... should keep the zoom once a relayout of a known small graph is calm', async () => {
                emitLayout(true);
                fixture.componentRef.setInput('resultGraph', expectedNextResultGraph);
                await detectChangesOnPush(fixture);
                const zoomToFitMethodSpy = vi.spyOn(component, 'zoomToFit');

                emitLayout(true, 1, Float32Array.from([0, 0, 100, 0]));

                expectSpyCall(zoomToFitMethodSpy, 0);
            });

            it('... should have signal `isLayoutLoading` to hold false while a calm layout runs again', () => {
                emitLayout(true);
                emitLayout(false);

                expectToBe(component.isLayoutLoading(), false);
            });

            it('... should keep the simulation running once the layout is calm (for later drags)', () => {
                emitLayout(true);

                expectToBe(simulationSubjects[0].observed, true);
            });

            it('... should have signal `isLayoutLoading` to hold false and log an error if the simulation fails', () => {
                const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
                const error = new Error('Boom');

                simulationSubjects[0].error(error);

                expectToBe(component.isLayoutLoading(), false);
                expectSpyCall(consoleSpy, 1, ['[ForceGraphCanvasComponent] Simulation failed:', error]);
            });

            it('... should cancel the running simulation and start a new one on a graph data change', async () => {
                fixture.componentRef.setInput('resultGraph', expectedNextResultGraph);
                await detectChangesOnPush(fixture);

                expectToBe(simulationSubjects[0].observed, false);
                expectSpyCall(simulateSpy, 2);
            });

            it('... should have signal `isLayoutLoading` to hold true for a graph data change (also with mostly known nodes)', async () => {
                // The first layout is calm; both nodes of the next graph keep their positions
                emitLayout(true);
                expectToBe(component.isLayoutLoading(), false);

                fixture.componentRef.setInput('resultGraph', expectedNextResultGraph);
                await detectChangesOnPush(fixture);

                expectToBe(component.isLayoutLoading(), true);
            });

            it('... should lay out the new force graph data on a graph data change', async () => {
                fixture.componentRef.setInput('resultGraph', expectedNextResultGraph);
                await detectChangesOnPush(fixture);

                expectSpyCall(simulateSpy, 2, component.forceGraphData());
            });

            it('... should not lay out again without a graph data change or on a resize', async () => {
                await detectChangesOnPush(fixture);
                resizeCanvas(800, 400);
                await detectChangesOnPush(fixture);

                expectSpyCall(simulateSpy, 1);
            });

            it('... should cancel the running simulation on destroy', () => {
                fixture.destroy();

                expectToBe(simulationSubjects[0].observed, false);
            });

            it('... should have signal `isLayoutLoading` to hold false after cancelling the simulation on destroy', () => {
                fixture.destroy();

                expectToBe(component.isLayoutLoading(), false);
            });
        });

        describe('... drawing', () => {
            beforeEach(() => {
                emitLayout(true);
                flushFrames();
                drawGraphSpy.mockClear();
            });

            it('... should draw only once per animation frame for several requests', () => {
                component['_drawScheduler'].schedule();
                component['_drawScheduler'].schedule();

                expectToBe(frameCallbacks.length, 1);

                flushFrames();

                expectSpyCall(drawGraphSpy, 1);
            });

            it('... should draw again on a zoom change', async () => {
                component.canvasZoom().zoomValue.set(2);
                await detectChangesOnPush(fixture);
                flushFrames();

                const drawnTransform = drawGraphSpy.mock.calls[0][2].transform;

                expectSpyCall(drawGraphSpy, 1);
                expectToBe(drawnTransform.k, 2);
            });

            it('... should draw at once on a resize with the viewport of the CanvasViewportDirective (before the next animation frame)', () => {
                resizeCanvas(800, 400);

                const drawnViewport = drawGraphSpy.mock.calls[0][2].viewport;
                const dpr = window.devicePixelRatio || 1;

                expectSpyCall(drawGraphSpy, 1);
                expectToEqual(drawnViewport, { width: 800, height: 400, dpr });
            });

            it('... should draw only once on a resize (not again in the next animation frame)', async () => {
                resizeCanvas(800, 400);
                await detectChangesOnPush(fixture);
                flushFrames();

                expectSpyCall(drawGraphSpy, 1);
            });

            it('... should draw again on a zoom change after a resize', async () => {
                resizeCanvas(800, 400);
                await detectChangesOnPush(fixture);
                flushFrames();
                drawGraphSpy.mockClear();

                component.canvasZoom().zoomValue.set(2);
                await detectChangesOnPush(fixture);
                flushFrames();

                expectSpyCall(drawGraphSpy, 1);
            });

            it('... should not draw without a 2D context', () => {
                vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);

                component['_drawScheduler'].schedule();
                flushFrames();

                expectSpyCall(drawGraphSpy, 0);
            });

            it('... should cancel a requested drawing on destroy', () => {
                component['_drawScheduler'].schedule();
                const frameId = frameCallbacks.length;

                fixture.destroy();

                expect(window.cancelAnimationFrame).toHaveBeenCalledWith(frameId);
            });
        });

        describe('METHODS', () => {
            beforeEach(() => {
                emitLayout(true);
            });

            describe('#onCanvasResize()', () => {
                it('... should have a method `onCanvasResize`', () => {
                    expect(component.onCanvasResize).toBeDefined();
                });

                it('... should draw the graph at once (without animation frame)', () => {
                    flushFrames();
                    drawGraphSpy.mockClear();

                    component.onCanvasResize();

                    expectSpyCall(drawGraphSpy, 1);
                    expectToBe(frameCallbacks.length, 0);
                });
            });

            describe('#onNodeClick()', () => {
                it('... should have a method `onNodeClick`', () => {
                    expect(component.onNodeClick).toBeDefined();
                });

                it('... should emit the graph node at the click position', () => {
                    getCanvasEl().dispatchEvent(mouseEvent('click', 300, 100));

                    expectSpyCall(clickedNodeRequestSpy, 1, expectedNodes[1]);
                });

                it('... should not emit for a click in empty space', () => {
                    getCanvasEl().dispatchEvent(mouseEvent('click', 10, 10));

                    expectSpyCall(clickedNodeRequestSpy, 0);
                });
            });

            describe('#onNodeDrag()', () => {
                it('... should have a method `onNodeDrag`', () => {
                    expect(component.onNodeDrag).toBeDefined();
                });

                it('... should move the dragged node to the pointer position and draw', () => {
                    const nodeB = component.forceGraphData().visibleNodes[1];
                    flushFrames();
                    drawGraphSpy.mockClear();

                    component.onNodeDrag({ subject: nodeB, point: { x: 250, y: 150 } });
                    flushFrames();

                    expectToBe(nodeB.x, 50);
                    expectToBe(nodeB.y, 50);
                    expectSpyCall(drawGraphSpy, 1);
                });

                it('... should send a pin command with the pointer position (in graph coordinates) to the simulation', () => {
                    const nodeB = component.forceGraphData().visibleNodes[1];

                    component.onNodeDrag({ subject: nodeB, point: { x: 250, y: 150 } });

                    expectToEqual(simulationCommands, [{ type: 'pin', node: nodeB, point: { x: 50, y: 50 } }]);
                });

                it('... should keep the simulation running while dragging', () => {
                    const nodeB = component.forceGraphData().visibleNodes[1];

                    component.onNodeDrag({ subject: nodeB, point: { x: 250, y: 150 } });

                    expectToBe(simulationSubjects[0].observed, true);
                });

                it('... should keep the dragged node at the pointer position on later simulation results', () => {
                    const nodeB = component.forceGraphData().visibleNodes[1];
                    component.onNodeDrag({ subject: nodeB, point: { x: 250, y: 150 } });

                    // A layout result computed before the pin arrived in the simulation
                    emitLayout(false);

                    expectToEqual([nodeB.x, nodeB.y], [50, 50]);
                });

                it('... should have signal `hoveredNode` to hold undefined', () => {
                    const nodeB = component.forceGraphData().visibleNodes[1];
                    component.onMouseMove(mouseEvent('mousemove', 300, 100));

                    component.onNodeDrag({ subject: nodeB, point: { x: 250, y: 150 } });

                    expect(component.hoveredNode()).toBeUndefined();
                });
            });

            describe('#onNodeDragEnd()', () => {
                it('... should have a method `onNodeDragEnd`', () => {
                    expect(component.onNodeDragEnd).toBeDefined();
                });

                it('... should send a release command for the dragged node to the simulation', () => {
                    const nodeB = component.forceGraphData().visibleNodes[1];
                    component.onNodeDrag({ subject: nodeB, point: { x: 250, y: 150 } });

                    component.onNodeDragEnd(nodeB);

                    expectToEqual(simulationCommands[simulationCommands.length - 1], { type: 'release', node: nodeB });
                });

                it('... should let later simulation results move the released node', () => {
                    const nodeB = component.forceGraphData().visibleNodes[1];
                    component.onNodeDrag({ subject: nodeB, point: { x: 250, y: 150 } });
                    component.onNodeDragEnd(nodeB);

                    emitLayout(false);

                    expectToEqual([nodeB.x, nodeB.y], [100, 0]);
                });
            });

            describe('#onMouseMove()', () => {
                it('... should have a method `onMouseMove`', () => {
                    expect(component.onMouseMove).toBeDefined();
                });

                it('... should have signal `hoveredNode` to hold the node under the pointer at its drawn position', () => {
                    component.onMouseMove(mouseEvent('mousemove', 302, 98));

                    const hovered = component.hoveredNode();

                    expectToBe(hovered?.node.resultNode, expectedNodes[1]);
                    expectToEqual(hovered?.point, { x: 300, y: 100 });
                });

                it('... should keep signal `hoveredNode` while the pointer stays on the same node', () => {
                    component.onMouseMove(mouseEvent('mousemove', 300, 100));
                    const hovered = component.hoveredNode();

                    component.onMouseMove(mouseEvent('mousemove', 302, 98));

                    expectToBe(component.hoveredNode(), hovered);
                });

                it('... should have signal `hoveredNode` to hold undefined in empty space', () => {
                    component.onMouseMove(mouseEvent('mousemove', 300, 100));
                    component.onMouseMove(mouseEvent('mousemove', 10, 10));

                    expect(component.hoveredNode()).toBeUndefined();
                });
            });

            describe('#onMouseLeave()', () => {
                it('... should have a method `onMouseLeave`', () => {
                    expect(component.onMouseLeave).toBeDefined();
                });

                it('... should have signal `hoveredNode` to hold undefined', () => {
                    component.onMouseMove(mouseEvent('mousemove', 300, 100));

                    component.onMouseLeave();

                    expect(component.hoveredNode()).toBeUndefined();
                });
            });

            describe('#resetZoom()', () => {
                it('... should have a method `resetZoom`', () => {
                    expect(component.resetZoom).toBeDefined();
                });

                it('... should reset the zoom via the CanvasZoomDirective', () => {
                    const resetSpy = vi.spyOn(component.canvasZoom(), 'reset');

                    component.resetZoom();

                    expectSpyCall(resetSpy, 1);
                });
            });

            describe('#zoomToFit()', () => {
                it('... should have a method `zoomToFit`', () => {
                    expect(component.zoomToFit).toBeDefined();
                });

                it('... should zoom the canvas to the area of the nodes (in canvas coordinates without zoom) with the viewport of the CanvasViewportDirective', () => {
                    // The layout is calm before (METHODS)
                    zoomToFitSpy.mockClear();

                    component.zoomToFit();

                    // Nodes a (radius 11) at (0, 0), b (radius 10) at (100, 0), c (radius 8) at (0, 50); canvas center (200, 100)
                    expectSpyCall(zoomToFitSpy, 1, [
                        { min: { x: 189, y: 89 }, max: { x: 310, y: 158 } },
                        component.canvasViewport().viewport(),
                    ]);
                });

                it('... should keep the zoom without positioned nodes', () => {
                    zoomToFitSpy.mockClear();
                    component.forceGraphData().nodes.forEach(node => {
                        node.x = NaN;
                        node.y = NaN;
                    });

                    component.zoomToFit();

                    expectSpyCall(zoomToFitSpy, 0);
                });
            });

            describe('#dragSubject()', () => {
                it('... should have a method `dragSubject`', () => {
                    expect(component.dragSubject).toBeDefined();
                });

                it('... should find the node at a given point of the canvas once the layout is calm', () => {
                    const foundNode = component.dragSubject({ x: 300, y: 100 });

                    expectToBe(foundNode?.resultNode, expectedNodes[1]);
                });

                it('... should find no node while a new layout runs (no drag while loading)', async () => {
                    fixture.componentRef.setInput('resultGraph', expectedNextResultGraph);
                    await detectChangesOnPush(fixture);

                    const foundNode = component.dragSubject({ x: 300, y: 100 });
                    const visibleNode = component['_findVisibleNodeAtPoint']({ x: 300, y: 100 });

                    expect(foundNode).toBeUndefined();
                    expect(visibleNode).toBeDefined();
                });
            });

            describe('#zoomFilter()', () => {
                it('... should have a method `zoomFilter`', () => {
                    expect(component.zoomFilter).toBeDefined();
                });

                it('... should reject a pointer-down on a node (it starts a drag instead of a pan)', () => {
                    const pointerDownOnNode = mouseEvent('mousedown', 300, 100);

                    expectToBe(component.zoomFilter(pointerDownOnNode), false);
                });

                it('... should accept a pointer-down in empty space', () => {
                    const pointerDownInEmptySpace = mouseEvent('mousedown', 10, 10);

                    expectToBe(component.zoomFilter(pointerDownInEmptySpace), true);
                });

                it('... should use the first touch of a touch event', () => {
                    const touchOnNode = { touches: [{ clientX: 300, clientY: 100 }] } as unknown as TouchEvent;
                    const touchWithoutTouches = { touches: [] } as unknown as TouchEvent;

                    expectToBe(component.zoomFilter(touchOnNode), false);
                    expectToBe(component.zoomFilter(touchWithoutTouches), true);
                });
            });

            describe('#_findVisibleNodeAtEvent()', () => {
                it('... should have a method `_findVisibleNodeAtEvent`', () => {
                    expect(component['_findVisibleNodeAtEvent']).toBeDefined();
                });

                it('... should find the node at the point of a given event', () => {
                    const foundNode = component['_findVisibleNodeAtEvent'](mouseEvent('mousedown', 300, 100));

                    expectToBe(foundNode?.resultNode, expectedNodes[1]);
                });

                it('... should find no node for a touch event without touches', () => {
                    const touchWithoutTouches = { touches: [] } as unknown as TouchEvent;
                    const foundNode = component['_findVisibleNodeAtEvent'](touchWithoutTouches);

                    expect(foundNode).toBeUndefined();
                });
            });

            describe('#_findVisibleNodeAtPoint()', () => {
                it('... should have a method `_findVisibleNodeAtPoint`', () => {
                    expect(component['_findVisibleNodeAtPoint']).toBeDefined();
                });

                it('... should find the node at a given point of the canvas', () => {
                    const foundNode = component['_findVisibleNodeAtPoint']({ x: 300, y: 100 });

                    expectToBe(foundNode?.resultNode, expectedNodes[1]);
                });

                it('... should find no node in empty space', () => {
                    const foundNode = component['_findVisibleNodeAtPoint']({ x: 10, y: 10 });

                    expect(foundNode).toBeUndefined();
                });
            });

            describe('#_toHoveredNode()', () => {
                it('... should have a method `_toHoveredNode`', () => {
                    expect(component['_toHoveredNode']).toBeDefined();
                });

                it('... should return the given node with the point of its tooltip at the node on the canvas', () => {
                    // Node b at (100, 0) is drawn at (300, 100) of the canvas
                    const nodeB = component.forceGraphData().visibleNodes[1];
                    const hoveredNode = component['_toHoveredNode'](nodeB);

                    expectToEqual(hoveredNode, { node: nodeB, point: { x: 300, y: 100 } });
                });
            });

            describe('#_startSimulation()', () => {
                it('... should have a method `_startSimulation`', () => {
                    expect(component['_startSimulation']).toBeDefined();
                });

                it('... should have signal `hoveredNode` to hold undefined for new graph data', () => {
                    component.onMouseMove(mouseEvent('mousemove', 300, 100));

                    component['_startSimulation'](
                        FORCE_GRAPH_UTILS.toForceGraphData(expectedNextResultGraph) as ForceGraphData
                    );

                    expect(component.hoveredNode()).toBeUndefined();
                });
            });
        });
    });
});
