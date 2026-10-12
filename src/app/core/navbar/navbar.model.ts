import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/**
 * The NavbarItem interface.
 *
 * It defines the structure of a navbar item.
 */
export interface NavbarItem {
    /**
     * The id of the navbar item.
     */
    readonly id: string;

    /**
     * The route of the navbar item.
     */
    readonly route: string[];

    /**
     * The label of the navbar item.
     */
    readonly label: string;

    /**
     * The span class of the navbar item.
     */
    readonly spanClass: string;

    /**
     * The icon of the navbar item.
     */
    readonly icon: IconDefinition;

    /**
     * The icon class of the navbar item.
     */
    readonly iconClass: string;
}

/**
 * The NavbarItems interface.
 *
 * It defines the structure of the navigation items in the navbar.
 */
export interface NavbarItems {
    /**
     * The home navbar item.
     */
    readonly home: NavbarItem;

    /**
     * The edition navbar item.
     */
    readonly edition: NavbarItem;

    /**
     * The structure navbar item.
     */
    readonly structure: NavbarItem;

    /**
     * The contact navbar item.
     */
    readonly contact: NavbarItem;
}
