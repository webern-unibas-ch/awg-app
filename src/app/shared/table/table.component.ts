import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, linkedSignal, output, signal } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap/typeahead';

import { ClickDirective } from '@awg-shared/click/click.directive';

import { TablePaginationComponent } from './table-pagination/table-pagination.component';
import { TableRows, TableSortState } from './table.model';
import {
    filterTableRows,
    paginateTableRows,
    sortTableRows,
    TABLE_DEFAULT_PAGE_SIZE,
    TABLE_PAGE_SIZE_OPTIONS,
} from './table.utils';

/**
 * The Table component.
 *
 * It contains a generic table with search filter,
 * sortable columns and pagination.
 */
@Component({
    selector: 'awg-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ClickDirective,
        FaIconComponent,
        NgbDropdownModule,
        NgbHighlight,
        NgTemplateOutlet,
        TablePaginationComponent,
    ],
})
export class TableComponent {
    /**
     * Readonly input signal: tableTitle.
     *
     * It holds the title of the table.
     * @default ''
     */
    readonly tableTitle = input<string>('');

    /**
     * Readonly input signal: headerInputData.
     *
     * It holds the header labels of the table.
     * @default []
     */
    readonly headerInputData = input<readonly string[]>([]);

    /**
     * Readonly input signal: rowInputData.
     *
     * It holds the rows of the table.
     * @default []
     */
    readonly rowInputData = input<TableRows[]>([]);

    /**
     * Readonly output signal: clickedTableValueRequest.
     *
     * It emits the value of a clicked table cell.
     */
    readonly clickedTableValueRequest = output<string>();

    /**
     * Readonly output signal: clickedTableRowRequest.
     *
     * It emits the event of a clicked table row.
     */
    readonly clickedTableRowRequest = output<Event>();

    /**
     * Readonly variable: pageSizeOptions.
     *
     * It keeps the selectable page sizes.
     */
    readonly pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;

    /**
     * Readonly signal: searchFilter.
     *
     * It holds the search term to filter the rows.
     */
    readonly searchFilter = signal<string>('');

    /**
     * Readonly signal: page.
     *
     * It holds the current page of the pagination.
     */
    readonly page = signal<number>(1);

    /**
     * Readonly signal: pageSize.
     *
     * It holds the number of rows per page.
     */
    readonly pageSize = signal<number>(TABLE_DEFAULT_PAGE_SIZE);

    /**
     * Readonly linked signal: sortState.
     *
     * It holds the sort state of the table.
     * It is reset to the first header label when the header changes.
     */
    readonly sortState = linkedSignal<TableSortState>(() => ({
        key: this.headerInputData()[0] ?? '',
        reverse: false,
    }));

    /**
     * Readonly computed signal: sortIcon.
     *
     * It holds the icon for the current sort order.
     */
    readonly sortIcon = computed(() => (this.sortState().reverse ? faSortUp : faSortDown));

    /**
     * Readonly computed signal: totalRows.
     *
     * It holds all rows of the table,
     * or an empty array if no rows are given.
     */
    readonly totalRows = computed(() => this.rowInputData() ?? []);

    /**
     * Readonly computed signal: filteredRows.
     *
     * It holds the rows filtered by the search filter.
     */
    readonly filteredRows = computed(() => filterTableRows(this.totalRows(), this.searchFilter()));

    /**
     * Readonly computed signal: sortedRows.
     *
     * It holds the filtered rows sorted by the sort state.
     */
    readonly sortedRows = computed(() => {
        const { key, reverse } = this.sortState();
        return sortTableRows(this.filteredRows(), key, reverse);
    });

    /**
     * Readonly computed signal: paginatedRows.
     *
     * It holds the sorted rows of the current page.
     */
    readonly paginatedRows = computed(() => paginateTableRows(this.sortedRows(), this.page(), this.pageSize()));

    /**
     * Public method: onSort.
     *
     * It sorts the table by the given key (header label).
     * Sorting by the current key again reverses the sort order.
     *
     * @param {string} key The given key to sort by.
     *
     * @returns {void} Sets the sort state.
     */
    onSort(key: string): void {
        if (!key) {
            return;
        }
        this.sortState.update(state => ({
            key,
            reverse: state.key === key ? !state.reverse : false,
        }));
    }

    /**
     * Public method: onSearchFilterChange.
     *
     * It sets the given search term and resets the page.
     *
     * @param {string} term The given search term.
     *
     * @returns {void} Sets the search filter.
     */
    onSearchFilterChange(term: string): void {
        this.searchFilter.set(term);
        this.page.set(1);
    }

    /**
     * Public method: onPageSizeChange.
     *
     * It sets the given page size and resets the page.
     *
     * @param {number} pageSize The given page size.
     *
     * @returns {void} Sets the page size.
     */
    onPageSizeChange(pageSize: number): void {
        this.pageSize.set(pageSize);
        this.page.set(1);
    }

    /**
     * Public method: onTableValueClick.
     *
     * It emits the value of a clicked table cell.
     *
     * @param {string} value The given value.
     *
     * @returns {void} Emits the value.
     */
    onTableValueClick(value: string): void {
        if (!value) {
            return;
        }
        this.clickedTableValueRequest.emit(value);
    }

    /**
     * Public method: onTableRowClick.
     *
     * It emits the event of a clicked table row.
     *
     * @param {Event} event The given event.
     *
     * @returns {void} Emits the event.
     */
    onTableRowClick(event: Event): void {
        if (!event) {
            return;
        }
        this.clickedTableRowRequest.emit(event);
    }
}
