/*
 * This component is adapted from Mads Holten's Sparql Visualizer
 * cf. https://github.com/MadsHolten/sparql-visualizer
 */

import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
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

import { GraphData, GraphNode } from '../models/graph-data.model';
import { GRAPH_DATA_UTILS } from '../utils/graph-data.utils';
import { SimEdge, SimLink, SimNode, SimulationData } from './force-graph.model';
import { FORCE_GRAPH_UTILS } from './force-graph.utils';

import * as D3_DRAG from 'd3-drag';
import * as D3_FORCE from 'd3-force';
import * as D3_SELECTION from 'd3-selection';
import * as D3_ZOOM from 'd3-zoom';

/**
 * The ForceSimulation type.
 *
 * It represents the D3 force simulation of the graph.
 */
type ForceSimulation = D3_FORCE.Simulation<SimNode, SimLink>;

/**
 * Object constant with a set of forces.
 *
 * It provides the default values for the D3 simulation's forces.
 *
 * Available force values: `LINK_DISTANCE`, `COLLISION_STRENGTH`, `CHARGE_STRENGTH`.
 */
const FORCES = {
    LINK_DISTANCE: 10, // Default 30
    COLLISION_STRENGTH: 1, // 0–1; Default: 0.7
    COLLISION_RADIUS: 30,
    CHARGE_STRENGTH: -10, //  Default -30
};

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
     * Private variable: _simulationData.
     *
     * It keeps the data for the D3 force simulation.
     */
    private _simulationData: SimulationData | undefined;

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
     * Public method: log.
     *
     * It logs a message to the console.
     *
     * @param {string} messageString The given message string.
     * @param {string} messageValue The given message value.
     *
     * @returns {void} Logs a message to the console.
     */
    log(messageString: string, messageValue: any): void {
        const value = typeof messageValue === 'object' ? structuredClone(messageValue) : messageValue;
        console.info(messageString, value);
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
        // Remove everything below the SVG element
        D3_SELECTION.selectAll('svg.force-graph > *').remove();
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
    }
    /**
     * Private method: _attachData.
     *
     * It attaches the (limited) graph data to the simulation which is then set up.
     *
     * @returns {void} Attaches the data and sets up the simulation.
     */
    private _attachData(): void {
        if (!this.graphData) {
            return;
        }
        const limitedGraphData = GRAPH_DATA_UTILS.limitGraphData(this.graphData, this.limit);
        this._simulationData = FORCE_GRAPH_UTILS.toSimulationData(limitedGraphData);
        this._setupForceSimulation();
        this._updateSVG();
    }

    /**
     * Private method: _setupForceSimulation.
     *
     * It sets up the force simulation.
     *
     * @returns {void} Sets up the simulation.
     */
    private _setupForceSimulation(): void {
        if (!this._simulationData) {
            return;
        }

        // Set up the simulation
        this._forceSimulation = D3_FORCE.forceSimulation();

        // Create forces
        // The charge uses the radius of the drawn node reduced by 1 (as before)
        const chargeForce = D3_FORCE.forceManyBody<SimNode>().strength(
            (d: SimNode) => (d.r - 1) * FORCES.CHARGE_STRENGTH
        );

        const centerForce = D3_FORCE.forceCenter(this._divWidth / 2, this._divHeight / 2);

        const collideForce = D3_FORCE.forceCollide()
            .strength(FORCES.COLLISION_STRENGTH)
            .radius(FORCES.COLLISION_RADIUS)
            .iterations(2);

        // Create a custom link force with id accessor to use named sources and targets
        const linkForce = D3_FORCE.forceLink<SimNode, SimLink>()
            .links(this._simulationData.links)
            .id((d: SimNode) => d.id)
            .distance(FORCES.LINK_DISTANCE);

        // Add forces
        // Add a charge to each node, a centering and collision force
        this._forceSimulation
            .force('charge_force', chargeForce)
            .force('center_force', centerForce)
            .force('collide_force', collideForce);

        // Add nodes to the simulation
        this._forceSimulation.nodes(this._simulationData.nodes);

        // Add links to the simulation
        this._forceSimulation.force('links', linkForce);

        // Restart simulation
        this._forceSimulation.alpha(1).restart();
    }

    /**
     * Private method: _updateSVG.
     *
     * It populates the svg container with all subjects
     * necessary for the force simulation.
     *
     * @returns {void} Updates the svg container.
     */
    private _updateSVG(): void {
        if (!this._svg || !this._zoomGroup || !this._simulationData || !this._forceSimulation) {
            return;
        }

        // ==================== Add Marker ====================
        this._zoomGroup
            .append('svg:defs')
            .selectAll('marker')
            .data(['end'])
            .enter()
            .append('svg:marker')
            .attr('id', String)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 30)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('svg:polyline')
            .attr('points', '0,-5 10,0 0,5');

        // ==================== Add Links ====================
        const links: D3Selection = this._zoomGroup
            .append('g')
            .attr('class', 'links')
            .selectAll('.link')
            .data(this._simulationData.edges)
            .enter()
            .append('path')
            .attr('marker-end', 'url(#end)')
            .attr('class', 'link');

        // ==================== Add Link Names =====================
        const linkTexts: D3Selection = this._zoomGroup
            .append('g')
            .attr('class', 'link-texts')
            .selectAll('.link-text')
            .data(this._simulationData.edges)
            .enter()
            .append('text')
            .attr('class', 'link-text')
            .text((d: SimEdge) => d.edge.label);

        // The middle nodes of the edges are part of the simulation, but not drawn
        const graphSimNodes = this._simulationData.nodes.filter((d: SimNode) => !!d.graphNode);

        // ==================== Add Node Names =====================
        const nodeTexts: D3Selection = this._zoomGroup
            .append('g')
            .attr('class', 'node-texts')
            .selectAll('.node-text')
            .data(graphSimNodes)
            .enter()
            .append('text')
            .attr('class', 'node-text')
            .text((d: SimNode) => d.graphNode?.shortName ?? '');

        // ==================== Add Nodes =====================
        const nodes: D3Selection = this._zoomGroup
            .append('g')
            .attr('class', 'nodes')
            .selectAll('.node')
            .data(graphSimNodes)
            .enter()
            .append('circle')
            .attr('class', (d: SimNode) => FORCE_GRAPH_UTILS.nodeCssClass(d.graphNode?.kind ?? 'resource'))
            .attr('id', (d: SimNode) => d.graphNode?.label ?? d.id)
            .attr('r', (d: SimNode) => d.r)
            .on('click', (event: any, d): void => {
                this._clickedOnNode(event, d);
            });

        // ==================== FORCES ====================
        this._forceSimulation.on('tick', () => {
            // Update node and link positions each tick of the simulation
            this._updateNodePositions(nodes);
            this._updateNodeTextPositions(nodeTexts);
            this._updateLinkPositions(links);
            this._updateLinkTextPositions(linkTexts);
        });

        // ==================== DRAG ====================
        this._dragHandler(nodes, this._forceSimulation);

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
     * It emits a node the user clicked on.
     *
     * @param {any} event The given D3 event listener.
     * @param {SimNode} d The given simulation node.
     *
     * @returns {void} Emits the graph node.
     */
    private _clickedOnNode(event: any, d: SimNode): void {
        if (event.defaultPrevented || !d.graphNode) {
            return;
        } // Dragged

        this.clickedNodeRequest.emit(d.graphNode);
    }

    /**
     * Private method: _dragHandler.
     *
     * It binds a draggable behaviour to a given dragContext (e.g. the nodes).
     *
     * @param {D3Selection} dragContext The given context that shall be draggable.
     * @param {ForceSimulation} simulation The given force simulation.
     *
     * @returns {void} Sets the drag behaviour.
     */
    private _dragHandler(dragContext: D3Selection, simulation: ForceSimulation): void {
        // Drag functions
        const dragStart = (event: any, d: SimNode): void => {
            /** Preventing propagation of dragstart to parent elements */
            event.sourceEvent.stopPropagation();

            if (!event.active) {
                simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        };

        // Make sure you can't drag the circle outside the box
        const dragged = (event: any, d: SimNode): void => {
            d.fx = event.x;
            d.fy = event.y;
        };

        const dragEnd = (event: any, d: SimNode): void => {
            if (!event.active) {
                simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
        };

        // Create drag behaviour
        const dragBehaviour = D3_DRAG.drag<any, SimNode>()
            .on('start', dragStart)
            .on('drag', dragged)
            .on('end', dragEnd);

        // Apply drag behaviour
        dragContext.call(dragBehaviour);
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

    /**
     * Private method: _updateNodePositions.
     *
     * It updates the positions of the nodes
     * on a force simulation's tick.
     *
     * @param {D3Selection} nodes The given nodes selection.
     *
     * @returns {void} Updates the position.
     */
    private _updateNodePositions(nodes: D3Selection): void {
        nodes.attr('cx', (d: SimNode) => d.x ?? 0).attr('cy', (d: SimNode) => d.y ?? 0);
    }

    /**
     * Private method: _updateNodeTextPositions.
     *
     * It updates the positions of the nodeTexts
     * on a force simulation's tick.
     *
     * @param {D3Selection} nodeTexts The given nodeTexts selection.
     *
     * @returns {void} Updates the position.
     */
    private _updateNodeTextPositions(nodeTexts: D3Selection): void {
        nodeTexts.attr('x', (d: SimNode) => (d.x ?? 0) + 12).attr('y', (d: SimNode) => (d.y ?? 0) + 3);
    }

    /**
     * Private method: _updateLinkPositions.
     *
     * It updates the positions of the links
     * on a force simulation's tick.
     * Cf. https://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node
     *
     * @param {D3Selection} links The given links selection.
     *
     * @returns {void} Updates the position.
     */
    private _updateLinkPositions(links: D3Selection): void {
        links.attr('d', (d: SimEdge) => FORCE_GRAPH_UTILS.linkPath(d));
    }

    /**
     * Private method: _updateLinkTextPositions.
     *
     * It updates the positions of the link texts
     * on a force simulation's tick.
     *
     * @param {D3Selection} linkTexts The given linkTexts selection.
     *
     * @returns {void} Updates the position.
     */
    private _updateLinkTextPositions(linkTexts: D3Selection): void {
        linkTexts
            .attr('x', (d: SimEdge) => FORCE_GRAPH_UTILS.linkLabelPosition(d).x)
            .attr('y', (d: SimEdge) => FORCE_GRAPH_UTILS.linkLabelPosition(d).y);
    }
}
