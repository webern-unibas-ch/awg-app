import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Observable, of as observableOf } from 'rxjs';

/**
 * The TableData class.
 *
 * It is used in the context of the app framework
 * to store the options for a table paginator.
 */
export class TableData {
    /**
     * The string array of headers of the table data.
     */
    header: string[];

    /**
     * The total rows of the table data as Observable.
     */
    totalRows$: Observable<any[]>;

    /**
     * The filtered rows of the table data.
     */
    filteredRows: any[];

    /**
     * The paginated rows of the table data as Observable.
     */
    paginatedRows$: Observable<any[]>;

    /**
     * Constructor of the TableData class.
     *
     * It initializes the class with given values.
     *
     * @param {string[]} header The given table header.
     * @param {any[]} rows The given table rows.
     */
    constructor(header: string[], rows: any[]) {
        this.header = header || [''];
        this.totalRows$ = observableOf(rows) || observableOf([]);
        this.filteredRows = rows || [];
        this.paginatedRows$ = observableOf(rows) || observableOf([]);
    }
}

/**
 * The PaginatorOptions class.
 *
 * It is used in the context of the app framework
 * to store the options for a table paginator.
 */
export class PaginatorOptions {
    /**
     * The current page number.
     */
    page: number;

    /**
     * The selected number of rows per page.
     */
    selectedPageSize: number;

    /**
     * The page size options.
     */
    pageSizeOptions: number[];

    /**
     * The size of the collection.
     */
    collectionSize: number;

    /**
     * Constructor of the PaginatorOptions class.
     *
     * It initializes the class with given values.
     *
     * @param {number} page The current page number.
     * @param {number} selectedPageSize The number of rows per page.
     * @param {number[]} pageSizeOptions The options for the page size.
     * @param {number} collectionSize The size of the collection.
     */
    constructor(page: number, selectedPageSize: number, pageSizeOptions: number[], collectionSize: number) {
        this.page = page;
        this.selectedPageSize = selectedPageSize;
        this.pageSizeOptions = pageSizeOptions;
        this.collectionSize = collectionSize;
    }
}

/**
 * The TableOptions class.
 *
 * It is used in the context of the app framework
 * to store the options for a table.
 */
export class TableOptions {
    /**
     * The selected key of the Table options.
     */
    selectedKey: string;

    /**
     * The sort key of the Table options.
     */
    sortKey: string;

    /**
     * The sortIcon of the Table options.
     */
    sortIcon: IconDefinition;

    /**
     * The flag for reverse order of the Table options.
     */
    reverse: boolean;

    /**
     * The sort case  of the Table options.
     */
    isCaseInsensitive: boolean;
}
