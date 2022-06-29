import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

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
