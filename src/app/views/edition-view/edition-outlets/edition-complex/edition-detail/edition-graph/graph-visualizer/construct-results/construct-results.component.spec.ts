import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EMPTY, Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbAccordion, NgbAccordionModule, NgbConfig, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { D3SimulationNode, D3SimulationNodeType, Triple } from '../models';
import { ConstructResultsComponent } from './construct-results.component';

// Mock components
@Component({ selector: 'awg-force-graph', template: '' })
class ForceGraphStubComponent {
    @Input() queryResultTriples: Triple[];
    @Input() height: number;
    @Output() clickedNodeRequest: EventEmitter<D3SimulationNode> = new EventEmitter<D3SimulationNode>();
}

@Component({ selector: 'awg-sparql-no-results', template: '' })
class SparqlNoResultsStubComponent {}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('ConstructResultsComponent (DONE)', () => {
    let component: ConstructResultsComponent;
    let fixture: ComponentFixture<ConstructResultsComponent>;
    let compDe: DebugElement;

    let expectedHeight: number;
    let expectedTriples: Triple[];
    let expectedQueryResult$: Observable<Triple[]>;
    let expectedIsFullscreen: boolean;

    let emitClickedNodeRequestSpy: Spy;
    let nodeClickSpy: Spy;
    let preventPanelCollapseOnFullscreenSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbAccordionWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgbAccordionWithConfigModule],
            declarations: [
                ConstructResultsComponent,
                ForceGraphStubComponent,
                SparqlNoResultsStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConstructResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedHeight = 500;
        expectedIsFullscreen = false;
        expectedTriples = [
            {
                subject: 'example:Test',
                predicate: 'example:has',
                object: 'example:Success',
            },
        ];
        expectedQueryResult$ = observableOf(expectedTriples);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        nodeClickSpy = spyOn(component, 'onGraphNodeClick').and.callThrough();
        preventPanelCollapseOnFullscreenSpy = spyOn(component, 'preventPanelCollapseOnFullscreen').and.callThrough();
        emitClickedNodeRequestSpy = spyOn(component.clickedNodeRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have queryResult', () => {
            expect(component.queryResult$).toBeUndefined();
        });

        it('... should not have defaultForceGraphHeight', () => {
            expect(component.defaultForceGraphHeight).toBeUndefined();
        });

        it('... should not have isFullscreen', () => {
            expect(component.isFullscreen).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.accordion-item) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 0, 0, 'yet');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.queryResult$ = expectedQueryResult$;
            component.defaultForceGraphHeight = expectedHeight;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `queryResult` input', () => {
            expect(component.queryResult$).toBeDefined();
            expect(component.queryResult$)
                .withContext(`should equal ${expectedQueryResult$}`)
                .toEqual(expectedQueryResult$);
        });

        it('... should have `defaultForceGraphHeight` input', () => {
            expect(component.defaultForceGraphHeight).toBeDefined();
            expect(component.defaultForceGraphHeight).withContext(`should be ${expectedHeight}`).toBe(expectedHeight);
        });

        it('... should have `isFullscreen` input', () => {
            expect(component.isFullscreen).toBeDefined();
            expect(component.isFullscreen).withContext(`should be ${expectedIsFullscreen}`).toBe(expectedIsFullscreen);
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion with panel (div.accordion-item) header and body', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel (div.card)
                const panelDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1); // Panel (div.card)
                // Header
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-construct-results-header.accordion-header',
                    1,
                    1
                ); // Panel (div.card)
                // Body
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-construct-results > div.accordion-body',
                    1,
                    1
                );
            });

            it('... should display panel header button', () => {
                // Panel header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results-header > button',
                    1,
                    1
                );

                const btnEl = btnDes[0].nativeElement;

                // Check button content
                expect(btnEl.textContent).toBeTruthy();
                expect(btnEl.textContent).withContext('should be Resultat').toContain('Resultat');
            });

            it('... should toggle panel body on click when not in fullscreen mode', () => {
                component.isFullscreen = false;
                fixture.detectChanges();

                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results-header.accordion-header',
                    1,
                    1
                );

                // Button debug elements
                const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                // Button native elements to click on
                const btnEl = btnDes[0].nativeElement;

                // Panel body is open
                getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results > div.accordion-body',
                    1,
                    1,
                    'open'
                );

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                // Panel is open
                getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results > div.accordion-body',
                    0,
                    0,
                    'collapsed'
                );

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(
                    // Panel body is closed again
                    compDe,
                    'div#awg-graph-visualizer-construct-results > div.accordion-body',
                    1,
                    1,
                    'open'
                );
            });

            it('... should not toggle panel body on click in fullscreen mode', () => {
                component.isFullscreen = true;
                fixture.detectChanges();

                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results-header.accordion-header',
                    1,
                    1
                );

                // Button debug elements
                const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                // Button native elements to click on
                const btnEl = btnDes[0].nativeElement;

                // Panel body does not close
                getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results > div.accordion-body',
                    1,
                    1,
                    'open'
                );

                // Click header button
                click(btnEl as HTMLElement);
                detectChangesOnPush(fixture);

                // Panel body does not close again
                getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results > div.accordion-body',
                    1,
                    1,
                    'open'
                );
            });

            it('... should contain panel body with TwelveToneSpinnerComponent (stubbed) while loading', () => {
                // Mock empty observable
                component.queryResult$ = EMPTY;
                detectChangesOnPush(fixture);

                // Panel body
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results > div.accordion-body',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
            });

            it('... should contain panel body with SparqlNoResultsStubComponent (stubbed) if no results are available', () => {
                // Mock empty response
                component.queryResult$ = observableOf([]);
                detectChangesOnPush(fixture);

                // Panel body
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results > div.accordion-body',
                    1,
                    1
                );

                // SparqlNoResultsStubComponent
                getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
            });

            it('... should contain panel body with ForceGraphComponent (stubbed) if results are available', () => {
                // Panel body
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-construct-results > div.accordion-body',
                    1,
                    1
                );

                // ForceGraph
                getAndExpectDebugElementByDirective(bodyDes[0], ForceGraphStubComponent, 1, 1);
            });

            it('... should pass down `queryResult` and `defaultForceGraphHeight` to forceGraph component', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                expect(forceGraphCmp.queryResultTriples).toBeDefined();
                expect(forceGraphCmp.queryResultTriples)
                    .withContext(`should equal ${expectedTriples}`)
                    .toEqual(expectedTriples);

                expect(forceGraphCmp.height).toBeDefined();
                expect(forceGraphCmp.height).withContext(`should be: ${expectedHeight}`).toBe(expectedHeight);
            });
        });

        describe('#onGraphNodeClick()', () => {
            it('... should have a method `onGraphNodeClick`', () => {
                expect(component.onGraphNodeClick).toBeDefined();
            });

            it('... should trigger on event from ForceGraphCompnent', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                const node: D3SimulationNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                forceGraphCmp.clickedNodeRequest.emit(node);

                expectSpyCall(nodeClickSpy, 1, node);
            });

            it('... should not emit anything if no node is provided', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                // Node is undefined
                forceGraphCmp.clickedNodeRequest.emit(undefined);

                expectSpyCall(nodeClickSpy, 1, undefined);
                expectSpyCall(emitClickedNodeRequestSpy, 0);
            });

            it('... should emit provided node on click', () => {
                const forceGraphDes = getAndExpectDebugElementByDirective(compDe, ForceGraphStubComponent, 1, 1);
                const forceGraphCmp = forceGraphDes[0].injector.get(ForceGraphStubComponent) as ForceGraphStubComponent;

                const node: D3SimulationNode = new D3SimulationNode('Test', D3SimulationNodeType.node);
                forceGraphCmp.clickedNodeRequest.emit(node);

                expectSpyCall(nodeClickSpy, 1, node);
                expectSpyCall(emitClickedNodeRequestSpy, 1, node);
            });
        });

        describe('#preventPanelCollapseOnFullscreen()', () => {
            it('... should have a method `preventPanelCollapseOnFullscreen`', () => {
                expect(component.preventPanelCollapseOnFullscreen).toBeDefined();
            });

            it('... should trigger on event from ngb-accordion', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                const panelChangeEvent: NgbPanelChangeEvent = {
                    panelId: 'panelChangeId',
                    nextState: true,
                    preventDefault: () => {
                        // Intentional empty test override
                    },
                };

                // Emit change event from accordion
                accordionCmp.panelChange.emit(panelChangeEvent);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, panelChangeEvent);
            });

            it('... should not do anything if no $event is provided', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                // Emit undefined change event from accordion
                accordionCmp.panelChange.emit(undefined);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, undefined);
            });

            it('... should trigger $event.preventDefault() if isFullscreen == true && $event.nextState == false', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                const panelChangeEvent: NgbPanelChangeEvent = {
                    panelId: 'panelChangeId',
                    nextState: false,
                    preventDefault: () => {
                        // Intentional empty test override
                    },
                };
                const preventDefaultSpy: Spy = spyOn(panelChangeEvent, 'preventDefault').and.callThrough();

                // Set fullscreen mode
                component.isFullscreen = true;

                // Emit change event from accordion
                accordionCmp.panelChange.emit(panelChangeEvent);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, panelChangeEvent);
                expectSpyCall(preventDefaultSpy, 1, undefined);
            });

            it('... should not trigger $event.preventDefault() if $event.nextState == true', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                const panelChangeEvent: NgbPanelChangeEvent = {
                    panelId: 'panelChangeId',
                    nextState: true,
                    preventDefault: () => {
                        // Intentional empty test override
                    },
                };
                const preventDefaultSpy: Spy = spyOn(panelChangeEvent, 'preventDefault').and.callThrough();

                // Set fullscreen mode
                component.isFullscreen = true;

                // Emit change event from accordion
                accordionCmp.panelChange.emit(panelChangeEvent);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, panelChangeEvent);
                expectSpyCall(preventDefaultSpy, 0, undefined);
            });

            it('... should not trigger $event.preventDefault() if isFullscreen == false', () => {
                const accordionDes = getAndExpectDebugElementByDirective(compDe, NgbAccordion, 1, 1);
                const accordionCmp = accordionDes[0].injector.get(NgbAccordion) as NgbAccordion;

                const panelChangeEvent: NgbPanelChangeEvent = {
                    panelId: 'panelChangeId',
                    nextState: false,
                    preventDefault: () => {
                        // Intentional empty test override
                    },
                };
                const preventDefaultSpy: Spy = spyOn(panelChangeEvent, 'preventDefault').and.callThrough();

                // Unset fullscreen mode
                component.isFullscreen = false;

                // Emit change event from accordion
                accordionCmp.panelChange.emit(panelChangeEvent);

                expectSpyCall(preventPanelCollapseOnFullscreenSpy, 1, panelChangeEvent);
                expectSpyCall(preventDefaultSpy, 0, undefined);
            });
        });
    });
});
