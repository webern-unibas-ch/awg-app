import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import Spy = jasmine.Spy;

import { EMPTY, lastValueFrom } from 'rxjs';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { BUTTON_CLICK_EVENTS, clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { OrderByPipe } from '@awg-shared/order-by-pipe/order-by.pipe';

import { TableData, TableOptions, TablePaginatorOptions } from './models';
import { TableComponent } from './table.component';

// Mock components
@Component({ selector: 'awg-table-pagination', template: '' })
class TablePaginationStubComponent {
    @Input()
    collectionSize: number;
    @Input()
    page: number;
    @Output()
    pageChange: EventEmitter<number> = new EventEmitter();
    @Output()
    pageChangeRequest: EventEmitter<number> = new EventEmitter();
}

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('TableComponent', () => {
    let component: TableComponent;
    let fixture: ComponentFixture<TableComponent>;
    let compDe: DebugElement;

    let initSpy: Spy;
    let onSortSpy: Spy;
    let onPageSizeChangeSpy: Spy;
    let paginateRowsSpy: Spy;
    let onTableValueClickSpy: Spy;
    let onTableRowClickSpy: Spy;
    let clickedTableValueRequestSpy: Spy;
    let clickedTableRowRequestSpy: Spy;

    let expectedTableTitle: string;
    let expectedHeaderInputData: any;
    let expectedRowInputData: any;
    let expectedTableData: TableData;
    let expectedTableOptions: TableOptions;
    let expectedPaginatorOptions: TablePaginatorOptions;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, FormsModule, NgbHighlight, NgbPaginationModule],
            declarations: [TableComponent, TablePaginationStubComponent, TwelveToneSpinnerStubComponent, OrderByPipe],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedTableTitle = 'Table title';
        expectedHeaderInputData = ['column1', 'column2', 'column3'];
        expectedRowInputData = [
            {
                column1: { value: 'Value Column 1 Row 1', label: 'ValueColumn1Row1', type: 'uri' },
                column2: { value: 'Value Column 2 Row 1', label: 'ValueColumn2Row1', type: 'uri' },
                column3: { value: 'Value Column 3 Row 1', label: 'ValueColumn3Row1', type: 'uri' },
            },
            {
                column1: { value: 'Value Column 1 Row 2', label: 'ValueColumn1Row2', type: 'uri' },
                column2: { value: 'Value Column 2 Row 2', label: 'ValueColumn2Row2', type: 'uri' },
                column3: { value: 'Value Column 3 Row 2', label: 'ValueColumn3Row2', type: 'uri' },
            },
            {
                column1: { value: 'Value Column 1 Row 3', label: 'ValueColumn1Row3', type: 'uri' },
                column2: { value: 'Value Column 2 Row 3', label: 'ValueColumn2Row3', type: 'uri' },
                column3: { value: 'Value Column 3 Row 3', label: 'ValueColumn3Row3', type: 'uri' },
            },
            {
                column1: { value: 'Value Column 1 Row 4', label: 'ValueColumn1Row4', type: 'uri' },
                column2: { value: 'Value Column 2 Row 4', label: 'ValueColumn2Row4', type: 'uri' },
                column3: { value: 'Value Column 3 Row 4', label: 'ValueColumn3Row4', type: 'uri' },
            },
            {
                column1: { value: 'Value Column 1 Row 5', label: 'ValueColumn1Row5', type: 'uri' },
                column2: { value: 'Value Column 2 Row 5', label: 'ValueColumn2Row5', type: 'uri' },
                column3: { value: 'Value Column 3 Row 5', label: 'ValueColumn3Row5', type: 'uri' },
            },
            {
                column1: { value: 'Value Column 1 Row 6', label: 'ValueColumn1Row6', type: 'uri' },
                column2: { value: 'Value Column 2 Row 6', label: 'ValueColumn2Row6', type: 'uri' },
                column3: { value: 'Value Column 3 Row 6', label: 'ValueColumn3Row6', type: 'uri' },
            },
        ];
        expectedTableData = new TableData(expectedHeaderInputData, expectedRowInputData);
        expectedTableOptions = {
            selectedKey: '',
            sortKey: '',
            sortIcon: component.faSortDown,
            reverse: false,
            isCaseInsensitive: false,
        };
        expectedPaginatorOptions = new TablePaginatorOptions(
            1,
            10,
            [5, 10, 25, 50, 100, 200],
            expectedRowInputData.length
        );

        // Spies on methods
        initSpy = spyOn(component, 'initTable').and.callThrough();
        onSortSpy = spyOn(component, 'onSort').and.callThrough();
        onPageSizeChangeSpy = spyOn(component, 'onPageSizeChange').and.callThrough();
        paginateRowsSpy = spyOn(component as any, '_paginateRows').and.callThrough();
        onTableValueClickSpy = spyOn(component, 'onTableValueClick').and.callThrough();
        onTableRowClickSpy = spyOn(component, 'onTableRowClick').and.callThrough();
        clickedTableValueRequestSpy = spyOn(component.clickedTableValueRequest, 'emit').and.callThrough();
        clickedTableRowRequestSpy = spyOn(component.clickedTableRowRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have tableTitle yet', () => {
            expect(component.tableTitle).toBeUndefined();
        });

        it('should not have headerInputData yet', () => {
            expect(component.headerInputData).toBeUndefined();
        });

        it('should not have rowInputData yet', () => {
            expect(component.rowInputData).toBeUndefined();
        });

        it('should not have paginatorOptions yet', () => {
            expect(component.paginatorOptions).toBeUndefined();
        });

        it('should not have searchFilter yet', () => {
            expect(component.searchFilter).toBeUndefined();
        });

        it('should not have tableData yet', () => {
            expect(component.tableData).toBeUndefined();
        });

        it('should have faSortUp and faSortDown icons', () => {
            expect(component.faSortUp).toBeDefined();
            expect(component.faSortUp).withContext(`should be faSortUp`).toBe(faSortUp);

            expect(component.faSortDown).toBeDefined();
            expect(component.faSortDown).withContext(`should be faSortDown`).toBe(faSortDown);
        });

        it('should have tableOptions', () => {
            expect(component.tableOptions).toBeDefined();
            expect(component.tableOptions)
                .withContext(`should equal ${expectedTableOptions}`)
                .toEqual(expectedTableOptions);
        });

        it('should not have called initTable()', () => {
            expectSpyCall(initSpy, 0);
        });

        it('should not have called onSort()', () => {
            expectSpyCall(onSortSpy, 0);
        });

        it('should not have called onPageSizeChange()', () => {
            expectSpyCall(onPageSizeChangeSpy, 0);
        });

        describe('VIEW', () => {
            it('... should contain no form yet', () => {
                getAndExpectDebugElementByCss(compDe, 'form', 0, 0);
            });

            it('... should contain no pagination divs yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-pagination', 0, 0);
            });

            it('... should contain no table yet', () => {
                getAndExpectDebugElementByCss(compDe, 'table', 0, 0);
            });

            it('... should not display TwelveToneSpinnerComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.tableTitle = 'Table title';
            component.headerInputData = expectedHeaderInputData;
            component.rowInputData = expectedRowInputData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have tableTitle', () => {
            expect(component.tableTitle).toBeDefined();
            expect(component.tableTitle).withContext(`should be ${expectedTableTitle}`).toBe(expectedTableTitle);
        });

        it('should have headerInputData', () => {
            expect(component.headerInputData).toBeDefined();
            expect(component.headerInputData)
                .withContext(`should equal ${expectedHeaderInputData}`)
                .toEqual(expectedHeaderInputData);
        });

        it('should have rowInputData', () => {
            expect(component.rowInputData).toBeDefined();
            expect(component.rowInputData)
                .withContext(`should equal ${expectedRowInputData}`)
                .toEqual(expectedRowInputData);
        });

        describe('#initTable()', () => {
            it('should have an initTable() method', () => {
                expect(component.initTable).toBeDefined();
            });

            it('should have been called', () => {
                expectSpyCall(initSpy, 1);
            });

            describe('should set tableData', () => {
                it('... with headerInputData and rowInputData', waitForAsync(() => {
                    expect(component.tableData).toBeDefined();

                    expect(component.tableData.header).toBeDefined();
                    expect(component.tableData.header)
                        .withContext(`should equal ${expectedHeaderInputData}`)
                        .toEqual(expectedHeaderInputData);

                    expect(component.tableData.filteredRows).toBeDefined();
                    expect(component.tableData.filteredRows)
                        .withContext(`should equal ${expectedRowInputData}`)
                        .toEqual(expectedRowInputData);

                    expect(component.tableData.paginatedRows$).toBeDefined();
                    expectAsync(lastValueFrom(component.tableData.paginatedRows$))
                        .withContext(`should be resolved to ${expectedRowInputData}`)
                        .toBeResolvedTo(expectedRowInputData);

                    expect(component.tableData.totalRows$).toBeDefined();
                    expectAsync(lastValueFrom(component.tableData.totalRows$))
                        .withContext(`should be resolved to ${expectedRowInputData}`)
                        .toBeResolvedTo(expectedRowInputData);
                }));

                describe('... to empty object', () => {
                    it('... if headerInputData is not given', waitForAsync(() => {
                        component.headerInputData = undefined;
                        component.rowInputData = expectedRowInputData;

                        component.initTable();
                        fixture.detectChanges();

                        expect(component.tableData).toBeDefined();

                        expect(component.tableData.header).toBeDefined();
                        expect(component.tableData.header).withContext(`should equal []`).toEqual([]);

                        expect(component.tableData.filteredRows).toBeDefined();
                        expect(component.tableData.filteredRows).withContext(`should equal []`).toEqual([]);

                        expect(component.tableData.paginatedRows$).toBeDefined();
                        expectAsync(lastValueFrom(component.tableData.paginatedRows$))
                            .withContext(`should be resolved to []`)
                            .toBeResolvedTo([]);

                        expect(component.tableData.totalRows$).toBeDefined();
                        expectAsync(lastValueFrom(component.tableData.totalRows$))
                            .withContext(`should be resolved to []`)
                            .toBeResolvedTo([]);
                    }));

                    it('... if rowInputData is not given', waitForAsync(() => {
                        component.headerInputData = expectedHeaderInputData;
                        component.rowInputData = undefined;

                        component.initTable();
                        fixture.detectChanges();

                        expect(component.tableData).toBeDefined();

                        expect(component.tableData.header).toBeDefined();
                        expect(component.tableData.header).withContext(`should equal []`).toEqual([]);

                        expect(component.tableData.filteredRows).toBeDefined();
                        expect(component.tableData.filteredRows).withContext(`should equal []`).toEqual([]);

                        expect(component.tableData.paginatedRows$).toBeDefined();
                        expectAsync(lastValueFrom(component.tableData.paginatedRows$))
                            .withContext(`should be resolved to []`)
                            .toBeResolvedTo([]);

                        expect(component.tableData.totalRows$).toBeDefined();
                        expectAsync(lastValueFrom(component.tableData.totalRows$))
                            .withContext(`should be resolved to []`)
                            .toBeResolvedTo([]);
                    }));

                    it('... if both headerInputData and rowInputData are not given', waitForAsync(() => {
                        component.headerInputData = undefined;
                        component.rowInputData = undefined;

                        component.initTable();
                        fixture.detectChanges();

                        expect(component.tableData).toBeDefined();

                        expect(component.tableData.header).toBeDefined();
                        expect(component.tableData.header).withContext(`should equal []`).toEqual([]);

                        expect(component.tableData.filteredRows).toBeDefined();
                        expect(component.tableData.filteredRows).withContext(`should equal []`).toEqual([]);

                        expect(component.tableData.paginatedRows$).toBeDefined();
                        expectAsync(lastValueFrom(component.tableData.paginatedRows$))
                            .withContext(`should be resolved to []`)
                            .toBeResolvedTo([]);

                        expect(component.tableData.totalRows$).toBeDefined();
                        expectAsync(lastValueFrom(component.tableData.totalRows$))
                            .withContext(`should be resolved to []`)
                            .toBeResolvedTo([]);
                    }));
                });
            });

            it('should set paginatorOptions', () => {
                expect(component.paginatorOptions).toBeDefined();
                expect(component.paginatorOptions)
                    .withContext(`should equal ${expectedPaginatorOptions}`)
                    .toEqual(expectedPaginatorOptions);
            });

            it('should set paginatorOptions.collectionSize to tableData.rowInputData.length', () => {
                expect(component.paginatorOptions.collectionSize).toBeDefined();
                expect(component.paginatorOptions.collectionSize)
                    .withContext(`should equal ${expectedPaginatorOptions.collectionSize}`)
                    .toEqual(expectedPaginatorOptions.collectionSize);
            });

            it('should set paginatorOptions.collectionSize to 0 if tableData.rowInputData is not given', () => {
                component.rowInputData = undefined;
                component.initTable();
                fixture.detectChanges();

                expect(component.paginatorOptions.collectionSize).toBeDefined();
                expect(component.paginatorOptions.collectionSize).withContext(`should equal 0`).toEqual(0);
            });

            it('should trigger onSort()', () => {
                expectSpyCall(onSortSpy, 1);
            });

            it('should trigger onPageSizeChange()', () => {
                expectSpyCall(onPageSizeChangeSpy, 1);
            });
        });

        describe('#onPageSizeChange()', () => {
            it('should have an onPageSizeChange() method', () => {
                expect(component.onPageSizeChange).toBeDefined();
            });

            it('should have been called', () => {
                expectSpyCall(onPageSizeChangeSpy, 1);
            });

            it('should trigger on change of searchFilter in input', async () => {
                await fixture.whenStable(); // Needed to wait for the ngModelto be initialized, cf. https://github.com/angular/angular/issues/22606#issuecomment-514760743

                const expectedSearchFilter = 'test';
                const otherSearchFilter = 'other';

                const inputDe = getAndExpectDebugElementByCss(compDe, 'input[name="searchFilter"]', 1, 1);
                const inputEl = inputDe[0].nativeElement;

                inputEl.value = expectedSearchFilter;
                inputEl.dispatchEvent(new Event('input'));
                fixture.detectChanges();

                // First call happens on ngOnInit()
                expectSpyCall(onPageSizeChangeSpy, 2, expectedSearchFilter);
                expect(component.searchFilter).toBeDefined();
                expect(component.searchFilter)
                    .withContext(`should equal ${expectedSearchFilter}`)
                    .toBe(expectedSearchFilter);

                inputEl.value = otherSearchFilter;
                inputEl.dispatchEvent(new Event('input'));
                fixture.detectChanges();

                expectSpyCall(onPageSizeChangeSpy, 3, otherSearchFilter);
                expect(component.searchFilter).toBeDefined();
                expect(component.searchFilter).withContext(`should equal ${otherSearchFilter}`).toBe(otherSearchFilter);
            });

            it('should trigger on change of selectedPageSize in upper dropdown menu', fakeAsync(() => {
                const expectedItemNumber = component.paginatorOptions.pageSizeOptions.length;

                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-pagination', 2, 2);
                const dropdownDes1 = getAndExpectDebugElementByCss(
                    divDes[0],
                    'div.d-inline-block > div.dropdown-menu',
                    1,
                    1
                );
                const buttonDes1 = getAndExpectDebugElementByCss(
                    dropdownDes1[0],
                    'button.dropdown-item',
                    expectedItemNumber,
                    expectedItemNumber
                );

                // Click on first button
                clickAndAwaitChanges(buttonDes1[0], fixture);

                // First call happens on ngOnInit()
                expectSpyCall(onPageSizeChangeSpy, 2, ['', component.paginatorOptions.pageSizeOptions[0]]);

                // Click on second button
                clickAndAwaitChanges(buttonDes1[1], fixture);

                expectSpyCall(onPageSizeChangeSpy, 3, ['', component.paginatorOptions.pageSizeOptions[1]]);

                // Click on third button
                clickAndAwaitChanges(buttonDes1[2], fixture);

                expectSpyCall(onPageSizeChangeSpy, 4, ['', component.paginatorOptions.pageSizeOptions[2]]);

                // Click on fourth button
                clickAndAwaitChanges(buttonDes1[3], fixture);

                expectSpyCall(onPageSizeChangeSpy, 5, ['', component.paginatorOptions.pageSizeOptions[3]]);

                // Click on fifth button
                clickAndAwaitChanges(buttonDes1[4], fixture);

                expectSpyCall(onPageSizeChangeSpy, 6, ['', component.paginatorOptions.pageSizeOptions[4]]);

                // Click on sixth button
                clickAndAwaitChanges(buttonDes1[5], fixture);

                expectSpyCall(onPageSizeChangeSpy, 7, ['', component.paginatorOptions.pageSizeOptions[5]]);
            }));

            it('should trigger on change of selectedPageSize in lower dropdown menu', fakeAsync(() => {
                const expectedItemNumber = component.paginatorOptions.pageSizeOptions.length;

                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-pagination', 2, 2);
                const dropdownDes2 = getAndExpectDebugElementByCss(
                    divDes[1],
                    'div.d-inline-block > div.dropdown-menu',
                    1,
                    1
                );
                const buttonDes2 = getAndExpectDebugElementByCss(
                    dropdownDes2[0],
                    'button.dropdown-item',
                    expectedItemNumber,
                    expectedItemNumber
                );

                // Click on first button
                clickAndAwaitChanges(buttonDes2[0], fixture);

                // First call happens on ngOnInit()
                expectSpyCall(onPageSizeChangeSpy, 2, ['', component.paginatorOptions.pageSizeOptions[0]]);

                // Click on second button
                clickAndAwaitChanges(buttonDes2[1], fixture);

                expectSpyCall(onPageSizeChangeSpy, 3, ['', component.paginatorOptions.pageSizeOptions[1]]);

                // Click on third button
                clickAndAwaitChanges(buttonDes2[2], fixture);

                expectSpyCall(onPageSizeChangeSpy, 4, ['', component.paginatorOptions.pageSizeOptions[2]]);

                // Click on fourth button
                clickAndAwaitChanges(buttonDes2[3], fixture);

                expectSpyCall(onPageSizeChangeSpy, 5, ['', component.paginatorOptions.pageSizeOptions[3]]);

                // Click on fifth button
                clickAndAwaitChanges(buttonDes2[4], fixture);

                expectSpyCall(onPageSizeChangeSpy, 6, ['', component.paginatorOptions.pageSizeOptions[4]]);

                // Click on sixth button
                clickAndAwaitChanges(buttonDes2[5], fixture);

                expectSpyCall(onPageSizeChangeSpy, 7, ['', component.paginatorOptions.pageSizeOptions[5]]);
            }));

            it('should trigger on event from both TablePaginationComponents', fakeAsync(() => {
                component.searchFilter = 'test';

                const tablePaginationDes = getAndExpectDebugElementByDirective(
                    compDe,
                    TablePaginationStubComponent,
                    2,
                    2
                );

                const tablePaginationCmps = tablePaginationDes.map(
                    de => de.injector.get(TablePaginationStubComponent) as TablePaginationStubComponent
                );

                tablePaginationCmps[0].pageChangeRequest.emit(10);

                expectSpyCall(onPageSizeChangeSpy, 2, 'test');

                tablePaginationCmps[1].pageChangeRequest.emit(250);

                expectSpyCall(onPageSizeChangeSpy, 3, 'test');
            }));

            it('should call paginateRows() with given searchfilter', () => {
                component.onPageSizeChange('test');
                fixture.detectChanges();

                expectSpyCall(paginateRowsSpy, 2, 'test');
            });

            describe('should filter tableData', () => {
                it('... by matching searchFilter', async () => {
                    const searchFilter = 'ValueColumn1Row1';
                    await component.onPageSizeChange(searchFilter);
                    fixture.detectChanges();

                    expect(component.tableData).toBeDefined();
                    expect(component.tableData.filteredRows.length).withContext(`should be 1`).toBe(1);
                    expect(component.tableData.filteredRows)
                        .withContext(`should equal ${[expectedRowInputData.at(0)]}`)
                        .toEqual([expectedRowInputData.at(0)]);
                });

                it('... by non-matching searchFilter (empty array)', async () => {
                    const searchFilter = 'test';
                    await component.onPageSizeChange(searchFilter);
                    fixture.detectChanges();

                    expect(component.tableData).toBeDefined();
                    expect(component.tableData.filteredRows.length).withContext(`should be 0`).toBe(0);
                    expect(component.tableData.filteredRows).withContext(`should equal empty array`).toEqual([]);
                });

                it('... if a rowEntry is null or undefined', async () => {
                    const expectedFilteredRows = expectedRowInputData.slice(0, 4);

                    expectedRowInputData[expectedRowInputData.length - 2] = {
                        column1: null,
                        column2: null,
                        column3: null,
                    };
                    expectedRowInputData[expectedRowInputData.length - 1] = {
                        column1: undefined,
                        column2: undefined,
                        column3: undefined,
                    };
                    component.tableData = new TableData(expectedHeaderInputData, expectedRowInputData);

                    const searchFilter = '';
                    await component.onPageSizeChange(searchFilter);
                    fixture.detectChanges();

                    expect(component.tableData).toBeDefined();
                    expect(component.tableData.filteredRows.length)
                        .withContext(`should be ${expectedFilteredRows.length}`)
                        .toBe(expectedFilteredRows.length);
                    expect(component.tableData.filteredRows)
                        .withContext(`should equal ${expectedFilteredRows}`)
                        .toEqual(expectedFilteredRows);
                });

                it('... if table data is empty (empty array)', async () => {
                    component.tableData = new TableData(null, null);

                    await component.onPageSizeChange('');
                    fixture.detectChanges();

                    expect(component.tableData).toBeDefined();

                    expect(component.tableData.header).toBeDefined();
                    expect(component.tableData.header).withContext(`should equal []`).toEqual([]);

                    expect(component.tableData.filteredRows).toBeDefined();
                    expect(component.tableData.filteredRows).withContext(`should equal []`).toEqual([]);

                    expect(component.tableData.paginatedRows$).toBeDefined();
                    await expectAsync(lastValueFrom(component.tableData.paginatedRows$))
                        .withContext(`should be resolved to []`)
                        .toBeResolvedTo([]);

                    expect(component.tableData.totalRows$).toBeDefined();
                    await expectAsync(lastValueFrom(component.tableData.totalRows$))
                        .withContext(`should be resolved to []`)
                        .toBeResolvedTo([]);
                });
            });

            it('should slice tableData by range of paginatorOptions.selectedPageSize', waitForAsync(() => {
                const expectedPageSize = component.paginatorOptions.pageSizeOptions[0];
                const expectedPaginatedRows = expectedRowInputData.slice(0, expectedPageSize);

                component.paginatorOptions.selectedPageSize = expectedPageSize;
                component.onPageSizeChange('', expectedPageSize);
                fixture.detectChanges();

                expect(component.tableData).toBeDefined();
                expectAsync(lastValueFrom(component.tableData.paginatedRows$)).toBeResolved();
                expectAsync(lastValueFrom(component.tableData.paginatedRows$))
                    .withContext(`should be resolved to ${expectedPaginatedRows}`)
                    .toBeResolvedTo(expectedPaginatedRows);
            }));

            describe('should not do anything', () => {
                it('... if tableData is undefined', () => {
                    component.tableData = undefined;
                    component.onPageSizeChange('test');
                    fixture.detectChanges();

                    expectSpyCall(paginateRowsSpy, 1);
                });

                it('... if headerInputData is undefined', () => {
                    component.headerInputData = undefined;
                    component.onPageSizeChange('test');
                    fixture.detectChanges();

                    expectSpyCall(paginateRowsSpy, 1);
                });

                it('... if rowInputData is undefined', () => {
                    component.rowInputData = undefined;
                    component.onPageSizeChange('test');
                    fixture.detectChanges();

                    expectSpyCall(paginateRowsSpy, 1);
                });
            });
        });

        describe('#onSort()', () => {
            it('should have an onSort() method', () => {
                expect(component.onSort).toBeDefined();
            });

            it('should have been called', () => {
                expectSpyCall(onSortSpy, 1);
            });

            it('... should trigger on click on table header', fakeAsync(() => {
                const headerDe = getAndExpectDebugElementByCss(compDe, 'table > thead > tr > th', 3, 3);

                // Click on first header
                clickAndAwaitChanges(headerDe[0], fixture);

                // First call happens on ngOnInit()
                expectSpyCall(onSortSpy, 2, expectedHeaderInputData[0]);

                // Click on second header
                clickAndAwaitChanges(headerDe[1], fixture);

                expectSpyCall(onSortSpy, 3, expectedHeaderInputData[1]);

                // Click on third header
                clickAndAwaitChanges(headerDe[2], fixture);

                expectSpyCall(onSortSpy, 4, expectedHeaderInputData[2]);
            }));

            it('should set tableOptions.selectedKey to the given key', () => {
                expect(component.tableOptions.selectedKey).toBeDefined();
                expect(component.tableOptions.selectedKey)
                    .withContext(`should equal ${expectedHeaderInputData[0]}`)
                    .toBe(expectedHeaderInputData[0]);

                component.onSort('key');

                expect(component.tableOptions.selectedKey).toBe('key');
            });

            it('should set tableOptions.sortKey', () => {
                expect(component.tableOptions.sortKey).toBeDefined();
                expect(component.tableOptions.sortKey)
                    .withContext(`should equal ${expectedHeaderInputData[0] + '.label'}`)
                    .toBe(expectedHeaderInputData[0] + '.label');

                component.onSort('key');

                expect(component.tableOptions.sortKey).toBe('key.label');
            });

            describe('should set tableOptions.reverse', () => {
                it('... to false by default', () => {
                    expect(component.tableOptions.reverse).toBe(false);
                });

                it('... to false when called with different keys', () => {
                    expect(component.tableOptions.reverse).toBe(false);

                    component.onSort('key');

                    expect(component.tableOptions.reverse).toBe(false);

                    component.onSort('key2');

                    expect(component.tableOptions.reverse).toBe(false);
                });

                it('... toggling false/true if key equals selected key', () => {
                    component.onSort('key');

                    expect(component.tableOptions.reverse).toBe(false);

                    component.onSort('key');

                    expect(component.tableOptions.reverse).toBe(true);

                    component.onSort('key');

                    expect(component.tableOptions.reverse).toBe(false);
                });
            });

            describe('should set tableOptions.sortIcon', () => {
                it('... to faSortDown by default', () => {
                    component.onSort('key');

                    expect(component.tableOptions.sortIcon).toBeDefined();
                    expect(component.tableOptions.sortIcon)
                        .withContext(`should equal ${faSortDown}`)
                        .toEqual(faSortDown);
                });

                it('... to faSortUp if tableOptions.reverse is true', () => {
                    component.tableOptions.reverse = true;
                    component.onSort('key');
                    fixture.detectChanges();

                    expect(component.tableOptions.sortIcon).toBeDefined();
                    expect(component.tableOptions.sortIcon).withContext(`should equal ${faSortUp}`).toEqual(faSortUp);
                });

                it('... toggling faSortDown/faSortUp if key equals selected key', () => {
                    component.onSort('key');

                    expect(component.tableOptions.sortIcon).toBeDefined();
                    expect(component.tableOptions.sortIcon)
                        .withContext(`should equal ${faSortDown}`)
                        .toEqual(faSortDown);

                    component.onSort('key');

                    expect(component.tableOptions.sortIcon).toBeDefined();
                    expect(component.tableOptions.sortIcon).withContext(`should equal ${faSortUp}`).toEqual(faSortUp);

                    component.onSort('key');

                    expect(component.tableOptions.sortIcon).toBeDefined();
                    expect(component.tableOptions.sortIcon)
                        .withContext(`should equal ${faSortDown}`)
                        .toEqual(faSortDown);
                });
            });

            describe('should set tableOptions.reverse ', () => {
                it('... to false by default', () => {
                    expect(component.tableOptions.reverse).toBeDefined();
                    expect(component.tableOptions.reverse).toBe(false);
                });
                it('... toggling true/false if tableOptions.selectedKey is the same as given key', () => {
                    component.tableOptions.selectedKey = expectedHeaderInputData[0];

                    component.onSort(expectedHeaderInputData[0]);

                    expect(component.tableOptions.reverse).toBe(true);

                    component.onSort(expectedHeaderInputData[0]);

                    expect(component.tableOptions.reverse).toBe(false);
                });
            });

            it('should not do anything if no key is given', () => {
                component.onSort(undefined);
                fixture.detectChanges();

                expect(component.tableOptions.selectedKey).toBeDefined();
                expect(component.tableOptions.selectedKey).toBe(expectedHeaderInputData[0]);
                expect(component.tableOptions.sortKey).toBeDefined();
                expect(component.tableOptions.sortKey).toBe(expectedHeaderInputData[0] + '.label');
                expect(component.tableOptions.sortIcon).toBeDefined();
                expect(component.tableOptions.sortIcon).toEqual(faSortDown);
                expect(component.tableOptions.reverse).toBeDefined();
                expect(component.tableOptions.reverse).toBe(false);
                expect(component.tableOptions.isCaseInsensitive).toBeDefined();
                expect(component.tableOptions.isCaseInsensitive).toBe(false);
            });
        });

        describe('#onTableValueClick()', () => {
            it('should have an onTableValueClick() method', () => {
                expect(component.onTableValueClick).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.onTableValueClick).not.toHaveBeenCalled();
            });

            it('... should trigger on click if a row value has type===uri', fakeAsync(() => {
                const rowDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedRowInputData.length,
                    expectedRowInputData.length
                );

                // Find anchors in rows with type===uri (first)
                const anchorDes = getAndExpectDebugElementByCss(rowDes[0], 'a', 3, 3);

                anchorDes.forEach((anchorDe, index) => {
                    clickAndAwaitChanges(anchorDe, fixture);
                    expectSpyCall(
                        onTableValueClickSpy,
                        index + 1,
                        expectedRowInputData[0]['column' + (index + 1)].value
                    );
                });
            }));

            describe('... should not emit anything if ', () => {
                it('... event is undefined', () => {
                    component.onTableValueClick(undefined);

                    expectSpyCall(clickedTableValueRequestSpy, 0);
                });

                it('... event is null', () => {
                    component.onTableValueClick(undefined);

                    expectSpyCall(clickedTableValueRequestSpy, 0, null);
                });
                it('... event is empty string', () => {
                    component.onTableValueClick('');

                    expectSpyCall(clickedTableValueRequestSpy, 0, '');
                });
            });

            it('... should emit a given event', () => {
                const expectedEvent = 'test';
                component.onTableValueClick(expectedEvent);

                expectSpyCall(clickedTableValueRequestSpy, 1, expectedEvent);
            });
        });

        describe('#onTableRowClick()', () => {
            it('should have an onTableRowClick() method', () => {
                expect(component.onTableRowClick).toBeDefined();
            });

            it('... should not have been called', () => {
                expect(component.onTableValueClick).not.toHaveBeenCalled();
            });

            it('... should trigger on click on a row', fakeAsync(() => {
                const rowDes = getAndExpectDebugElementByCss(
                    compDe,
                    'table > tbody > tr',
                    expectedRowInputData.length,
                    expectedRowInputData.length
                );

                // Click through rows
                rowDes.forEach((rowDe, index) => {
                    clickAndAwaitChanges(rowDe, fixture);

                    expectSpyCall(onTableRowClickSpy, index + 1, BUTTON_CLICK_EVENTS.left);
                });
            }));

            describe('... should not emit anything if ', () => {
                it('... event is undefined', () => {
                    component.onTableRowClick(undefined);

                    expectSpyCall(clickedTableRowRequestSpy, 0);
                });

                it('... event is null', () => {
                    component.onTableRowClick(null);

                    expectSpyCall(clickedTableRowRequestSpy, 0, null);
                });

                it('... event is empty string', () => {
                    component.onTableRowClick('');

                    expectSpyCall(clickedTableRowRequestSpy, 0, '');
                });
            });

            it('... should emit a given event', () => {
                const expectedEvent = 'test';
                component.onTableRowClick(expectedEvent);

                expectSpyCall(clickedTableRowRequestSpy, 1, expectedEvent);
            });
        });

        describe('VIEW', () => {
            it('should pass down paginatorOptions to pagination component', () => {
                const tablePaginationDes = getAndExpectDebugElementByDirective(
                    compDe,
                    TablePaginationStubComponent,
                    2,
                    2
                );
                const tablePaginationCmps = tablePaginationDes.map(
                    de => de.injector.get(TablePaginationStubComponent) as TablePaginationStubComponent
                );

                expect(tablePaginationCmps.length).withContext('should have 2 pagination components').toBe(2);

                expect(tablePaginationCmps[0].collectionSize).toBeTruthy();
                expect(tablePaginationCmps[0].collectionSize)
                    .withContext(`should equal ${expectedRowInputData.length}`)
                    .toEqual(expectedRowInputData.length);

                expect(tablePaginationCmps[1].collectionSize).toBeTruthy();
                expect(tablePaginationCmps[1].collectionSize)
                    .withContext(`should equal ${expectedRowInputData.length}`)
                    .toEqual(expectedRowInputData.length);

                expect(tablePaginationCmps[0].page).toBeTruthy();
                expect(tablePaginationCmps[0].page).withContext(`should be 1`).toBe(1);

                expect(tablePaginationCmps[1].page).toBeTruthy();
                expect(tablePaginationCmps[1].page).withContext(`should be 1`).toBe(1);
            });

            it('... should display TwelveToneSpinnerComponent (stubbed) while loading (paginatedRows are not available)', () => {
                // Mock empty observable
                component.tableData.paginatedRows$ = EMPTY;
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 1, 1);
            });
        });
    });
});
