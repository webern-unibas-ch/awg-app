import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap/dropdown';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
} from '@testing/expect-helper';

import { ClickDirective } from '@awg-shared/click/click.directive';
import { GraphSparqlQuery } from '@awg-views/edition-view/models/graph.model';

import { ExampleQueriesComponent } from './example-queries.component';

describe('ExampleQueriesComponent (DONE)', () => {
    let component: ExampleQueriesComponent;
    let fixture: ComponentFixture<ExampleQueriesComponent>;
    let compDe: DebugElement;

    let expectedConstructQuery1: GraphSparqlQuery;
    let expectedConstructQuery2: GraphSparqlQuery;
    let expectedSelectQuery1: GraphSparqlQuery;
    let expectedSelectQuery2: GraphSparqlQuery;
    let expectedQueryList: GraphSparqlQuery[];

    let emitQuerySelectRequestSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ExampleQueriesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExampleQueriesComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedConstructQuery1 = {
            queryType: 'construct',
            queryLabel: 'Test Query 1',
            queryString: 'CONSTRUCT WHERE { ?test ?has ?success }',
        };
        expectedConstructQuery2 = {
            queryType: 'construct',
            queryLabel: 'Test Query 2',
            queryString: 'CONSTRUCT WHERE { ?success a ?test }',
        };
        expectedSelectQuery1 = {
            queryType: 'select',
            queryLabel: 'Test Query 3',
            queryString: 'SELECT * WHERE { ?test ?has ?success }',
        };
        expectedSelectQuery2 = {
            queryType: 'select',
            queryLabel: 'Test Query 4',
            queryString: 'SELECT * WHERE { ?success a ?test }',
        };
        expectedQueryList = [
            expectedConstructQuery1,
            expectedConstructQuery2,
            expectedSelectQuery1,
            expectedSelectQuery2,
        ];

        // Spies
        emitQuerySelectRequestSpy = vi.spyOn(component.querySelectRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `queryList`', () => {
            expectToBe(isSignal(component.queryList), true);

            expect(() => component.queryList()).toThrow();
        });

        it('... should have input signal `activeQuery` to hold undefined initially', () => {
            expectToBe(isSignal(component.activeQuery), true);
            expect(component.activeQuery()).toBeUndefined();
        });

        it('... should have variable `dropdownPopperOptions` to set a fixed positioning strategy', () => {
            const defaultOptions = { placement: 'bottom-end' as const, modifiers: [] };

            expectToEqual(component.dropdownPopperOptions(defaultOptions), { ...defaultOptions, strategy: 'fixed' });
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-example-query-btn-group with a disabled label button and a dropdown toggle button', () => {
                const btnGroupDes = getAndExpectDebugElementByCss(compDe, 'div.awg-example-query-btn-group', 1, 1);
                const btnDes = getAndExpectDebugElementByCss(btnGroupDes[0], 'div > button.btn', 2, 2);
                const labelBtnEl: HTMLButtonElement = btnDes[0].nativeElement;
                const toggleBtnEl: HTMLButtonElement = btnDes[1].nativeElement;

                expectToBe(labelBtnEl.disabled, true);
                expectToBe(labelBtnEl.getAttribute('aria-disabled'), 'true');
                expectToBe(labelBtnEl.textContent.trim(), 'Beispielabfragen');

                expectToContain(toggleBtnEl.classList, 'dropdown-toggle-split');
                expectToBe(toggleBtnEl.getAttribute('aria-label'), 'Toggle dropdown');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('queryList', expectedQueryList);
            fixture.componentRef.setInput('activeQuery', expectedConstructQuery1);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `queryList` to hold the provided query list', () => {
            expectToEqual(component.queryList(), expectedQueryList);
        });

        it('... should have input signal `activeQuery` to hold the provided query', () => {
            expectToEqual(component.activeQuery(), expectedConstructQuery1);
        });

        it('... should have computed signal `constructQueries` to hold the CONSTRUCT queries of the query list', () => {
            expectToEqual(component.constructQueries(), [expectedConstructQuery1, expectedConstructQuery2]);
        });

        it('... should have computed signal `selectQueries` to hold the SELECT queries of the query list', () => {
            expectToEqual(component.selectQueries(), [expectedSelectQuery1, expectedSelectQuery2]);
        });

        describe('VIEW', () => {
            it('... should pass down `dropdownPopperOptions` and no container to the NgbDropdown', () => {
                const btnGroupDes = getAndExpectDebugElementByCss(compDe, 'div.awg-example-query-btn-group', 1, 1);
                const ngbDropdown = btnGroupDes[0].injector.get(NgbDropdown);

                expectToBe(ngbDropdown.popperOptions, component.dropdownPopperOptions);
                expect(ngbDropdown.container).toBeFalsy();
            });

            it('... should contain one dropdown menu with a header per query type and a divider in between', () => {
                const menuDes = getAndExpectDebugElementByCss(compDe, 'div.dropdown-menu', 1, 1);
                const headerDes = getAndExpectDebugElementByCss(menuDes[0], 'h6.dropdown-header', 2, 2);

                expectToBe(headerDes[0].nativeElement.textContent, 'Graph-Ansicht (CONSTRUCT)');
                expectToBe(headerDes[1].nativeElement.textContent, 'Tabellen-Ansicht (SELECT)');

                getAndExpectDebugElementByCss(menuDes[0], 'div.dropdown-divider', 1, 1);
            });

            it('... should display the labels of the queries on the dropdown items', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.dropdown-menu > a.dropdown-item',
                    expectedQueryList.length,
                    expectedQueryList.length
                );

                expectToEqual(
                    aDes.map(aDe => aDe.nativeElement.textContent.trim()),
                    expectedQueryList.map(q => q.queryLabel)
                );
            });

            it('... should contain only the construct header and no divider if there are no SELECT queries', async () => {
                fixture.componentRef.setInput('queryList', [expectedConstructQuery1, expectedConstructQuery2]);
                await detectChangesOnPush(fixture);

                const menuDes = getAndExpectDebugElementByCss(compDe, 'div.dropdown-menu', 1, 1);
                const headerDes = getAndExpectDebugElementByCss(menuDes[0], 'h6.dropdown-header', 1, 1);

                expectToBe(headerDes[0].nativeElement.textContent, 'Graph-Ansicht (CONSTRUCT)');
                getAndExpectDebugElementByCss(menuDes[0], 'div.dropdown-divider', 0, 0);
                getAndExpectDebugElementByCss(menuDes[0], 'a.dropdown-item', 2, 2);
            });

            it('... should contain only the select header and no divider if there are no CONSTRUCT queries', async () => {
                fixture.componentRef.setInput('queryList', [expectedSelectQuery1, expectedSelectQuery2]);
                await detectChangesOnPush(fixture);

                const menuDes = getAndExpectDebugElementByCss(compDe, 'div.dropdown-menu', 1, 1);
                const headerDes = getAndExpectDebugElementByCss(menuDes[0], 'h6.dropdown-header', 1, 1);

                expectToBe(headerDes[0].nativeElement.textContent, 'Tabellen-Ansicht (SELECT)');
                getAndExpectDebugElementByCss(menuDes[0], 'div.dropdown-divider', 0, 0);
                getAndExpectDebugElementByCss(menuDes[0], 'a.dropdown-item', 2, 2);
            });

            it('... should disable the dropdown item of the active query', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.dropdown-menu > a.dropdown-item',
                    expectedQueryList.length,
                    expectedQueryList.length
                );

                expectToEqual(
                    aDes.map(aDe => aDe.nativeElement.classList.contains('disabled')),
                    [true, false, false, false]
                );
            });

            it('... should disable the dropdown item of an active query copy (same label and type)', async () => {
                fixture.componentRef.setInput('activeQuery', { ...expectedSelectQuery1 });
                await detectChangesOnPush(fixture);

                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.dropdown-menu > a.dropdown-item',
                    expectedQueryList.length,
                    expectedQueryList.length
                );

                expectToNotContain(aDes[0].nativeElement.classList, 'disabled');
                expectToContain(aDes[2].nativeElement.classList, 'disabled');
            });

            it('... should have `awgClick` on each dropdown item', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.dropdown-menu > a.dropdown-item',
                    expectedQueryList.length,
                    expectedQueryList.length
                );

                aDes.forEach(aDe => {
                    expect(aDe.injector.get(ClickDirective)).toBeTruthy();
                });
            });

            it('... should emit `querySelectRequest` with the query on `awgClick` of a dropdown item', () => {
                const aDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.dropdown-menu > a.dropdown-item',
                    expectedQueryList.length,
                    expectedQueryList.length
                );

                aDes[1].injector.get(ClickDirective).awgClick.emit(new Event('click'));

                expectSpyCall(emitQuerySelectRequestSpy, 1, expectedConstructQuery2);
            });
        });

        describe('METHODS', () => {
            describe('#isActive()', () => {
                it('... should have a method `isActive`', () => {
                    expect(component.isActive).toBeDefined();
                });

                it('... should be true for a query with the label and type of the active query', () => {
                    expectToBe(component.isActive({ ...expectedConstructQuery1, queryString: 'changed' }), true);
                });

                it.each([
                    { desc: 'another label', query: { ...expectedConstructQuery1, queryLabel: 'Other' } },
                    {
                        desc: 'another type',
                        query: { ...expectedConstructQuery1, queryType: 'select' } as GraphSparqlQuery,
                    },
                ])('... should be false for a query with $desc', ({ query }) => {
                    expectToBe(component.isActive(query), false);
                });

                it('... should be false if there is no active query', async () => {
                    fixture.componentRef.setInput('activeQuery', undefined);
                    await detectChangesOnPush(fixture);

                    expectToBe(component.isActive(expectedConstructQuery1), false);
                });
            });
        });
    });
});
