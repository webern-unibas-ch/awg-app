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
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import {
    D3Selection,
    D3Simulation,
    D3SimulationData,
    D3SimulationLink,
    D3SimulationNode,
    D3SimulationNodeTriple,
    D3SimulationNodeType,
    PrefixForm,
    Triple
} from '../models';
import { PrefixPipe } from '../prefix-pipe/prefix.pipe';
import { GraphVisualizerService } from '../services/graph-visualizer.service';

import * as d3_drag from 'd3-drag';
import * as d3_force from 'd3-force';
import * as d3_selection from 'd3-selection';
import * as d3_zoom from 'd3-zoom';

import * as N3 from 'n3';

/**
 * The ForceGraphComponent component.
 *
 * It visualizes an RDF graph using a D3 force simulation.
 */
@Component({
    selector: 'awg-force-graph',
    templateUrl: './force-graph.component.html',
    styleUrls: ['./force-graph.component.css']
})
export class ForceGraphComponent implements OnInit, OnChanges {
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
     * ViewChild variable: graphContainer.
     *
     * It keeps the reference to the element containing the graph.
     */
    @ViewChild('graph', { static: true }) private graphContainer: ElementRef;

    /**
     * Private variable: svg.
     *
     * It keeps the D3 svg selection.
     */
    private svg: D3Selection;

    /**
     * Private variable: zoomGroup.
     *
     * It keeps the D3 zoomGroup selection.
     */
    private zoomGroup: D3Selection;

    /**
     * Private variable: forceSimulation.
     *
     * It keeps the D3 force simulation.
     */
    private forceSimulation: D3Simulation;

    /**
     * Private variable: simulationData.
     *
     * It keeps the data for the D3 force simulation.
     */
    private simulationData: D3SimulationData;

    /**
     * Private variable: divWidth.
     *
     * It keeps the width of the container div.
     */
    private divWidth: number;

    /**
     * Private variable: divHeight.
     *
     * It keeps the height of the container div.
     */
    private divHeight: number;

    /**
     * Private variable: widthBeforeResize.
     *
     * It keeps the initial width of the container div before resize.
     */
    private widthBeforeResize: number;

    /**
     * Private variable: limit.
     *
     * It keeps the default limit value for the display of query results.
     */
    private limit = '100';

    /**
     * Public variable: fullscreen.
     *
     * It keeps a boolean flag if the graph is in fullscreen or not.
     */
    fullScreen = false; // Fullscreen on?

