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
                        { complex: EDITION_COMPLEXES.OP3, disabled: true },
                        { complex: EDITION_COMPLEXES.OP4, disabled: true },
                        { complex: EDITION_COMPLEXES.OP12, disabled: false },
                        { complex: EDITION_COMPLEXES.OP23, disabled: false },
                        { complex: EDITION_COMPLEXES.OP25, disabled: false },
                    ],
                    mnr: [
                        { complex: EDITION_COMPLEXES.M212, disabled: true },
                        { complex: EDITION_COMPLEXES.M213, disabled: true },
                        { complex: EDITION_COMPLEXES.M216, disabled: true },
                        { complex: EDITION_COMPLEXES.M217, disabled: true },
                    ],
                },
                disabled: false,
            },
        ],
    },
    {
        series: EDITION_ROUTE_CONSTANTS.SERIES_2,
        sections: [
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_1,
                complexes: { opus: [], mnr: [] },
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_2A,
                complexes: {
                    opus: [],
                    mnr: [
                        { complex: EDITION_COMPLEXES.M30, disabled: false },
                        { complex: EDITION_COMPLEXES.M34, disabled: false },
                    ],
                },
                disabled: false,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_2B,
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
                complexes: { opus: [], mnr: [] },
                disabled: true,
            },
        ],
    },
    {
        series: EDITION_ROUTE_CONSTANTS.SERIES_3,
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
                section: EDITION_ROUTE_CONSTANTS.SERIES_3_SECTION_5,
                complexes: { opus: [], mnr: [] },
                disabled: true,
            },
        ],
    },
];
