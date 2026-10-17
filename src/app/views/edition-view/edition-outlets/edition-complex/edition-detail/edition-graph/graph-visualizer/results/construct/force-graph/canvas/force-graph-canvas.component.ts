import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    linkedSignal,
    model,
    output,
    signal,
    untracked,
    viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { finalize, Subscription } from 'rxjs';

import * as D3_ZOOM from 'd3-zoom';

import { CanvasPoint } from '@awg-shared/canvas/canvas.model';
import { CANVAS_UTILS } from '@awg-shared/canvas/canvas.utils';
import { CanvasDragDirective } from '@awg-shared/canvas/drag/canvas-drag.directive';
import { CanvasDragMove, CanvasDragSubjectAccessor } from '@awg-shared/canvas/drag/canvas-drag.model';
import { CanvasTooltipComponent } from '@awg-shared/canvas/tooltip/canvas-tooltip.component';
import { CanvasViewportDirective } from '@awg-shared/canvas/viewport/canvas-viewport.directive';
import { CanvasZoomDirective } from '@awg-shared/canvas/zoom/canvas-zoom.directive';
import { CanvasZoomFilter } from '@awg-shared/canvas/zoom/canvas-zoom.model';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { ResultGraph, ResultGraphNode } from '@awg-graph/graph-visualizer/models/result-graph.model';

import { ForceGraphData, ForceGraphVisibleNode } from '../force-graph.model';
import { FORCE_GRAPH_UTILS } from '../force-graph.utils';
import { ForceGraphSimulationPin } from '../simulation/force-graph-simulation-pin';
import { FORCE_GRAPH_SIMULATION_TRANSFER_UTILS } from '../simulation/force-graph-simulation-transfer.utils';
import { ForceGraphSimulationService } from '../simulation/force-graph-simulation.service';

import { ForceGraphCanvasHoveredNode, ForceGraphCanvasView } from './force-graph-canvas.model';
import { ForceGraphCanvasService } from './force-graph-canvas.service';
import { FORCE_GRAPH_CANVAS_UTILS } from './force-graph-canvas.utils';

/**
 * The ForceGraphCanvas component.
 *
 * It contains the canvas of the {@link ForceGraphComponent}:
 * it lays out the result graph, draws it, and supports zoom, node drag and node clicks.
 */
@Component({
    selector: 'awg-force-graph-canvas',
    templateUrl: './force-graph-canvas.component.html',
    styleUrls: ['./force-graph-canvas.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CanvasDragDirective,
        CanvasTooltipComponent,
        CanvasViewportDirective,
        CanvasZoomDirective,
        TwelveToneSpinnerComponent,
    ],
})
export class ForceGraphCanvasComponent {
    /**
     * Private readonly injection variable: _destroyRef.
     *
     * It keeps the instance of the injected DestroyRef.
     */
    private readonly _destroyRef = inject(DestroyRef);

    /**
     * Private readonly injection variable: _canvasService.
     *
     * It keeps the instance of the injected ForceGraphCanvasService.
     */
    private readonly _canvasService = inject(ForceGraphCanvasService);

    /**
     * Private readonly injection variable: _simulationService.
     *
     * It keeps the instance of the injected ForceGraphSimulationService.
     */
    private readonly _simulationService = inject(ForceGraphSimulationService);

    /**
     * Readonly input signal: resultGraph.
     *
     * It holds the (limited) result graph to be drawn.
     */
    readonly resultGraph = input.required<ResultGraph>();

    /**
     * Readonly input signal: zoomConfig.
     *
     * It holds the zoom configuration (initial, min, max, step size).
     */
    readonly zoomConfig = input.required<ZoomConfig>();

    /**
     * Model signal: zoomValue.
     *
     * It holds the current zoom factor of the graph.
     */
    readonly zoomValue = model.required<number>();

    /**
     * Readonly output signal: clickedNodeRequest.
     *
     * It emits the node of the result graph the user clicked on.
     */
    readonly clickedNodeRequest = output<ResultGraphNode>();

