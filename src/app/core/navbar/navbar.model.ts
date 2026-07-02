import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

/**
 * The NavbarDropdownLink interface.
 *
 * It defines the structure of a navbar dropdown link in the navbar.
 */
export interface NavbarDropdownLink {
    readonly label: string;
    readonly route: string[];
}

/**
 * The NavbarItem interface.
 *
 * It defines the structure of a navigation item in the navbar.
 */
export interface NavbarItem {
    readonly id: string;
    readonly route: string[];
    readonly label: string;
    readonly spanClass: string;
    readonly icon: IconDefinition;
    readonly iconClass: string;
}

/**
 * The NavbarItems interface.
 *
 * It defines the structure of the collection of navigation items in the navbar.
 */
export interface NavbarItems {
    readonly home: NavbarItem;
    readonly edition: NavbarItem;
    readonly structure: NavbarItem;
    readonly contact: NavbarItem;
}
