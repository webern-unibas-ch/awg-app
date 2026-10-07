import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { GraphData, GraphNode } from '../../../models/graph-data.model';
import { ForceGraphDrawingService } from './force-graph-drawing.service';
import { ForceSimulation } from './force-graph.model';
import { ForceGraphLimitComponent } from './limit/force-graph-limit.component';
import { ForceGraphSvgComponent } from './svg/force-graph-svg.component';

import { ForceGraphComponent } from './force-graph.component';

describe('ForceGraphComponent', () => {
    let component: ForceGraphComponent;
    let fixture: ComponentFixture<ForceGraphComponent>;
    let compDe: DebugElement;

    let onResetZoomSpy: Spy;

    let expectedZoomConfig: ZoomConfig;

    const nodes: GraphNode[] = [
        { id: 'a', shortName: 'awg:a', label: 'A', kind: 'instance' },
        { id: 'b', shortName: 'awg:B', label: 'awg:B', kind: 'class' },
        { id: '_:c', shortName: '_:c', label: '_:c', kind: 'blank' },
        { id: '"x"', shortName: 'x', label: 'x', kind: 'literal' },
    ];
    const graphData: GraphData = {
        nodes,
        edges: [
            { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
            { id: 'e1', source: 'a', target: '_:c', label: 'awg:has' },
            { id: 'e2', source: '_:c', target: '"x"', label: 'awg:value' },
        ],
        tripleCount: 3,
    };

    const getGraphLimitCmp = (): ForceGraphLimitComponent =>
        getAndExpectDebugElementByDirective(compDe, ForceGraphLimitComponent, 1, 1)[0].injector.get(
            ForceGraphLimitComponent
        );
    const getGraphSvgCmp = (): ForceGraphSvgComponent =>
        getAndExpectDebugElementByDirective(compDe, ForceGraphSvgComponent, 1, 1)[0].injector.get(
            ForceGraphSvgComponent
        );

    beforeAll(() => {
        // Patch SVGSVGElement prototype to provide width/height.baseVal for d3-zoom (missing in jsdom)
        if (typeof SVGSVGElement !== 'undefined') {
            if (!('width' in SVGSVGElement.prototype)) {
                Object.defineProperty(SVGSVGElement.prototype, 'width', {
                    configurable: true,
                    get() {
                        return { baseVal: { value: 100 } };
                    },
                });
            }
            if (!('height' in SVGSVGElement.prototype)) {
                Object.defineProperty(SVGSVGElement.prototype, 'height', {
                    configurable: true,
                    get() {
                        return { baseVal: { value: 100 } };
                    },
                });
            }
        }
    });

    beforeEach(async () => {
        // The ForceGraphSvgComponent renders into its own template (no hollow child possible), so mock the drawing
        const mockForceGraphDrawingService = {
            renderGraph: vi.fn(() => ({ stop: vi.fn() }) as unknown as ForceSimulation),
            getGraphNode: vi.fn(() => undefined),
        };

        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, ForceGraphLimitComponent, ForceGraphSvgComponent, SliderZoomComponent],
            declarations: [ForceGraphComponent],
            providers: [{ provide: ForceGraphDrawingService, useValue: mockForceGraphDrawingService }],
        })
            .overrideComponent(ForceGraphLimitComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ForceGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 3, 0.01);

        // Spies
        onResetZoomSpy = vi.spyOn(component, 'onResetZoom');
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `zoomConfig`', () => {
            expectToEqual(component.zoomConfig, expectedZoomConfig);
        });

        it('... should have signal `zoomValue` to hold the initial zoom value', () => {
            expectToBe(component.zoomValue(), expectedZoomConfig.initial);
        });

        it('... should have `limit`', () => {
            expectToBe(component.limit, 50);
        });

        it('... should not have `limitedGraphData`', () => {
            expect(component.limitedGraphData).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one SliderZoomComponent in div.awg-force-graph-icon-bar', () => {
                const iconBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-icon-bar', 1, 1);

                getAndExpectDebugElementByDirective(iconBarDes[0], SliderZoomComponent, 1, 1);
            });

            it('... should not contain the ForceGraphSvgComponent (with mocked drawing) yet', () => {
                getAndExpectDebugElementByDirective(compDe, ForceGraphSvgComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('graphData', graphData);
            fixture.componentRef.setInput('height', 500);
            fixture.detectChanges();
        });

        it('... should have `limitedGraphData` to hold the provided graph data (below the limit)', () => {
            expectToBe(component.limitedGraphData, graphData);
        });

        describe('VIEW', () => {
            it('... should set the height of the container', () => {
                const containerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-container', 1, 1);

                expectToBe(containerDes[0].nativeElement.style.height, '500px');
            });

            describe('... SliderZoomComponent', () => {
                it('... should pass down `zoomConfig` and `zoomValue` to the SliderZoomComponent', () => {
                    const sliderZoomDes = getAndExpectDebugElementByDirective(compDe, SliderZoomComponent, 1, 1);
                    const sliderZoomCmp = sliderZoomDes[0].injector.get(SliderZoomComponent);

                    expectToEqual(sliderZoomCmp.zoomConfig(), expectedZoomConfig);
                    expectToBe(sliderZoomCmp.zoomValue(), expectedZoomConfig.initial);
                });

                it('... should sync `zoomValue` on value change of the SliderZoomComponent', () => {
                    const rangeDes = getAndExpectDebugElementByCss(compDe, 'awg-slider-zoom input[type="range"]', 1, 1);
                    const rangeEl: HTMLInputElement = rangeDes[0].nativeElement;

                    rangeEl.value = '2.5';
                    rangeEl.dispatchEvent(new Event('input'));

                    expectToBe(component.zoomValue(), 2.5);
                });

                it('... should trigger `onResetZoom` on reset request of the SliderZoomComponent', async () => {
                    const buttonDes = getAndExpectDebugElementByCss(compDe, 'awg-slider-zoom button', 1, 1);

                    await clickAndAwaitChanges(buttonDes[0], fixture);

                    expectSpyCall(onResetZoomSpy, 1);
                });
            });

            describe('... ForceGraphSvgComponent (with mocked drawing)', () => {
                it('... should pass down `limitedGraphData`, `zoomConfig` and `zoomValue`', () => {
                    const graphSvgCmp = getGraphSvgCmp();

                    expectToBe(graphSvgCmp.graphData(), graphData);
                    expectToEqual(graphSvgCmp.zoomConfig(), expectedZoomConfig);
                    expectToBe(graphSvgCmp.zoomValue(), expectedZoomConfig.initial);
                });

                it('... should sync `zoomValue` from the ForceGraphSvgComponent', async () => {
                    getGraphSvgCmp().zoomValue.set(2);
                    await detectChangesOnPush(fixture);

                    expectToBe(component.zoomValue(), 2);
                });

                it('... should emit the clicked graph node of the ForceGraphSvgComponent', () => {
                    const emitSpy = vi.spyOn(component.clickedNodeRequest, 'emit');

                    getGraphSvgCmp().clickedNodeRequest.emit(nodes[0]);

                    expectSpyCall(emitSpy, 1, nodes[0]);
                });

                it('... should pass down the limited graph data after a limit change', async () => {
                    component.onLimitValueChange(1);
                    await detectChangesOnPush(fixture);

                    expectToEqual(getGraphSvgCmp().graphData(), {
                        nodes: nodes.slice(0, 2),
                        edges: graphData.edges.slice(0, 1),
                        tripleCount: 3,
                    });
                });
            });

            describe('... ForceGraphLimitComponent (hollow)', () => {
                it('... should contain one ForceGraphLimitComponent in div.awg-force-graph-icon-bar', () => {
                    const iconBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-icon-bar', 1, 1);

                    getAndExpectDebugElementByDirective(iconBarDes[0], ForceGraphLimitComponent, 1, 1);
                });

                it('... should pass down the triple count and `limit`', () => {
                    const graphLimitCmp = getGraphLimitCmp();

                    expectToBe(graphLimitCmp.tripleCount(), graphData.tripleCount);
                    expectToBe(graphLimitCmp.limit(), 50);
                });

                it('... should trigger `onLimitValueChange` on a limit change of the ForceGraphLimitComponent', () => {
                    const onLimitValueChangeSpy = vi.spyOn(component, 'onLimitValueChange');

                    getGraphLimitCmp().limit.set(2);

                    expectSpyCall(onLimitValueChangeSpy, 1, 2);
                });
            });
        });

        describe('METHODS', () => {
            describe('#ngOnChanges()', () => {
                it('... should have a method `ngOnChanges`', () => {
                    expect(component.ngOnChanges).toBeDefined();
                });

                it('... should limit the changed graph data', () => {
                    const nextGraphData: GraphData = { ...graphData, tripleCount: 60 };
                    component.limit = 1;

                    fixture.componentRef.setInput('graphData', nextGraphData);
                    fixture.detectChanges();

                    expectToEqual(component.limitedGraphData, {
                        nodes: nodes.slice(0, 2),
                        edges: graphData.edges.slice(0, 1),
                        tripleCount: 60,
                    });
                });
            });

            describe('#onLimitValueChange()', () => {
                it('... should have a method `onLimitValueChange`', () => {
                    expect(component.onLimitValueChange).toBeDefined();
                });

                it('... should set `limit` and limit the graph data', () => {
                    component.onLimitValueChange(2);

                    expectToBe(component.limit, 2);
                    expectToEqual(component.limitedGraphData?.edges, graphData.edges.slice(0, 2));
                });
            });

            describe('#onResetZoom()', () => {
                it('... should have a method `onResetZoom`', () => {
                    expect(component.onResetZoom).toBeDefined();
                });

                it('... should reset the zoom via the ForceGraphSvgComponent', () => {
                    const resetZoomSpy = vi.spyOn(getGraphSvgCmp(), 'resetZoom').mockImplementation(() => undefined);

                    component.onResetZoom();

                    expectSpyCall(resetZoomSpy, 1);
                });
            });
        });
    });
});
