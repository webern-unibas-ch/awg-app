import {
    afterNextRender,
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    inject,
    input,
    model,
    output,
    signal,
    untracked,
    viewChild,
} from '@angular/core';

import * as D3_SELECTION from 'd3-selection';

import { ClickDirective } from '@awg-shared/click/click.directive';
import { SvgZoomDirective } from '@awg-shared/zoom/svg-zoom.directive';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';
import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';

import { ResultGraph, ResultGraphNode } from '../../../../models/result-graph.model';
import { FORCE_GRAPH_ARROW_MARKER_ID, ForceGraphDrawingService } from '../force-graph-drawing.service';
import { ForceSimulation, SimulationData, SvgSize } from '../force-graph.model';
import { FORCE_GRAPH_UTILS } from '../force-graph.utils';

/**
 * The ForceGraphSvg component.
 *
 * It contains the svg of the {@link ForceGraphComponent}:
 * it renders the given graph data with a D3 force simulation
 * (centered in the svg, zoomable via the {@link SvgZoomDirective})
 * and emits the graph nodes the user clicks on.
 */
@Component({
    selector: 'awg-force-graph-svg',
    templateUrl: './force-graph-svg.component.html',
    styleUrls: ['./force-graph-svg.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ClickDirective, SvgZoomDirective],
    host: {
        '(window:resize)': 'onResize()',
    },
})
export class ForceGraphSvgComponent {
    /**
     * Private readonly injection variable: _destroyRef.
     *
     * It keeps the instance of the injected DestroyRef.
     */
    private readonly _destroyRef = inject(DestroyRef);

    /**
     * Private readonly injection variable: _forceGraphDrawingService.
     *
     * It keeps the instance of the injected ForceGraphDrawingService.
     */
    private readonly _forceGraphDrawingService = inject(ForceGraphDrawingService);

    /**
     * Readonly input signal: resultGraph.
     *
     * It holds the (limited) graph data to be rendered.
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
     * It emits the graph node the user clicked on.
     */
    readonly clickedNodeRequest = output<ResultGraphNode>();

    /**
     * Readonly view child signal: svg.
     *
     * It holds the reference to the svg element of the graph.
     */
    readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');

    /**
     * Readonly view child signal: svgRootGroup.
     *
     * It holds the reference to the root group of the graph.
     */
    readonly svgRootGroup = viewChild.required<ElementRef<SVGGElement>>('svgRootGroup');

    /**
     * Readonly view child signal: svgZoom.
     *
     * It holds the svg zoom directive of the graph.
     */
    readonly svgZoom = viewChild.required(SvgZoomDirective);

    /**
     * Readonly variable: arrowMarkerId.
     *
     * It keeps the id of the svg marker drawn at the end of the links.
     */
    readonly arrowMarkerId = FORCE_GRAPH_ARROW_MARKER_ID;

    /**
     * Readonly signal: svgSize.
     *
     * It holds the rendered size of the svg (measured after rendering and on window resize).
     */
    readonly svgSize = signal<SvgSize>({ width: 0, height: 0 });

    /**
     * Readonly computed signal: centerTransform.
     *
     * It holds the transform that moves the origin of the
     * force simulation (and thus the graph) to the center of the svg.
     */
    readonly centerTransform = computed<string>(() => {
        const { width, height } = this.svgSize();
        return `translate(${width / 2},${height / 2})`;
    });

    /**
     * Readonly computed signal: simulationData.
     *
     * It holds the data of the force simulation of the graph data.
     */
    readonly simulationData = computed<SimulationData>(() => FORCE_GRAPH_UTILS.toSimulationData(this.resultGraph()));

    /**
     * Private variable: _simulation.
     *
     * It keeps the force simulation of the rendered graph.
     */
    private _simulation: ForceSimulation | undefined;

    /**
     * Private readonly computed signal: _svgRootGroupSelection.
     *
     * It holds the d3 selection of the svg root group (the element is stable across renderings).
     */
    private readonly _svgRootGroupSelection = computed<D3Selection>(
        () => D3_SELECTION.select(this.svgRootGroup().nativeElement) as unknown as D3Selection
    );

    /**
     * Constructor of the ForceGraphSvgComponent.
     *
     * It measures the svg after the first rendering, renders the graph
     * whenever the simulation data changes and stops the simulation on destroy.
     * The rendering runs outside of the Angular zone, so the ticks of the
     * simulation and the dragging do not trigger change detection.
     */
    constructor() {
        afterNextRender(() => this.onResize());

        afterRenderEffect(() => {
            const simulationData = this.simulationData();
            const rootGroupSelection = this._svgRootGroupSelection();
            untracked(() => this._renderGraph(rootGroupSelection, simulationData));
        });

        this._destroyRef.onDestroy(() => this._simulation?.stop());
    }

    /**
     * Public method: onNodeSelect.
     *
     * It handles a click on the svg (delegated from the svg element)
     * and emits the graph node of the clicked circle, if any.
     * Clicks after dragging a node or panning are suppressed by d3 itself.
     *
     * @param {Event} event The given click event.
     * @returns {void} Emits the clicked graph node.
     */
    onNodeSelect(event: Event): void {
        const graphNode = this._forceGraphDrawingService.getGraphNode(event.target);
        if (graphNode) {
            this.clickedNodeRequest.emit(graphNode);
        }
    }

    /**
     * Public method: onResize.
     *
     * It sets the svg size to the rendered size of the svg element,
     * which centers the graph again without redrawing it.
     *
     * @returns {void} Sets the svg size.
     */
    onResize(): void {
        const { clientWidth, clientHeight } = this.svg().nativeElement;
        this.svgSize.set({ width: clientWidth, height: clientHeight });
    }

    /**
     * Public method: resetZoom.
     *
     * It resets the zoom of the graph via the svg zoom directive.
     *
     * @returns {void} Resets the zoom.
     */
    resetZoom(): void {
        this.svgZoom().reset();
    }

    /**
     * Private method: _renderGraph.
     *
     * It stops the force simulation of the previously rendered graph
     * and renders the given simulation data into the given root group selection.
     *
     * @param {D3Selection} rootGroupSelection The given d3 selection of the svg root group.
     * @param {SimulationData} simulationData The given simulation data.
     * @returns {void} Renders the graph.
     */
    private _renderGraph(rootGroupSelection: D3Selection, simulationData: SimulationData): void {
        this._simulation?.stop();
        this._simulation = this._forceGraphDrawingService.renderGraph(rootGroupSelection, simulationData);
    }
}
