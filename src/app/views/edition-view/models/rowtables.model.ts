/**
 * The EditionRowtables interface.
 *
 * It is used in the context of the edition view
 * to store information about rowtables.
 */
export interface Rowtables {
    /**
     * The route of a rowtable.
     */
    route: string;

    /**
     * The short label of a rowtable.
     */
    short: string;

    /**
     * The full label of a rowtable.
     */
    full: string;

    /**
     * The id of the sketch which contains the rowtable.
     */
    id: string;

    /**
     * A boolean flag if the rowtable is disabled.
     */
    disabled: boolean;
}

/**
 * The EditionRowtablesList class.
 *
 * It is used in the context of the edition view
 * to store a list of rowtables.
 */
export class RowtablesList {
    /**
     * The array of rowtables from a rowtables list.
     */
    rowtables: Rowtables[] = [];
}
