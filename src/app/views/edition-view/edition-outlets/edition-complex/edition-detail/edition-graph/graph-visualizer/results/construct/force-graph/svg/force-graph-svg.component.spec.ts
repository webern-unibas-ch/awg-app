import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { patchSvgSizeForD3Zoom } from '@testing/svg-drawing-helper';

import { SvgZoomDirective } from '@awg-shared/zoom/svg-zoom.directive';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';
import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';

import { ResultGraph, ResultGraphNode } from '../../../../models/result-graph.model';
import { FORCE_GRAPH_ARROW_MARKER_ID, ForceGraphDrawingService } from '../force-graph-drawing.service';
import { ForceSimulation } from '../force-graph.model';
import { FORCE_GRAPH_UTILS } from '../force-graph.utils';

import { ForceGraphSvgComponent } from './force-graph-svg.component';

describe('ForceGraphSvgComponent (DONE)', () => {
    let component: ForceGraphSvgComponent;
    let fixture: ComponentFixture<ForceGraphSvgComponent>;
    let compDe: DebugElement;

    let mockForceGraphDrawingService: {
        renderGraph: Mock<ForceGraphDrawingService['renderGraph']>;
        getGraphNode: Mock<ForceGraphDrawingService['getGraphNode']>;
    };
    let mockSimulations: { stop: Mock<() => void> }[];

    let clickedNodeRequestSpy: Mock<(node: ResultGraphNode) => void>;

    let expectedZoomConfig: ZoomConfig;
    let expectedResultGraph: ResultGraph;
    let expectedNextResultGraph: ResultGraph;

    const expectedNodes: ResultGraphNode[] = [
        { id: 'a', shortName: 'awg:a', label: 'A', kind: 'instance' },
        { id: 'b', shortName: 'awg:B', label: 'awg:B', kind: 'class' },
        { id: '_:c', shortName: '_:c', label: '_:c', kind: 'blank' },
    ];

    const getSvgEl = (): SVGSVGElement =>
        getAndExpectDebugElementByCss(compDe, 'svg.awg-force-graph-svg', 1, 1)[0].nativeElement;
    const getZoomGroupEl = (): SVGGElement =>
        getAndExpectDebugElementByCss(compDe, 'g.awg-force-graph-svg-zoom-group', 1, 1)[0].nativeElement;
    const getCenterGroupEl = (): SVGGElement =>
        getAndExpectDebugElementByCss(compDe, 'g.awg-force-graph-svg-center-group', 1, 1)[0].nativeElement;
    const getRootGroupEl = (): SVGGElement =>
        getAndExpectDebugElementByCss(compDe, 'g.awg-force-graph-svg-root-group', 1, 1)[0].nativeElement;

    const setInputs = (resultGraph: ResultGraph): void => {
        fixture.componentRef.setInput('resultGraph', resultGraph);
        fixture.componentRef.setInput('zoomConfig', expectedZoomConfig);
        fixture.componentRef.setInput('zoomValue', expectedZoomConfig.initial);
    };
    const setSvgClientSize = (width: number, height: number): void => {
        Object.defineProperty(getSvgEl(), 'clientWidth', { configurable: true, value: width });
        Object.defineProperty(getSvgEl(), 'clientHeight', { configurable: true, value: height });
    };

    beforeAll(() => {
        // Provide width/height.baseVal for d3-zoom (missing in jsdom)
        patchSvgSizeForD3Zoom();
    });

    beforeEach(async () => {
        mockSimulations = [];
        mockForceGraphDrawingService = {
            renderGraph: vi.fn(() => {
                const simulation = { stop: vi.fn() };
                mockSimulations.push(simulation);
                return simulation as unknown as ForceSimulation;
            }),
            getGraphNode: vi.fn(() => undefined),
        };

        await TestBed.configureTestingModule({
            imports: [ForceGraphSvgComponent],
            providers: [{ provide: ForceGraphDrawingService, useValue: mockForceGraphDrawingService }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 3, 0.01);
        expectedResultGraph = {
            nodes: expectedNodes,
            edges: [
                { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
                { id: 'e1', source: 'a', target: '_:c', label: 'awg:has' },
            ],
            tripleCount: 2,
        };
        expectedNextResultGraph = {
            nodes: expectedNodes.slice(0, 2),
            edges: expectedResultGraph.edges.slice(0, 1),
            tripleCount: 1,
        };

        // Create component fixture
        fixture = TestBed.createComponent(ForceGraphSvgComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        clickedNodeRequestSpy = vi.fn();
        component.clickedNodeRequest.subscribe(clickedNodeRequestSpy);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `resultGraph`', () => {
            expectToBe(isSignal(component.resultGraph), true);

            expect(() => component.resultGraph()).toThrow();
        });

        it('... should throw due to missing required input signal `zoomConfig`', () => {
            expectToBe(isSignal(component.zoomConfig), true);

            expect(() => component.zoomConfig()).toThrow();
        });

        it('... should throw due to missing required model signal `zoomValue`', () => {
            expectToBe(isSignal(component.zoomValue), true);

            expect(() => component.zoomValue()).toThrow();
        });

        it('... should have `arrowMarkerId`', () => {
            expectToBe(component.arrowMarkerId, FORCE_GRAPH_ARROW_MARKER_ID);
        });

        it('... should have signal `svgSize` to hold an empty size', () => {
            expectToEqual(component.svgSize(), { width: 0, height: 0 });
        });

        it('... should have computed signal `centerTransform` to hold a translation to the origin', () => {
            expectToBe(component.centerTransform(), 'translate(0,0)');
        });

        it('... should not have rendered a graph yet', () => {
            expectSpyCall(mockForceGraphDrawingService.renderGraph, 0);
        });

        describe('VIEW', () => {
            it('... should contain one svg with one SvgZoomDirective', () => {
                const svgDes = getAndExpectDebugElementByCss(compDe, 'svg.awg-force-graph-svg', 1, 1);
                const svgZoomDes = getAndExpectDebugElementByDirective(compDe, SvgZoomDirective, 1, 1);

                expectToBe(svgZoomDes[0].nativeElement, svgDes[0].nativeElement);
            });

            it('... should contain one arrow marker with a polyline in svg > defs', () => {
                const markerDes = getAndExpectDebugElementByCss(compDe, 'svg > defs > marker', 1, 1);

                getAndExpectDebugElementByCss(markerDes[0], 'polyline', 1, 1);
            });

            it('... should contain the root group within the center group within the zoom group', () => {
                expectToBe(getRootGroupEl().parentNode, getCenterGroupEl());
                expectToBe(getCenterGroupEl().parentNode, getZoomGroupEl());
                expectToBe(getZoomGroupEl().parentNode, getSvgEl());
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            setInputs(expectedResultGraph);
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `resultGraph` to hold the provided graph data', () => {
            expectToEqual(component.resultGraph(), expectedResultGraph);
        });

        it('... should have input signal `zoomConfig` to hold the provided zoom config', () => {
            expectToEqual(component.zoomConfig(), expectedZoomConfig);
        });

        it('... should have model signal `zoomValue` to hold the provided zoom value', () => {
            expectToBe(component.zoomValue(), expectedZoomConfig.initial);
        });

        it('... should have computed signal `ariaLabel` to hold the number of nodes and edges', () => {
            expectToBe(
                component.ariaLabel(),
                'Graph mit 3 Knoten und 2 Kanten. Eine textuelle Darstellung bieten die RDF-Triples und die Tabellenansicht von SPARQL-SELECT-Abfragen.'
            );
        });

        it('... should have computed signal `simulationData` to hold the simulation data of the graph data', () => {
            expectToEqual(component.simulationData(), FORCE_GRAPH_UTILS.toSimulationData(expectedResultGraph));
        });

        it('... should have view child signals for svg element, root group and svg zoom', () => {
            const svgDe = getAndExpectDebugElementByCss(compDe, 'svg.awg-force-graph-svg', 1, 1)[0];

            expectToBe(component.svg().nativeElement, svgDe.nativeElement);
            expectToBe(component.svgRootGroup().nativeElement, getRootGroupEl());
            expectToBe(component.svgZoom(), svgDe.injector.get(SvgZoomDirective));
        });

        describe('VIEW', () => {
            it('... should set the id of the arrow marker', () => {
                const markerDes = getAndExpectDebugElementByCss(compDe, 'svg > defs > marker', 1, 1);

                expectToBe(markerDes[0].nativeElement.getAttribute('id'), FORCE_GRAPH_ARROW_MARKER_ID);
            });

            it('... should set role `group` and `ariaLabel` as aria-label on the svg', () => {
                expectToBe(getSvgEl().getAttribute('role'), 'group');
                expectToBe(getSvgEl().getAttribute('aria-label'), component.ariaLabel());
            });

            it('... should set the transform of the center group to `centerTransform`', () => {
                expectToBe(getCenterGroupEl().getAttribute('transform'), component.centerTransform());
            });

            it('... should pass down `zoomConfig`, `zoomTarget` and `zoomValue` to the SvgZoomDirective', () => {
                const svgZoom = component.svgZoom();

                expectToEqual(svgZoom.zoomConfig(), expectedZoomConfig);
                expectToBe(svgZoom.zoomTarget(), getZoomGroupEl());
                expectToBe(svgZoom.zoomValue(), expectedZoomConfig.initial);
            });

            it('... should sync `zoomValue` with the SvgZoomDirective', async () => {
                component.svgZoom().zoomValue.set(2);
                await detectChangesOnPush(fixture);

                expectToBe(component.zoomValue(), 2);
            });

            it('... should trigger `onNodeSelect` on a click on the svg', () => {
                const onNodeSelectSpy = vi.spyOn(component, 'onNodeSelect');
                const event = new MouseEvent('click', { bubbles: true });

                getRootGroupEl().dispatchEvent(event);

                expectSpyCall(onNodeSelectSpy, 1, event);
            });

            it('... should trigger `onResize` on a window resize', () => {
                const onResizeSpy = vi.spyOn(component, 'onResize');

                window.dispatchEvent(new Event('resize'));

                expectSpyCall(onResizeSpy, 1);
            });
        });

        describe('... rendering', () => {
            it('... should render the simulation data into the root group', () => {
                expectSpyCall(mockForceGraphDrawingService.renderGraph, 1);

                const [rootGroupSelection, simulationData] = mockForceGraphDrawingService.renderGraph.mock.calls[0];

                expectToBe((rootGroupSelection as D3Selection).node(), getRootGroupEl());
                expectToBe(simulationData, component.simulationData());
            });

            it('... should render again on a graph data change', async () => {
                fixture.componentRef.setInput('resultGraph', expectedNextResultGraph);
                await detectChangesOnPush(fixture);

                expectSpyCall(mockForceGraphDrawingService.renderGraph, 2);

                const [, simulationData] = mockForceGraphDrawingService.renderGraph.mock.calls[1];
                expectToEqual(simulationData, FORCE_GRAPH_UTILS.toSimulationData(expectedNextResultGraph));
            });

            it('... should stop the previous simulation on a graph data change', async () => {
                fixture.componentRef.setInput('resultGraph', expectedNextResultGraph);
                await detectChangesOnPush(fixture);

                expectSpyCall(mockSimulations[0].stop, 1);
                expectSpyCall(mockSimulations[1].stop, 0);
            });

            it('... should not render again without a graph data change', async () => {
                await detectChangesOnPush(fixture);

                expectSpyCall(mockForceGraphDrawingService.renderGraph, 1);
            });

            it('... should not render again on a resize', async () => {
                setSvgClientSize(800, 400);

                component.onResize();
                await detectChangesOnPush(fixture);

                expectSpyCall(mockForceGraphDrawingService.renderGraph, 1);
            });

            it('... should stop the simulation on destroy', () => {
                fixture.destroy();

                expectSpyCall(mockSimulations[0].stop, 1);
            });
        });

        describe('METHODS', () => {
            describe('#onNodeSelect()', () => {
                it('... should have a method `onNodeSelect`', () => {
                    expect(component.onNodeSelect).toBeDefined();
                });

                it('... should get the graph node of the event target from the ForceGraphDrawingService', () => {
                    const event = new MouseEvent('click', { bubbles: true });

                    getRootGroupEl().dispatchEvent(event);

                    expectSpyCall(mockForceGraphDrawingService.getGraphNode, 1, getRootGroupEl());
                });

                it('... should emit the graph node of the event target', () => {
                    mockForceGraphDrawingService.getGraphNode.mockReturnValue(expectedNodes[1]);

                    getRootGroupEl().dispatchEvent(new MouseEvent('click', { bubbles: true }));

                    expectSpyCall(clickedNodeRequestSpy, 1, expectedNodes[1]);
                });

                it('... should not emit without a graph node of the event target', () => {
                    getRootGroupEl().dispatchEvent(new MouseEvent('click', { bubbles: true }));

                    expectSpyCall(clickedNodeRequestSpy, 0);
                });
            });

            describe('#onResize()', () => {
                it('... should have a method `onResize`', () => {
                    expect(component.onResize).toBeDefined();
                });

                it('... should set `svgSize` to the client size of the svg', () => {
                    setSvgClientSize(800, 400);

                    component.onResize();

                    expectToEqual(component.svgSize(), { width: 800, height: 400 });
                });

                it('... should center the graph in the svg', async () => {
                    setSvgClientSize(800, 400);

                    component.onResize();
                    await detectChangesOnPush(fixture);

                    expectToBe(component.centerTransform(), 'translate(400,200)');
                    expectToBe(getCenterGroupEl().getAttribute('transform'), 'translate(400,200)');
                });
            });

            describe('#resetZoom()', () => {
                it('... should have a method `resetZoom`', () => {
                    expect(component.resetZoom).toBeDefined();
                });

                it('... should reset the zoom via the SvgZoomDirective', () => {
                    const resetSpy = vi.spyOn(component.svgZoom(), 'reset');

                    component.resetZoom();

                    expectSpyCall(resetSpy, 1);
                });
            });
        });
    });
});
