import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { expectSpyCall, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { SearchResult } from '@awg-views/edition-view/edition-outlets/edition-graph/graph-visualizer/models';
import { SparqlTableComponent } from './sparql-table.component';

@Component({ selector: 'awg-table', template: '' })
class TableStubComponent {
    @Input() tableTitle: string;
    @Input() headerInputData: any;
    @Input() rowInputData: any;
    @Output() clickedTableValueRequest: EventEmitter<string> = new EventEmitter();
    @Output() clickedTableRowRequest: EventEmitter<string> = new EventEmitter();
}

describe('SparqlTableComponent (DONE)', () => {
    let component: SparqlTableComponent;
    let fixture: ComponentFixture<SparqlTableComponent>;
    let compDe: DebugElement;

    let expectedQueryResult: SearchResult;
    let expectedQueryTime: number;

    let expectedTableTitle: string;

    let tableClickSpy: Spy;
    let emitSpy: Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbPaginationModule],
            declarations: [SparqlTableComponent, TableStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlTableComponent);
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
        expectedQueryTime = 5000;

        expectedTableTitle = 'SELECT Anfrage';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        tableClickSpy = spyOn(component, 'onTableNodeClick').and.callThrough();
        emitSpy = spyOn(component.clickedTableRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have queryResult', () => {
            expect(component.queryResult).withContext('should be undefined').toBeUndefined();
        });

        it('should not have queryTime', () => {
            expect(component.queryTime).withContext('should be undefined').toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should not display TableComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TableStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.queryResult = expectedQueryResult;
            component.queryTime = expectedQueryTime;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `queryResult` input', () => {
            expect(component.queryResult).withContext('should be defined').toBeDefined();
            expect(component.queryResult)
                .withContext(`should equal ${expectedQueryResult}`)
                .toEqual(expectedQueryResult);
        });

        it('should have `queryTime` input', () => {
            expect(component.queryTime).withContext('should be defined').toBeDefined();
            expect(component.queryTime).withContext(`should equal ${expectedQueryTime}`).toEqual(expectedQueryTime);
        });

        describe('VIEW', () => {
            it('... should contain one TableComponent (stubbed) if results are available', () => {
                getAndExpectDebugElementByDirective(compDe, TableStubComponent, 1, 1);
            });

            it('... should pass down `tableTitle` to table component', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, TableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(TableStubComponent) as TableStubComponent;

                expect(tableCmp.tableTitle).toBeDefined();
                expect(tableCmp.tableTitle)
                    .withContext(`should equal ${expectedTableTitle}`)
                    .toEqual(expectedTableTitle);
            });

            it('... should pass down `headerInputData` to table component', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, TableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(TableStubComponent) as TableStubComponent;

                expect(tableCmp.headerInputData).toBeDefined();
                expect(tableCmp.headerInputData)
                    .withContext(`should equal ${expectedQueryResult.head.vars}`)
                    .toEqual(expectedQueryResult.head.vars);
            });

            it('... should pass down `rowInputData` to table component', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, TableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(TableStubComponent) as TableStubComponent;

                expect(tableCmp.rowInputData).toBeDefined();
                expect(tableCmp.rowInputData)
                    .withContext(`should equal ${expectedQueryResult.body.bindings}`)
                    .toEqual(expectedQueryResult.body.bindings);
            });
        });

        describe('#onTableNodeClick', () => {
            it('... should trigger on clickedTableValueRequest event from TableComponent', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, TableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(TableStubComponent) as TableStubComponent;

                const expectedUri = 'example:Test';
                tableCmp.clickedTableValueRequest.emit(expectedUri);

                expectSpyCall(tableClickSpy, 1, expectedUri);
            });

            it('... should not emit anything if no URI is provided', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, TableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(TableStubComponent) as TableStubComponent;

                // Node is undefined
                tableCmp.clickedTableValueRequest.emit(undefined);

                expectSpyCall(tableClickSpy, 1, undefined);
                expectSpyCall(emitSpy, 0);
            });

            it('... should emit provided URI on click', () => {
                const tableDes = getAndExpectDebugElementByDirective(compDe, TableStubComponent, 1, 1);
                const tableCmp = tableDes[0].injector.get(TableStubComponent) as TableStubComponent;

                const expectedUri = 'example:Test';
                tableCmp.clickedTableValueRequest.emit(expectedUri);

                expectSpyCall(tableClickSpy, 1, expectedUri);
                expectSpyCall(emitSpy, 1, expectedUri);
            });
        });
    });
});
