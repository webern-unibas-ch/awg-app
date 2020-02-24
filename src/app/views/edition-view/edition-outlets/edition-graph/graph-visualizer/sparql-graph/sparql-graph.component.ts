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

import { PrefixForm, PrefixPipe } from '../prefix-pipe/prefix.pipe';
import { Triple } from '@awg-views/edition-view/edition-outlets/edition-graph/edition-graph.service';

import * as d3_drag from 'd3-drag';
import * as d3_force from 'd3-force';
import * as d3_selection from 'd3-selection';
import * as d3_zoom from 'd3-zoom';
import * as N3 from 'n3';

export enum NodeType {
    link = 'link',
    node = 'node'
}

export class D3SimulationNode implements d3_force.SimulationNodeDatum {
    id: string;
    label: string;
    weight: number;
    type: NodeType;
    owlClass: boolean;
    instance: boolean;

    // optional properties from d3_force.SimulationNodeDatum
    index?: number;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;

    // set default values
    constructor(id: string, weight: number, type: NodeType) {
        this.id = id;
        this.label = id;
        this.weight = weight;
        this.type = type;
        this.owlClass = false;
        this.instance = false;
    }
}

export class D3SimulationLink implements d3_force.SimulationLinkDatum<D3SimulationNode> {
    source: D3SimulationNode | string | number;
    target: D3SimulationNode | string | number;

    predicate: string;
    weight: number;

    // optional properties from d3.SimulationLinkDatum
    index?: number;

    // set default values
    //  source: predNode, target: objNode, predicate: blankLabel, weight: 1
    constructor(
        source: D3SimulationNode | string | number,
        target: D3SimulationNode | string | number,
        predicate: string,
        weight: number
    ) {
        this.source = source;
        this.target = target;
        this.predicate = predicate;
        this.weight = weight;
    }
}

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

export interface D3Simulation extends d3_force.Simulation<D3SimulationNode, D3SimulationLink> {}

export interface D3Selection extends d3_selection.Selection<any, any, any, any> {}

