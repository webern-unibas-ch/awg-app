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

import { SimplePrefixPipe } from '../prefix-simple-pipe/prefix-simple.pipe';
import { Triple } from '@awg-views/edition-view/edition-outlets/edition-graph/edition-graph.service';

import * as d3 from 'd3';
import * as N3 from 'n3';

export enum NodeType {
    link = 'link',
    node = 'node'
}

export interface INode {
    id: string;
    label: string;
    weight: number;
    type: NodeType;
    owlClass?: boolean;
    instance?: boolean;
    // instSpace?: boolean; //MB
    // instSpaceType?: boolean; //MB
}

export interface ILink {
    source: INode;
    target: INode;
    predicate: string;
    weight: number;
}

export interface INodeTriple {
    nodeSubject: INode;
    nodePredicate: INode;
    nodeObject: INode;
}

export interface ID3Graph {
    nodes: INode[];
    links: ILink[];
    nodeTriples: INodeTriple[];
}

export class Node implements INode {
    id: string;
    label: string;
    weight: number;
    type: NodeType;
    owlClass?: boolean;
    instance?: boolean;

    constructor(id: string, weight: number, type: NodeType) {
        this.id = id;
        this.label = id;
        this.weight = weight;
        this.type = type;
    }
}

export class Link implements ILink {
    source: Node;
    target: Node;
    predicate: string;
    weight: number;
}

export class NodeTriple implements INodeTriple {
    nodeSubject: Node;
    nodePredicate: Node;
    nodeObject: Node;
}

export class D3GraphData implements ID3Graph {
    nodes: Node[];
    links: Link[];
    nodeTriples: NodeTriple[];
}

@Component({
    selector: 'awg-sparql-graph',
    templateUrl: './sparql-graph.component.html',
    styleUrls: ['./sparql-graph.component.css']
})
export class SparqlGraphComponent implements OnInit, OnChanges {
    @Input() queryResultTriples: Triple[];
    @Input() height: number;
    @Output() clickedURI = new EventEmitter<string>();

    @ViewChild('graph', { static: true }) private graphContainer: ElementRef;

    d3GraphData: D3GraphData;
    private svg;
    private force;

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
            d3.selectAll('svg').remove();
            this.createChart();
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

    constructor(private prefixSimplePipe: SimplePrefixPipe) {}

