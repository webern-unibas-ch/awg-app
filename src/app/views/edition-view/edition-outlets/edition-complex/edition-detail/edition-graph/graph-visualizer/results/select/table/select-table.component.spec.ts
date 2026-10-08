import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { DataFactory } from 'n3';

import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { TableComponent } from '@awg-shared/table/table.component';

import { SparqlSelectResult } from '../../../models/sparql-result.model';
import { DEFAULT_PREFIXES } from '../../../utils/prefix.utils';

import { SelectTableComponent } from './select-table.component';
import { SELECT_TABLE_UTILS } from './select-table.utils';

const { literal, namedNode } = DataFactory;

describe('SelectTableComponent (DONE)', () => {
    let component: SelectTableComponent;
    let fixture: ComponentFixture<SelectTableComponent>;
    let compDe: DebugElement;

    let tableClickSpy: Spy;
    let emitSpy: Spy;

    let expectedQueryResult: SparqlSelectResult;
    let expectedTableTitle: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SelectTableComponent],
        })
            .overrideComponent(TableComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        // Test data
        expectedQueryResult = {
            kind: 'select',
            variables: ['test', 'success'],
            bindings: [{ test: namedNode(`${DEFAULT_PREFIXES['awg']}test`), success: literal('success value') }],
            prefixes: DEFAULT_PREFIXES,
        };

        expectedTableTitle = 'SELECT Anfrage';

        // Create component fixture
        fixture = TestBed.createComponent(SelectTableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Spies
        tableClickSpy = vi.spyOn(component, 'onTableNodeClick');
        emitSpy = vi.spyOn(component.clickedTableRequest, 'emit');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `queryResult`', () => {
            expectToBe(isSignal(component.queryResult), true);

            expect(() => component.queryResult()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one TableComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, TableComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('queryResult', expectedQueryResult);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `queryResult` to hold the provided result', () => {
            expectToEqual(component.queryResult(), expectedQueryResult);
        });

        it('... should have computed signal `tableRows` to hold the table rows of the result', () => {
            expectToBe(isSignal(component.tableRows), true);
            expectToEqual(component.tableRows(), SELECT_TABLE_UTILS.toTableRows(expectedQueryResult));
        });

        it('... should have recomputed signal `tableRows` to hold no rows for a result without bindings', () => {
            const otherResult: SparqlSelectResult = { ...expectedQueryResult, bindings: [] };
            fixture.componentRef.setInput('queryResult', otherResult);

            expectToEqual(component.tableRows(), []);
        });

        describe('VIEW', () => {
            it('... should pass down `tableTitle` to TableComponent (hollow)', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, TableComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(TableComponent);

                expectToBe(tableCmp.tableTitle(), expectedTableTitle);
            });

            it('... should pass down `headerInputData` to TableComponent (hollow)', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, TableComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(TableComponent);

                expectToEqual(tableCmp.headerInputData(), expectedQueryResult.variables);
            });

            it('... should pass down `rowInputData` to TableComponent (hollow)', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, TableComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(TableComponent);

                expectToBe(tableCmp.rowInputData(), component.tableRows());
                expectToEqual(tableCmp.rowInputData(), [
                    {
                        test: { type: 'uri', value: `${DEFAULT_PREFIXES['awg']}test`, label: 'awg:test' },
                        success: { type: 'literal', value: 'success value', label: 'success value' },
                    },
                ]);
            });
        });

        describe('METHODS', () => {
            describe('#onTableNodeClick()', () => {
                it('... should have a method `onTableNodeClick`', () => {
                    expect(component.onTableNodeClick).toBeDefined();
                });

                it('... should trigger on clickedTableValueRequest event from TableComponent (hollow)', () => {
                    const tableDes = getAndExpectDebugElementByDirective(compDe, TableComponent, 1, 1);
                    const tableCmp = tableDes[0].injector.get(TableComponent);

                    const expectedUri = 'example:Test';
                    tableCmp.clickedTableValueRequest.emit(expectedUri);

                    expectSpyCall(tableClickSpy, 1, expectedUri);
                });

                it('... should not emit anything if no URI is provided', () => {
                    const tableDes = getAndExpectDebugElementByDirective(compDe, TableComponent, 1, 1);
                    const tableCmp = tableDes[0].injector.get(TableComponent);

                    // Node is undefined
                    tableCmp.clickedTableValueRequest.emit(undefined as unknown as string);

                    expectSpyCall(tableClickSpy, 1, undefined);
                    expectSpyCall(emitSpy, 0);
                });

                it('... should emit provided URI on click', () => {
                    const tableDes = getAndExpectDebugElementByDirective(compDe, TableComponent, 1, 1);
                    const tableCmp = tableDes[0].injector.get(TableComponent);

                    const expectedUri = 'example:Test';
                    tableCmp.clickedTableValueRequest.emit(expectedUri);

                    expectSpyCall(tableClickSpy, 1, expectedUri);
                    expectSpyCall(emitSpy, 1, expectedUri);
                });
            });
        });
    });
});
