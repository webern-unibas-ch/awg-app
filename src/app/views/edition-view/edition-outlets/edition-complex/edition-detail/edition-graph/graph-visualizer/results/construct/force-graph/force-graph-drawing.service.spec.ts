import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import * as D3_FORCE from 'd3-force';
import * as D3_SELECTION from 'd3-selection';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';

import { GraphData, GraphNode } from '../../../models/graph-data.model';
import { FORCE_GRAPH_ARROW_MARKER_ID, ForceGraphDrawingService } from './force-graph-drawing.service';
import { ForceSimulation, SimLink, SimNode, SimulationData } from './force-graph.model';
import { FORCE_GRAPH_UTILS } from './force-graph.utils';

describe('ForceGraphDrawingService (DONE)', () => {
    let forceGraphDrawingService: ForceGraphDrawingService;

    let rootGroupSelection: D3Selection;
    let simulation: ForceSimulation | undefined;

    const expectedNodes: GraphNode[] = [
        { id: 'a', shortName: 'awg:a', label: 'A', kind: 'instance' },
        { id: 'b', shortName: 'awg:B', label: 'awg:B', kind: 'class' },
        { id: '_:c', shortName: '_:c', label: '_:c', kind: 'blank' },
        { id: '"x"', shortName: 'x', label: 'x', kind: 'literal' },
    ];
    const expectedGraphData: GraphData = {
        nodes: expectedNodes,
        edges: [
            { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
            { id: 'e1', source: 'a', target: '_:c', label: 'awg:has' },
            { id: 'e2', source: '_:c', target: '"x"', label: 'awg:value' },
        ],
        tripleCount: 3,
    };

    let expectedSimulationData: SimulationData;

    /**
     * Renders the given simulation data into the root group and keeps the simulation (stopped in afterEach).
     */
    const render = (simulationData: SimulationData = expectedSimulationData): ForceSimulation => {
        simulation = forceGraphDrawingService.renderGraph(rootGroupSelection, simulationData);
        return simulation;
    };

    const getElements = <T extends Element>(selector: string): T[] =>
        Array.from(rootGroupSelection.node().querySelectorAll(selector));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ForceGraphDrawingService],
        });

        forceGraphDrawingService = TestBed.inject(ForceGraphDrawingService);

        // Test data
        rootGroupSelection = D3_SELECTION.create('svg').append('g') as unknown as D3Selection;
        expectedSimulationData = FORCE_GRAPH_UTILS.toSimulationData(expectedGraphData);
    });

    afterEach(() => {
        simulation?.stop();
        simulation = undefined;
    });

    it('... should inject', () => {
        expect(forceGraphDrawingService).toBeTruthy();
    });

    it('... should have `FORCE_GRAPH_ARROW_MARKER_ID`', () => {
        expectToBe(FORCE_GRAPH_ARROW_MARKER_ID, 'awg-force-graph-arrow');
    });

    describe('#renderGraph()', () => {
        it('... should have a method `renderGraph`', () => {
            expect(forceGraphDrawingService.renderGraph).toBeDefined();
        });

        describe('... root group', () => {
            it('... should remove the existing content of the root group but keep the root group itself', () => {
                rootGroupSelection.append('rect').attr('class', 'old-content');

                render();

                expectToBe(getElements('.old-content').length, 0);
                expectToBe(rootGroupSelection.node().parentNode.tagName, 'svg');
            });

            it('... should draw the groups of links, link texts, node texts and nodes in this order', () => {
                render();

                const groupClasses = Array.from<Element>(rootGroupSelection.node().children).map(el =>
                    el.getAttribute('class')
                );

                expectToEqual(groupClasses, ['links', 'link-texts', 'node-texts', 'nodes']);
            });

            it('... should redraw the groups only once on repeated renderings', () => {
                render().stop();
                render();

                expectToBe(rootGroupSelection.node().children.length, 4);
            });
        });

        describe('... links', () => {
            it('... should draw one path with arrow marker per edge', () => {
                render();

                const linkEls = getElements<SVGPathElement>('g.links > path.link');

                expectToBe(linkEls.length, expectedGraphData.edges.length);
                linkEls.forEach(el => {
                    expectToBe(el.getAttribute('marker-end'), `url(#${FORCE_GRAPH_ARROW_MARKER_ID})`);
                });
            });

            it('... should label each edge with its label', () => {
                render();

                const linkTextEls = getElements<SVGTextElement>('g.link-texts > text.link-text');

                expectToEqual(
                    linkTextEls.map(el => el.textContent),
                    ['rdf:type', 'awg:has', 'awg:value']
                );
            });
        });

        describe('... nodes', () => {
            it('... should draw one circle per graph node (without the middle nodes of the edges)', () => {
                render();

                expectToBe(getElements('g.nodes > circle').length, expectedNodes.length);
            });

            it('... should set css class, id and radius of the circles by their graph nodes', () => {
                render();

                const circleEls = getElements<SVGCircleElement>('g.nodes > circle');

                expectToEqual(
                    circleEls.map(el => [el.getAttribute('class'), el.getAttribute('id'), el.getAttribute('r')]),
                    [
                        ['instance', 'A', '11'],
                        ['class', 'awg:B', '10'],
                        ['blank', '_:c', '8'],
                        ['node', 'x', '9'],
                    ]
                );
            });

            it('... should label the nodes with their short name', () => {
                render();

                const nodeTextEls = getElements<SVGTextElement>('g.node-texts > text.node-text');

                expectToEqual(
                    nodeTextEls.map(el => el.textContent),
                    expectedNodes.map(node => node.shortName)
                );
            });

            it('... should make the circles draggable', () => {
                render();

                const nodesSelection = rootGroupSelection.selectAll('g.nodes > circle');

                expect(nodesSelection.on('mousedown.drag')).toBeDefined();
                expect(nodesSelection.on('touchstart.drag')).toBeDefined();
            });

            it('... should not bind a click listener to the circles (clicks are delegated)', () => {
                render();

                expect(rootGroupSelection.selectAll('g.nodes > circle').on('click')).toBeUndefined();
            });
        });

        describe('... simulation', () => {
            it('... should create a force simulation of all simulation nodes (incl. middle nodes)', () => {
                const result = render();

                expectToBe(result.nodes(), expectedSimulationData.nodes);
            });

            it('... should have a link force with the simulation links', () => {
                const result = render();

                const linkForce = result.force('links') as D3_FORCE.ForceLink<SimNode, SimLink>;

                expectToBe(linkForce.links(), expectedSimulationData.links);
            });

            it('... should have a center force at the origin', () => {
                const result = render();

                const centerForce = result.force('center_force') as D3_FORCE.ForceCenter<SimNode>;

                expectToBe(centerForce.x(), 0);
                expectToBe(centerForce.y(), 0);
            });

            it('... should have charge and collide forces', () => {
                const result = render();

                expect(result.force('charge_force')).toBeDefined();
                expect(result.force('collide_force')).toBeDefined();
            });

            it('... should update the positions of nodes, node texts, links and link texts on tick', () => {
                const result = render();
                result.stop();
                result.tick(10);

                result.on('tick')?.call(result);

                const [firstNode] = expectedSimulationData.nodes;
                const [firstEdge] = expectedSimulationData.edges;
                const expectedLabelPosition = FORCE_GRAPH_UTILS.linkLabelPosition(firstEdge);

                const circleEl = getElements('g.nodes > circle')[0];
                const nodeTextEl = getElements('g.node-texts > text')[0];
                const linkEl = getElements('g.links > path')[0];
                const linkTextEl = getElements('g.link-texts > text')[0];

                expectToBe(circleEl.getAttribute('cx'), String(firstNode.x));
                expectToBe(circleEl.getAttribute('cy'), String(firstNode.y));
                expectToBe(nodeTextEl.getAttribute('x'), String((firstNode.x ?? 0) + 12));
                expectToBe(nodeTextEl.getAttribute('y'), String((firstNode.y ?? 0) + 3));
                expectToBe(linkEl.getAttribute('d'), FORCE_GRAPH_UTILS.linkPath(firstEdge));
                expectToBe(linkTextEl.getAttribute('x'), String(expectedLabelPosition.x));
                expectToBe(linkTextEl.getAttribute('y'), String(expectedLabelPosition.y));
            });
        });
    });

    describe('#getGraphNode()', () => {
        beforeEach(() => {
            render();
        });

        it('... should have a method `getGraphNode`', () => {
            expect(forceGraphDrawingService.getGraphNode).toBeDefined();
        });

        it('... should get the graph node of a drawn circle', () => {
            const circleEls = getElements('g.nodes > circle');

            expectToEqual(
                circleEls.map(el => forceGraphDrawingService.getGraphNode(el)),
                expectedNodes
            );
        });

        it('... should get undefined for other drawn elements', () => {
            const otherEls = [
                getElements('g.links > path')[0],
                getElements('g.node-texts > text')[0],
                getElements('g.nodes')[0],
                rootGroupSelection.node(),
            ];

            otherEls.forEach(el => {
                expect(forceGraphDrawingService.getGraphNode(el)).toBeUndefined();
            });
        });

        it('... should get undefined for a circle without bound data', () => {
            const circleEl = D3_SELECTION.create('svg').append('g').attr('class', 'nodes').append('circle').node();

            expect(forceGraphDrawingService.getGraphNode(circleEl)).toBeUndefined();
        });

        it('... should get undefined for null or non-element targets', () => {
            expect(forceGraphDrawingService.getGraphNode(null)).toBeUndefined();
            expect(forceGraphDrawingService.getGraphNode(window)).toBeUndefined();
        });
    });
});
