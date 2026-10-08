import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { DataFactory } from 'n3';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { SparqlResult, SparqlSelectResult } from '../../models/sparql-result.model';
import { GraphResultsEmptyComponent } from '../empty/graph-results-empty.component';
import { SelectTableComponent } from './table/select-table.component';
import { DEFAULT_PREFIXES } from '../../utils/prefix.utils';
import { GraphResultsSelectComponent } from './graph-results-select.component';

const { literal, namedNode } = DataFactory;

/**
 * Helper function: createSelectResult.
 *
 * It creates a select result with the given variables and bindings.
 */
const createSelectResult = (variables: string[], bindings: SparqlSelectResult['bindings']): SparqlSelectResult => ({
    kind: 'select',
    variables,
    bindings,
    prefixes: DEFAULT_PREFIXES,
});

describe('GraphResultsSelectComponent (DONE)', () => {
    let component: GraphResultsSelectComponent;
    let fixture: ComponentFixture<GraphResultsSelectComponent>;
    let compDe: DebugElement;

    let expectedQueryResult: SparqlSelectResult;
    let expectedIsFullscreen: boolean;

    let emitClickedTableRequestSpy: Spy;
    let isValidSelectQueryResultSpy: Spy;
    let tableClickSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbAccordionModule, GraphResultsSelectComponent],
        })
            .overrideComponent(GraphResultsEmptyComponent, { set: { template: '', imports: [] } })
            .overrideComponent(SelectTableComponent, { set: { template: '', imports: [] } })
            .overrideComponent(TwelveToneSpinnerComponent, { set: { template: '', imports: [] } })
            .compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GraphResultsSelectComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedQueryResult = createSelectResult(
            ['test', 'success'],
            [{ test: namedNode(`${DEFAULT_PREFIXES['awg']}test`), success: literal('success value') }]
        );
        expectedIsFullscreen = false;

        // Spies
        emitClickedTableRequestSpy = vi.spyOn(component.clickedTableRequest, 'emit');
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
        it('... should have input signal `queryResult` to hold undefined initially', () => {
            expectToBe(isSignal(component.queryResult), true);
            expect(component.queryResult()).toBeUndefined();
        });

        it('... should have input signal `isFullscreenMode` to hold false initially', () => {
            expectToBe(isSignal(component.isFullscreenMode), true);
            expectToBe(component.isFullscreenMode(), false);
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
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('queryResult', expectedQueryResult);
            fixture.componentRef.setInput('isFullscreenMode', expectedIsFullscreen);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `queryResult` to hold the provided query result', () => {
            expectToBe(component.queryResult(), expectedQueryResult);
        });

        it('... should have input signal `isFullscreenMode` to hold the provided fullscreen flag', () => {
            expectToBe(component.isFullscreenMode(), expectedIsFullscreen);
        });

        describe('VIEW', () => {
            describe('not in fullscreen mode', () => {
                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-results-select.accordion-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-results-select > div.accordion-header',
                        1,
                        1
                    );

                    // Body open (div.accordion-collapse)
                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-results-select-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.disabled, false);
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body is collapsed
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select > div.accordion-collapse',
                        1,
                        1,
                        'collapsed'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'collapse');

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body is open again
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should contain TwelveToneSpinnerComponent (hollow) in item body while loading (queryResult is undefined)', async () => {
                    fixture.componentRef.setInput('queryResult', undefined);
                    await detectChangesOnPush(fixture);

                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select-collapse > div.accordion-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(bodyDes[0], TwelveToneSpinnerComponent, 1, 1);
                });

                it('... should contain GraphResultsEmptyComponent (hollow) in item body if the query result is not valid', async () => {
                    fixture.componentRef.setInput('queryResult', createSelectResult([], []));
                    await detectChangesOnPush(fixture);

                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select-collapse > div.accordion-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(bodyDes[0], GraphResultsEmptyComponent, 1, 1);
                    getAndExpectDebugElementByDirective(bodyDes[0], SelectTableComponent, 0, 0);
                });

                it('... should contain SelectTableComponent (hollow) in item body if results are available', () => {
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select-collapse > div.accordion-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(bodyDes[0], SelectTableComponent, 1, 1);
                    getAndExpectDebugElementByDirective(bodyDes[0], GraphResultsEmptyComponent, 0, 0);
                });

                it('... should pass down `queryResult` to SelectTableComponent (hollow)', () => {
                    const selectTableDes = getAndExpectDebugElementByDirective(compDe, SelectTableComponent, 1, 1);
                    const selectTableCmp = selectTableDes[0].injector.get(SelectTableComponent);

                    expectToEqual(selectTableCmp.queryResult(), expectedQueryResult);
                });
            });

            describe('in fullscreen mode', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('isFullscreenMode', true);
                    await detectChangesOnPush(fixture);
                });

                it('... should contain one div.accordion-item with header and open body in div.accordion', () => {
                    const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);

                    const itemDes = getAndExpectDebugElementByCss(
                        accordionDes[0],
                        'div#awg-graph-results-select.accordion-item',
                        1,
                        1
                    );
                    getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-results-select > div.accordion-header',
                        1,
                        1
                    );

                    const itemBodyDes = getAndExpectDebugElementByCss(
                        itemDes[0],
                        'div#awg-graph-results-select-collapse',
                        1,
                        1
                    );
                    const itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should display disabled item header button', () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);
                    const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

                    expectToBe(btnEl.disabled, true);
                    expectToBe(btnEl.textContent, 'Resultat');
                });

                it('... should not toggle item body on click', async () => {
                    const itemHeaderDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select > div.accordion-header',
                        1,
                        1
                    );

                    const btnDes = getAndExpectDebugElementByCss(itemHeaderDes[0], 'button.accordion-button', 1, 1);

                    // Item body is open
                    let itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    let itemBodyEl: HTMLDivElement = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');

                    await clickAndAwaitChanges(btnDes[0], fixture);

                    // Item body does not close
                    itemBodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select > div.accordion-collapse',
                        1,
                        1,
                        'open'
                    );
                    itemBodyEl = itemBodyDes[0].nativeElement;

                    expectToContain(itemBodyEl.classList, 'show');
                });

                it('... should contain SelectTableComponent (hollow) in item body if results are available', () => {
                    const bodyDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div#awg-graph-results-select-collapse > div.accordion-body',
                        1,
                        1
                    );

                    getAndExpectDebugElementByDirective(bodyDes[0], SelectTableComponent, 1, 1);
                });
            });
        });

        describe('METHODS', () => {
            describe('#isValidSelectQueryResult()', () => {
                it('... should have a method `isValidSelectQueryResult`', () => {
                    expect(component.isValidSelectQueryResult).toBeDefined();
                });

                it('... should be triggered from ngbAccordionBody with the query result', () => {
                    expectSpyCall(isValidSelectQueryResultSpy, 3, expectedQueryResult);
                });

                it('... should be triggered by change of the query result', async () => {
                    const queryResult = createSelectResult(
                        ['anotherTestHeader'],
                        [{ anotherTestHeader: literal('AnotherTestValue') }]
                    );
                    fixture.componentRef.setInput('queryResult', queryResult);
                    await detectChangesOnPush(fixture);

                    expectSpyCall(isValidSelectQueryResultSpy, 4, queryResult);
                });

                describe('... should be false if', () => {
                    it.each<{ desc: string; query: SparqlResult | null | undefined }>([
                        { desc: 'queryResult is undefined', query: undefined },
                        { desc: 'queryResult is null', query: null },
                        {
                            desc: 'queryResult is a construct result',
                            query: { kind: 'construct', quads: [], prefixes: DEFAULT_PREFIXES },
                        },
                        {
                            desc: 'queryResult is an unsupported result',
                            query: { kind: 'unsupported', queryType: 'ask' },
                        },
                        {
                            desc: 'queryResult has no variables',
                            query: createSelectResult([], [{ testHeader: literal('TestValue') }]),
                        },
                        {
                            desc: 'queryResult has no bindings',
                            query: createSelectResult(['testHeader'], []),
                        },
                        {
                            desc: 'queryResult has neither variables nor bindings',
                            query: createSelectResult([], []),
                        },
                    ])('... $desc', ({ query }) => {
                        expectToBe(component.isValidSelectQueryResult(query), false);
                    });
                });

                describe('... should be true if', () => {
                    it('... queryResult is a select result with variables and bindings', () => {
                        expectToBe(component.isValidSelectQueryResult(expectedQueryResult), true);
                    });
                });
            });

            describe('#onTableNodeClick()', () => {
                it('... should have a method `onTableNodeClick`', () => {
                    expect(component.onTableNodeClick).toBeDefined();
                });

                it('... should trigger on clickedTableRequest event from SelectTableComponent (hollow)', () => {
                    const selectTableDes = getAndExpectDebugElementByDirective(compDe, SelectTableComponent, 1, 1);
                    const selectTableCmp = selectTableDes[0].injector.get(SelectTableComponent);

                    const expectedUri = 'example:Test';
                    selectTableCmp.clickedTableRequest.emit(expectedUri);

                    expectSpyCall(tableClickSpy, 1, expectedUri);
                });

                it('... should not emit anything if no URI is provided', () => {
                    component.onTableNodeClick(undefined as unknown as string);

                    expectSpyCall(emitClickedTableRequestSpy, 0);
                });

                it('... should emit provided URI on click', () => {
                    const expectedUri = 'example:Test';
                    component.onTableNodeClick(expectedUri);

                    expectSpyCall(emitClickedTableRequestSpy, 1, expectedUri);
                });
            });
        });
    });
});
