import { faEnvelope, faFileAlt, faHome, faNetworkWired } from '@fortawesome/free-solid-svg-icons';

import { LabeledRoute } from '@awg-shared/models/labeled-route.model';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';

import { NavbarItems } from './navbar.model';

/**
 * Object constant with a set of section edition links for the navbar.
 */
export const NAVBAR_DROPDOWN_EDITION_SECTION_LINKS: LabeledRoute[] = [
    {
        label: 'Einleitung / Intro',
        route: [EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route],
    },
    {
        label: 'Übersicht',
        route: [],
    },
];

/**
 * Object constant with a set of navigation items for the navbar.
 */
export const NAVBAR_ITEMS: NavbarItems = {
    home: {
        id: 'home',
        route: ['/home'],
        label: 'Home',
        spanClass: 'd-sm-none d-md-inline order-md-2',
        icon: faHome,
        iconClass: '',
    },
    edition: {
        id: 'edition',
        route: ['/edition'],
        label: 'Edition',
        spanClass: 'd-sm-none d-md-inline',
        icon: faFileAlt,
        iconClass: 'order-md-first',
    },
    structure: {
        id: 'structure',
        route: ['/structure'],
        label: 'Strukturmodell',
        spanClass: 'd-sm-none d-md-inline order-md-2',
        icon: faNetworkWired,
        iconClass: '',
    },
    contact: {
        id: 'contact',
        route: ['/contact'],
        label: 'Kontakt',
        spanClass: 'd-sm-none d-lg-inline',
        icon: faEnvelope,
        iconClass: '',
    },
};