    /**
     * Readonly view child signal: canvas.
     *
     * It holds the reference to the canvas element of the graph.
     */
    readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

    /**
     * Readonly view child signal: canvasViewport.
     *
     * It holds the canvas viewport directive of the graph (size and device pixel ratio of the canvas).
     */
    readonly canvasViewport = viewChild.required(CanvasViewportDirective);

    /**
     * Readonly view child signal: canvasZoom.
     *
     * It holds the canvas zoom directive of the graph.
     */
    readonly canvasZoom = viewChild.required(CanvasZoomDirective);

    /**
     * Readonly signal: hoveredNode.
     *
     * It holds the node under the pointer (with the position of its tooltip), if any.
     */
    readonly hoveredNode = signal<ForceGraphCanvasHoveredNode | undefined>(undefined);

    /**
     * Readonly signal: isLayoutLoading.
     *
     * It holds the flag if the graph is laid out behind the loading spinner.
     */
    readonly isLayoutLoading = signal<boolean>(false);

    /**
     * Readonly computed signal: ariaLabel.
     *
     * It holds the accessible name of the canvas.
     */
    readonly ariaLabel = computed<string>(() => {
        const { nodes, edges } = this.resultGraph();
        return `Graph mit ${nodes.length} Knoten und ${edges.length} Kanten. Eine textuelle Darstellung bieten die RDF-Triples und die Tabellenansicht von SPARQL-SELECT-Abfragen.`;
    });

    /**
     * Readonly linked signal: forceGraphData.
     *
     * It holds the force graph data of the result graph, with the positions restored from its previous value.
     */
    readonly forceGraphData = linkedSignal<ResultGraph, ForceGraphData>({
        source: this.resultGraph,
        computation: (resultGraph, previous) => {
            const forceGraphData = FORCE_GRAPH_UTILS.toForceGraphData(resultGraph);
            FORCE_GRAPH_UTILS.restorePositions(forceGraphData.nodes, previous?.value.nodes ?? []);
            return forceGraphData;
        },
    });

    /**
     * Private readonly computed signal: _canvasView.
     *
     * It holds the current view onto the graph (zoom transform and viewport of the canvas).
     */
    private readonly _canvasView = computed<ForceGraphCanvasView>(() => ({
        transform: this.canvasZoom().transform(),
        viewport: this.canvasViewport().viewport(),
    }));

    /**
     * Readonly variable: dragSubject.
     *
     * It keeps the drag subject accessor of the canvas drag: the visible node at a point, if any (none while loading).
     */
    readonly dragSubject: CanvasDragSubjectAccessor<ForceGraphVisibleNode> = point =>
        this.isLayoutLoading() ? undefined : this._findVisibleNodeAtPoint(point);

    /**
     * Readonly variable: zoomFilter.
     *
     * It keeps the filter of the canvas zoom: a pointer-down on a node starts a drag instead of a pan.
     */
    readonly zoomFilter: CanvasZoomFilter = event => !this._findVisibleNodeAtEvent(event);

    /**
     * Private readonly variable: _drawScheduler.
     *
     * It keeps the scheduler of the drawings (at most one per animation frame).
     */
    private readonly _drawScheduler = CANVAS_UTILS.createFrameScheduler(() => this._draw(), this._destroyRef);

    /**
     * Private readonly variable: _simulationPin.
     *
     * It keeps the pin of the dragged node for the running simulation.
     */
    private readonly _simulationPin = new ForceGraphSimulationPin();

    /**
     * Private variable: _simulationSubscription.
     *
     * It keeps the subscription of the running simulation.
     */
    private _simulationSubscription: Subscription | undefined;

    /**
     * Private variable: _drawnView.
     *
     * It keeps the view of the last drawing, if any.
     */
    private _drawnView: ForceGraphCanvasView | undefined;

