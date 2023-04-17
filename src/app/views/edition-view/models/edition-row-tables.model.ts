/**
 * The EditionRowTables class.
 *
 * It is used in the context of the edition view
 * to store information about row tables.
 */
export class EditionRowTables {
    /**
     * The route of a row table.
     */
    route: string;

    /**
     * The short label of a row table.
     */
    short: string;

    /**
     * The full label of a row table.
     */
    full: string;

    /**
     * The id of the sketch which contains the row table.
     */
    id: string;

    /**
     * A boolean flag if the row table is diabled
     */
    disabled: boolean;
}

/**
 * The EditionRowTablesList class.
 *
 * It is used in the context of the edition view
 * to store a list of row tables.
 */
export class EditionRowTablesList {
    /**
     * The array of row tables from a row tables list.
     */
    rowTables: EditionRowTables[];
}
