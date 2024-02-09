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

    let emitClickedTableRequestSpy: Spy;
    let isAccordionItemDisabledSpy: Spy;
    let isQueryResultNotEmptySpy: Spy;
    let tableClickSpy: Spy;

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
        emitClickedTableRequestSpy = spyOn(component.clickedTableRequest, 'emit').and.callThrough();
        isAccordionItemDisabledSpy = spyOn(component, 'isAccordionItemDisabled').and.callThrough();
        isQueryResultNotEmptySpy = spyOn(component, 'isQueryResultNotEmpty').and.callThrough();
        tableClickSpy = spyOn(component, 'onTableNodeClick').and.callThrough();
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
                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    // NgbAccordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Div.accordion-item
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-select-results.accordion-item',
                        1,
                        1
                    );
                    // Header (div.accordion-header)
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-collapse)
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-select-results-collapse',
                        1,
                        1
                    );
                    const itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Item header button
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle item body on click', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Item body is collapsed
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'collapsed'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'collapse');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Item body is open again
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                describe('... should contain TwelveToneSpinnerComponent (stubbed) in item body while loading if ... ', () => {
                    it('... queryResult$ is EMPTY', () => {
                        // Mock empty observable
                        component.queryResult$ = EMPTY;
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is undefined', () => {
                        // Mock undefined response
                        component.queryResult$ = undefined;
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is null', () => {
                        // Mock null response
                        component.queryResult$ = null;
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });

                describe('... should contain item body with SparqlNoResultsStubComponent (stubbed) if ... ', () => {
                    it('... no results are available', () => {
                        // Mock empty response
                        component.queryResult$ = observableOf({ head: { vars: [] }, body: { bindings: [] } });
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.head is undefined', () => {
                        // Mock undefined response
                        const undefinedQueryResult = { head: undefined, body: { bindings: [{ test: 'Test' }] } };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.body is undefined', () => {
                        // Mock undefined response
                        const undefinedQueryResult = { head: { vars: ['Test'] }, body: undefined };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.head and queryResult.body are undefined', () => {
                        // Mock undefined response
                        const undefinedQueryResult = { head: undefined, body: undefined };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        detectChangesOnPush(fixture);

                        // Item body
                        const body = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(body[0], SparqlNoResultsStubComponent, 1, 1);
                    });
                });

                it('... should contain item body with SparqlTableComponent (stubbed) if results are available', () => {
                    // Item body
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

                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    // NgbAccordion debug element
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    // Div.accordion-item
                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-select-results.accordion-item',
                        1,
                        1
                    );
                    // Header (div.accordion-header)
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-collapse)
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-visualizer-select-results-collapse',
                        1,
                        1
                    );
                    const itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Item header button
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle item body on click', () => {
                    // Header debug elements
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    // Button debug elements
                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    // Button native elements to click on
                    const btnEl = btnDes[0].nativeElement;

                    expect(btnEl.disabled).toBeTruthy();

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    click(btnEl as HTMLElement);
                    detectChangesOnPush(fixture);

                    // Item body does not close again
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                describe('... should contain TwelveToneSpinnerComponent (stubbed) in item body while loading if ... ', () => {
                    it('... queryResult$ is EMPTY', () => {
                        // Mock empty observable
                        component.queryResult$ = EMPTY;
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is undefined', () => {
                        // Mock undefined response
                        component.queryResult$ = undefined;
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is null', () => {
                        // Mock null response
                        component.queryResult$ = null;
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });
                });

                describe('... should contain item body with SparqlNoResultsStubComponent (stubbed) if ... ', () => {
                    it('... no results are available', () => {
                        // Mock empty response
                        component.queryResult$ = observableOf({ head: { vars: [] }, body: { bindings: [] } });
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.head is undefined', () => {
                        // Mock undefined response
                        const undefinedQueryResult = { head: undefined, body: { bindings: [{ test: 'Test' }] } };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.body is undefined', () => {
                        // Mock undefined response
                        const undefinedQueryResult = { head: { vars: ['Test'] }, body: undefined };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        detectChangesOnPush(fixture);

                        // Item body
                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.head and queryResult.body are undefined', () => {
                        // Mock undefined response
                        const undefinedQueryResult = { head: undefined, body: undefined };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        detectChangesOnPush(fixture);

                        // Item body
                        const body = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(body[0], SparqlNoResultsStubComponent, 1, 1);
                    });
                });

                it('... should contain item body with SparqlTableComponent (stubbed) if results are available', () => {
                    // Item body
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

        describe('#isQueryResultNotEmpty()', () => {
            it('... should have a method `isQueryResultNotEmpty`', () => {
                expect(component.isQueryResultNotEmpty).toBeDefined();
            });

            it('... should be triggered from ngbAccordionBody', () => {
                expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult[0]);
            });

            it('... should be triggered by change of queryResult', () => {
                expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult);

                // Mock another queryResult
                const queryResult = {
                    head: { vars: ['AnotherTestHeader'] },
                    body: { bindings: [{ testKey: 'AnotherTestValue' }] },
                };
                component.queryResult$ = observableOf(queryResult);

                detectChangesOnPush(fixture);

                expectSpyCall(isQueryResultNotEmptySpy, 3, queryResult);
            });

            describe('... should return false if ...', () => {
                it('... queryResult.head is undefined', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult);

                    // Mock undefined response
                    const undefinedQueryResult = { head: undefined, body: { bindings: [{ test: 'Test' }] } };
                    component.queryResult$ = observableOf(undefinedQueryResult);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, undefinedQueryResult);
                    expectToBe(component.isQueryResultNotEmpty(undefinedQueryResult), false);
                });

                it('... queryResult.body is undefined', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult);

                    // Mock undefined response
                    const undefinedQueryResult = { head: { vars: ['Test'] }, body: undefined };
                    component.queryResult$ = observableOf(undefinedQueryResult);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, undefinedQueryResult);
                    expectToBe(component.isQueryResultNotEmpty(undefinedQueryResult), false);
                });

                it('... queryResult.head and queryResult.body are undefined', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult);

                    // Mock undefined response
                    const undefinedQueryResult = { head: undefined, body: undefined };
                    component.queryResult$ = observableOf(undefinedQueryResult);
                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, undefinedQueryResult);
                    expectToBe(component.isQueryResultNotEmpty(undefinedQueryResult), false);
                });

                it('... queryResult.head.vars is empty array', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult);

                    // Mock empty response
                    const emptyQueryResult = { head: { vars: [] }, body: { bindings: [{ testKey: 'TestValue' }] } };
                    component.queryResult$ = observableOf(emptyQueryResult);

                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, emptyQueryResult);
                    expectToBe(component.isQueryResultNotEmpty(emptyQueryResult), false);
                });

                it('... queryResult.body.bindings is empty array', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult);

                    // Mock empty response
                    const emptyQueryResult = { head: { vars: ['TestHeader'] }, body: { bindings: [] } };
                    component.queryResult$ = observableOf(emptyQueryResult);

                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, emptyQueryResult);
                    expectToBe(component.isQueryResultNotEmpty(emptyQueryResult), false);
                });

                it('... queryResult.head.vars & queryResult.body.bindings are empty arrays', () => {
                    expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult);

                    // Mock empty response
                    const emptyQueryResult = { head: { vars: [] }, body: { bindings: [] } };
                    component.queryResult$ = observableOf(emptyQueryResult);

                    detectChangesOnPush(fixture);

                    expectSpyCall(isQueryResultNotEmptySpy, 3, emptyQueryResult);
                    expectToBe(component.isQueryResultNotEmpty(emptyQueryResult), false);
                });
            });

            it('... should return true if queryResult.head.vars && queryResult.body.bindings is not empty (length > 0)', () => {
                expectSpyCall(isQueryResultNotEmptySpy, 2, expectedQueryResult);

                // Mock non-empty response
                const nonEmptyQueryResult = {
                    head: { vars: ['AnotherTestHeader'] },
                    body: { bindings: [{ testKey: 'AnotherTestValue' }] },
                };
                component.queryResult$ = observableOf(nonEmptyQueryResult);
                detectChangesOnPush(fixture);

                expectSpyCall(isQueryResultNotEmptySpy, 3, nonEmptyQueryResult);
                expectToBe(component.isQueryResultNotEmpty(nonEmptyQueryResult), true);
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
    });
});
