import { EditionConstants, EditionSeriesRoute } from '@awg-views/edition-view/models';
import { EDITION_COMPLEXES } from '@awg-views/edition-view/data/edition-complexes.data';

/**
 * Object constant with the outline of the edition.
 *
 * It provides metadata for structure of the edition.
 */
export const EDITION_OUTLINE_DATA: EditionSeriesRoute[] = [
    {
        series: EditionConstants.SERIES_1,
        sections: [
            {
                section: EditionConstants.SECTION_1,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_2,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_3,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_4,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_5,
                complexes: [
                    { complex: EDITION_COMPLEXES.OP12, disabled: false },
                    { complex: EDITION_COMPLEXES.OP23, disabled: false },
                    { complex: EDITION_COMPLEXES.OP25, disabled: false },
                ],
            },
        ],
    },
    {
        series: EditionConstants.SERIES_2,
        sections: [
            {
                section: EditionConstants.SECTION_1,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_2A,
                complexes: [{ complex: EDITION_COMPLEXES.M34, disabled: false }],
            },
            {
                section: EditionConstants.SECTION_2B,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_3,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_4,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_5,
                complexes: [],
            },
        ],
    },
    {
        series: EditionConstants.SERIES_3,
        sections: [
            {
                section: EditionConstants.SECTION_1,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_2,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_3,
                complexes: [],
            },
            {
                section: EditionConstants.SECTION_4,
                complexes: [],
            },
            {
                section: EditionConstants.SERIES_3_SECTION_5,
                complexes: [],
            },
        ],
    },
];
