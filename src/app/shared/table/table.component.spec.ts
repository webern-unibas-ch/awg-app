import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap/typeahead';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { TableRows } from './models/table-rows.model';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';
import { TableComponent } from './table.component';
import { TABLE_DEFAULT_PAGE_SIZE, TABLE_PAGE_SIZE_OPTIONS } from './table.utils';

/**
 * Helper function: createRows.
 *
 * It creates the given number of uri rows with three columns.
 * The label of column1 is zero-padded to sort lexicographically.
 *
 * @param {number} length The number of rows.
 * @returns {TableRows[]} The created rows.
 */
const createRows = (length: number): TableRows[] =>
    Array.from({ length }, (_, i) => {
        const n = (i + 1).toString().padStart(2, '0');
        return {
            column1: { value: `value:c1r${n}`, label: `C1R${n}`, type: 'uri' },
            column2: { value: `value:c2r${n}`, label: `C2R${n}`, type: 'search' },
            column3: { value: `value:c3r${n}`, label: `C3R${n}`, type: 'literal' },
        };
    });

describe('TableComponent (DONE)', () => {
    let component: TableComponent;
    let fixture: ComponentFixture<TableComponent>;
    let compDe: DebugElement;

    let onSortSpy: Spy;
    let onSearchFilterChangeSpy: Spy;
    let onPageSizeChangeSpy: Spy;
    let onTableValueClickSpy: Spy;
    let onTableRowClickSpy: Spy;
    let clickedTableValueRequestSpy: Spy;
    let clickedTableRowRequestSpy: Spy;

    let expectedTableTitle: string;
    let expectedHeaderInputData: string[];
    let expectedRowInputData: TableRows[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TableComponent],
        })
            .overrideComponent(TablePaginationComponent, { set: { template: '', imports: [] } })
            .compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
    });

    beforeEach(() => {
        // Test data
        expectedTableTitle = 'Table title';
        expectedHeaderInputData = ['column1', 'column2', 'column3'];
        expectedRowInputData = createRows(12);

        // Create component fixture
        fixture = TestBed.createComponent(TableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        onSortSpy = vi.spyOn(component, 'onSort');
        onSearchFilterChangeSpy = vi.spyOn(component, 'onSearchFilterChange');
        onPageSizeChangeSpy = vi.spyOn(component, 'onPageSizeChange');
        onTableValueClickSpy = vi.spyOn(component, 'onTableValueClick');
        onTableRowClickSpy = vi.spyOn(component, 'onTableRowClick');
        clickedTableValueRequestSpy = vi.spyOn(component.clickedTableValueRequest, 'emit');
        clickedTableRowRequestSpy = vi.spyOn(component.clickedTableRowRequest, 'emit');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `tableTitle` to hold the default value', () => {
            expectToBe(isSignal(component.tableTitle), true);
            expectToBe(component.tableTitle(), '');
        });

        it('... should have input signal `headerInputData` to hold the default value', () => {
            expectToBe(isSignal(component.headerInputData), true);
            expectToEqual(component.headerInputData(), []);
        });

        it('... should have input signal `rowInputData` to hold the default value', () => {
            expectToBe(isSignal(component.rowInputData), true);
            expectToEqual(component.rowInputData(), []);
        });

        it('... should have `pageSizeOptions`', () => {
            expectToEqual(component.pageSizeOptions, TABLE_PAGE_SIZE_OPTIONS);
        });

        it('... should have signal `searchFilter` to hold an empty string', () => {
            expectToBe(component.searchFilter(), '');
        });

        it('... should have signal `page` to hold 1', () => {
            expectToBe(component.page(), 1);
        });

        it('... should have signal `pageSize` to hold the default page size', () => {
            expectToBe(component.pageSize(), TABLE_DEFAULT_PAGE_SIZE);
        });

        it('... should have linked signal `sortState` to hold an empty key', () => {
            expectToEqual(component.sortState(), { key: '', reverse: false });
        });

        it('... should have computed signal `sortIcon` to hold faSortDown', () => {
            expectToBe(component.sortIcon(), faSortDown);
        });

        it('... should have computed signals `filteredRows`, `sortedRows` and `paginatedRows` to hold empty arrays', () => {
            expectToEqual(component.filteredRows(), []);
            expectToEqual(component.sortedRows(), []);
            expectToEqual(component.paginatedRows(), []);
        });

        describe('VIEW', () => {
            it('... should contain no header cells and no rows yet', () => {
                const tableDes = getAndExpectDebugElementByCss(compDe, 'table.table', 1, 1);

                getAndExpectDebugElementByCss(tableDes[0], 'thead th', 0, 0);
                getAndExpectDebugElementByCss(tableDes[0], 'tbody tr', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        const getTitleEl = (): HTMLParagraphElement =>
            getAndExpectDebugElementByCss(compDe, 'div.form-group > div.col-sm-4 > p', 1, 1)[0].nativeElement;

        const getSearchInputEl = (): HTMLInputElement =>
            getAndExpectDebugElementByCss(compDe, 'input#search', 1, 1)[0].nativeElement;

        const getBodyRowDes = (count: number): DebugElement[] =>
            getAndExpectDebugElementByCss(compDe, 'table.table > tbody > tr', count, count);

        const getHeaderCellDes = (): DebugElement[] =>
            getAndExpectDebugElementByCss(
                compDe,
                'table.table > thead > tr > th',
                expectedHeaderInputData.length,
                expectedHeaderInputData.length
            );

        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('tableTitle', expectedTableTitle);
            fixture.componentRef.setInput('headerInputData', expectedHeaderInputData);
            fixture.componentRef.setInput('rowInputData', expectedRowInputData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `tableTitle` to hold the provided title', () => {
            expectToBe(component.tableTitle(), expectedTableTitle);
        });

        it('... should have input signal `headerInputData` to hold the provided header', () => {
            expectToEqual(component.headerInputData(), expectedHeaderInputData);
        });

        it('... should have input signal `rowInputData` to hold the provided rows', () => {
            expectToEqual(component.rowInputData(), expectedRowInputData);
        });

        it('... should have linked signal `sortState` to hold the first header label', () => {
            expectToEqual(component.sortState(), { key: 'column1', reverse: false });
        });

        it('... should have computed signal `filteredRows` to hold all rows', () => {
            expectToEqual(component.filteredRows(), expectedRowInputData);
        });

        it('... should have computed signal `paginatedRows` to hold the rows of the first page', () => {
            expectToEqual(component.paginatedRows(), expectedRowInputData.slice(0, TABLE_DEFAULT_PAGE_SIZE));
        });

        describe('... recomputed signals', () => {
            it('... should have recomputed signal `filteredRows` when `rowInputData` changes', async () => {
                const newRows = createRows(3);
                fixture.componentRef.setInput('rowInputData', newRows);
                await detectChangesOnPush(fixture);

                expectToEqual(component.filteredRows(), newRows);
                getBodyRowDes(3);
            });

            it('... should have reset linked signal `sortState` when `headerInputData` changes', async () => {
                component.onSort('column2');
                fixture.componentRef.setInput('headerInputData', ['column3', 'column1']);
                await detectChangesOnPush(fixture);

                expectToEqual(component.sortState(), { key: 'column3', reverse: false });
            });

            it('... should have computed signal `sortedRows` to sort across all pages before paginating', async () => {
                component.onSort('column1');
                await detectChangesOnPush(fixture);

                // Reversed sort order: the first page holds the last rows of all pages
                expectToEqual(component.paginatedRows(), [...expectedRowInputData].reverse().slice(0, 10));
            });

            it('... should have computed signal `sortIcon` to hold faSortUp in reverse order', () => {
                component.onSort('column1');

                expectToBe(component.sortIcon(), faSortUp);
            });
        });

        describe('VIEW', () => {
            it('... should display the title and the number of results', () => {
                const titleEl = getTitleEl();

                expectToBe(
                    titleEl.textContent.replaceAll(/\s+/g, ' ').trim(),
                    `${expectedTableTitle} (12 von 12 Ergebnissen)`
                );
            });

            it('... should display the number of filtered results', async () => {
                component.onSearchFilterChange('C1R01');
                await detectChangesOnPush(fixture);

                expectToBe(getTitleEl().textContent.includes('(1 von 12 Ergebnissen)'), true);
            });

            it('... should contain a search input (not in a form)', () => {
                const inputEl = getSearchInputEl();

                expectToBe(inputEl.placeholder, 'Ergebnisse filtern...');
                getAndExpectDebugElementByCss(compDe, 'form', 0, 0);
            });

            it('... should trigger `onSearchFilterChange()` on input event of search input', () => {
                const inputEl = getSearchInputEl();
                inputEl.value = 'C1R0';
                inputEl.dispatchEvent(new Event('input'));

                expectSpyCall(onSearchFilterChangeSpy, 1, 'C1R0');
            });

            describe('... pagination panels', () => {
                it('... should contain a top and a bottom pagination panel', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.awg-pagination', 2, 2);
                });

                it('... should contain one TablePaginationComponent (hollow) in each pagination panel', () => {
                    getAndExpectDebugElementByDirective(compDe, TablePaginationComponent, 2, 2);
                });

                it('... should pass down `collectionSize` and `page` to TablePaginationComponent (hollow)', () => {
                    const paginationDes = getAndExpectDebugElementByDirective(compDe, TablePaginationComponent, 2, 2);

                    paginationDes.forEach(paginationDe => {
                        const paginationCmp = paginationDe.injector.get(TablePaginationComponent);

                        expectToBe(paginationCmp.collectionSize(), expectedRowInputData.length);
                        expectToBe(paginationCmp.page(), 1);
                    });
                });

                it('... should update signal `page` from TablePaginationComponent (hollow)', async () => {
                    const paginationDes = getAndExpectDebugElementByDirective(compDe, TablePaginationComponent, 2, 2);

                    paginationDes[0].injector.get(TablePaginationComponent).page.set(2);
                    await detectChangesOnPush(fixture);

                    expectToBe(component.page(), 2);
                    getBodyRowDes(2);
                });

                it('... should contain one page size dropdown with unique ids in each pagination panel', () => {
                    getAndExpectDebugElementByDirective(compDe, NgbDropdown, 2, 2);
                    getAndExpectDebugElementByCss(compDe, 'button#pageSizeDropdownMenuTop', 1, 1);
                    getAndExpectDebugElementByCss(compDe, 'button#pageSizeDropdownMenuBottom', 1, 1);
                });

                it('... should display the page size in the dropdown toggle', () => {
                    const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-pagesize-dropdown-button', 2, 2);

                    btnDes.forEach(btnDe => {
                        expectToBe(btnDe.nativeElement.textContent.trim(), '10 Ergebnisse pro Seite');
                    });
                });

                it('... should contain one dropdown item per page size option', () => {
                    getAndExpectDebugElementByCss(
                        compDe,
                        'div.dropdown-menu > button.dropdown-item',
                        TABLE_PAGE_SIZE_OPTIONS.length * 2,
                        TABLE_PAGE_SIZE_OPTIONS.length * 2
                    );
                });

                it('... should trigger `onPageSizeChange()` by click on a dropdown item', () => {
                    const itemDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.dropdown-menu > button.dropdown-item',
                        TABLE_PAGE_SIZE_OPTIONS.length * 2,
                        TABLE_PAGE_SIZE_OPTIONS.length * 2
                    );

                    (itemDes[0].nativeElement as HTMLButtonElement).click();

                    expectSpyCall(onPageSizeChangeSpy, 1, TABLE_PAGE_SIZE_OPTIONS[0]);
                });
            });

            describe('... table header', () => {
                it('... should display one header cell per header label', () => {
                    getHeaderCellDes().forEach((thDe, i) => {
                        expectToBe(thDe.nativeElement.textContent.trim(), expectedHeaderInputData[i]);
                    });
                });

                it('... should display the sort icon only in the header cell of the sort key', () => {
                    const thDes = getHeaderCellDes();
                    const iconDes = getAndExpectDebugElementByDirective(thDes[0], FaIconComponent, 1, 1);

                    expectToBe(iconDes[0].injector.get(FaIconComponent).icon(), faSortDown);
                    getAndExpectDebugElementByDirective(thDes[1], FaIconComponent, 0, 0);
                    getAndExpectDebugElementByDirective(thDes[2], FaIconComponent, 0, 0);
                });

                it('... should trigger `onSort()` by click on a header cell', () => {
                    (getHeaderCellDes()[1].nativeElement as HTMLTableCellElement).click();

                    expectSpyCall(onSortSpy, 1, 'column2');
                });

                it('... should trigger `onSort()` by keydown on a header cell', () => {
                    getHeaderCellDes()[2].nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

                    expectSpyCall(onSortSpy, 1, 'column3');
                });
            });

            describe('... table body', () => {
                it('... should display the rows of the first page', () => {
                    getBodyRowDes(TABLE_DEFAULT_PAGE_SIZE);
                });

                it('... should display one cell per header label in each row', () => {
                    getBodyRowDes(TABLE_DEFAULT_PAGE_SIZE).forEach(rowDe => {
                        getAndExpectDebugElementByCss(
                            rowDe,
                            'td',
                            expectedHeaderInputData.length,
                            expectedHeaderInputData.length
                        );
                    });
                });

                it('... should display uri cells as link, search and literal cells as span', () => {
                    const tdDes = getAndExpectDebugElementByCss(getBodyRowDes(10)[0], 'td', 3, 3);

                    getAndExpectDebugElementByCss(tdDes[0], 'a[role="link"]', 1, 1);
                    getAndExpectDebugElementByCss(tdDes[1], 'span', 1, 1);
                    getAndExpectDebugElementByCss(tdDes[1], 'a', 0, 0);
                    getAndExpectDebugElementByCss(tdDes[2], 'span', 1, 1);
                    getAndExpectDebugElementByCss(tdDes[2], 'a', 0, 0);
                });

                it('... should display an icon badge in search cells if an icon is given', async () => {
                    const rows = createRows(1);
                    rows[0]['column2'].icon = 'assets/img/test.png';
                    fixture.componentRef.setInput('rowInputData', rows);
                    await detectChangesOnPush(fixture);

                    const imgDes = getAndExpectDebugElementByCss(compDe, 'tbody td span.badge > img', 1, 1);

                    expectToBe(imgDes[0].nativeElement.getAttribute('src'), 'assets/img/test.png');
                });

                it('... should pass down label and search filter to NgbHighlight', async () => {
                    component.onSearchFilterChange('C1R01');
                    await detectChangesOnPush(fixture);

                    const highlightDes = getAndExpectDebugElementByDirective(compDe, NgbHighlight, 3, 3);
                    const highlightCmp = highlightDes[0].injector.get(NgbHighlight);

                    expectToBe(highlightCmp.result, 'C1R01');
                    expectToBe(highlightCmp.term, 'C1R01');
                });

                it('... should trigger `onTableValueClick()` by click on a uri link', () => {
                    const aDes = getAndExpectDebugElementByCss(compDe, 'tbody a[role="link"]', 10, 10);

                    (aDes[0].nativeElement as HTMLAnchorElement).click();

                    expectSpyCall(onTableValueClickSpy, 1, 'value:c1r01');
                });

                it('... should trigger `onTableValueClick()` by keyup.enter on a uri link', () => {
                    const aDes = getAndExpectDebugElementByCss(compDe, 'tbody a[role="link"]', 10, 10);

                    aDes[1].nativeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

                    expectSpyCall(onTableValueClickSpy, 1, 'value:c1r02');
                });

                it('... should trigger `onTableRowClick()` by click on a row', () => {
                    (getBodyRowDes(10)[0].nativeElement as HTMLTableRowElement).click();

                    expectSpyCall(onTableRowClickSpy, 1);
                });
            });
        });

        describe('METHODS', () => {
            describe('#onSort()', () => {
                it('... should have a method `onSort`', () => {
                    expect(component.onSort).toBeDefined();
                });

                it('... should set a new key in normal order', () => {
                    component.onSort('column2');

                    expectToEqual(component.sortState(), { key: 'column2', reverse: false });
                });

                it('... should reverse the order for the same key', () => {
                    component.onSort('column1');

                    expectToEqual(component.sortState(), { key: 'column1', reverse: true });

                    component.onSort('column1');

                    expectToEqual(component.sortState(), { key: 'column1', reverse: false });
                });

                it('... should reset the order for a new key', () => {
                    component.onSort('column1');
                    component.onSort('column2');

                    expectToEqual(component.sortState(), { key: 'column2', reverse: false });
                });

                it('... should do nothing if no key is given', () => {
                    component.onSort('');

                    expectToEqual(component.sortState(), { key: 'column1', reverse: false });
                });
            });

            describe('#onSearchFilterChange()', () => {
                it('... should have a method `onSearchFilterChange`', () => {
                    expect(component.onSearchFilterChange).toBeDefined();
                });

                it('... should set signal `searchFilter` and filter the rows', () => {
                    component.onSearchFilterChange('c2r1');

                    expectToBe(component.searchFilter(), 'c2r1');
                    expectToEqual(component.filteredRows(), expectedRowInputData.slice(9, 12));
                });

                it('... should reset signal `page` to 1', () => {
                    component.page.set(2);

                    component.onSearchFilterChange('C1R');

                    expectToBe(component.page(), 1);
                });
            });

            describe('#onPageSizeChange()', () => {
                it('... should have a method `onPageSizeChange`', () => {
                    expect(component.onPageSizeChange).toBeDefined();
                });

                it('... should set signal `pageSize` and paginate the rows', () => {
                    component.onPageSizeChange(5);

                    expectToBe(component.pageSize(), 5);
                    expectToEqual(component.paginatedRows(), expectedRowInputData.slice(0, 5));
                });

                it('... should reset signal `page` to 1', () => {
                    component.page.set(2);

                    component.onPageSizeChange(25);

                    expectToBe(component.page(), 1);
                });
            });

            describe('#onTableValueClick()', () => {
                it('... should have a method `onTableValueClick`', () => {
                    expect(component.onTableValueClick).toBeDefined();
                });

                it('... should emit the given value', () => {
                    component.onTableValueClick('value:test');

                    expectSpyCall(clickedTableValueRequestSpy, 1, 'value:test');
                });

                it('... should do nothing if no value is given', () => {
                    component.onTableValueClick('');

                    expectSpyCall(clickedTableValueRequestSpy, 0);
                });
            });

            describe('#onTableRowClick()', () => {
                it('... should have a method `onTableRowClick`', () => {
                    expect(component.onTableRowClick).toBeDefined();
                });

                it('... should emit the given event', () => {
                    const event = new Event('click');

                    component.onTableRowClick(event);

                    expectSpyCall(clickedTableRowRequestSpy, 1, event);
                });

                it('... should do nothing if no event is given', () => {
                    component.onTableRowClick(undefined as unknown as Event);

                    expectSpyCall(clickedTableRowRequestSpy, 0);
                });
            });
        });
    });
});
