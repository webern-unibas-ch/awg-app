import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';

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

import { SearchResult } from '../models';
import { SelectResultsComponent } from './select-results.component';

// Mock components
@Component({ selector: 'awg-sparql-no-results', template: '' })
class SparqlNoResultsStubComponent {}

@Component({ selector: 'awg-sparql-table', template: '' })
class SparqlTableStubComponent {
    @Input() queryResult: SearchResult;
    @Input() queryTime: number;
    @Output() clickedTableRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('SelectResultsComponent (DONE)', () => {
    let component: SelectResultsComponent;
    let fixture: ComponentFixture<SelectResultsComponent>;
    let compDe: DebugElement;

    let expectedQueryResult: SearchResult;
    let expectedQueryResult$: Observable<SearchResult>;
    let expectedQueryTime: number;
    let expectedIsFullscreen: boolean;

    let tableClickSpy: Spy;
    let emitClickedTableRequestSpy: Spy;
    let isNotEmptySpy: Spy;
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
                SelectResultsComponent,
                SparqlNoResultsStubComponent,
                SparqlTableStubComponent,
                TwelveToneSpinnerStubComponent,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        const varKeys = ['Test', 'success'];
        const b = [
            {
                Test: { type: 'test type', value: 'test value' },
                success: { type: 'success type', value: 'sucess value' },
            },
        ];
        expectedQueryResult = { head: { vars: varKeys }, body: { bindings: b } };
        expectedQueryResult$ = observableOf(expectedQueryResult);
        expectedQueryTime = 5000;
        expectedIsFullscreen = false;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        tableClickSpy = spyOn(component, 'onTableNodeClick').and.callThrough();
        emitClickedTableRequestSpy = spyOn(component.clickedTableRequest, 'emit').and.callThrough();
        isNotEmptySpy = spyOn(component, 'isNotEmpty').and.callThrough();
        preventPanelCollapseOnFullscreenSpy = spyOn(component, 'preventPanelCollapseOnFullscreen').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have queryResult', () => {
            expect(component.queryResult$).withContext('should be undefined').toBeUndefined();
        });

        it('should not have queryTime', () => {
            expect(component.queryTime).withContext('should be undefined').toBeUndefined();
        });

        it('should not have isFullscreen', () => {
            expect(component.isFullscreen).withContext('should be undefined').toBeUndefined();
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
            component.queryTime = expectedQueryTime;
            component.isFullscreen = expectedIsFullscreen;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `queryResult` input', () => {
            expect(component.queryResult$).toBeDefined();
            expect(component.queryResult$)
                .withContext(`should equal ${expectedQueryResult$}`)
                .toEqual(expectedQueryResult$);
        });

        it('should have `queryTime` input', () => {
            expect(component.queryTime).toBeDefined();
            expect(component.queryTime).withContext(`should equal ${expectedQueryTime}`).toEqual(expectedQueryTime);
        });

