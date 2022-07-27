import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/**
 * The ViewHandleTypes enumeration.
 *
 * It stores the possible types for the view handle button group.
 */
export enum ViewHandleTypes {
    GRAPH = 'graph',
    GRID = 'grid',
    TABLE = 'table',
}

/**
 * The ViewHandle class.
 *
 * It represents the view handle button group elements.
 * It is used to switch between the different view types.
 *
 */
export class ViewHandle {
    /**
     * The label of the view handle.
     */
    label: string;

    /**
     * The type of the view handle.
     */
    type: ViewHandleTypes;

    /**
     * The icon of the view handle.
     */
    icon: IconDefinition;

    /**
     * Constructor of the ViewHandle.
     *
     * @param {string} label The label of the view handle.
     * @param {ViewHandleTypes} type The type of the view handle.
     * @param {IconDefinition} icon The icon of the view handle.
     *
     */
    constructor(label: string, type: ViewHandleTypes, icon: IconDefinition) {
        this.label = label;
        this.type = type;
        this.icon = icon;
    }
}
