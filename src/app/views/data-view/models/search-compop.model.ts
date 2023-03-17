/**
 * The SearchCompop class.
 *
 * It is used in the context of the extended search
 * to store the data for a comparison operator.
 */
export class SearchCompop {
    /**
     * The value of a comparison operator.
     */
    value: string;

    /**
     * The title of a comparison operator.
     */
    title: string;

    /**
     * The label of a comparison operator.
     */
    label: string;

    /**
     * Constructor of the SearchCompop class.
     *
     * It initializes the class with given values
     * for value, title, and label.
     *
     * @param {string} value The given compop value.
     * @param {string} title The given compop title.
     * @param {string} label The given compop label.
     */
    constructor(value: string, title: string, label: string) {
        this.value = value || '';
        this.title = title || '';
        this.label = label || '';
    }
}

/**
 * The SearchCompopSet class.
 *
 * It is used in the context of the extended search
 * to store the data for a set of comparison operators.
 */
class SearchCompopSet {
    /**
     * The id of a comparison operator list.
     */
    id: number;

    /**
     * The set of comparison operators.
     */
    compopSet: SearchCompop[];
}

/**
 * The SearchCompopSetsList class.
 *
 * It is used in the context of the extended search
 * to store the data for a list of comparison operator sets.
 */
export class SearchCompopSetsList {
    /**
     * The list of comparison operator sets.
     */
    compopList: SearchCompopSet[];
}
