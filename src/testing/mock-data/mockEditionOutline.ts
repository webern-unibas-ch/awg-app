/* eslint-disable @typescript-eslint/naming-convention */

import { EDITION_COMPLEXES } from '@awg-app/views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-app/views/edition-view/edition-route-constants';

/**
 * Test helper data file: mockEditionOutline.
 *
 * It provides a mocked EditionOutline
 * for the edition view.
 *
 * Exposed to be called from tests.
 */
export const mockEditionOutline = [
    {
        series: EDITION_ROUTE_CONSTANTS.SERIES_1,
        sections: [
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_1,
                complexes: { opus: [], mnr: [] },
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_2,
                complexes: { opus: [], mnr: [] },
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_3,
                complexes: { opus: [], mnr: [] },
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_4,
                complexes: { opus: [], mnr: [] },
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_5,
                complexes: {
                    opus: [
                        { complex: EDITION_COMPLEXES.OP12, disabled: false },
                        { complex: EDITION_COMPLEXES.OP23, disabled: false },
                        { complex: EDITION_COMPLEXES.OP25, disabled: false },
                    ],
                    mnr: [
                        { complex: EDITION_COMPLEXES.M212, disabled: false },
                        { complex: EDITION_COMPLEXES.M213, disabled: false },
                        { complex: EDITION_COMPLEXES.M216, disabled: false },
                        { complex: EDITION_COMPLEXES.M217, disabled: false },
                    ],
                },
                disabled: true,
            },
        ],
    },
];
