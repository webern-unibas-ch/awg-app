import { EditionConstants, EditionSeriesRoute } from '@awg-views/edition-view/models';
import { EditionWorks } from '@awg-views/edition-view/data/edition-works';

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
                    { complex: EditionWorks.OP12, available: true },
                    { complex: EditionWorks.OP23, available: true },
                    { complex: EditionWorks.OP25, available: true },
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
