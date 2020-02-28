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

import { D3SimulationLink, D3SimulationNode, D3SimulationNodeType } from './d3/models';
import { D3Simulation } from '@awg-views/edition-view/edition-outlets/edition-graph/graph-visualizer/force-graph/d3/models/d3-force-simulation.model';

import { PrefixForm, PrefixPipe } from '../prefix-pipe/prefix.pipe';
import { Triple } from '@awg-views/edition-view/edition-outlets/edition-graph/edition-graph.service';

import * as d3_drag from 'd3-drag';
import * as d3_force from 'd3-force';
import * as d3_selection from 'd3-selection';
import * as d3_zoom from 'd3-zoom';
import * as N3 from 'n3';

export class D3SimulationNodeTriple {
    nodeSubject: D3SimulationNode;
    nodePredicate: D3SimulationNode;
    nodeObject: D3SimulationNode;

    constructor(nodeSubject: D3SimulationNode, nodePredicate: D3SimulationNode, nodeObject: D3SimulationNode) {
        this.nodeSubject = nodeSubject;
        this.nodePredicate = nodePredicate;
        this.nodeObject = nodeObject;
    }
}

export class D3SimulationData {
    nodes: D3SimulationNode[];
    links: D3SimulationLink[];
    nodeTriples: D3SimulationNodeTriple[];

    constructor() {
        this.nodes = [];
        this.links = [];
        this.nodeTriples = [];
    }
}

export interface D3Selection extends d3_selection.Selection<any, any, any, any> {}

@Component({
    selector: 'awg-force-graph',
    templateUrl: './force-graph.component.html',
    styleUrls: ['./force-graph.component.css']
})
export class ForceGraphComponent implements OnInit, OnChanges {
    @Input() queryResultTriples: Triple[];

    /**
     * Input variable: height.
     *
     * It keeps the default height of the component.
     */
    @Input() height: number;

    @Input() fitGraphIntoContainer: boolean;
    @Output() clickedURI = new EventEmitter<D3SimulationNode>();

    @ViewChild('graph', { static: true }) private graphContainer: ElementRef;

    private svg: D3Selection;
    private zoomGroup: D3Selection;
    private forceSimulation: D3Simulation;
    private simulationData: D3SimulationData;

    private divWidth: number;
    private divHeight: number;
    private widthBeforeResize: number;

    private limit = '100';

    fullScreen = false; // Fullscreen on?

