import { Component, DebugElement, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EMPTY, Observable, lastValueFrom, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { NgbAccordionDirective, NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';

import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { QueryResult } from '../models';
import { SelectResultsComponent } from './select-results.component';

// Mock components
@Component({ selector: 'awg-sparql-no-results', template: '' })
class SparqlNoResultsStubComponent {}

@Component({ selector: 'awg-sparql-table', template: '' })
class SparqlTableStubComponent {
    @Input() queryResult: QueryResult;
    @Input() queryTime: number;
    @Output() clickedTableRequest: EventEmitter<string> = new EventEmitter();
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('SelectResultsComponent (DONE)', () => {
    let component: SelectResultsComponent;
    let fixture: ComponentFixture<SelectResultsComponent>;
    let compDe: DebugElement;

    let expectedQueryResult: QueryResult;
    let expectedQueryResult$: Observable<QueryResult>;
    let expectedQueryTime: number;
    let expectedIsFullscreen: boolean;

    let tableClickSpy: Spy;
    let emitClickedTableRequestSpy: Spy;
    let isAccordionItemDisabledSpy: Spy;
    let isNotEmptySpy: Spy;

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
            imports: [NgbAccordionWithConfigModule, NgbAccordionDirective],
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
        isAccordionItemDisabledSpy = spyOn(component, 'isAccordionItemDisabled').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have queryResult', () => {
            expect(component.queryResult$).toBeUndefined();
        });

        it('... should not have queryTime', () => {
            expect(component.queryTime).toBeUndefined();
        });

        it('... should not have isFullscreen', () => {
            expect(component.isFullscreen).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain no div.accordion yet', () => {
                // Div.accordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 0, 0);
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

        it('... should have `queryResult` input', waitForAsync(() => {
            expectToEqual(component.queryResult$, expectedQueryResult$);
            expectAsync(lastValueFrom(component.queryResult$)).toBeResolved();
            expectAsync(lastValueFrom(component.queryResult$))
                .withContext(`should be resolved to ${expectedQueryResult}}`)
                .toBeResolvedTo(expectedQueryResult);
        }));

        it('... should have `queryTime` input', () => {
            expectToBe(component.queryTime, expectedQueryTime);
        });

        it('... should have `isFullscreen` input', () => {
            expectToBe(component.isFullscreen, expectedIsFullscreen);
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                // NgbAccordion debug element
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            describe('not in fullscreen mode', () => {
                it('... should contain one div.accordion with panel (div.accordion-item) header and open body', () => {
                    // NgbAccordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Panel (div.accordion-item)
                    const panelDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-select-results.accordion-item',
                        1,
                        1
                    );
                    // Header (div.accordion-header)
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-collapse)
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                        1,
                        1
                    );
                });

                it('... should display panel header button', () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Panel header button
                    const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle panel body on click', () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Panel body is open
                    let panelBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let panelBodyEl = panelBodyDes[0].nativeElement;

                    expectToContain(panelBodyEl.classList, 'show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Panel body is collapsed
                    panelBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'collapsed'
                    );
                    panelBodyEl = panelBodyDes[0].nativeElement;

                    expectToContain(panelBodyEl.classList, 'collapse');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Panel body is open again
                    panelBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    panelBodyEl = panelBodyDes[0].nativeElement;

                    expectToContain(panelBodyEl.classList, 'show');
                });

                it('... should contain panel body with SparqlNoResultsStubComponent (stubbed) if no results are available', () => {
                    // Mock empty response
                    component.queryResult$ = observableOf({ head: { vars: [] }, body: { bindings: [] } });
                    fixture.detectChanges();

                    // Panel body
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                        1,
                        1
                    );

                    // SparqlNoResultsStubComponent
                    getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                });

                it('... should contain TwelveToneSpinnerComponent (stubbed) in panel body while loading', () => {
                    // Mock empty observable
                    component.queryResult$ = EMPTY;
                    fixture.detectChanges();

                    // Panel body
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                });

                it('... should contain panel body with SparqlTableComponent (stubbed) if results are available', () => {
                    // Panel body
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
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

                    expectToEqual(sparqlTableCmp.queryResult, expectedQueryResult);
                    expectToBe(sparqlTableCmp.queryTime, expectedQueryTime);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(() => {
                    // Set fullscreen mode
                    component.isFullscreen = true;
                    detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion with panel (div.accordion-item) header and open body', () => {
                    // NgbAccordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Panel (div.accordion-item)
                    const panelDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-select-results.accordion-item',
                        1,
                        1
                    );
                    // Header (div.accordion-header)
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-collapse)
                    getAndExpectDebugElementByCss(
                        panelDes[0],
                        'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                        1,
                        1
                    );
                });

                it('... should display panel header button', () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Panel header button
                    const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle panel body on click', () => {
                    // Header debug elements
                    const panelHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(panelHeaderDes[0], 'button.accordion-button', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    expect(btnEl.disabled).toBeTruthy();

                    // Panel body is open
                    let panelBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let panelBodyEl = panelBodyDes[0].nativeElement;

                    expectToContain(panelBodyEl.classList, 'show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Panel body does not close again
                    panelBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    panelBodyEl = panelBodyDes[0].nativeElement;

                    expectToContain(panelBodyEl.classList, 'show');
                });

                it('... should contain panel body with SparqlNoResultsStubComponent (stubbed) if no results are available', () => {
                    // Mock empty response
                    component.queryResult$ = observableOf({ head: { vars: [] }, body: { bindings: [] } });
                    fixture.detectChanges();

                    // Panel body
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                        1,
                        1
                    );

                    // SparqlNoResultsStubComponent
                    getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                });

                it('... should contain TwelveToneSpinnerComponent (stubbed) in panel body while loading', () => {
                    // Mock empty observable
                    component.queryResult$ = EMPTY;
                    fixture.detectChanges();

                    // Panel body
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                });

                it('... should contain panel body with SparqlTableComponent (stubbed) if results are available', () => {
                    // Panel body
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
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

                    expectToEqual(sparqlTableCmp.queryResult, expectedQueryResult);
                    expectToBe(sparqlTableCmp.queryTime, expectedQueryTime);
                });
            });
        });

        describe('#onTableNodeClick()', () => {
            it('... should have a method `onTableNodeClick`', () => {
                expect(component.onTableNodeClick).toBeDefined();
            });

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

        describe('#isNotEmpty()', () => {
            it('... should have a method `isNotEmpty`', () => {
                expect(component.isNotEmpty).toBeDefined();
            });

            describe('... should return false if ...', () => {
                it('... no queryResult.head is provided', () => {
                    // Mock empty response
                    const emptyQueryResult = { head: undefined, body: { bindings: [{ test: 'Test' }] } };
                    component.queryResult$ = observableOf(emptyQueryResult);

                    fixture.detectChanges();

                    expectSpyCall(isNotEmptySpy, 5, emptyQueryResult);
                    // SparqlNoResultsStubComponent
                    getAndExpectDebugElementByDirective(compDe, SparqlNoResultsStubComponent, 1, 1);
                });

                it('... no queryResult.body is provided', () => {
                    expectSpyCall(isNotEmptySpy, 3, expectedQueryResult);

                    // Mock empty response
                    const emptyQueryResult = { head: { vars: ['Test'] }, body: undefined };
                    component.queryResult$ = observableOf(emptyQueryResult);

                    fixture.detectChanges();

                    expectSpyCall(isNotEmptySpy, 5, emptyQueryResult);
                    // SparqlNoResultsStubComponent
                    getAndExpectDebugElementByDirective(compDe, SparqlNoResultsStubComponent, 1, 1);
                });

                it('... queryResult.head.vars length = 0', () => {
                    expectSpyCall(isNotEmptySpy, 3, expectedQueryResult);

                    // Mock empty response
                    const emptyQueryResult = { head: { vars: [] }, body: { bindings: [{ testKey: 'TestValue' }] } };
                    component.queryResult$ = observableOf(emptyQueryResult);

                    fixture.detectChanges();

                    expectSpyCall(isNotEmptySpy, 5, emptyQueryResult);
                    expect(component.isNotEmpty(emptyQueryResult)).toBeFalse();
                });

                it('... queryResult.body.bindings length = 0', () => {
                    expectSpyCall(isNotEmptySpy, 3, expectedQueryResult);

                    // Mock empty response
                    const emptyQueryResult = { head: { vars: ['TestHeader'] }, body: { bindings: [] } };
                    component.queryResult$ = observableOf(emptyQueryResult);

                    fixture.detectChanges();

                    expectSpyCall(isNotEmptySpy, 5, emptyQueryResult);
                    expect(component.isNotEmpty(emptyQueryResult)).toBeFalse();
                });

                it('... queryResult.head.vars & queryResult.body.bindings length = 0', () => {
                    expectSpyCall(isNotEmptySpy, 3, expectedQueryResult);

                    // Mock empty response
                    const emptyQueryResult = { head: { vars: [] }, body: { bindings: [] } };
                    component.queryResult$ = observableOf(emptyQueryResult);

                    fixture.detectChanges();

                    expectSpyCall(isNotEmptySpy, 5, emptyQueryResult);
                    expect(component.isNotEmpty(emptyQueryResult)).toBeFalse();
                });
            });

            it('... should return true if queryResult.head.vars && queryResult.body.bindings is not empty (length > 0)', () => {
                expectSpyCall(isNotEmptySpy, 3, expectedQueryResult);

                expect(component.isNotEmpty(expectedQueryResult)).toBeTrue();
                expectSpyCall(isNotEmptySpy, 4, expectedQueryResult);

                // Mock another non-empty response
                const queryResult = { head: { vars: ['TestHeader'] }, body: { bindings: [{ testKey: 'TestValue' }] } };
                component.queryResult$ = observableOf(queryResult);

                fixture.detectChanges();

                expectSpyCall(isNotEmptySpy, 6, queryResult);
                expect(component.isNotEmpty(queryResult)).toBeTrue();
                expectSpyCall(isNotEmptySpy, 7, queryResult);
            });
        });

        describe('#isAccordionItemDisabled()', () => {
            it('... should have a method `isAccordionItemDisabled`', () => {
                expect(component.isAccordionItemDisabled).toBeDefined();
            });

            it('... should be triggered from ngbAccordionItem', () => {
                expectSpyCall(isAccordionItemDisabledSpy, 2);
            });

            it('... should return false if isFullscreen is false', () => {
                expectToBe(component.isAccordionItemDisabled(), false);
            });

            it('... should return true if isFullscreen is true', () => {
                // Set fullscreen flag to true
                component.isFullscreen = true;

                expectToBe(component.isAccordionItemDisabled(), true);
            });
        });
    });
});
