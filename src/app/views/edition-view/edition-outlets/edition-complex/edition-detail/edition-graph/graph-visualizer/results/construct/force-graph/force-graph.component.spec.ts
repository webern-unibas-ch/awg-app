import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { NEVER } from 'rxjs';

import { createFakeCanvasContext } from '@testing/canvas-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { stubResizeObserver } from '@testing/svg-drawing-helper';

import { ZoomSliderComponent } from '@awg-shared/zoom/zoom-slider.component';
import { ZoomConfig } from '@awg-shared/zoom/zoom.model';

import { ResultGraph, ResultGraphNode } from '@awg-graph/graph-visualizer/models/result-graph.model';

import { ForceGraphCanvasComponent } from './canvas/force-graph-canvas.component';
import { ForceGraphLimitComponent } from './limit/force-graph-limit.component';
import { ForceGraphSimulationService } from './simulation/force-graph-simulation.service';

import { ForceGraphComponent } from './force-graph.component';

describe('ForceGraphComponent (DONE)', () => {
    let component: ForceGraphComponent;
    let fixture: ComponentFixture<ForceGraphComponent>;
    let compDe: DebugElement;

    let clickedNodeRequestSpy: Mock<(node: ResultGraphNode) => void>;

    let expectedZoomConfig: ZoomConfig;

    const expectedHeight = 500;
    const expectedNodes: ResultGraphNode[] = [
        { id: 'a', shortName: 'awg:a', label: 'A', kind: 'instance' },
        { id: 'b', shortName: 'awg:B', label: 'awg:B', kind: 'class' },
        { id: '_:c', shortName: '_:c', label: '_:c', kind: 'blank' },
        { id: '"x"', shortName: 'x', label: 'x', kind: 'literal' },
    ];
    const expectedResultGraph: ResultGraph = {
        nodes: expectedNodes,
        edges: [
            { id: 'e0', source: 'a', target: 'b', label: 'rdf:type' },
            { id: 'e1', source: 'a', target: '_:c', label: 'awg:has' },
            { id: 'e2', source: '_:c', target: '"x"', label: 'awg:value' },
        ],
        tripleCount: 3,
    };
    const expectedLimitedResultGraph: ResultGraph = {
        nodes: expectedNodes.slice(0, 2),
        edges: expectedResultGraph.edges.slice(0, 1),
        tripleCount: 3,
    };

    const getGraphLimitCmp = (): ForceGraphLimitComponent =>
        getAndExpectDebugElementByDirective(compDe, ForceGraphLimitComponent, 1, 1)[0].injector.get(
            ForceGraphLimitComponent
        );
    const getGraphCanvasCmp = (): ForceGraphCanvasComponent =>
        getAndExpectDebugElementByDirective(compDe, ForceGraphCanvasComponent, 1, 1)[0].injector.get(
            ForceGraphCanvasComponent
        );

    beforeEach(async () => {
        // Stub the ResizeObserver and the 2D context of the ForceGraphCanvasComponent (missing in jsdom)
        stubResizeObserver();
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createFakeCanvasContext());

        // The ForceGraphCanvasComponent needs its own template (no hollow child possible), so mock the simulation
        const mockForceGraphSimulationService = { simulate: vi.fn(() => NEVER) };

        await TestBed.configureTestingModule({
            imports: [ForceGraphComponent],
            providers: [{ provide: ForceGraphSimulationService, useValue: mockForceGraphSimulationService }],
        })
            .overrideComponent(ForceGraphLimitComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 3, 0.01);

        // Create component fixture
        fixture = TestBed.createComponent(ForceGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        clickedNodeRequestSpy = vi.fn();
        component.clickedNodeRequest.subscribe(clickedNodeRequestSpy);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `resultGraph`', () => {
            expectToBe(isSignal(component.resultGraph), true);

            expect(() => component.resultGraph()).toThrow();
        });

        it('... should have input signal `height` to hold the default height', () => {
            expectToBe(component.height(), 0);
        });

        it('... should have `zoomConfig` to hold the expected zoom config', () => {
            expectToEqual(component.zoomConfig, expectedZoomConfig);
        });

        it('... should have signal `zoomValue` to hold the initial zoom value', () => {
            expectToBe(component.zoomValue(), expectedZoomConfig.initial);
        });

        it('... should have signal `limit` to hold the default limit', () => {
            expectToBe(component.limit(), 50);
        });

        describe('VIEW', () => {
            it('... should contain one container with an icon bar and one ForceGraphCanvasComponent', () => {
                const containerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-container', 1, 1);

                getAndExpectDebugElementByCss(containerDes[0], 'div.awg-force-graph-icon-bar', 1, 1);
                getAndExpectDebugElementByDirective(containerDes[0], ForceGraphCanvasComponent, 1, 1);
            });

            it('... should contain one ZoomSliderComponent and one ForceGraphLimitComponent (hollow) in the icon bar', () => {
                const iconBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-icon-bar', 1, 1);

                getAndExpectDebugElementByDirective(iconBarDes[0], ZoomSliderComponent, 1, 1);
                getAndExpectDebugElementByDirective(iconBarDes[0], ForceGraphLimitComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('resultGraph', expectedResultGraph);
            fixture.componentRef.setInput('height', expectedHeight);
            fixture.detectChanges();
        });

        it('... should have input signal `resultGraph` to hold the provided graph data', () => {
            expectToEqual(component.resultGraph(), expectedResultGraph);
        });

        it('... should have input signal `height` to hold the provided height', () => {
            expectToBe(component.height(), expectedHeight);
        });

        it('... should have computed signal `limitedResultGraph` to hold the graph data (below the limit)', () => {
            expectToBe(component.limitedResultGraph(), expectedResultGraph);
        });

        it('... should have computed signal `limitedResultGraph` to hold the limited graph data', () => {
            component.limit.set(1);

            expectToEqual(component.limitedResultGraph(), expectedLimitedResultGraph);
        });

        describe('VIEW', () => {
            it('... should set the height of the container', () => {
                const containerDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-container', 1, 1);

                expectToBe(containerDes[0].nativeElement.style.height, `${expectedHeight}px`);
            });

            describe('... ZoomSliderComponent', () => {
                it('... should pass down `zoomConfig`, `zoomValue` and `hasFitButton`', () => {
                    const zoomSliderDes = getAndExpectDebugElementByDirective(compDe, ZoomSliderComponent, 1, 1);
                    const zoomSliderCmp = zoomSliderDes[0].injector.get(ZoomSliderComponent);

                    expectToEqual(zoomSliderCmp.zoomConfig(), expectedZoomConfig);
                    expectToBe(zoomSliderCmp.zoomValue(), expectedZoomConfig.initial);
                    expectToBe(zoomSliderCmp.hasFitButton(), true);
                });

                it('... should sync `zoomValue` on value change of the ZoomSliderComponent', () => {
                    const rangeDes = getAndExpectDebugElementByCss(compDe, 'awg-zoom-slider input[type="range"]', 1, 1);
                    const rangeEl: HTMLInputElement = rangeDes[0].nativeElement;

                    rangeEl.value = '2.5';
                    rangeEl.dispatchEvent(new Event('input'));

                    expectToBe(component.zoomValue(), 2.5);
                });

                it('... should reset the zoom of the ForceGraphCanvasComponent on reset request', async () => {
                    const resetZoomSpy = vi.spyOn(getGraphCanvasCmp(), 'resetZoom').mockImplementation(() => undefined);
                    const buttonDes = getAndExpectDebugElementByCss(
                        compDe,
                        'awg-zoom-slider button[aria-label="Zoom zurücksetzen"]',
                        1,
                        1
                    );

                    await clickAndAwaitChanges(buttonDes[0], fixture);

                    expectSpyCall(resetZoomSpy, 1);
                });

                it('... should zoom the ForceGraphCanvasComponent to fit the graph on fit request', async () => {
                    const zoomToFitSpy = vi.spyOn(getGraphCanvasCmp(), 'zoomToFit').mockImplementation(() => undefined);
                    const buttonDes = getAndExpectDebugElementByCss(
                        compDe,
                        'awg-zoom-slider button[aria-label="Einpassen"]',
                        1,
                        1
                    );

                    await clickAndAwaitChanges(buttonDes[0], fixture);

                    expectSpyCall(zoomToFitSpy, 1);
                });
            });

            describe('... ForceGraphLimitComponent (hollow)', () => {
                it('... should pass down the triple count and `limit`', () => {
                    const graphLimitCmp = getGraphLimitCmp();

                    expectToBe(graphLimitCmp.tripleCount(), expectedResultGraph.tripleCount);
                    expectToBe(graphLimitCmp.limit(), 50);
                });

                it('... should sync `limit` from the ForceGraphLimitComponent', () => {
                    getGraphLimitCmp().limit.set(1);

                    expectToBe(component.limit(), 1);
                });
            });

            describe('... ForceGraphCanvasComponent (with mocked simulation)', () => {
                it('... should pass down `limitedResultGraph`, `zoomConfig` and `zoomValue`', () => {
                    const graphCanvasCmp = getGraphCanvasCmp();

                    expectToBe(graphCanvasCmp.resultGraph(), expectedResultGraph);
                    expectToEqual(graphCanvasCmp.zoomConfig(), expectedZoomConfig);
                    expectToBe(graphCanvasCmp.zoomValue(), expectedZoomConfig.initial);
                });

                it('... should pass down the limited graph data after a limit change', async () => {
                    component.limit.set(1);
                    await detectChangesOnPush(fixture);

                    expectToEqual(getGraphCanvasCmp().resultGraph(), expectedLimitedResultGraph);
                });

                it('... should sync `zoomValue` from the ForceGraphCanvasComponent', async () => {
                    getGraphCanvasCmp().zoomValue.set(2);
                    await detectChangesOnPush(fixture);

                    expectToBe(component.zoomValue(), 2);
                });

                it('... should emit `clickedNodeRequest` for a clicked graph node of the ForceGraphCanvasComponent', () => {
                    getGraphCanvasCmp().clickedNodeRequest.emit(expectedNodes[0]);

                    expectSpyCall(clickedNodeRequestSpy, 1, expectedNodes[0]);
                });
            });
        });
    });
});