    // Redraw on resize
    @HostListener('window:resize') onResize() {
        if (!this.graphContainer) {
            return;
        }
        const graphContainerElement = this.graphContainer.nativeElement;

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
            this.redraw('DRAW ON WINDOW:RESIZE');
        }
    }

    constructor(private prefixPipe: PrefixPipe) {}

    ngOnInit() {
        if (this.queryResultTriples) {
            this.redraw('DRAW ON INIT');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (
            changes.queryResultTriples &&
            changes.queryResultTriples.currentValue &&
            !changes.queryResultTriples.isFirstChange()
        ) {
            this.queryResultTriples = changes.queryResultTriples.currentValue;
            this.redraw('REDRAW ON CHANGES');
        }
    }

    redraw(message: string): void {
        console.log(message);
        this.cleanSVG();
        this.createSVG();
        this.attachData();
    }

    attachData(): void {
        // Limit result length
        const limit: number = parseInt(this.limit, 10);
        const triples: Triple[] = this.limitTriples(this.queryResultTriples, limit);

        // If type of triples is text/turtle (not array)
        // the triples must be parsed to objects instead
        if (typeof triples === 'string') {
            this.parseTriples(triples).then((d: { triples; prefixes }) => {
                const abrTriples = this.abbreviateTriples(d);
                this.simulationData = this.triplesToD3GraphData(abrTriples);

                this.setupForceSimulation();
                this.updateSVG();
            });
        } else {
            this.simulationData = this.triplesToD3GraphData(triples);

            console.log('GOT array triples', triples);
            console.log('simulationData', this.simulationData);

            this.setupForceSimulation();
            this.updateSVG();
        }
    }

    cleanSVG(): void {
        // Remove everything below the SVG element
        d3_selection.selectAll('svg > *').remove();
    }

    createSVG(): void {
        if (!this.graphContainer) {
            return;
        }
        // Get graph container
        const graphContainerElement = this.graphContainer.nativeElement;

        // Get container width & height
        this.divWidth = this.divWidth
            ? this.divWidth
            : this.getContainerWidth(graphContainerElement)
            ? this.getContainerWidth(graphContainerElement)
            : 400;
        this.divHeight = this.height
            ? this.height
            : this.getContainerHeight(graphContainerElement)
            ? this.getContainerHeight(graphContainerElement)
            : 500;

        console.log('width', this.divWidth);
        console.log('height', this.divHeight);

        if (!this.svg) {
            this.svg = d3_selection.select(graphContainerElement).append('svg');
        }
        this.svg.attr('width', this.divWidth).attr('height', this.divHeight);
    }

    setupForceSimulation(): void {
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

    updateSVG(): void {
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

    private abbreviateTriples(data: { triples; prefixes }): Triple[] {
        const prefixes = data.prefixes;
        const triples = [];

        function abbreviate(foi) {
            let newVal = null;
            // If FoI has 'http' in its name, continue
            if (foi.indexOf('http') !== -1 || foi.indexOf('https') !== -1) {
                // Loop over prefixes
                Object.entries(prefixes).forEach(([key, value], index) => {
                    // If the FoI has the prefixed namespace in its name, return it
                    if (foi.indexOf(value) !== -1) {
                        newVal = foi.replace(value, key + ':');
                    }
                });
            }
            return newVal;
        }

        data.triples.forEach((triple: Triple) => {
            let s = triple.subject;
            let p = triple.predicate;
            let o = triple.object;

            if (abbreviate(s) != null) {
                s = abbreviate(s);
            }
            if (abbreviate(p) != null) {
                p = abbreviate(p);
            }
            if (abbreviate(o) != null) {
                o = abbreviate(o);
            }
            triples.push({ subject: s, predicate: p, object: o });
        });
        return triples;
    }

    private checkForRdfType(predNode: D3SimulationNode): boolean {
        return (
            // rdf:type
            predNode.label === 'a' ||
            predNode.label === 'rdf:type' ||
            predNode.label === this.prefixPipe.transform(PrefixForm.long, 'rdf:type')
        );
    }

    private clickedOnNode(d: D3SimulationNode): void {
        if (d3_selection.event.defaultPrevented) {
            return;
        } // dragged

        this.clickedURI.emit(d);
    }

    private dragHandler(dragObject: D3Selection, simulation: D3Simulation) {
        // Drag functions
        // d is the node
        const dragStart = (d: D3SimulationNode) => {
            /** Preventing propagation of dragstart to parent elements */
            d3_selection.event.sourceEvent.stopPropagation();

            if (!d3_selection.event.active) {
                simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
        };

        // make sure you can't drag the circle outside the box
        const dragActions = (d: D3SimulationNode) => {
            d.fx = d3_selection.event.x;
            d.fy = d3_selection.event.y;
        };

        const dragEnd = (d: D3SimulationNode) => {
            if (!d3_selection.event.active) {
                simulation.alphaTarget(0);
            }
            d.fx = null;
            d.fy = null;
        };

        // apply drag handler
        dragObject.call(
            d3_drag
                .drag()
                .on('start', dragStart)
                .on('drag', dragActions)
                .on('end', dragEnd)
        );
    }

    private filterNodesById(nodes: D3SimulationNode[], id: string): D3SimulationNode {
        return nodes.filter(node => node.id === id)[0];
    }

    private filterNodesByType(nodes: D3SimulationNode[], type: D3SimulationNodeType): D3SimulationNode[] {
        return nodes.filter(node => node.type === type);
    }

    private getContainerWidth(container): number {
        if (!container) {
            return null;
        }
        return container.clientWidth;
    }

    private getContainerHeight(container): number {
        if (!container) {
            return null;
        }
        return container.clientHeight;
    }

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

    private nodeRadius(d: D3SimulationNode): number {
        if (!d) {
            return null;
        }

        let defaultRadius = 8;

        // MB if(d.instance || d.instSpace || d.instSpaceType){
        if (d.label.indexOf('_:') !== -1) {
            return defaultRadius--;
        } else if (d.instance || d.label.indexOf('inst:') !== -1) {
            return defaultRadius + 2;
        } else if (d.owlClass || d.label.indexOf('inst:') !== -1) {
            return defaultRadius++;
        } else {
            return defaultRadius;
        }
    }

    private parseTriples(triples: Triple[]): Promise<{ triples; prefixes }> {
        // ParseTriples
        const parser = N3.Parser();
        const jsonTriples = [];
        return new Promise((resolve, reject) => {
            parser.parse(triples, (err, triple, prefixValues) => {
                if (triple) {
                    jsonTriples.push(triple);
                } else {
                    resolve({ triples: jsonTriples, prefixes: prefixValues });
                }
                if (err) {
                    reject(err);
                }
            });
        });
    }

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

            const predNode: D3SimulationNode = new D3SimulationNode(predId, 1, D3SimulationNodeType.link);
            graphData.nodes.push(predNode);

            let subjNode: D3SimulationNode = this.filterNodesById(graphData.nodes, subjId);
            let objNode: D3SimulationNode = this.filterNodesById(graphData.nodes, objId);

            if (subjNode == null) {
                subjNode = new D3SimulationNode(subjId, 1, D3SimulationNodeType.node);

                graphData.nodes.push(subjNode);
            }

            if (objNode == null) {
                objNode = new D3SimulationNode(objId, 1, D3SimulationNodeType.node);

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

            const blankLabel = '';

            graphData.links.push(new D3SimulationLink(subjNode, predNode, blankLabel, 1));
            graphData.links.push(new D3SimulationLink(predNode, objNode, blankLabel, 1));

            graphData.nodeTriples.push(new D3SimulationNodeTriple(subjNode, predNode, objNode));
        });

        return graphData;
    }

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

    private updateNodeTextPositions(nodeTexts: D3Selection): void {
        nodeTexts.attr('x', (d: D3SimulationNode) => d.x + 12).attr('y', (d: D3SimulationNode) => d.y + 3);
    }

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

    private updateLinkTextPositions(linkTexts: D3Selection): void {
        linkTexts
            .attr('x', (d: D3SimulationNodeTriple) => 4 + (d.nodeSubject.x + d.nodePredicate.x + d.nodeObject.x) / 3)
            .attr('y', (d: D3SimulationNodeTriple) => 4 + (d.nodeSubject.y + d.nodePredicate.y + d.nodeObject.y) / 3);
    }

    private zoomHandler(zoomArea: D3Selection, svg: D3Selection) {
        // perform the zooming
        const zoomActions = () => {
            zoomArea.attr('transform', d3_selection.event.transform);
        };

        // apply zoom handler
        svg.call(d3_zoom.zoom().on('zoom', zoomActions));
    }

    log(messageString: string, messageValue: any): void {
        const value = messageValue ? JSON.parse(JSON.stringify(messageValue)) : messageValue;
        console.log(messageString, value);
    }
}
