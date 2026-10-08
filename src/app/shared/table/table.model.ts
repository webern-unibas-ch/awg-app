/**
 * The TableRows interface.
 *
 * It represents the rows of a table.
 */
export interface TableRows {
    /**
     * The key-value pair bindings of the table rows.
     */
    [key: string]: any;
}

/**
 * The TableSortState interface.
 *
 * It represents the sort state of a table.
 */
export interface TableSortState {
    /**
     * The key (header label) to sort by.
     */
    key: string;

    /**
     * The flag for reverse sort order.
     */
    reverse: boolean;
}
