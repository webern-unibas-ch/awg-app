import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';
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

import { ZoomConfig } from '@awg-shared/zoom/zoom.model';
import { SliderZoomComponent } from '@awg-shared/zoom/slider-zoom.component';

import { GraphData, GraphNode } from '../../../models/graph-data.model';

import { ForceGraphComponent } from './force-graph.component';
import { ForceSimulation } from './force-graph.model';

describe('ForceGraphComponent', () => {
    let component: ForceGraphComponent;
    let fixture: ComponentFixture<ForceGraphComponent>;
    let compDe: DebugElement;

    let onReCenterSpy: Spy;
    let onZoomChangeSpy: Spy;

    let expectedZoomConfig: ZoomConfig;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, SliderZoomComponent],
            declarations: [ForceGraphComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ForceGraphComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedZoomConfig = new ZoomConfig(1, 0.1, 3, 0.01);

        // Spies
        onReCenterSpy = vi.spyOn(component, 'onReCenter');
        onZoomChangeSpy = vi.spyOn(component, 'onZoomChange');
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

        describe('VIEW', () => {
            it('... should contain one SliderZoomComponent in div.awg-force-graph-icon-bar', () => {
                const iconBarDes = getAndExpectDebugElementByCss(compDe, 'div.awg-force-graph-icon-bar', 1, 1);

                getAndExpectDebugElementByDirective(iconBarDes[0], SliderZoomComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            describe('... SliderZoomComponent', () => {
                it('... should pass down `zoomConfig` and `zoomValue` to the SliderZoomComponent', () => {
                    const sliderZoomDes = getAndExpectDebugElementByDirective(compDe, SliderZoomComponent, 1, 1);
                    const sliderZoomCmp = sliderZoomDes[0].injector.get(SliderZoomComponent);

                    expectToEqual(sliderZoomCmp.zoomConfig(), expectedZoomConfig);
                    expectToBe(sliderZoomCmp.zoomValue(), expectedZoomConfig.initial);
                });

                it('... should trigger `onZoomChange` on value change of the SliderZoomComponent', () => {
                    const rangeDes = getAndExpectDebugElementByCss(compDe, 'awg-slider-zoom input[type="range"]', 1, 1);
                    const rangeEl: HTMLInputElement = rangeDes[0].nativeElement;

                    rangeEl.value = '2.5';
                    rangeEl.dispatchEvent(new Event('input'));

                    expectSpyCall(onZoomChangeSpy, 1, 2.5);
                });

                it('... should trigger `onReCenter` on reset request of the SliderZoomComponent', async () => {
                    const buttonDes = getAndExpectDebugElementByCss(compDe, 'awg-slider-zoom button', 1, 1);

                    await clickAndAwaitChanges(buttonDes[0], fixture);

                    expectSpyCall(onReCenterSpy, 1);
                });
            });
        });

        describe('... with graph data', () => {
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

            const getCircleEls = (): SVGCircleElement[] =>
                Array.from(compDe.nativeElement.querySelectorAll('svg.force-graph circle'));

            beforeEach(() => {
                // The d3 zoom rescaling reads svg.width.baseVal, which jsdom does not implement
                vi.spyOn(component as any, '_reScaleZoom').mockImplementation(() => undefined);

                fixture.componentRef.setInput('graphData', graphData);
                component.ngOnInit();
                fixture.detectChanges();
            });

            it('... should draw one circle per graph node (without the middle nodes of the edges)', () => {
                expectToBe(getCircleEls().length, nodes.length);
            });

            it('... should draw one link and one link text per edge', () => {
                const linkTextEls = Array.from<SVGTextElement>(
                    compDe.nativeElement.querySelectorAll('svg.force-graph text.link-text')
                );

                expectToBe(compDe.nativeElement.querySelectorAll('svg.force-graph path.link').length, 3);
                expectToEqual(
                    linkTextEls.map(el => el.textContent),
                    ['rdf:type', 'awg:has', 'awg:value']
                );
            });

            it('... should display the number of triples in the limit button', () => {
                const buttonDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-force-graph-node-limit-container button[disabled]',
                    1,
                    1
                );

                expectToBe(buttonDes[0].nativeElement.textContent.trim(), '3 Triples');
            });

            it('... should draw only the limited edges and their nodes after a limit change', async () => {
                component.onLimitValueChange(1);
                await detectChangesOnPush(fixture);

                expectToBe(getCircleEls().length, 2);
                expectToBe(compDe.nativeElement.querySelectorAll('svg.force-graph path.link').length, 1);
            });

            it('... should redraw on changes of the graph data', () => {
                fixture.componentRef.setInput('graphData', {
                    nodes: nodes.slice(0, 2),
                    edges: graphData.edges.slice(0, 1),
                    tripleCount: 1,
                });
                fixture.detectChanges();

                expectToBe(getCircleEls().length, 2);
            });

            it('... should stop the previous force simulation on redraw and on destroy', () => {
                const previousStopSpy = vi.spyOn(component['_forceSimulation'] as ForceSimulation, 'stop');

                component.onLimitValueChange(1);

                expectSpyCall(previousStopSpy, 1);

                const currentStopSpy = vi.spyOn(component['_forceSimulation'] as ForceSimulation, 'stop');

                fixture.destroy();

                expectSpyCall(currentStopSpy, 1);
            });

            it('... should emit the graph node of a clicked circle', () => {
                const emitSpy = vi.spyOn(component.clickedNodeRequest, 'emit');

                getCircleEls()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));

                expectSpyCall(emitSpy, 1, nodes[0]);
            });
        });

        describe('METHODS', () => {
            describe('#onZoomChange()', () => {
                it('... should have a method `onZoomChange`', () => {
                    expect(component.onZoomChange).toBeDefined();
                });

                it.each([0.5, 2, 1])('... should set `zoomValue` to the given zoom value %s', expectedZoom => {
                    component.onZoomChange(expectedZoom);

                    expectToBe(component.zoomValue(), expectedZoom);
                });
            });
        });
    });
});
