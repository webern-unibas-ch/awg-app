import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineSeries } from '@awg-views/edition-view/models';

/**
 * Object constant: EDITION_OUTLINE_DATA.
 *
 * It provides metadata for the outline structure of the edition.
 */
export const EDITION_OUTLINE_DATA: EditionOutlineSeries[] = [
    {
        series: EDITION_ROUTE_CONSTANTS.SERIES_1,
        sections: [
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_1,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_2,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_3,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_4,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_5,
                complexes: [
                    { complex: EDITION_COMPLEXES.OP3, disabled: true },
                    { complex: EDITION_COMPLEXES.OP4, disabled: true },
                    { complex: EDITION_COMPLEXES.OP12, disabled: false },
                    { complex: EDITION_COMPLEXES.OP23, disabled: false },
                    { complex: EDITION_COMPLEXES.OP25, disabled: false },
                ],
                disabled: false,
            },
        ],
    },
    {
        series: EDITION_ROUTE_CONSTANTS.SERIES_2,
        sections: [
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_1,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_2A,
                complexes: [{ complex: EDITION_COMPLEXES.M34, disabled: false }],
                disabled: false,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_2B,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_3,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_4,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_5,
                complexes: [],
                disabled: true,
            },
        ],
    },
    {
        series: EDITION_ROUTE_CONSTANTS.SERIES_3,
        sections: [
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_1,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_2,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_3,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_4,
                complexes: [],
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SERIES_3_SECTION_5,
                complexes: [],
                disabled: true,
            },
        ],
    },
];
