import { LabeledRoute } from '@awg-shared/models/labeled-route.model';

import { EDITION_ROUTE_CONSTANTS } from './edition-routes.constants';

/**
 * Object constant with a set of general edition links.
 */
export const EDITION_GENERAL_LINKS: LabeledRoute[] = [
    {
        label: EDITION_ROUTE_CONSTANTS.SERIES.full,
        route: [EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.SERIES.route],
    },
    {
        label: EDITION_ROUTE_CONSTANTS.ROWTABLES.full,
        route: [EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.ROWTABLES.route],
    },
    {
        label: EDITION_ROUTE_CONSTANTS.PREFACE.full,
        route: [EDITION_ROUTE_CONSTANTS.EDITION.route, EDITION_ROUTE_CONSTANTS.PREFACE.route],
    },
];