    /**
     * Constructor of the ForceGraphCanvasComponent.
     *
     * It lays out the graph on force graph data changes
     * and redraws it on zoom or viewport changes (in an animation frame).
     */
    constructor() {
        afterRenderEffect(() => {
            const forceGraphData = this.forceGraphData();
            untracked(() => this._startSimulation(forceGraphData));
        });

        // Redraw on zoom or viewport changes (the hovered node is outdated then);
        // A view already drawn at once (after a resize) is not drawn again
        afterRenderEffect(() => {
            const view = this._canvasView();
            untracked(() => {
                this.hoveredNode.set(undefined);
                if (view !== this._drawnView) {
                    this._drawScheduler.schedule();
                }
            });
        });
    }

    /**
     * Public method: onCanvasResize.
     *
     * It draws the graph at once after a resize of the canvas (which has cleared it), before the next paint.
     *
     * @returns {void} Draws the graph.
     */
    onCanvasResize(): void {
        this._draw();
    }

    /**
     * Public method: onNodeClick.
     *
     * It handles a click on the canvas and emits the node of the result graph at the click position, if any.
     * Clicks after dragging a node or panning are suppressed by d3 itself.
     *
     * @param {MouseEvent} event The given click event.
     * @returns {void} Emits the clicked graph node.
     */
    onNodeClick(event: MouseEvent): void {
        const node = this._findVisibleNodeAtEvent(event);
        if (node) {
            this.clickedNodeRequest.emit(node.resultNode);
        }
    }

    /**
     * Public method: onNodeDrag.
     *
     * It pins the dragged node at the current point of the pointer, so that its neighbours follow,
     * and redraws the graph.
     *
     * @param {CanvasDragMove<ForceGraphVisibleNode>} dragMove The given move of the dragged node.
     * @returns {void} Pins the node.
     */
    onNodeDrag({ subject: node, point }: CanvasDragMove<ForceGraphVisibleNode>): void {
        const graphPoint = FORCE_GRAPH_CANVAS_UTILS.toGraphPoint(point, this._canvasView());
        this._simulationPin.pin(node, graphPoint);
        this.hoveredNode.set(undefined);
        this._drawScheduler.schedule();
    }

    /**
     * Public method: onNodeDragEnd.
     *
     * It releases the dragged node, so that the graph settles again.
     *
     * @param {ForceGraphVisibleNode} node The given dragged node.
     * @returns {void} Releases the node.
     */
    onNodeDragEnd(node: ForceGraphVisibleNode): void {
        this._simulationPin.release(node);
    }

    /**
     * Public method: onMouseMove.
     *
     * It sets the hovered node (with the point of its tooltip at the node)
     * when the mouse moves over the canvas.
     *
     * @param {MouseEvent} event The given mouse event.
     * @returns {void} Sets the hovered node.
     */
    onMouseMove(event: MouseEvent): void {
        const node = this._findVisibleNodeAtEvent(event);
        if (node === this.hoveredNode()?.node) {
            return;
        }
        this.hoveredNode.set(node && this._toHoveredNode(node));
    }

    /**
     * Public method: onMouseLeave.
     *
     * It clears the hovered node when the mouse leaves the canvas.
     *
     * @returns {void} Clears the hovered node.
     */
    onMouseLeave(): void {
        this.hoveredNode.set(undefined);
    }

    /**
     * Public method: resetZoom.
     *
     * It resets the zoom of the graph via the canvas zoom directive.
     *
     * @returns {void} Resets the zoom.
     */
    resetZoom(): void {
        this.canvasZoom().reset();
    }

    /**
     * Public method: zoomToFit.
     *
     * It zooms the canvas to fit the area covered by the positioned nodes of the graph
     * (converted into canvas coordinates without zoom).
     *
     * @returns {void} Zooms to the graph.
     */
    zoomToFit(): void {
        const bounds = FORCE_GRAPH_UTILS.nodeBounds(this.forceGraphData().visibleNodes);
        if (!bounds) {
            return;
        }
        // The bounds and the fit refer to the same viewport
        const { viewport } = this._canvasView();
        const canvasBounds = FORCE_GRAPH_CANVAS_UTILS.toCanvasBounds(bounds, {
            transform: D3_ZOOM.zoomIdentity,
            viewport,
        });
        this.canvasZoom().zoomToFit(canvasBounds, viewport);
    }

