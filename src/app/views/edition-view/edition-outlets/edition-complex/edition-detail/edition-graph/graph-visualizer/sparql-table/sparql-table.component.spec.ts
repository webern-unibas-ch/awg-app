import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { DataFactory } from 'n3';

import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { TableComponent } from '@awg-shared/table/table.component';

import { SparqlSelectResult } from '../models/sparql-result.model';
import { DEFAULT_PREFIXES } from '../utils/prefix.utils';
import { SparqlTableComponent } from './sparql-table.component';
import { SPARQL_TABLE_UTILS } from './sparql-table.utils';

const { literal, namedNode } = DataFactory;

describe('SparqlTableComponent (DONE)', () => {
    let component: SparqlTableComponent;
    let fixture: ComponentFixture<SparqlTableComponent>;
    let compDe: DebugElement;

    let tableClickSpy: Spy;
    let emitSpy: Spy;

    let expectedQueryResult: SparqlSelectResult;
    let expectedTableTitle: string;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableComponent],
            declarations: [SparqlTableComponent],
        })
            .overrideComponent(TableComponent, { set: { template: '', imports: [] } })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlTableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedQueryResult = {
            kind: 'select',
            variables: ['test', 'success'],
            bindings: [{ test: namedNode(`${DEFAULT_PREFIXES['awg']}test`), success: literal('success value') }],
            prefixes: DEFAULT_PREFIXES,
        };

        expectedTableTitle = 'SELECT Anfrage';

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
            it('... should not display TableComponent (hollow)', () => {
                getAndExpectDebugElementByDirective(compDe, TableComponent, 0, 0);
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

        it('... should have signal `queryResult` to hold the expected result', () => {
            expectToEqual(component.queryResult(), expectedQueryResult);
        });

        it('... should have computed signal `tableRows` to hold the table rows of the result', () => {
            expectToBe(isSignal(component.tableRows), true);
            expectToEqual(component.tableRows(), SPARQL_TABLE_UTILS.toTableRows(expectedQueryResult));
        });

        it('... should have recomputed signal `tableRows` when the result changes', async () => {
            const otherResult: SparqlSelectResult = { ...expectedQueryResult, bindings: [] };
            fixture.componentRef.setInput('queryResult', otherResult);

            expectToEqual(component.tableRows(), []);
        });

        describe('VIEW', () => {
            it('... should contain one TableComponent (hollow) if results are available', () => {
                getAndExpectDebugElementByDirective(compDe, TableComponent, 1, 1);
            });

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