    /**
     * HostListener: onResize.
     *
     * It redraws the graph when the window is resized.
     */
    @HostListener('window:resize') onResize() {
        if (!this.graphContainer) {
            return;
        }
        const graphContainerElement: any = this.graphContainer.nativeElement;

        // guard against resize before view is rendered
        if (graphContainerElement) {
            // When changing from fullscreen the recorded width before resize is used
            if (!this.fullScreen && this.widthBeforeResize) {
                this.divWidth = this.widthBeforeResize;
                this.widthBeforeResize = null;
            } else {
                this.divWidth = this.getContainerWidth(graphContainerElement);
            }

            this.divHeight = this.getContainerHeight(graphContainerElement);

            // Redraw
            d3_selection.selectAll('svg').remove();
            this.redraw();
        }
    }

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
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        if (this.queryResultTriples) {
            this.redraw();
        }
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
            changes.queryResultTriples &&
            changes.queryResultTriples.currentValue &&
            !changes.queryResultTriples.isFirstChange()
        ) {
            this.queryResultTriples = changes.queryResultTriples.currentValue;
            this.redraw();
        }
    }

    /**
     * Private method: redraw.
     *
     * It redraws the graph.
     *
     * @returns {void} Redraws the graph.
     */
    private redraw(): void {
        this.cleanSVG();
        this.createSVG();
        this.attachData();
    }

    /**
     * Private method: attachData.
     *
     * It attaches the RDF data to the simulation which is then set up.
     *
     * @returns {void} Attaches the data and sets up the simulation.
     */
    private attachData(): void {
        // Limit result length
        const limit: number = parseInt(this.limit, 10);
        const triples: Triple[] = this.limitTriples(this.queryResultTriples, limit);

        // If type of triples is text/turtle (not array)
        // the triples must be parsed to objects instead
        if (typeof triples === 'string') {
            this.parseTriples(triples).then((data: { triples; namespaces }) => {
                const abrTriples = this.graphVisualizerService.abbreviateTriples(data.triples, data.namespaces);
                this.simulationData = this.triplesToD3GraphData(abrTriples);

                this.setupForceSimulation();
                this.updateSVG();
            });
        } else {
            this.simulationData = this.triplesToD3GraphData(triples);

            this.setupForceSimulation();
            this.updateSVG();
        }
    }

    /**
     * Private method: cleanSVG.
     *
     * It removes everything from the svg container.
     *
     * @returns {void} Cleans the svg container.
     */
    private cleanSVG(): void {
        // Remove everything below the SVG element
        d3_selection.selectAll('svg > *').remove();
    }

    /**
     * Private method: createSVG.
     *
     * It creates the svg container and detects its width and height.
     *
     * @returns {void} Creates the svg container.
     */
    private createSVG(): void {
        if (!this.graphContainer) {
            return;
        }

        // Get container width & height
        this.divWidth = this.divWidth
            ? this.divWidth
            : this.getContainerWidth(this.graphContainer)
            ? this.getContainerWidth(this.graphContainer)
            : 400;
        this.divHeight = this.height
            ? this.height
            : this.getContainerHeight(this.graphContainer)
            ? this.getContainerHeight(this.graphContainer)
            : 500;

        if (!this.svg) {
            this.svg = d3_selection.select(this.graphContainer.nativeElement).append('svg');
        }
        this.svg.attr('width', this.divWidth).attr('height', this.divHeight);
    }

    /**
     * Private method: setupForceSimulation.
     *
     * It sets up the force simulation.
     *
     * @returns {void} Sets up the simulation.
     */
    private setupForceSimulation(): void {
        // set up the simulation
        this.forceSimulation = d3_force.forceSimulation();

        // Create forces
        const chargeForce = d3_force.forceManyBody().strength((d: D3SimulationNode) => this.nodeRadius(d) * -5);

        const centerForce = d3_force.forceCenter(this.divWidth / 2, this.divHeight / 2);

        const collideForce = d3_force
            .forceCollide()
            .strength(1)
            .radius(+5)
            .iterations(2);

        // create a custom link force with id accessor to use named sources and targets
        const linkForce = d3_force
            .forceLink()
            .links(this.simulationData.links)
            .id((d: D3SimulationLink) => d.predicate)
            .distance(1 / 50);

        // add forces
        // add a charge to each node, a centering and collision force
        this.forceSimulation
            .force('charge_force', chargeForce)
            .force('center_force', centerForce)
            .force('collide_force', collideForce);

        // add nodes to the simulation
        this.forceSimulation.nodes(this.simulationData.nodes);

        // add links to the simulation
        this.forceSimulation.force('links', linkForce);

        // restart simulation
        this.forceSimulation.restart();
    }

    /**
     * Private method: updateSVG.
     *
     * It populates the svg container with all subjects
     * necessary for the force simulation.
     *
     * @returns {void} Updates the svg container.
     */
    private updateSVG(): void {
        if (!this.svg) {
            return;
        }

        // ==================== Add Encompassing Group for Zoom =====================
        this.zoomGroup = this.svg.append('g').attr('class', 'zoom-container');

        // ==================== Add Marker ====================
        this.zoomGroup
            .append('svg:defs')
            .selectAll('marker')
            .data(['end'])
            .enter()
            .append('svg:marker')
            .attr('id', String)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 30)
            .attr('refY', -0.5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('svg:polyline')
            .attr('points', '0,-5 10,0 0,5');

        // ==================== Add Links ====================
        const links: D3Selection = this.zoomGroup
            .selectAll('.link')
            .data(this.simulationData.nodeTriples)
            .enter()
            .append('path')
            .attr('marker-end', 'url(#end)')
            .attr('class', 'link');

        // ==================== Add Link Names =====================
        const linkTexts: D3Selection = this.zoomGroup
            .selectAll('.link-text')
            .data(this.simulationData.nodeTriples)
            .enter()
            .append('text')
            .attr('class', 'link-text')
            .text((d: D3SimulationNodeTriple) => d.nodePredicate.label);

        // ==================== Add Node Names =====================
        const nodeTexts: D3Selection = this.zoomGroup
            .selectAll('.node-text')
            .data(this.filterNodesByType(this.simulationData.nodes, D3SimulationNodeType.node))
            .enter()
            .append('text')
            .attr('class', 'node-text')
            .text((d: D3SimulationNode) => d.label);

        // ==================== Add Node =====================
        const nodes: D3Selection = this.zoomGroup
            .selectAll('.node')
            .data(this.filterNodesByType(this.simulationData.nodes, D3SimulationNodeType.node))
            .enter()
            .append('circle')
            // .attr("class", "node")
            .attr('class', (d: D3SimulationNode) => {
                if (d.owlClass) {
                    return 'class';
                    // }else if(d.instSpace){ //MB
                    // return "instance-space" //MB
                    // }else if(d.instSpaceType){ //MB
                    // return "instance-spaceType"	//MB
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
            .on('click', (d: D3SimulationNode) => {
                this.clickedOnNode(d);
            });

        // ==================== When dragging ====================
        this.forceSimulation.on('tick', () => {
            // update node and link positions each tick of the simulation
            this.updateNodePositions(nodes);
            this.updateNodeTextPositions(nodeTexts);
            this.updateLinkPositions(links);
            this.updateLinkTextPositions(linkTexts);
        });

        // ==================== DRAG ====================
        this.dragHandler(nodes, this.forceSimulation);

        // ==================== ZOOM ====================
        this.zoomHandler(this.zoomGroup, this.svg);
    }

    /**
     * Private method: checkForRdfType.
     *
     * It checks if a given predicate node
     * contains a short or longform of "rdf:type".
     *
     * @param {D3SimulationNode} predicateNode The given node of the RDF predicate.
     *
     * @returns {boolean} The result of the check.
     */
    private checkForRdfType(predicateNode: D3SimulationNode): boolean {
        return (
            // rdf:type
            predicateNode.label === 'a' ||
            predicateNode.label === 'rdf:type' ||
            predicateNode.label === this.prefixPipe.transform(PrefixForm.long, 'rdf:type')
        );
    }

    /**
     * Private method: clickedOnNode.
     *
     * It emits a node the user clicked on.
     *
     * @param {D3SimulationNode} node The given node.
     *
     * @returns {void} Emits the node.
     */
    private clickedOnNode(node: D3SimulationNode): void {
        if (d3_selection.event.defaultPrevented) {
            return;
        } // dragged

        this.clickedNodeRequest.emit(node);
    }

    /**
     * Private method: dragHandler.
     *
     * It binds a draggable behaviour to a given dragContext (e.g. the nodes).
     *
     * @param {D3Selection} dragContext The given context that shall be draggable.
     * @param {D3Simulation} simulation The given force simulation.
     *
     * @returns {void} Sets the drag behaviour.
     */
    private dragHandler(dragContext: D3Selection, simulation: D3Simulation): void {
        // Drag functions
        // d is the node
        const dragStart = (node: D3SimulationNode) => {
            /** Preventing propagation of dragstart to parent elements */
            d3_selection.event.sourceEvent.stopPropagation();

            if (!d3_selection.event.active) {
                simulation.alphaTarget(0.3).restart();
            }
            node.fx = node.x;
            node.fy = node.y;
        };

        // make sure you can't drag the circle outside the box
        const dragActions = (node: D3SimulationNode) => {
            node.fx = d3_selection.event.x;
            node.fy = d3_selection.event.y;
        };

        const dragEnd = (node: D3SimulationNode) => {
            if (!d3_selection.event.active) {
                simulation.alphaTarget(0);
            }
            node.fx = null;
            node.fy = null;
        };

        // apply drag handler
        dragContext.call(
            d3_drag
                .drag()
                .on('start', dragStart)
                .on('drag', dragActions)
                .on('end', dragEnd)
        );
    }

    /**
     * Private method: filterNodesById.
     *
     * It filters an array of simulations nodes by a given id.
     *
     * @param {D3SimulationNode[]} nodes The given nodes array.
     * @param {string} id The given node id.
     *
     * @returns {D3SimulationNode} The filtered node.
     */
    private filterNodesById(nodes: D3SimulationNode[], id: string): D3SimulationNode {
        return nodes.filter(node => node.id === id)[0];
    }

    /**
     * Private method: filterNodesByType.
     *
     * It filters an array of simulations nodes by a given type.
     *
     * @param {D3SimulationNode[]} nodes The given nodes array.
     * @param {D3SimulationNodeType} type The given node type.
     *
     * @returns {D3SimulationNode} The filtered node.
     */
    private filterNodesByType(nodes: D3SimulationNode[], type: D3SimulationNodeType): D3SimulationNode[] {
        return nodes.filter(node => node.type === type);
    }

    /**
     * Private method: getContainerWidth.
     *
     * It returns the clientWidth of a given container.
     *
     * @param {ElementRef} container The given container element.
     *
     * @returns {number} The container width.
     */
    private getContainerWidth(container: ElementRef): number {
        if (!container) {
            return null;
        }
        return container.nativeElement.clientWidth;
    }

    /**
     * Private method: getContainerHeight.
     *
     * It returns the clientHeight of a given container.
     *
     * @param {ElementRef} container The given container element.
     *
     * @returns {number} The container height.
     */
    private getContainerHeight(container: ElementRef): number {
        if (!container) {
            return null;
        }
        return container.nativeElement.clientHeight;
    }

    /**
     * Private method: limitTriples.
     *
     * It limits a given array of triples by a given limit.
     *
     * @param {Triple[]} triples The given triples array.
     * @param {number} limit The given limit.
     *
     * @returns {Triple[]} The array of limited triples.
     */
    private limitTriples(triples: Triple[], limit: number): Triple[] {
        if (!triples) {
            return [];
        }
        if (triples.length > limit) {
            return triples.slice(0, limit);
        } else {
            return triples;
        }
    }

    /**
     * Private method: nodeRadius.
     *
     * It returns the radius of a given node depending on the kind of node.
     *
     * @param {D3SimulationNode} node The given node.
     *
     * @returns {number} The radius of the node.
     */
    private nodeRadius(node: D3SimulationNode): number {
        if (!node) {
            return null;
        }

        let defaultRadius = 8;

        // MB if(d.instance || d.instSpace || d.instSpaceType){
        if (node.label.indexOf('_:') !== -1) {
            return defaultRadius--;
        } else if (node.instance || node.label.indexOf('inst:') !== -1) {
            return defaultRadius + 2;
        } else if (node.owlClass || node.label.indexOf('inst:') !== -1) {
            return defaultRadius++;
        } else {
            return defaultRadius;
        }
    }

    /**
     * Private method: parseTriples.
     *
     * It parses the triples from a given triple array.
     *
     * @param {Triple[]} triples The given triple array.
     *
     * @returns {Promise<{triples; namespaces}>} A promise of the parsed triples.
     */
    private parseTriples(triples: Triple[]): Promise<{ triples; namespaces }> {
        const parser = N3.Parser();
        const jsonTriples = [];

        return new Promise((resolve, reject) => {
            parser.parse(triples, (err, triple, namespaceValues) => {
                if (triple) {
                    jsonTriples.push(triple);
                } else {
                    resolve({ triples: jsonTriples, namespaces: namespaceValues });
                }
                if (err) {
                    reject(err);
                }
            });
        });
    }

    /**
     * Private method: triplesToD3GraphData.
     *
     * It calculates the D3 simulation data from an array of triples.
     *
     * @param {Triple[]} triples The given triple array.
     *
     * @returns {D3SimulationData} The D3 graph data.
     */
    private triplesToD3GraphData(triples: Triple[]): D3SimulationData {
        if (!triples) {
            return;
        }

        // Graph
        const graphData: D3SimulationData = new D3SimulationData();

        // Initial Graph from triples
        triples.map((triple: Triple) => {
            const subjId = this.prefixPipe.transform(PrefixForm.short, triple.subject);
            const predId = this.prefixPipe.transform(PrefixForm.short, triple.predicate);
            let objId = this.prefixPipe.transform(PrefixForm.short, triple.object);

            // check if object is number & round decimal numbers to 2 decimals
            if (!isNaN(objId)) {
                objId = Number(objId) % 1 === 0 ? String(Number(objId)) : String(Number(objId).toFixed(2));
            }

            const predNode: D3SimulationNode = new D3SimulationNode(predId, D3SimulationNodeType.link);
            graphData.nodes.push(predNode);

            let subjNode: D3SimulationNode = this.filterNodesById(graphData.nodes, subjId);
            let objNode: D3SimulationNode = this.filterNodesById(graphData.nodes, objId);

            if (subjNode == null) {
                subjNode = new D3SimulationNode(subjId, D3SimulationNodeType.node);

                graphData.nodes.push(subjNode);
            }

            if (objNode == null) {
                objNode = new D3SimulationNode(objId, D3SimulationNodeType.node);

                graphData.nodes.push(objNode);
            }

            // check if predicate is "rdf:type"
            // then subjNode is an instance and objNode is a Class
            if (subjNode.instance === false) {
                subjNode.instance = this.checkForRdfType(predNode);
            }
            if (objNode.owlClass === false) {
                objNode.owlClass = this.checkForRdfType(predNode);
            }

            graphData.links.push(new D3SimulationLink(subjNode, predNode));
            graphData.links.push(new D3SimulationLink(predNode, objNode));

            graphData.nodeTriples.push(new D3SimulationNodeTriple(subjNode, predNode, objNode));
        });

        return graphData;
    }

    /**
     * Private method: updateNodePositions.
     *
     * It updates the positions of the nodes
     * on a force simulation's tick.
     *
     * @param {D3Selection} nodes The given nodes selection.
     *
     * @returns {void} Updates the position.
     */
    private updateNodePositions(nodes: D3Selection): void {
        nodes.attr('cx', (d: D3SimulationNode) => d.x).attr('cy', (d: D3SimulationNode) => d.y);

        /*// constrains the nodes to be within a box
        nodes
            .attr(
                'cx',
                (d: D3SimulationNode) =>
                    (d.x = Math.max(this.nodeRadius(d), Math.min(this.divWidth - this.nodeRadius(d), d.x)))
            )
            .attr(
                'cy',
                (d: D3SimulationNode) =>
                    (d.y = Math.max(this.nodeRadius(d), Math.min(this.divHeight - this.nodeRadius(d), d.y)))
            );*/
    }

    /**
     * Private method: updateNodeTextPositions.
     *
     * It updates the positions of the nodeTexts
     * on a force simulation's tick.
     *
     * @param {D3Selection} nodeTexts The given nodeTexts selection.
     *
     * @returns {void} Updates the position.
     */
    private updateNodeTextPositions(nodeTexts: D3Selection): void {
        nodeTexts.attr('x', (d: D3SimulationNode) => d.x + 12).attr('y', (d: D3SimulationNode) => d.y + 3);
    }

    /**
     * Private method: updateLinkPositions.
     *
     * It updates the positions of the links
     * on a force simulation's tick.
     *
     * @param {D3Selection} links The given links selection.
     *
     * @returns {void} Updates the position.
     */
    private updateLinkPositions(links: D3Selection): void {
        links.attr(
            'd',
            (d: D3SimulationNodeTriple) =>
                'M' +
                d.nodeSubject.x +
                ',' +
                d.nodeSubject.y +
                'S' +
                d.nodePredicate.x +
                ',' +
                d.nodePredicate.y +
                ' ' +
                d.nodeObject.x +
                ',' +
                d.nodeObject.y
        );
    }

    /**
     * Private method: updateLinkTextPositions.
     *
     * It updates the positions of the link texts
     * on a force simulation's tick.
     *
     * @param {D3Selection} linkTexts The given linkTexts selection.
     *
     * @returns {void} Updates the position.
     */
    private updateLinkTextPositions(linkTexts: D3Selection): void {
        linkTexts
            .attr('x', (d: D3SimulationNodeTriple) => 4 + (d.nodeSubject.x + d.nodePredicate.x + d.nodeObject.x) / 3)
            .attr('y', (d: D3SimulationNodeTriple) => 4 + (d.nodeSubject.y + d.nodePredicate.y + d.nodeObject.y) / 3);
    }

    /**
     * Private method: zoomHandler.
     *
     * It binds a pan and zoom behaviour to an svg element.
     *
     * @param {D3Selection} zoomContext The given context that shall be zoomable.
     * @param {D3Selection} svg The given svg container.
     *
     * @returns {void} Sets the zoom behaviour.
     */
    private zoomHandler(zoomContext: D3Selection, svg: D3Selection): void {
        // perform the zooming
        const zoomActions = () => {
            zoomContext.attr('transform', d3_selection.event.transform);
        };

        // apply zoom handler
        svg.call(d3_zoom.zoom().on('zoom', zoomActions));
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
        console.log(messageString, value);
    }
}
