/**
 * The ResourceDetailProperty class.
 *
 * It is used in the context of the resource detail view
 * to store the data for a resource detail property.
 */
export class ResourceDetailProperty {
    /**
     * The id of the property.
     */
    pid: string;

    /**
     * The gui element of the property.
     */
    guielement: string;

    /**
     * The label of the property.
     */
    label: string;

    /**
     * The value array of the property.
     */
    values: string[];

    /**
     * Constructor of the ResourceDetailProperty class.
     *
     * It initializes the class with property id,
     * guielement, label and values array.
     *
     * @param {string} pid The given property id.
     * @param {string} guielement The given guielement.
     * @param {string} label The given label.
     * @param {string[]} values The given values array.
     */
    constructor(pid: string, guielement: string, label: string, values: string[]) {
        this.pid = pid;
        this.guielement = guielement;
        this.label = label;
        this.values = values;
    }
}
