/**
 * The RouterLinkButton class.
 *
 * It is used in the context of the app framework
 * to store the data for a router link button.
 */
export class RouterLinkButton {
    /**
     * The router link root.
     */
    root: string;

    /**
     * The router link.
     */
    link: string;

    /**
     * The label of a router link button.
     */
    label: string;

    /**
     * If a router link button is disabled or not.
     */
    disabled: boolean;

    /**
     * Constructor of the RouterLinkButton class.
     *
     * It initializes the class with values
     * from a given query and number of hits
     * of a search.
     *
     * @param {string} root The given router link root.
     * @param {string} link The given router link.
     * @param {string} label The given label.
     * @param {string} disabled The given disabled flag.
     */
    constructor(root: string, link: string, label: string, disabled: boolean) {
        this.root = root;
        this.link = link;
        this.label = label;
        this.disabled = disabled;
    }
}
