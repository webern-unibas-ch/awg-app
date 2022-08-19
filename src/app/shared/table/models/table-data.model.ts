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
        this.header = header || [];
        this.totalRows$ = rows ? observableOf(rows) : observableOf([]);
        this.paginatedRows$ = rows ? observableOf(rows) : observableOf([]);
        this.filteredRows = rows || [];
    }
}
