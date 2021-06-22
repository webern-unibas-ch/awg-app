import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { combineLatest, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs/operators';

import { faSortDown, faSortUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { SelectResponse } from '../models';

/**
 * The PaginatorOptions class.
 *
 * It is used in the context of the app framework
 * to store the options for a table paginator.
 */
export class PaginatorOptions {
    page: number;
    pageSize: number;
    pageSizeOptions: number[];
    collectionSize: number;

    /**
     * Constructor of the PaginatorOptions class.
     *
     * It initializes the class with given values.
     *
     * @param {number} page The current page number.
     * @param {number} pageSize The number of rows per page.
     * @param {number[]} pageSizeOptions The options for the page size.
     * @param {number} collectionSize The size of the collection.
     */
    constructor(page: number, pageSize: number, pageSizeOptions: number[], collectionSize: number) {
        this.page = page;
        this.pageSize = pageSize;
        this.pageSizeOptions = pageSizeOptions;
        this.collectionSize = collectionSize;
    }
}

/**
 * The TableOptionsSortCase enumeration.
 *
 * It stores the possible sort case options for a table.
 */
export enum TableOptionsSortCase {
    CASE_SENSITIVE = 'case-sensitive',
    CASE_INSENSITIVE = 'case-insensitive',
}

/**
 * The TableOptions class.
 *
 * It is used in the context of the app framework
 * to store the options for a table.
 */
export class TableOptions {
    selectedKey: string;
    sortKey: string;
    sortIcon: IconDefinition;
    reverse: boolean;
    case: TableOptionsSortCase;
}

/**
 * The SparqlTable component.
 *
 * It contains the SPARQL table for SELECT queries
 * of the {@link GraphVisualizerComponent}.
 */
@Component({
    selector: 'awg-sparql-table',
    templateUrl: './sparql-table.component.html',
    styleUrls: ['./sparql-table.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparqlTableComponent implements OnInit {
    /**
     * Input variable: queryResult$.
     *
     * It keeps the SelectResponse as an observable.
     */
    @Input()
    queryResult: SelectResponse;

    /**
     * Input variable: queryTime.
     *
     * It keeps the duration time of the query.
     */
    @Input()
    queryTime: number;

    /**
     * Output variable: clickedTableRequest.
     *
     * It keeps an event emitter for a click on a table IRI.
     */
    @Output()
    clickedTableRequest: EventEmitter<string> = new EventEmitter();

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
     * Public variable: tableData.
     *
     * It keeps the header and content rows data arrays of the table.
     */
    tableData = {
        header: [],
        totalRows$: of([]),
        filteredRows$: of([]),
        visibleRows$: of([]),
    };

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
        case: TableOptionsSortCase.CASE_INSENSITIVE,
    };

    /**
     * Public variable: searchFilter.
     *
     * It keeps the form control of the search filter.
     */
    searchFilter: FormControl;

    /**
     * Public variable: searchFilter$.
     *
     * It keeps an observable of the search filter values.
     */
    searchFilter$: Observable<string>;

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
        this.initTable();
    }

    /**
     * Public method: initTable.
     *
     * It inits all the data needed for the table.
     *
     * @returns {void} Inits the table data.
     */
    initTable(): void {
        this.tableData = {
            header: this.queryResult.head.vars,
            totalRows$: of(this.queryResult.body.bindings),
            filteredRows$: of(this.queryResult.body.bindings),
            visibleRows$: of([]),
        };
        this.paginatorOptions = new PaginatorOptions(
            1,
            10,
            [5, 10, 25, 50, 100, 200],
            this.queryResult.body.bindings.length
        );

        this.initFilter();

        this.onSort(this.tableData.header[0]);

        this.onPageChange();
    }

    initFilter(): void {
        this.searchFilter = new FormControl('');
        this.searchFilter$ = this.searchFilter.valueChanges.pipe(
            // Start with empty string
            startWith(''),
            // Do not check changes before half a second
            debounceTime(500),
            // Do not check unchanged values
            distinctUntilChanged()
        );

        this.tableData.filteredRows$ = this.onFilter();
        this.tableData.visibleRows$ = this.tableData.filteredRows$;
    }

    /**
     * Public method: onFilter.
     *
     * It returns a combined observable with the filtered table data.
     *
     * @returns {Observable<any[]>} Returns a combined observable.
     */
    onFilter(): Observable<any[]> {
        return combineLatest(this.tableData.totalRows$, this.searchFilter$).pipe(
            map(([results, filterTerm]) => {
                const term = filterTerm.toLowerCase();
                return results.filter(result => {
                    for (const key in result) {
                        if (Object.prototype.hasOwnProperty.call(result, key)) {
                            if (result[key] === null || result[key] === undefined) {
                                continue;
                            }
                            if (result[key]['label'] && result[key]['label'].toString().toLowerCase().includes(term)) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
            })
        );
    }

    /**
     * Public method: onPageChange.
     *
     * It emits the new start position of the Paginator
     * from a given page number to the {@link pageChangeRequest}.
     *
     * @returns {void} Emits the new start position.
     */
    onPageChange(): void {
        if (!this.queryResult) {
            return;
        }
        this.tableData.visibleRows$ = this.tableData.filteredRows$.pipe(
            tap(x => console.log(x)),
            map(rows =>
                rows.slice(
                    (this.paginatorOptions.page - 1) * this.paginatorOptions.pageSize,
                    (this.paginatorOptions.page - 1) * this.paginatorOptions.pageSize + this.paginatorOptions.pageSize
                )
            ),
            tap(x => console.log(x))
        );
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
     * Public method: onTableNodeClick.
     *
     * It emits a uri the user clicked on in the result table.
     *
     * @param {string} uri The given uri.
     *
     * @returns {void} Emits the uri.
     */
    onTableNodeClick(uri: string): void {
        if (!uri) {
            return;
        }
        this.clickedTableRequest.emit(uri);
    }
}
