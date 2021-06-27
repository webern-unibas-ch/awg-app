import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';

import { SelectResponse, SelectResponseBindings } from './select-response.model';

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
    totalRows$: Observable<SelectResponseBindings[]>;

    /**
     * The filtered rows of the table data.
     */
    filteredRows: SelectResponseBindings[];

    /**
     * The paginated rows of the table data as Observable.
     */
    paginatedRows$: Observable<SelectResponseBindings[]>;

    /**
     * Constructor of the TableData class.
     *
     * It initializes the class with given values.
     *
     * @param {SelectResponse} data The given SelectResponse.
     */
    constructor(data: SelectResponse) {
        this.header = data.head.vars;
        this.totalRows$ = of(data.body.bindings);
        this.filteredRows = data.body.bindings;
        this.paginatedRows$ = of(data.body.bindings);
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
     * The current page number of the Paginator options.
     */
    page: number;

    /**
     * The number of rows per page of the Paginator options.
     */
    pageSize: number;

    /**
     * The page size optios of the Paginator options.
     */
    pageSizeOptions: number[];

    /**
     * The size of the collection of the Paginator options.
     */
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
    case: TableOptionsSortCase;
}
