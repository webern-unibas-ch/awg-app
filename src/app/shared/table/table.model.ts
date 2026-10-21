/**
 * The TableCell interface.
 *
 * It represents a cell of a table.
 */
export interface TableCell {
    /**
     * The type of the cell (`uri` cells are displayed as links).
     */
    readonly type: string;

    /**
     * The value of the cell (emitted on click of a link).
     */
    readonly value: string;

    /**
     * The label of the cell to be displayed, searched and sorted.
     */
    readonly label: string;
}

/**
 * The TableRow type.
 *
 * It represents a row of a table with one cell per column (header label);
 * a row can have no cell for a column.
 */
export type TableRow = Readonly<Partial<Record<string, TableCell>>>;

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
