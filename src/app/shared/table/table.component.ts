import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

import { PaginatorOptions, TableData, TableOptions } from './table-data.model';

import { SearchResultBindings } from '@awg-views/edition-view/edition-outlets/edition-graph/graph-visualizer/models';

@Component({
    selector: 'awg-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
    /**
     * Input variable: tableTitle.
     *
     * It keeps the title for the table.
     */
    @Input()
    tableTitle: string;

    /**
     * Input variable: headerInputData.
     *
     * It keeps the input data for the table header.
     */
    @Input()
    headerInputData: any;

    /**
     * Input variable: rowInputData.
     *
     * It keeps the input data for the table rows.
     */
    @Input()
    rowInputData: any;

    /**
     * Output variable: clickedTableValueRequest.
     *
     * It keeps an event emitter for a click on a table value.
     */
    @Output()
    clickedTableValueRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: clickedTableRowRequest.
     *
     * It keeps an event emitter for a click on a table row.
     */
    @Output()
    clickedTableRowRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public variable: faSortUp.
     *
     * It instantiates fontawesome's faSortUp icon.
     */
    faSortUp = faSortUp;

    /**
     * Public variable: faSortDown.
     *
     * It instantiates fontawesome's faSortDown icon.
     */
    faSortDown = faSortDown;

    /**
     * Public variable: paginatorOptions.
     *
     * It keeps the options of the Paginator.
     */
    paginatorOptions: PaginatorOptions;

    /**
     * Public variable: searchFilter.
     *
     * It keeps the string value of the search filter.
     */
    searchFilter: string;

    /**
     * Public variable: tableData.
     *
     * It keeps the data arrays of the table.
     */
    tableData: TableData;

    /**
     * Public variable: tableOptions.
     *
     * It keeps the options of the table.
     */
    tableOptions: TableOptions = {
        selectedKey: '',
        sortKey: '',
        sortIcon: this.faSortDown,
        reverse: false,
        isCaseInsensitive: false,
    };

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this._initTable();
    }

    /**
     * Public method: onPageSizeChange.
     *
     * It emits the new start position of the Paginator
     * from a given page number to the {@link pageChangeRequest}.
     *
     * @returns {void} Emits the new start position.
     */
    onPageSizeChange(searchFilter: string): void {
        if (!this.tableData || !this.headerInputData || !this.rowInputData) {
            return;
        }
        this.tableData.paginatedRows$ = this._paginateRows(searchFilter);
    }

    /**
     * Public method: onSort.
     *
     * It sets the options to sort a table column by a given sort key (header label).
     *
     * @param {string} key The given key to sort by.
     *
     * @returns {void} Sets the options.
     */
    onSort(key: string): void {
        if (!key) {
            return;
        }

        // Switch sort order when clicking on same key
        if (this.tableOptions.selectedKey === key) {
            this.tableOptions.reverse = !this.tableOptions.reverse;
        }

        // Set sort icon
        this.tableOptions.sortIcon = this.tableOptions.reverse ? this.faSortUp : this.faSortDown;

        // Select new key
        this.tableOptions.selectedKey = key;

        // Create sortKey for nested object
        this.tableOptions.sortKey = this.tableOptions.selectedKey.toString() + '.label';
    }

    /**
     * Public method: onTableValueClick.
     *
     * It emits an event when the user clicks on a table value.
     *
     * @param {any} e The given event.
     *
     * @returns {void} Emits the event.
     */
    onTableValueClick(e: any): void {
        if (!e) {
            return;
        }
        this.clickedTableValueRequest.emit(e);
    }

    /**
     * Public method: onTableRowClick.
     *
     * It emits an event when the user clicks on a table row.
     *
     * @param {any} e The given event.
     *
     * @returns {void} Emits the event.
     */
    onTableRowClick(e: any): void {
        if (!e) {
            return;
        }
        this.clickedTableRowRequest.emit(e);
    }

    /**
     * Private method: _initTable.
     *
     * It inits all the data needed for the table.
     *
     * @returns {void} Inits the table data.
     */
    private _initTable(): void {
        if (!this.headerInputData || !this.rowInputData) {
            this.tableData = new TableData([], []);
        } else {
            this.tableData = new TableData(this.headerInputData, this.rowInputData);
        }
        this.paginatorOptions = new PaginatorOptions(1, 10, [5, 10, 25, 50, 100, 200], this.rowInputData?.length || 0);
        this.searchFilter = '';

        this.onSort(this.tableData.header[0]);

        this.onPageSizeChange(this.searchFilter);
    }

    /**
     * Private method: _paginateRows.
     *
     * It filters by searchTerm and paginates the observable of total rows.
     *
     * @param {string} searchTerm The given searchTerm.
     *
     * @returns {Observable<SearchResultBindings[]>} Returns an observable of the paginated rows.
     */
    private _paginateRows(searchTerm: string): Observable<SearchResultBindings[]> {
        return this.tableData.totalRows$.pipe(
            // Filter rows by searchTerm
            map((rows: SearchResultBindings[]) => {
                const term = searchTerm.toString().toLowerCase();
                this.tableData.filteredRows = rows.filter(row =>
                    Object.values(row).some(rowEntry => {
                        if (rowEntry === null || rowEntry === undefined) {
                            return false;
                        }
                        return rowEntry['label'] && rowEntry['label'].toString().toLowerCase().includes(term);
                    })
                );
                return this.tableData.filteredRows;
            }),
            // Paginate rows
            map((rows: SearchResultBindings[]) => {
                const startRow = (this.paginatorOptions.page - 1) * this.paginatorOptions.selectedPageSize;
                const endRow = startRow + this.paginatorOptions.selectedPageSize;
                const range = endRow - startRow;

                if (rows.length <= range) {
                    return rows;
                } else {
                    return rows.slice(startRow, endRow);
                }
            })
        );
    }
}
