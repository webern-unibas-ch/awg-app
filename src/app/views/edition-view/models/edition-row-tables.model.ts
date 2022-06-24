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
     * The convolute in which the row table is located.
     */
    convolute: string;

    /**
     * The sketch which contains the row table.
     */
    sketch: string;

    /**
     * A boolean flag if the row table is diabled
     */
    disabled: boolean;
}