    /**
     * Private method: _draw.
     *
     * It draws the force graph data with the current zoom transform and viewport, and keeps that view.
     *
     * @returns {void} Draws the graph.
     */
    private _draw(): void {
        // The canvas returns the same 2D context on every call (null if not available)
        const ctx = this.canvas().nativeElement.getContext('2d');
        if (!ctx) {
            return;
        }
        const view = this._canvasView();
        this._canvasService.drawGraph(ctx, this.forceGraphData(), view);
        this._drawnView = view;
    }

    /**
     * Private method: _findVisibleNodeAtEvent.
     *
     * It finds the visible node at the point of the canvas of a given mouse or touch event, if any.
     *
     * @param {MouseEvent | TouchEvent} event The given event.
     * @returns {ForceGraphVisibleNode | undefined} The found node or undefined.
     */
    private _findVisibleNodeAtEvent(event: MouseEvent | TouchEvent): ForceGraphVisibleNode | undefined {
        const point = CANVAS_UTILS.eventToCanvasPoint(event, this.canvas().nativeElement);
        return point && this._findVisibleNodeAtPoint(point);
    }

    /**
     * Private method: _findVisibleNodeAtPoint.
     *
     * It finds the visible node at a given point of the canvas (in css pixels), if any.
     *
     * @param {CanvasPoint} point The given point of the canvas.
     * @returns {ForceGraphVisibleNode | undefined} The found node or undefined.
     */
    private _findVisibleNodeAtPoint(point: CanvasPoint): ForceGraphVisibleNode | undefined {
        return FORCE_GRAPH_CANVAS_UTILS.findVisibleNode(this.forceGraphData(), point, this._canvasView());
    }

    /**
     * Private method: _startSimulation.
     *
     * It (re)starts the simulation of the given data and draws each result.
     * The spinner shows until the layout is calm; then a large graph is zoomed to fit.
     *
     * @param {ForceGraphData} graphData The given force graph data.
     * @returns {void} Starts the simulation.
     */
    private _startSimulation(graphData: ForceGraphData): void {
        this._simulationSubscription?.unsubscribe();

        const isLargeGraph = FORCE_GRAPH_UTILS.isLargeGraph(graphData.nodes.length);
        this.hoveredNode.set(undefined);
        this.isLayoutLoading.set(true);

        this._simulationSubscription = this._simulationService
            .simulate(graphData, this._simulationPin.commands$)
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                // Failed or cancelled
                finalize(() => this.isLayoutLoading.set(false))
            )
            .subscribe({
                next: ({ positions, isCalm }) => {
                    FORCE_GRAPH_SIMULATION_TRANSFER_UTILS.unpackPositions(positions, graphData.nodes);
                    // Simulation results arrive one round trip late: the pinned node stays at the pointer
                    this._simulationPin.apply();
                    // The tooltip of a hovered node follows the node (e.g. while the graph settles after a drag)
                    const hovered = this.hoveredNode();
                    if (hovered) {
                        this.hoveredNode.set(this._toHoveredNode(hovered.node));
                    }
                    if (isCalm && this.isLayoutLoading()) {
                        // Only large graphs are zoomed out automatically, once after their new layout
                        // (small ones stay readable at the initial zoom)
                        if (isLargeGraph) {
                            this.zoomToFit();
                        }
                        this.isLayoutLoading.set(false);
                    }
                    this._drawScheduler.schedule();
                },
                error: (err: unknown) => console.error('[ForceGraphCanvasComponent] Simulation failed:', err),
            });
    }

    /**
     * Private method: _toHoveredNode.
     *
     * It gets the given node as hovered node, with the point of its tooltip at the node on the canvas.
     *
     * @param {ForceGraphVisibleNode} node The given node.
     * @returns {ForceGraphCanvasHoveredNode} The hovered node.
     */
    private _toHoveredNode(node: ForceGraphVisibleNode): ForceGraphCanvasHoveredNode {
        const canvasPoint = FORCE_GRAPH_CANVAS_UTILS.toCanvasPoint(node, this._canvasView());
        return { node, point: canvasPoint };
    }
}
