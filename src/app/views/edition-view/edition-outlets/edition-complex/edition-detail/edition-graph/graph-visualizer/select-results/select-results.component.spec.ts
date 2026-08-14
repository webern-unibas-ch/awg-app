import { Component, DebugElement, EventEmitter, Input, NgModule, Output, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EMPTY, Observable, lastValueFrom, of as observableOf } from 'rxjs';

import { NgbAccordionModule, NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { TwelveToneSpinnerStubComponent } from '@testing/component-stubs';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { QuerySelectResult } from '../models';
import { SelectResultsComponent } from './select-results.component';

// Mock components
@Component({
    selector: 'awg-sparql-no-results',
    template: '',
    standalone: false,
})
class SparqlNoResultsStubComponent {}

@Component({
    selector: 'awg-sparql-table',
    template: '',
    standalone: false,
})
class SparqlTableStubComponent {
    @Input()
    queryResult: QuerySelectResult;
    @Input()
    queryTime: number;
    @Output()
    clickedTableRequest: EventEmitter<string> = new EventEmitter();
}

describe('SelectResultsComponent (DONE)', () => {
    let component: SelectResultsComponent;
    let fixture: ComponentFixture<SelectResultsComponent>;
    let compDe: DebugElement;

    let expectedQueryResult: QuerySelectResult | string;
    let expectedQueryResult$: Observable<QuerySelectResult | string>;
    let expectedQueryTime: number;
    let expectedIsFullscreen: boolean;

    let emitClickedTableRequestSpy: Spy;
    let isAccordionItemDisabledSpy: Spy;
    let isValidSelectQueryResultSpy: Spy;
    let tableClickSpy: Spy;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbAccordionModule], exports: [NgbAccordionModule] })
    class NgbConfigModule {
        constructor() {
            const config = inject(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbAccordionModule, NgbConfigModule, TwelveToneSpinnerStubComponent],
            declarations: [SelectResultsComponent, SparqlNoResultsStubComponent, SparqlTableStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectResultsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        const varKeys = ['test', 'success'];
        const b = [
            {
                test: { type: 'test type', value: 'test value' },
                success: { type: 'success type', value: 'sucess value' },
            },
        ];
        expectedQueryResult = { head: { vars: varKeys }, body: { bindings: b } };
        expectedQueryResult$ = observableOf(expectedQueryResult);
        expectedQueryTime = 5000;
        expectedIsFullscreen = false;

        // Spies
        emitClickedTableRequestSpy = vi.spyOn(component.clickedTableRequest, 'emit');
        isAccordionItemDisabledSpy = vi.spyOn(component, 'isAccordionItemDisabled');
        isValidSelectQueryResultSpy = vi.spyOn(component, 'isValidSelectQueryResult');
        tableClickSpy = vi.spyOn(component, 'onTableNodeClick');
    });

    afterEach(() => {
        vi.clearAllMocks();
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
            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one div.accordion-item with header and non-collapsible body yet in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);
                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);

                const itemBodyDes = getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
                const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                expectToContain(itemBodyEl.classList, 'accordion-collapse');
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

        it('... should have `queryResult` input', async () => {
            expectToEqual(component.queryResult$, expectedQueryResult$);
            await expect(lastValueFrom(component.queryResult$)).resolves.not.toThrow();
            await expect(lastValueFrom(component.queryResult$)).resolves.toEqual(expectedQueryResult);
        });

        it('... should have `queryTime` input', () => {
            expectToBe(component.queryTime, expectedQueryTime);
        });

        it('... should have `isFullscreen` input', () => {
            expectToBe(component.isFullscreen, expectedIsFullscreen);
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-select-results.accordion-item',
                        1,
                        1
                    );
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
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

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
                    await clickAndAwaitChanges(btnDes[0], fixture);

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
                    it('... queryResult$ is EMPTY', async () => {
                        // Mock empty observable
                        component.queryResult$ = EMPTY;
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is undefined', async () => {
                        // Mock undefined response
                        component.queryResult$ = undefined;
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is null', async () => {
                        // Mock null response
                        component.queryResult$ = null;
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... should have default spinnerText on TwelveToneSpinnerComponent', async () => {
                        // Mock null response
                        component.queryResult$ = null;
                        await detectChangesOnPush(fixture);

                        const spinnerDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TwelveToneSpinnerStubComponent,
                            1,
                            1
                        );
                        const spinnerCmp = spinnerDes[0].injector.get(
                            TwelveToneSpinnerStubComponent
                        ) as TwelveToneSpinnerStubComponent;

                        expectToBe(spinnerCmp.spinnerText(), 'loading');
                    });
                });

                describe('... should contain item body with SparqlNoResultsStubComponent (stubbed) if ... ', () => {
                    it('... no results are available', async () => {
                        // Mock empty response
                        component.queryResult$ = observableOf({ head: { vars: [] }, body: { bindings: [] } });
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.head is undefined', async () => {
                        // Mock undefined response
                        const undefinedQueryResult: QuerySelectResult = {
                            head: undefined,
                            body: { bindings: [{ test: 'Test' }] },
                        };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.body is undefined', async () => {
                        // Mock undefined response
                        const undefinedQueryResult: QuerySelectResult = { head: { vars: ['Test'] }, body: undefined };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.head and queryResult.body are undefined', async () => {
                        // Mock undefined response
                        const undefinedQueryResult: QuerySelectResult = { head: undefined, body: undefined };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        await detectChangesOnPush(fixture);

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
                beforeEach(async () => {
                    // Set fullscreen mode
                    component.isFullscreen = true;
                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-visualizer-select-results.accordion-item',
                        1,
                        1
                    );
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
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    // Check button content
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expect(btnEl.disabled).toBeTruthy();

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-visualizer-select-results > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    // Click header button
                    await clickAndAwaitChanges(btnDes[0], fixture);

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
                    it('... queryResult$ is EMPTY', async () => {
                        // Mock empty observable
                        component.queryResult$ = EMPTY;
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is undefined', async () => {
                        // Mock undefined response
                        component.queryResult$ = undefined;
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... queryResult$ is null', async () => {
                        // Mock null response
                        component.queryResult$ = null;
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerStubComponent, 1, 1);
                    });

                    it('... should have default spinnerText on TwelveToneSpinnerComponent', async () => {
                        // Mock null response
                        component.queryResult$ = null;
                        await detectChangesOnPush(fixture);

                        const spinnerDes = getAndExpectDebugElementByDirective(
                            compDe,
                            TwelveToneSpinnerStubComponent,
                            1,
                            1
                        );
                        const spinnerCmp = spinnerDes[0].injector.get(
                            TwelveToneSpinnerStubComponent
                        ) as TwelveToneSpinnerStubComponent;

                        expectToBe(spinnerCmp.spinnerText(), 'loading');
                    });
                });

                describe('... should contain item body with SparqlNoResultsStubComponent (stubbed) if ... ', () => {
                    it('... no results are available', async () => {
                        // Mock empty response
                        component.queryResult$ = observableOf({ head: { vars: [] }, body: { bindings: [] } });
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.head is undefined', async () => {
                        // Mock undefined response
                        const undefinedQueryResult: QuerySelectResult = {
                            head: undefined,
                            body: { bindings: [{ test: 'Test' }] },
                        };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.body is undefined', async () => {
                        // Mock undefined response
                        const undefinedQueryResult: QuerySelectResult = { head: { vars: ['Test'] }, body: undefined };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        await detectChangesOnPush(fixture);

                        const bodyDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div#awg-graph-visualizer-select-results-collapse > div.accordion-body',
                            1,
                            1
                        );

                        // SparqlNoResultsStubComponent
                        getAndExpectDebugElementByDirective(bodyDes[0], SparqlNoResultsStubComponent, 1, 1);
                    });

                    it('... queryResult.head and queryResult.body are undefined', async () => {
                        // Mock undefined response
                        const undefinedQueryResult: QuerySelectResult = { head: undefined, body: undefined };
                        component.queryResult$ = observableOf(undefinedQueryResult);
                        await detectChangesOnPush(fixture);

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

        describe('#isValidSelectQueryResult()', () => {
            it('... should have a method `isValidSelectQueryResult`', () => {
                expect(component.isValidSelectQueryResult).toBeDefined();
            });

            it('... should be triggered from ngbAccordionBody', () => {
                expectSpyCall(isValidSelectQueryResultSpy, 3, expectedQueryResult);
            });

            it('... should be triggered by change of queryResult', async () => {
                expectSpyCall(isValidSelectQueryResultSpy, 3, expectedQueryResult);

                // Mock another queryResult
                const queryResult = {
                    head: { vars: ['AnotherTestHeader'] },
                    body: { bindings: [{ testKey: 'AnotherTestValue' }] },
                };
                component.queryResult$ = observableOf(queryResult);

                await detectChangesOnPush(fixture);

                expectSpyCall(isValidSelectQueryResultSpy, 4, queryResult);
            });

            describe('... should return false if', () => {
                it.each([
                    {
                        desc: 'queryResult is a string message',
                        query: 'Query returned no results',
                    },
                    {
                        desc: 'queryResult.head is undefined',
                        query: { head: undefined, body: { bindings: [{ test: 'Test' }] } },
                    },
                    {
                        desc: 'queryResult.body is undefined',
                        query: { head: { vars: ['Test'] }, body: undefined },
                    },
                    {
                        desc: 'queryResult.head and queryResult.body are undefined',
                        query: { head: undefined, body: undefined },
                    },
                    {
                        desc: 'queryResult.head.vars is empty array',
                        query: { head: { vars: [] }, body: { bindings: [{ testKey: 'TestValue' }] } },
                    },
                    {
                        desc: 'queryResult.body.bindings is empty array',
                        query: { head: { vars: ['TestHeader'] }, body: { bindings: [] } },
                    },
                    {
                        desc: 'queryResult.head.vars & queryResult.body.bindings are empty arrays',
                        query: { head: { vars: [] }, body: { bindings: [] } },
                    },
                ])('... $desc', async ({ query }) => {
                    isValidSelectQueryResultSpy.mockClear();

                    component.queryResult$ = observableOf(query);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(isValidSelectQueryResultSpy, 1, query);
                    expectToBe(component.isValidSelectQueryResult(query), false);
                });
            });

            describe('... should return true if', () => {
                it.each([
                    {
                        desc: 'queryResult is valid',
                        query: {
                            head: { vars: ['TestHeader'] },
                            body: { bindings: [{ testKey: 'TestValue' }] },
                        },
                    },
                    {
                        desc: 'queryResult changes to another valid result',
                        query: {
                            head: { vars: ['AnotherTestHeader'] },
                            body: { bindings: [{ testKey: 'AnotherTestValue' }] },
                        },
                    },
                ])('... $desc', async ({ query }) => {
                    isValidSelectQueryResultSpy.mockClear();

                    component.queryResult$ = observableOf(query);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(isValidSelectQueryResultSpy, 1, query);
                    expectToBe(component.isValidSelectQueryResult(query), true);
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
    });
});