    ngOnInit() {
        if (this.queryResultTriples) {
            // set initial height
            if (this.height) {
                this.divHeight = this.height;
            } else {
                this.divHeight = this.getContainerHeight() ? this.getContainerHeight() : 500;
            }
            this.createChart();
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

    redraw() {
        this.cleanGraph();
        this.attachData();
    }

    attachData() {
        // set size of force
        this.force = d3.layout.force().size([this.divWidth, this.divHeight]);

        console.log('force', this.force);

        // Limit result length
        const limit: number = parseInt(this.limit, 10);
        const triples: Triple[] = this.limitTriples(this.queryResultTriples, limit);

        // If type of triples is text/turtle (not array)
        // the triples must be parsed to objects instead
        if (typeof triples === 'string') {
            this.parseTriples(triples).then(d => {
                const abrTriples = this.abbreviateTriples(d);
                this.d3GraphData = this.triplesToD3GraphData(abrTriples);
                this.updateChart();
            });
        } else {
            console.log('GOT array triples', triples);
            this.d3GraphData = this.triplesToD3GraphData(triples);
            console.log('d3GraphData', this.d3GraphData);
            this.updateChart();
        }
    }

    clickedOnNode(d) {
        if (d3.event.defaultPrevented) {
            return;
        } // dragged

        this.clickedURI.emit(d);
    }

    createChart(): void {
        if (!this.graphContainer) {
            return;
        }
        const graphContainerElement = this.graphContainer.nativeElement;

        // Get container width & height
        this.divWidth = this.divWidth || graphContainerElement.clientWidth;
        this.divHeight = this.divHeight || graphContainerElement.clientHeight;

        this.svg = d3
            .select(graphContainerElement)
            .append('svg')
            .attr('width', this.divWidth)
            .attr('height', this.divHeight);

        this.attachData();
    }

    cleanGraph() {
        // Remove everything below the SVG element
        d3.selectAll('svg > *').remove();
    }

    updateChart() {
        if (!this.svg) {
            return;
        }

        // ==================== Add Marker ====================
        this.svg
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
        const links = this.svg
            .selectAll('.link')
            .data(this.d3GraphData.nodeTriples)
            .enter()
            .append('path')
            .attr('marker-end', 'url(#end)')
            .attr('class', 'link');

        // ==================== Add Link Names =====================
        const linkTexts = this.svg
            .selectAll('.link-text')
            .data(this.d3GraphData.nodeTriples)
            .enter()
            .append('text')
            .attr('class', 'link-text')
            .text(d => d.nodePredicate.label);

        // ==================== Add Node Names =====================
        const nodeTexts = this.svg
            .selectAll('.node-text')
            .data(this.filterNodesByType(this.d3GraphData.nodes, NodeType.node))
            .enter()
            .append('text')
            .attr('class', 'node-text')
            .text(d => d.label);

        // ==================== Add Node =====================
        const nodes = this.svg
            .selectAll('.node')
            .data(this.filterNodesByType(this.d3GraphData.nodes, NodeType.node))
            .enter()
            .append('circle')
            // .attr("class", "node")
            .attr('class', d => {
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
            .attr('id', d => d.label)
            .attr('r', d => {
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
            .on('click', d => {
                this.clickedOnNode(d);
            })
            .call(this.force.drag); // nodes

        // ==================== When dragging ====================
        this.force.on('tick', () => {
            nodes.attr('cx', d => d.x).attr('cy', d => d.y);

            links.attr(
                'd',
                d =>
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

            nodeTexts.attr('x', d => d.x + 12).attr('y', d => d.y + 3);

            linkTexts
                .attr('x', d => 4 + (d.nodeSubject.x + d.nodePredicate.x + d.nodeObject.x) / 3)
                .attr('y', d => 4 + (d.nodeSubject.y + d.nodePredicate.y + d.nodeObject.y) / 3);
        });

        // ==================== Run ====================
        this.force
            .nodes(this.d3GraphData.nodes)
            .links(this.d3GraphData.links)
            .charge(-500)
            .linkDistance(50)
            .start();
    }

    private filterNodesById(nodes: Node[], id: string) {
        return nodes.filter(node => node.id === id);
    }

    private filterNodesByType(nodes: Node[], type: NodeType) {
        return nodes.filter(node => node.type === type);
    }

    private limitTriples(triples: Triple[], limit) {
        if (!triples) {
            return [];
        }
        if (triples.length > limit) {
            return triples.slice(0, limit);
        } else {
            return triples;
        }
    }

    private triplesToD3GraphData(triples) {
        if (!triples) {
            return;
        }

        // Graph
        const graph: D3GraphData = { nodes: [], links: [], nodeTriples: [] };

        // Initial Graph from triples
        triples.map(triple => {
            const subjId = this.prefixSimplePipe.transform(triple.subject);
            const predId = this.prefixSimplePipe.transform(triple.predicate);
            let objId = this.prefixSimplePipe.transform(triple.object);

            // check if object is number & round decimal numbers to 2 decimals
            if (!isNaN(objId)) {
                objId = Number(objId) % 1 === 0 ? String(Number(objId)) : String(Number(objId).toFixed(2));
            }

            const predNode: Node = new Node(predId, 1, NodeType.link);
            graph.nodes.push(predNode);

            let subjNode: Node = this.filterNodesById(graph.nodes, subjId)[0];
            let objNode: Node = this.filterNodesById(graph.nodes, objId)[0];

            if (subjNode == null) {
                subjNode = new Node(subjId, 1, NodeType.node);
                // MB: here I made some mistake. The objNode.label cannot be found as it is only introduced in the next if
                // if(objNode.label == "bot:Space"){subjNode.instSpace = true} //MB
                // else if(objNode.label == "prop:SpaceType"){subjNode.instSpaceType = true} //MB
                // else{} //MB
                graph.nodes.push(subjNode);
            }

            if (objNode == null) {
                objNode = new Node(objId, 1, NodeType.node);
                // If the predicate is rdf:type, the node is an OWL Class
                // Then the domain is an instance
                if (
                    predNode.label === 'rdf:type' ||
                    predNode.label === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
                ) {
                    objNode.owlClass = true;
                    subjNode.instance = true;
                }
                graph.nodes.push(objNode);
            }

            const blankLabel = '';

            graph.links.push({ source: subjNode, target: predNode, predicate: blankLabel, weight: 1 });
            graph.links.push({ source: predNode, target: objNode, predicate: blankLabel, weight: 1 });

            graph.nodeTriples.push({ nodeSubject: subjNode, nodePredicate: predNode, nodeObject: objNode });
        });

        console.log(graph.nodes);

        return graph;
    }

    private parseTriples(triples) {
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

    private abbreviateTriples(data) {
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

        data.triples.forEach(triple => {
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
}