@Component({
    selector: 'awg-sparql-graph',
    templateUrl: './sparql-graph.component.html',
    styleUrls: ['./sparql-graph.component.css']
})
export class SparqlGraphComponent implements OnInit, OnChanges {
    @Input() queryResultTriples: Triple[];
    @Input() height: number;
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
                this.divWidth = graphContainerElement.clientWidth;
            }

            this.divHeight = this.fullScreen ? graphContainerElement.clientHeight : this.height;

            // Redraw
            d3_selection.selectAll('svg').remove();
            this.redraw();
        }
    }

    // Resize on scroll
    @HostListener('mousewheel', ['$event']) onScroll(ev) {
        const delta = Math.max(-1, Math.min(1, ev.wheelDelta || -ev.detail));
        if (delta > 0) {
            console.log('zoom in');
        } else if (delta < 0) {
            console.log('zoom out');
        }
    }

    constructor(private prefixPipe: PrefixPipe) {}

    ngOnInit() {
        if (this.queryResultTriples) {
            // set initial height
            if (this.height) {
                this.divHeight = this.height;
            } else {
                this.divHeight = this.getContainerHeight() ? this.getContainerHeight() : 500;
            }
            this.createSVG();
            this.redraw();
        }

        this.getContainerHeight();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.queryResultTriples.currentValue && !changes.queryResultTriples.isFirstChange()) {
            this.queryResultTriples = changes.queryResultTriples.currentValue;
            this.redraw();
        }
    }

    getContainerHeight(): number {
        if (!this.graphContainer || !this.graphContainer.nativeElement) {
            return null;
        }
        return this.graphContainer.nativeElement.clientHeight;
    }

    redraw(): void {
        this.cleanSVG();
        this.attachData();
    }

    attachData(): void {
        // Limit result length
        const limit: number = parseInt(this.limit, 10);
        const triples: Triple[] = this.limitTriples(this.queryResultTriples, limit);

        // If type of triples is text/turtle (not array)
        // the triples must be parsed to objects instead
        if (typeof triples === 'string') {
            this.parseTriples(triples).then(d => {
                const abrTriples = this.abbreviateTriples(d);
                this.simulationData = this.triplesToD3GraphData(abrTriples);

                this.setupForceSimulation();
                this.updateChart();
            });
        } else {
            this.simulationData = this.triplesToD3GraphData(triples);

            console.log('GOT array triples', triples);
            console.log('simulationData', this.simulationData);

            this.setupForceSimulation();
            this.updateChart();
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
        const graphContainerElement = this.graphContainer.nativeElement;

        // Get container width & height
        this.divWidth = this.divWidth || graphContainerElement.clientWidth;
        this.divHeight = this.divHeight || graphContainerElement.clientHeight;

        this.svg = d3_selection
            .select(graphContainerElement)
            .append('svg')
            .attr('width', this.divWidth)
            .attr('height', this.divHeight);
    }

    setupForceSimulation() {
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
            .distance(50);

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
        // this.forceSimulation.restart();
    }

    updateChart(): void {
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
            .data(this.filterNodesByType(this.simulationData.nodes, NodeType.node))
            .enter()
            .append('text')
            .attr('class', 'node-text')
            .text((d: D3SimulationNode) => d.label);

        // ==================== Add Node =====================
        const nodes: D3Selection = this.zoomGroup
            .selectAll('.node')
            .data(this.filterNodesByType(this.simulationData.nodes, NodeType.node))
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

    clickedOnNode(d: D3SimulationNode): void {
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

    private zoomHandler(zoomArea: any, svg: any) {
        // zoom actions is a function that performs the zooming.
        const zoomActions = () => {
            zoomArea.attr('transform', d3_selection.event.transform);
        };

        // apply zoom handler
        svg.call(d3_zoom.zoom().on('zoom', zoomActions));
    }

    private updateNodePositions(nodes: D3Selection): void {
        // constrains the nodes to be within a box
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
            );
    }

    private updateNodeTextPositions(nodeTexts: D3Selection): void {
        // constrains the nodes to be within a box
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

    private filterNodesById(nodes: D3SimulationNode[], id: string): D3SimulationNode {
        return nodes.filter(node => node.id === id)[0];
    }

    private filterNodesByType(nodes: D3SimulationNode[], type: NodeType): D3SimulationNode[] {
        return nodes.filter(node => node.type === type);
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

    private triplesToD3GraphData(triples: Triple[]): D3SimulationData {
        if (!triples) {
            return;
        }

        // Graph
        const graphData: D3SimulationData = new D3SimulationData();

        // Initial Graph from triples
        triples.map((triple: Triple) => {
            console.warn('------ TRIPLE ------ ');
            this.log('triple', triple);

            const subjId = this.prefixPipe.transform(PrefixForm.short, triple.subject);
            const predId = this.prefixPipe.transform(PrefixForm.short, triple.predicate);
            let objId = this.prefixPipe.transform(PrefixForm.short, triple.object);

            // check if object is number & round decimal numbers to 2 decimals
            if (!isNaN(objId)) {
                objId = Number(objId) % 1 === 0 ? String(Number(objId)) : String(Number(objId).toFixed(2));
            }

            const predNode: D3SimulationNode = new D3SimulationNode(predId, 1, NodeType.link);
            graphData.nodes.push(predNode);

            let subjNode: D3SimulationNode = this.filterNodesById(graphData.nodes, subjId);
            let objNode: D3SimulationNode = this.filterNodesById(graphData.nodes, objId);

            this.log('filtered known subjNode', subjNode);
            this.log('filtered known objNode', objNode);

            if (subjNode == null) {
                subjNode = new D3SimulationNode(subjId, 1, NodeType.node);

                graphData.nodes.push(subjNode);
            }

            if (objNode == null) {
                objNode = new D3SimulationNode(objId, 1, NodeType.node);

                graphData.nodes.push(objNode);
            }

            // check if predicate is "rdf:type"
            // then subjNode is an instance and objNode is a Class
            if (subjNode.instance === false) {
                subjNode.instance = this.checkForRdfType(predNode);
                this.log('checked subj for rdf:type', subjNode.instance);
            }
            if (objNode.owlClass === false) {
                objNode.owlClass = this.checkForRdfType(predNode);
                this.log('checked obj for rdf:type', objNode.owlClass);
            }

            const blankLabel = '';

            graphData.links.push(new D3SimulationLink(subjNode, predNode, blankLabel, 1));
            graphData.links.push(new D3SimulationLink(predNode, objNode, blankLabel, 1));

            graphData.nodeTriples.push(new D3SimulationNodeTriple(subjNode, predNode, objNode));

            console.log('------ / END ------ ');
        });

        console.log(graphData.nodes);

        return graphData;
    }

    private checkForRdfType(predNode: D3SimulationNode): boolean {
        console.warn(this.prefixPipe.transform(PrefixForm.long, 'rdf:type'));

        return (
            // rdf:type
            predNode.label === 'a' ||
            predNode.label === 'rdf:type' ||
            predNode.label === this.prefixPipe.transform(PrefixForm.long, 'rdf:type')
        );
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

    private abbreviateTriples(data): Triple[] {
        const prefixes = data.prefixes;
        const triples = [];

        function abbreviate(foi) {
            let newVal = null;
            // If FoI has 'http' in its name, continue
            if (foi.indexOf('http') !== -1) {
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
        console.log(triples);
        return triples;
    }

    log(messageString: string, messageValue: any): void {
        const value = messageValue ? JSON.parse(JSON.stringify(messageValue)) : messageValue;
        console.log(messageString, value);
    }
}
