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
    SimpleChanges,
    ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { faCompressArrowsAlt } from '@fortawesome/free-solid-svg-icons';

import {
    D3DragBehaviour,
    D3Selection,
    D3Simulation,
    D3SimulationData,
    D3SimulationLink,
    D3SimulationNode,
    D3SimulationNodeTriple,
    D3SimulationNodeType,
    D3ZoomBehaviour,
    PrefixForm,
    Triple,
} from '../models';
import { PrefixPipe } from '../prefix-pipe/prefix.pipe';
import { GraphVisualizerService } from '../services/graph-visualizer.service';

import * as d3_drag from 'd3-drag';
import * as d3_force from 'd3-force';
import * as d3_selection from 'd3-selection';
import * as d3_zoom from 'd3-zoom';

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
})
export class ForceGraphComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * Input variable:  queryResultTriples.
     *
     * It keeps the triples of the query result.
     */
    @Input() queryResultTriples: Triple[];

    /**
     * Input variable: height.
     *
     * It keeps the default height of the component.
     */
    @Input() height: number;

    /**
     * Output variable: clickedNodeRequest.
     *
     * It keeps an event emitter for the node IRI a user clicked on.
     */
    @Output() clickedNodeRequest = new EventEmitter<D3SimulationNode>();

    /**
     * ViewChild variable: _graphContainer.
     *
     * It keeps the reference to the element containing the graph.
     */
    @ViewChild('graph', { static: true }) private _graphContainer: ElementRef;

    /**
     * ViewChild variable: _sliderInput.
     *
     * It keeps the reference to the input range slider.
     */
    @ViewChild('sliderInput', { static: true })
    private _sliderInput: ElementRef;

    /**
     * ViewChild variable: _sliderInputLabel.
     *
     * It keeps the reference to the input sliderInputLabel.
     */
    @ViewChild('sliderInputLabel', { static: true })
    private _sliderInputLabel: ElementRef;

    /**
     * Public variable: faCompressArrowsAlt.
     *
     * It instantiates fontawesome's faCompressArrowsAlt icon.
     */
    faCompressArrowsAlt = faCompressArrowsAlt;

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
     * Public variable: sliderConfig.
     *
     * It keeps the default values for the zoom slider input.
     */
    sliderConfig = {
        initial: 1,
        min: 0.1,
        max: 3,
        step: 1 / 100,
        value: 1,
    };

    /**
     * Private variable: _svg.
     *
     * It keeps the D3 svg selection.
     */
    private _svg: D3Selection;

    /**
     * Private variable: _zoomGroup.
     *
     * It keeps the D3 zoomGroup selection.
     */
    private _zoomGroup: D3Selection;

    /**
     * Private variable: _zoomBehaviour.
     *
     * It keeps the D3 zoom behaviour.
     */
    private _zoomBehaviour: D3ZoomBehaviour;

    /**
     * Private variable: _forceSimulation.
     *
     * It keeps the D3 force simulation.
     */
    private _forceSimulation: D3Simulation;

    /**
     * Private variable: _simulationData.
     *
     * It keeps the data for the D3 force simulation.
     */
    private _simulationData: D3SimulationData;

    /**
     * Private variable: _divWidth.
     *
     * It keeps the width of the container div.
     */
    private _divWidth: number;

    /**
     * Private variable: _divHeight.
     *
     * It keeps the height of the container div.
     */
    private _divHeight: number;

    /**
     * Private variable: _resize$.
     *
     * It keeps a subject for a resize event.
     */
    private _resize$: Subject<boolean> = new Subject<boolean>();

    /**
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor of the ForceGraphComponent.
     *
     * It declares private instances of the
     * {@link GraphVisualizerService} and the {@link PrefixPipe}.
     *
     * @param {GraphVisualizerService} graphVisualizerService Instance of the GraphVisualizerService.
     * @param {PrefixPipe} prefixPipe Instance of the PrefixPipe.
     */
    constructor(private graphVisualizerService: GraphVisualizerService, private prefixPipe: PrefixPipe) {}

    /**
     * HostListener: onResize.
     *
     * It redraws the graph when the window is resized.
     */
    @HostListener('window:resize') onResize() {
        // Guard against resize before view is rendered
        if (!this._graphContainer || !this.queryResultTriples) {
            return;
        }

        // Calculate new width & height
        this._divWidth = this._getContainerWidth(this._graphContainer);
        this._divHeight = this._getContainerHeight(this._graphContainer);

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
        this._resize$.pipe(debounceTime(150), takeUntil(this._destroyed$)).subscribe((_event: any) => {
            this._redraw();
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
        if (
            changes['queryResultTriples'] &&
            changes['queryResultTriples'].currentValue &&
            !changes['queryResultTriples'].isFirstChange()
        ) {
            this.queryResultTriples = changes['queryResultTriples'].currentValue;
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
        if (!this._svg || !(this._divWidth && this._divHeight)) {
            return;
        }
        this.onZoomChange(this.sliderConfig.initial);
        this._zoomBehaviour.translateTo(this._svg, this._divWidth / 2, this._divHeight / 2);
    }

    /**
     * Public method: onZoomChange.
     *
     * It sets the slider value to a given scalestep .
     *
     * @param {number} newSliderValue The new slider value.
     *
     * @returns {void} Sets the new slider value and calls for rescale.
     */
    onZoomChange(newSliderValue: number): void {
        this.sliderConfig.value = newSliderValue;
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
        const value = messageValue ? JSON.parse(JSON.stringify(messageValue)) : messageValue;
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
        if (this.queryResultTriples) {
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
        d3_selection.selectAll('svg.force-graph > *').remove();
    }

    /**
     * Private method: _createSVG.
     *
     * It creates the svg container and detects its width and height.
     *
     * @returns {void} Creates the svg container.
     */
    private _createSVG(): void {
        if (!this._graphContainer) {
            return;
        }

        // Get container width & height
        this._divWidth = this._divWidth
            ? this._divWidth
            : this._getContainerWidth(this._graphContainer)
            ? this._getContainerWidth(this._graphContainer)
            : 400;
        this._divHeight = this.height
            ? this.height
            : this._getContainerHeight(this._graphContainer)
            ? this._getContainerHeight(this._graphContainer)
            : 500;
        // Leave some space for icon bar at the top
        this._divHeight = this._divHeight - 20;

        // ==================== Add SVG =====================
        if (!this._svg) {
            this._svg = d3_selection
                .select(this._graphContainer.nativeElement)
                .append('svg')
                .attr('class', 'force-graph');
        }
        this._svg.attr('width', this._divWidth).attr('height', this._divHeight);

        // ==================== Add Encompassing Group for Zoom =====================
        this._zoomGroup = this._svg.append('g').attr('class', 'zoom-container');
    }
    /**
     * Private method: _attachData.
     *
     * It attaches the RDF data to the simulation which is then set up.
     *
     * @returns {void} Attaches the data and sets up the simulation.
     */
    private _attachData(): void {
        // Limit result length
        const triples: Triple[] = this.graphVisualizerService.limitTriples(this.queryResultTriples, this.limit);

        // If type of triples is text/turtle (not array)
        // The triples must be parsed to objects instead
        if (typeof triples === 'string') {
            this.graphVisualizerService.parseTripleString(triples).then((data: { triples; namespaces }) => {
                const abrTriples: Triple[] = this.graphVisualizerService.abbreviateTriples(
                    data.triples,
                    data.namespaces
                );
                this._simulationData = this._triplesToD3GraphData(abrTriples);

                this._setupForceSimulation();
                this._updateSVG();
            });
        } else {
            this._simulationData = this._triplesToD3GraphData(triples);

            this._setupForceSimulation();
            this._updateSVG();
        }
    }

    /**
     * Private method: _setupForceSimulation.
     *
     * It sets up the force simulation.
     *
     * @returns {void} Sets up the simulation.
     */
    private _setupForceSimulation(): void {
        // Set up the simulation
        this._forceSimulation = d3_force.forceSimulation();

        // Create forces
        const chargeForce = d3_force
            .forceManyBody()
            .strength((d: D3SimulationNode) => this._nodeRadius(d) * FORCES.CHARGE_STRENGTH);

        const centerForce = d3_force.forceCenter(this._divWidth / 2, this._divHeight / 2);

        const collideForce = d3_force
            .forceCollide()
            .strength(FORCES.COLLISION_STRENGTH)
            .radius(FORCES.COLLISION_RADIUS)
            .iterations(2);

        // Create a custom link force with id accessor to use named sources and targets
        const linkForce = d3_force
            .forceLink()
            .links(this._simulationData.links)
            .id((d: D3SimulationLink) => d.predicate)
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
        if (!this._svg) {
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
            .data(this._simulationData.nodeTriples)
            .enter()
            .append('path')
            .attr('marker-end', 'url(#end)')
            .attr('class', 'link');

        // ==================== Add Link Names =====================
        const linkTexts: D3Selection = this._zoomGroup
            .append('g')
            .attr('class', 'link-texts')
            .selectAll('.link-text')
            .data(this._simulationData.nodeTriples)
            .enter()
            .append('text')
            .attr('class', 'link-text')
            .text((d: D3SimulationNodeTriple) => d.nodePredicate.label);

        // ==================== Add Node Names =====================
        const nodeTexts: D3Selection = this._zoomGroup
            .append('g')
            .attr('class', 'node-texts')
            .selectAll('.node-text')
            .data(this._filterNodesByType(this._simulationData.nodes, D3SimulationNodeType.node))
            .enter()
            .append('text')
            .attr('class', 'node-text')
            .text((d: D3SimulationNode) => d.label);

        // ==================== Add Nodes =====================
        const nodes: D3Selection = this._zoomGroup
            .append('g')
            .attr('class', 'nodes')
            .selectAll('.node')
            .data(this._filterNodesByType(this._simulationData.nodes, D3SimulationNodeType.node))
            .enter()
            .append('circle')
            // .attr("class", "node")
            .attr('class', (d: D3SimulationNode) => {
                if (d.owlClass) {
                    return 'class';
                    // }else if(d.instSpace){ //MB
                    // Return "instance-space" //MB
                    // }else if(d.instSpaceType){ //MB
                    // Return "instance-spaceType"	//MB
                } else if (d.label.indexOf('_:') !== -1) {
                    return 'blank';
                } else if (d.instance || d.label.indexOf('inst:') !== -1) {
                    return 'instance';
                } else {
                    return 'node';
                }
            })
            .attr('id', (d: D3SimulationNode) => d.label)
            .attr('r', (d: D3SimulationNode) => {
                // MB if(d.instance || d.instSpace || d.instSpaceType){
                if (d.label.indexOf('_:') !== -1) {
                    return 8;
                } else if (d.instance || d.label.indexOf('inst:') !== -1) {
                    return 11;
                } else if (d.owlClass || d.label.indexOf('inst:') !== -1) {
                    return 10;
                } else {
                    return 9;
                }
            })
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
        if (!this._svg || !this.sliderConfig.value) {
            return;
        }
        this._zoomBehaviour.scaleTo(this._svg, this.sliderConfig.value);
    }

    /**
     * Private method: _checkForRdfType.
     *
     * It checks if a given predicate node
     * contains a short or longform of "rdf:type".
     *
     * @param {D3SimulationNode} predicateNode The given node of the RDF predicate.
     *
     * @returns {boolean} The result of the check.
     */
    private _checkForRdfType(predicateNode: D3SimulationNode): boolean {
        return (
            // Rdf:type
            predicateNode.label === 'a' ||
            predicateNode.label === 'rdf:type' ||
            predicateNode.label === this.prefixPipe.transform('rdf:type', PrefixForm.long)
        );
    }

    /**
     * Private method: _clickedOnNode.
     *
     * It emits a node the user clicked on.
     *
     * @param {any} event The given D3 event listener.
     * @param {D3SimulationNode} d The given node.
     *
     * @returns {void} Emits the node.
     */
    private _clickedOnNode(event: any, d): void {
        if (event.defaultPrevented) {
            return;
        } // Dragged

        this.clickedNodeRequest.emit(d);
    }

    /**
     * Private method: _dragHandler.
     *
     * It binds a draggable behaviour to a given dragContext (e.g. the nodes).
     *
     * @param {D3Selection} dragContext The given context that shall be draggable.
     * @param {D3Simulation} simulation The given force simulation.
     *
     * @returns {void} Sets the drag behaviour.
     */
    private _dragHandler(dragContext: D3Selection, simulation: D3Simulation): void {
        // Drag functions
        const dragStart = (event: any, d): void => {
            /** Preventing propagation of dragstart to parent elements */
            event.sourceEvent.stopPropagation();

            if (!event.active) {
                simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        };

        // Make sure you can't drag the circle outside the box
        const dragged = (event: any, d): void => {
            d.fx = event.x;
            d.fy = event.y;
        };

        const dragEnd = (event: any, d): void => {
            if (!event.active) {
                simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
        };

        // Create drag behaviour
        const dragBehaviour: D3DragBehaviour = d3_drag
            .drag()
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
            const roundedTransformValue = this._roundToNearestScaleStep(currentTransform.k);

            // Update d3 zoom context
            zoomContext.attr('transform', currentTransform);

            // Update view
            this._sliderInput.nativeElement.value = roundedTransformValue;
            // Needed because d3 listener does not update ngModel
            this._sliderInputLabel.nativeElement.innerText = roundedTransformValue + 'x';
            this.sliderConfig.value = roundedTransformValue;
        };

        // Create zoom behaviour
        this._zoomBehaviour = d3_zoom
            .zoom()
            .scaleExtent([this.sliderConfig.min, this.sliderConfig.max])
            .on('zoom', zoomed);

        // Apply zoom behaviour
        svg.call(this._zoomBehaviour);
    }

    /**
     * Private method: _filterNodesById.
     *
     * It filters an array of simulations nodes by a given id.
     *
     * @param {D3SimulationNode[]} nodes The given nodes array.
     * @param {string} id The given node id.
     *
     * @returns {D3SimulationNode} The filtered node.
     */
    private _filterNodesById(nodes: D3SimulationNode[], id: string): D3SimulationNode {
        return nodes.filter(node => node.id === id)[0];
    }

    /**
     * Private method: _filterNodesByType.
     *
     * It filters an array of simulations nodes by a given type.
     *
     * @param {D3SimulationNode[]} nodes The given nodes array.
     * @param {D3SimulationNodeType} type The given node type.
     *
     * @returns {D3SimulationNode} The filtered node.
     */
    private _filterNodesByType(nodes: D3SimulationNode[], type: D3SimulationNodeType): D3SimulationNode[] {
        return nodes.filter(node => node.type === type);
    }

    /**
     * Private method: _getContainerWidth.
     *
     * It returns the clientWidth of a given container.
     *
     * @param {ElementRef} container The given container element.
     *
     * @returns {number} The container width.
     */
    private _getContainerWidth(container: ElementRef): number {
        if (!container || !container.nativeElement) {
            return null;
        }
        return container.nativeElement.clientWidth;
    }

    /**
     * Private method: _getContainerHeight.
     *
     * It returns the clientHeight of a given container.
     *
     * @param {ElementRef} container The given container element.
     *
     * @returns {number} The container height.
     */
    private _getContainerHeight(container: ElementRef): number {
        if (!container || !container.nativeElement) {
            return null;
        }
        return container.nativeElement.clientHeight;
    }

    /**
     * Private method: _nodeRadius.
     *
     * It returns the radius of a given node depending on the kind of node.
     *
     * @param {D3SimulationNode} node The given node.
     *
     * @returns {number} The radius of the node.
     */
    private _nodeRadius(node: D3SimulationNode): number {
        if (!node) {
            return null;
        }

        let defaultRadius = 8;

        // MB if(d.instance || d.instSpace || d.instSpaceType){
        if (node.label.indexOf('_:') !== -1) {
            defaultRadius = defaultRadius - 1;
        } else if (node.instance || node.label.indexOf('inst:') !== -1) {
            defaultRadius = defaultRadius + 2;
        } else if (node.owlClass || node.label.indexOf('inst:') !== -1) {
            defaultRadius = defaultRadius + 1;
        }
        return defaultRadius;
    }

    /**
     * Private method: _roundToNearestScaleStep.
     *
     * It rounds a given value to the nearest value on an input range scale.
     * Cf. https://stackoverflow.com/a/13635455
     *
     * @param {number} value The given value to round.
     *
     * @returns {number} The rounded value.
     */
    private _roundToNearestScaleStep(value: number): number {
        const steps = this.sliderConfig.step;

        // Count decimals of a given value
        // Cf. https://stackoverflow.com/a/17369245
        const countDecimals = (countValue: number): number => {
            // Return zero if value cannot be rounded
            if (Math.floor(countValue) === countValue) {
                return 0;
            }
            // Convert the number to a string, split at the . and return the last part of the array, or 0 if the last part of the array is undefined (which will occur if there was no decimal point)
            return countValue.toString().split('.')[1].length || 0;
        };

        // Avoid Math.round error
        // Cf. https://www.jacklmoore.com/notes/rounding-in-javascript/
        const round = (roundValue: number, decimalPlaces: number): number =>
            Number(Math.round(Number(roundValue + 'e' + decimalPlaces)) + 'e-' + decimalPlaces);

        return round(value, countDecimals(steps));
    }

    /**
     * Private method: _triplesToD3GraphData.
     *
     * It calculates the D3 simulation data from an array of triples.
     *
     * @param {Triple[]} triples The given triple array.
     *
     * @returns {D3SimulationData} The D3 graph data.
     */
    private _triplesToD3GraphData(triples: Triple[]): D3SimulationData {
        if (!triples) {
            return undefined;
        }

        // Graph
        const graphData: D3SimulationData = new D3SimulationData();

        // Initial Graph from triples
        triples.forEach((triple: Triple) => {
            const subjId = this.prefixPipe.transform(triple.subject, PrefixForm.short);
            const predId = this.prefixPipe.transform(triple.predicate, PrefixForm.short);
            let objId = this.prefixPipe.transform(triple.object, PrefixForm.short);

            // Check if object is number & round decimal numbers to 2 decimals
            if (!isNaN(objId)) {
                objId = Number(objId) % 1 === 0 ? String(Number(objId)) : String(Number(objId).toFixed(2));
            }

            const predNode: D3SimulationNode = new D3SimulationNode(predId, D3SimulationNodeType.link);
            graphData.nodes.push(predNode);

            let subjNode: D3SimulationNode = this._filterNodesById(graphData.nodes, subjId);

            if (subjNode == null) {
                subjNode = new D3SimulationNode(subjId, D3SimulationNodeType.node);

                graphData.nodes.push(subjNode);
            }

            // Look up objNode only after subjNode has been created to avoid unwanted duplication of self linking nodes
            let objNode: D3SimulationNode = this._filterNodesById(graphData.nodes, objId);
            if (objNode == null) {
                objNode = new D3SimulationNode(objId, D3SimulationNodeType.node);

                graphData.nodes.push(objNode);
            }

            // Check if predicate is "rdf:type"
            // Then subjNode is an instance and objNode is a Class
            if (subjNode.instance === false) {
                subjNode.instance = this._checkForRdfType(predNode);
            }
            if (objNode.owlClass === false) {
                objNode.owlClass = this._checkForRdfType(predNode);
            }

            graphData.links.push(new D3SimulationLink(subjNode, predNode));
            graphData.links.push(new D3SimulationLink(predNode, objNode));

            graphData.nodeTriples.push(new D3SimulationNodeTriple(subjNode, predNode, objNode));
        });

        return graphData;
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
        nodes.attr('cx', (d: D3SimulationNode) => d.x).attr('cy', (d: D3SimulationNode) => d.y);

        /*
        // constrains the nodes to be within a box
        nodes
            .attr(
                'cx',
                (d: D3SimulationNode) =>
                    (d.x = Math.max(this._nodeRadius(d), Math.min(this._divWidth - this._nodeRadius(d), d.x)))
            )
            .attr(
                'cy',
                (d: D3SimulationNode) =>
                    (d.y = Math.max(this._nodeRadius(d), Math.min(this._divHeight - this._nodeRadius(d), d.y)))
            );
         */
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
        nodeTexts.attr('x', (d: D3SimulationNode) => d.x + 12).attr('y', (d: D3SimulationNode) => d.y + 3);
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
        links.attr('d', (d: D3SimulationNodeTriple) => {
            const x1 = d.nodeSubject.x;
            const y1 = d.nodeSubject.y;
            let x2 = d.nodeObject.x;
            let y2 = d.nodeObject.y;
            const dr = 0;

            // Defaults for normal edge.
            let drx = dr;
            let dry = dr;
            let xRotation = 0; // Degrees
            let largeArc = 0; // 1 or 0
            const sweep = 1; // 1 or 0

            // Self edge.
            if (x1 === x2 && y1 === y2) {
                // Fiddle with this angle to get loop oriented.
                xRotation = -45;

                // Needs to be 1.
                largeArc = 1;

                // Change sweep to change orientation of loop
                // Sweep = 0;

                // Make drx and dry different to get an ellipse instead of a circle.
                drx = 30;
                dry = 20;

                /* For whatever reason the arc collapses to a point if the beginning
                 * and ending points of the arc are the same, so kludge it.
                 */
                x2 = x2 + 1;
                y2 = y2 + 1;
            }

            return (
                'M' +
                x1 +
                ',' +
                y1 +
                'A' +
                drx +
                ',' +
                dry +
                ' ' +
                xRotation +
                ',' +
                largeArc +
                ',' +
                sweep +
                ' ' +
                x2 +
                ',' +
                y2
            );
        });
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
            .attr('x', (d: D3SimulationNodeTriple) => {
                if (d.nodeSubject.x === d.nodeObject.x && d.nodeSubject.y === d.nodeObject.y) {
                    return 20 + (d.nodeSubject.x + d.nodePredicate.x + d.nodeObject.x) / 3;
                }

                return 10 + (d.nodeSubject.x + d.nodePredicate.x + d.nodeObject.x) / 3;
            })
            .attr('y', (d: D3SimulationNodeTriple) => {
                if (d.nodeSubject.x === d.nodeObject.x && d.nodeSubject.y === d.nodeObject.y) {
                    return -40 + (d.nodeSubject.y + d.nodePredicate.y + d.nodeObject.y) / 3;
                }
                return 4 + (d.nodeSubject.y + d.nodePredicate.y + d.nodeObject.y) / 3;
            });
    }
}
