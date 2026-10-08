/**
 * The NavLink class.
 *
 * It is used in the context of the app framework
 * to store the data for a nav link.
 */
export class NavLink {
    /**
     * The router link root.
     */
    root: string;

    /**
     * The router link.
     */
    link: string;

    /**
     * The label of a nav link.
     */
    label: string;

    /**
     * If a nav link is disabled or not.
     */
    disabled: boolean;

    /**
     * Constructor of the NavLink class.
     *
     * It initializes the class with values
     * from a given root, link, label and disabled flag.
     *
     * @param {string} root The given router link root.
     * @param {string} link The given router link.
     * @param {string} label The given label.
     * @param {boolean} disabled The given disabled flag.
     */
    constructor(root: string, link: string, label: string, disabled: boolean) {
        this.root = root;
        this.link = link;
        this.label = label;
        this.disabled = disabled;
    }
}