        it('should have `isFullscreen` input', () => {
            expect(component.isFullscreen).toBeDefined();
            expect(component.isFullscreen)
                .withContext(`should equal ${expectedIsFullscreen}`)
                .toEqual(expectedIsFullscreen);
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
                    'div#awg-graph-visualizer-select-results-header.accordion-header',
                    1,
                    1
                ); // Panel (div.card)
                // Body
                getAndExpectDebugElementByCss(
                    panelDes[0],
                    'div#awg-graph-visualizer-select-results > div.accordion-body',
                    1,
                    1
                );
            });

            it('... should display panel header button', () => {
                // Panel header button
                const btnDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-select-results-header > button.accordion-button',
                    1,
                    1
                );

                const btnEl = btnDes[0].nativeElement;

                // Check button content
                expect(btnEl.textContent).toBeTruthy();
                expect(btnEl.textContent).withContext('should contain Resultat').toContain('Resultat');
            });

            it('... should toggle panel body on click when not in fullscreen mode', () => {
                component.isFullscreen = false;
                fixture.detectChanges();

                // Header debug elements
                const panelHeaderDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-select-results-header.accordion-header',
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
                    'div#awg-graph-visualizer-select-results > div.accordion-body',
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
                    'div#awg-graph-visualizer-select-results > div.accordion-body',
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
                    'div#awg-graph-visualizer-select-results > div.accordion-body',
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
                    'div#awg-graph-visualizer-select-results-header.accordion-header',
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
                    'div#awg-graph-visualizer-select-results > div.accordion-body',
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
                    'div#awg-graph-visualizer-select-results > div.accordion-body',
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
                    'div#awg-graph-visualizer-select-results > div.accordion-body',
                    1,
                    1
                );

                getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
            });

            it('... should contain panel body with SparqlNoResultsStubComponent (stubbed) if no results are available', () => {
                // Mock empty response
                component.queryResult$ = observableOf({ head: { vars: [] }, body: { bindings: [] } });
                detectChangesOnPush(fixture);

                // Panel body
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-select-results > div.accordion-body',
                    1,
                    1
                );

                // SparqlNoResultsStubComponent
                getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
            });

            it('... should contain panel body with SparqlTableComponent (stubbed) if results are available', () => {
                // Panel body
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div#awg-graph-visualizer-select-results > div.accordion-body',
                    1,
                    1
                );

                // SparqlTable
                getAndExpectDebugElementByDirective(bodyDes[0], SparqlTableStubComponent, 1, 1);
            });

            it('... should pass down `queryResult` and `queryTime` to sparqlTable component', () => {
                const sparqlTableDes = getAndExpectDebugElementByDirective(compDe, SparqlTableStubComponent, 1, 1);
                const sparqlTableCmp = sparqlTableDes[0].injector.get(
                    SparqlTableStubComponent
                ) as SparqlTableStubComponent;

                expect(sparqlTableCmp.queryResult).toBeDefined();
                expect(sparqlTableCmp.queryResult)
                    .withContext(`should equal ${expectedQueryResult}`)
                    .toEqual(expectedQueryResult);

                expect(sparqlTableCmp.queryTime).toBeDefined();
                expect(sparqlTableCmp.queryTime)
                    .withContext(`should have data: ${expectedQueryTime}`)
                    .toEqual(expectedQueryTime);
            });
        });

        describe('#onTableNodeClick', () => {
            it('... should trigger on event from SparqlTableComponent', () => {
                const sparqlTableDes = getAndExpectDebugElementByDirective(compDe, SparqlTableStubComponent, 1, 1);
                const sparqlTableCmp = sparqlTableDes[0].injector.get(
                    SparqlTableStubComponent
                ) as SparqlTableStubComponent;

                const expectedUri = 'example:Test';
                sparqlTableCmp.clickedTableRequest.emit(expectedUri);

                expectSpyCall(tableClickSpy, 1, expectedUri);
            });

            it('... should not emit anything if no URI is provided', () => {
                const sparqlTableDes = getAndExpectDebugElementByDirective(compDe, SparqlTableStubComponent, 1, 1);
                const sparqlTableCmp = sparqlTableDes[0].injector.get(
                    SparqlTableStubComponent
                ) as SparqlTableStubComponent;

                // Node is undefined
                sparqlTableCmp.clickedTableRequest.emit(undefined);

                expectSpyCall(tableClickSpy, 1, undefined);
                expectSpyCall(emitClickedTableRequestSpy, 0);
            });

            it('... should emit provided URI on click', () => {
                const sparqlTableDes = getAndExpectDebugElementByDirective(compDe, SparqlTableStubComponent, 1, 1);
                const sparqlTableCmp = sparqlTableDes[0].injector.get(
                    SparqlTableStubComponent
                ) as SparqlTableStubComponent;

                const expectedUri = 'example:Test';
                sparqlTableCmp.clickedTableRequest.emit(expectedUri);

                expectSpyCall(tableClickSpy, 1, expectedUri);
                expectSpyCall(emitClickedTableRequestSpy, 1, expectedUri);
            });
        });

        describe('#isNotEmpty', () => {
            it('... should not do anything if no queryResult.head is provided', () => {
                expectSpyCall(isNotEmptySpy, 1, expectedQueryResult);

                // Mock empty response
                const emptyQueryResult = { head: undefined, body: { bindings: [{ test: 'Test' }] } };
                component.queryResult$ = observableOf(emptyQueryResult);
                detectChangesOnPush(fixture);

                expectSpyCall(isNotEmptySpy, 2, emptyQueryResult);
                // SparqlNoResultsStubComponent
                getAndExpectDebugElementByDirective(compDe, SparqlNoResultsStubComponent, 1, 1);
            });

            it('... should not do anything if no queryResult.body is provided', () => {
                expectSpyCall(isNotEmptySpy, 1, expectedQueryResult);

                // Mock empty response
                const emptyQueryResult = { head: { vars: ['Test'] }, body: undefined };
                component.queryResult$ = observableOf(emptyQueryResult);
                detectChangesOnPush(fixture);

                expectSpyCall(isNotEmptySpy, 2, emptyQueryResult);
                // SparqlNoResultsStubComponent
                getAndExpectDebugElementByDirective(compDe, SparqlNoResultsStubComponent, 1, 1);
            });

            it('... should return false if queryResult.head.vars length = 0', () => {
                expectSpyCall(isNotEmptySpy, 1, expectedQueryResult);

                // Mock empty response
                const emptyQueryResult = { head: { vars: [] }, body: { bindings: [{ testKey: 'TestValue' }] } };
                component.queryResult$ = observableOf(emptyQueryResult);
                detectChangesOnPush(fixture);

                expectSpyCall(isNotEmptySpy, 2, emptyQueryResult);
                expect(component.isNotEmpty(emptyQueryResult)).toBeFalse();
            });

            it('... should return false if queryResult.body.bindings length = 0', () => {
                expectSpyCall(isNotEmptySpy, 1, expectedQueryResult);

                // Mock empty response
                const emptyQueryResult = { head: { vars: ['TestHeader'] }, body: { bindings: [] } };
                component.queryResult$ = observableOf(emptyQueryResult);
                detectChangesOnPush(fixture);

                expectSpyCall(isNotEmptySpy, 2, emptyQueryResult);
                expect(component.isNotEmpty(emptyQueryResult)).toBeFalse();
            });

            it('... should return false if queryResult.head.vars & queryResult.body.bindings length = 0', () => {
                expectSpyCall(isNotEmptySpy, 1, expectedQueryResult);

                // Mock empty response
                const emptyQueryResult = { head: { vars: [] }, body: { bindings: [] } };
                component.queryResult$ = observableOf(emptyQueryResult);
                detectChangesOnPush(fixture);

                expectSpyCall(isNotEmptySpy, 2, emptyQueryResult);
                expect(component.isNotEmpty(emptyQueryResult)).toBeFalse();
            });

            it('... should return true if queryResult.head.vars & queryResult.body.bindings length > 0', () => {
                component.queryResult$ = expectedQueryResult$;
                expectSpyCall(isNotEmptySpy, 1, expectedQueryResult);

                expect(component.isNotEmpty(expectedQueryResult)).toBeTrue();
                expectSpyCall(isNotEmptySpy, 2, expectedQueryResult);

                // Mock another non-empty response
                const queryResult = { head: { vars: ['TestHeader'] }, body: { bindings: [{ testKey: 'TestValue' }] } };
                component.queryResult$ = observableOf(queryResult);
                detectChangesOnPush(fixture);

                expectSpyCall(isNotEmptySpy, 3, queryResult);
                expect(component.isNotEmpty(queryResult)).toBeTrue();
            });
        });

        describe('#preventPanelCollapseOnFullscreen', () => {
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
