/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    signal,
    SimpleChanges,
    ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { NUMBER_UTILS } from '@awg-shared/utils/number-utils';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';
import { D3Selection, D3ZoomBehaviour } from '@awg-views/edition-view/models';

import { GraphData, GraphNode } from '../../../models/graph-data.model';
import { GRAPH_DATA_UTILS } from '../../../utils/graph-data.utils';
import { FORCE_GRAPH_ARROW_MARKER_ID, ForceGraphDrawingService } from './force-graph-drawing.service';
import { ForceSimulation } from './force-graph.model';
import { FORCE_GRAPH_UTILS } from './force-graph.utils';

import * as D3_SELECTION from 'd3-selection';
import * as D3_ZOOM from 'd3-zoom';

/**
 * The ForceGraphComponent component.
 *
 * It visualizes an RDF graph using a D3 force simulation.
 */
@Component({
    selector: 'awg-force-graph',
    templateUrl: './force-graph.component.html',
    styleUrls: ['./force-graph.component.scss'],
    standalone: false,
})
export class ForceGraphComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * Private readonly injection variable: _forceGraphDrawingService.
     *
     * It keeps the instance of the injected ForceGraphDrawingService.
     */
    private readonly _forceGraphDrawingService = inject(ForceGraphDrawingService);

    /**
     * Input variable: graphData.
     *
     * It keeps the graph data of the query result.
     */
    @Input() graphData?: GraphData;

    /**
     * Input variable: height.
     *
     * It keeps the default height of the component.
     */
    @Input() height = 0;

    /**
     * Output variable: clickedNodeRequest.
     *
     * It keeps an event emitter for the graph node a user clicked on.
     */
    @Output() clickedNodeRequest = new EventEmitter<GraphNode>();

    /**
     * ViewChild variable: graphContainer.
     *
     * It keeps the reference to the element containing the graph.
     */
    @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef<HTMLDivElement>;

    /**
     * Public variable: limitValues.
     *
     * It keeps the array of possible limit values.
     */
    limitValues = [5, 10, 25, 50, 100, 250, 500, 1000];

    /**
     * Public variable: limit.
     *
     * It keeps the default limit value for the display of query results.
     */
    limit = 50;

    /**
     * Public variable: zoomConfig.
     *
     * It keeps the default values for the zoom slider input.
     */
    zoomConfig = new ZoomConfig(1, 0.1, 3, 0.01);

    /**
     * Readonly signal: zoomValue.
     *
     * It holds the current zoom factor of the graph (shown by the zoom slider).
     */
    readonly zoomValue = signal<number>(this.zoomConfig.initial);

    /**
     * Private variable: _svg.
     *
     * It keeps the D3 svg selection.
     */
    private _svg: D3Selection | undefined;

    /**
     * Private variable: _zoomGroup.
     *
     * It keeps the D3 zoomGroup selection.
     */
    private _zoomGroup: D3Selection | undefined;

    /**
     * Private variable: _rootGroup.
     *
     * It keeps the D3 selection of the (centered) root group of the graph.
     */
    private _rootGroup: D3Selection | undefined;

    /**
     * Private variable: _zoomBehaviour.
     *
     * It keeps the D3 zoom behaviour.
     */
    private _zoomBehaviour: D3ZoomBehaviour | undefined;

    /**
     * Private variable: _forceSimulation.
     *
     * It keeps the D3 force simulation.
     */
    private _forceSimulation: ForceSimulation | undefined;

    /**
     * Private variable: _divWidth.
     *
     * It keeps the width of the container div.
     */
    private _divWidth = 0;

    /**
     * Private variable: _divHeight.
     *
     * It keeps the height of the container div.
     */
    private _divHeight = 0;

    /**
     * Private readonly variable: _resize$.
     *
     * It keeps a subject for a resize event.
     */
    private readonly _resize$: Subject<boolean> = new Subject<boolean>();

    /**
     * Private readonly variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private readonly _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * HostListener: onResize.
     *
     * It redraws the graph when the window is resized.
     */
    @HostListener('window:resize') onResize() {
        // Guard against resize before view is rendered
        if (!this.graphContainer || !this.graphData) {
            return;
        }

        // Calculate new width & height
        this._divWidth = this._getContainerDimensions(this.graphContainer).width;
        this._divHeight = this._getContainerDimensions(this.graphContainer).height;

        // Fire resize event
        this._resize$.next(true);
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        // Subscribe to resize subject to _redraw on resize with delay until component gets destroyed
        this._resize$.pipe(debounceTime(150), takeUntil(this._destroyed$)).subscribe({
            next: () => {
                this._redraw();
            },
        });

        this._redraw();
    }

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges) {
        const { graphData } = changes;

        if (graphData?.currentValue && !graphData.isFirstChange()) {
            this._redraw();
        }
    }

    /**
     * Public method: onLimitValueChange.
     *
     * It sets the current limit to a given limit value
     * and redraws the simulation.
     *
     * @param {string} limitValue The given limit value.
     *
     * @returns {void} Sets the new limit for the _redraw.
     */
    onLimitValueChange(limitValue: number): void {
        this.limit = limitValue;
        this._redraw();
    }

    /**
     * Public method: onReCenter.
     *
     * It sets the slider zoom back to its initial state,
     * removing scale factor and transitions.
     *
     * @returns {void} Sets the initial translation and scale factor.
     */
    onReCenter(): void {
        if (!this._zoomBehaviour || !this._svg || !(this._divWidth && this._divHeight)) {
            return;
        }
        this.onZoomChange(this.zoomConfig.initial);
        this._zoomBehaviour.translateTo(this._svg, this._divWidth / 2, this._divHeight / 2);
    }

    /**
     * Public method: onZoomChange.
     *
     * It sets the zoom value to a given scale step.
     *
     * @param {number} newZoomValue The new zoom value.
     *
     * @returns {void} Sets the new zoom value and calls for rescale.
     */
    onZoomChange(newZoomValue: number): void {
        this.zoomValue.set(newZoomValue);
        this._reScaleZoom();
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself
        this._destroyed$.complete();

        this._forceSimulation?.stop();
    }

    /**
     * Private method: _redraw.
     *
     * It redraws the graph.
     *
     * @returns {void} Redraws the graph.
     */
    private _redraw(): void {
        if (this.graphData) {
            this._cleanSVG();
            this._createSVG();
            this._attachData();
            this._reScaleZoom();
        }
    }

    /**
     * Private method: _cleanSVG.
     *
     * It removes everything from the svg container.
     *
     * @returns {void} Cleans the svg container.
     */
    private _cleanSVG(): void {
        // Remove everything below the own SVG element
        this._svg?.selectAll('*').remove();
    }

    /**
     * Private method: _createSVG.
     *
     * It creates the svg container and detects its width and height.
     *
     * @returns {void} Creates the svg container.
     */
    private _createSVG(): void {
        if (!this.graphContainer) {
            return;
        }

        // Get container dimensions
        let width;
        let height;

        if (this._divWidth) {
            width = this._divWidth;
        } else if (this._getContainerDimensions(this.graphContainer).width) {
            width = this._getContainerDimensions(this.graphContainer).width;
        } else {
            width = 400;
        }

        if (this._divHeight) {
            height = this._divHeight;
        } else if (this._getContainerDimensions(this.graphContainer).height) {
            height = this._getContainerDimensions(this.graphContainer).height;
        } else {
            height = 500;
        }

        this._divWidth = width;
        // Leave some space for icon bar at the top and the bottom
        this._divHeight = height - 45;

        // ==================== Add SVG =====================
        this._svg ??= D3_SELECTION.select(this.graphContainer.nativeElement).append('svg').attr('class', 'force-graph');

        this._svg.attr('width', this._divWidth).attr('height', this._divHeight);

        // ==================== Add Encompassing Group for Zoom =====================
        this._zoomGroup = this._svg.append('g').attr('class', 'zoom-container');

        // ==================== Add Marker ====================
        this._zoomGroup
            .append('svg:defs')
            .append('svg:marker')
            .attr('id', FORCE_GRAPH_ARROW_MARKER_ID)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 30)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('svg:polyline')
            .attr('points', '0,-5 10,0 0,5');

        // ==================== Add Root Group (simulation is centered around the origin) =====================
        this._rootGroup = this._zoomGroup
            .append('g')
            .attr('transform', `translate(${this._divWidth / 2},${this._divHeight / 2})`);
    }

    /**
     * Private method: _attachData.
     *
     * It attaches the (limited) graph data to the simulation which is then set up.
     *
     * @returns {void} Attaches the data and sets up the simulation.
     */
    private _attachData(): void {
        if (!this.graphData || !this._svg || !this._zoomGroup || !this._rootGroup) {
            return;
        }
        const limitedGraphData = GRAPH_DATA_UTILS.limitGraphData(this.graphData, this.limit);
        const simulationData = FORCE_GRAPH_UTILS.toSimulationData(limitedGraphData);

        this._forceSimulation?.stop();
        this._forceSimulation = this._forceGraphDrawingService.renderGraph(this._rootGroup, simulationData);

        // ==================== CLICK ====================
        this._svg.on('click', (event: MouseEvent): void => {
            this._clickedOnNode(event);
        });

        // ==================== ZOOM ====================
        this._zoomHandler(this._zoomGroup, this._svg);
    }

    /**
     * Private method: _reScaleZoom.
     *
     * It rescales the current zoom with a given slider value.
     *
     * @returns {void} Sets the zoom for the rescale.
     */
    private _reScaleZoom(): void {
        if (!this._zoomBehaviour || !this._svg || !this.zoomValue()) {
            return;
        }
        this._zoomBehaviour.scaleTo(this._svg, this.zoomValue());
    }

    /**
     * Private method: _clickedOnNode.
     *
     * It emits the graph node the user clicked on (delegated from the svg element).
     *
     * @param {MouseEvent} event The given click event.
     *
     * @returns {void} Emits the graph node.
     */
    private _clickedOnNode(event: MouseEvent): void {
        const graphNode = this._forceGraphDrawingService.getGraphNode(event.target);
        if (event.defaultPrevented || !graphNode) {
            return;
        } // Dragged

        this.clickedNodeRequest.emit(graphNode);
    }

    /**
     * Private method: _zoomHandler.
     *
     * It binds a pan and zoom behaviour to an svg element.
     *
     * @param {D3Selection} zoomContext The given context that shall be zoomable.
     * @param {D3Selection} svg The given svg container.
     *
     * @returns {void} Sets the zoom behaviour.
     */
    private _zoomHandler(zoomContext: D3Selection, svg: D3Selection): void {
        // Perform the zooming
        const zoomed = (event: any): void => {
            const currentTransform = event.transform;

            // Update d3 zoom context
            zoomContext.attr('transform', currentTransform);

            // Update zoom value (shown by the zoom slider)
            this.zoomValue.set(NUMBER_UTILS.roundToStepPrecision(currentTransform.k, this.zoomConfig.stepSize));
        };

        // Create zoom behaviour
        this._zoomBehaviour = D3_ZOOM.zoom().scaleExtent([this.zoomConfig.min, this.zoomConfig.max]).on('zoom', zoomed);

        // Apply zoom behaviour
        svg.call(this._zoomBehaviour);
    }

    /**
     * Private method: _getContainerDimensions.
     *
     * It returns the dimensions (clientWidth & clientHeight) of a given container.
     *
     * @param {ElementRef<HTMLDivElement>} container The given container element.
     *
     * @returns { width: number; height: number } The container dimensions.
     */
    private _getContainerDimensions(container: ElementRef<HTMLDivElement>): { width: number; height: number } {
        if (!container?.nativeElement) {
            return { width: 0, height: 0 };
        }
        return { width: container.nativeElement.clientWidth, height: container.nativeElement.clientHeight };
    }
}
