import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

/**
 * Test helper data file: mockEditionOutline.
 *
 * It provides a mocked EditionOutline
 * for the edition view.
 *
 * Exposed to be called from tests.
 */
export const mockEditionOutline: EditionOutlineSeries[] = [
    {
        series: EDITION_ROUTE_CONSTANTS.SERIES_1,
        sections: [
            {
                seriesParent: EDITION_ROUTE_CONSTANTS.SERIES_1,
                section: EDITION_ROUTE_CONSTANTS.SECTION_1,
                content: {
                    intro: {
                        disabled: true,
                        preview: '',
                    },
                    complexTypes: { opus: [], mnr: [] },
                },
                disabled: true,
            },
            {
                seriesParent: EDITION_ROUTE_CONSTANTS.SERIES_1,
                section: EDITION_ROUTE_CONSTANTS.SECTION_2,
                content: {
                    intro: {
                        disabled: true,
                        preview: '',
                    },
                    complexTypes: { opus: [], mnr: [] },
                },
                disabled: true,
            },
            {
                seriesParent: EDITION_ROUTE_CONSTANTS.SERIES_1,
                section: EDITION_ROUTE_CONSTANTS.SECTION_3,
                content: {
                    intro: {
                        disabled: true,
                        preview: '',
                    },
                    complexTypes: { opus: [], mnr: [] },
                },
                disabled: true,
            },
            {
                seriesParent: EDITION_ROUTE_CONSTANTS.SERIES_1,
                section: EDITION_ROUTE_CONSTANTS.SECTION_4,
                content: {
                    intro: {
                        disabled: true,
                        preview: '',
                    },
                    complexTypes: { opus: [], mnr: [] },
                },
                disabled: true,
            },
            {
                seriesParent: EDITION_ROUTE_CONSTANTS.SERIES_1,
                section: EDITION_ROUTE_CONSTANTS.SECTION_5,
                content: {
                    intro: {
                        disabled: false,
                        preview: 'This is a preview for the intro of section 5.',
                    },
                    complexTypes: {
                        opus: [
                            { complex: EditionComplexesService.getEditionComplexById('op12'), disabled: false },
                            { complex: EditionComplexesService.getEditionComplexById('op23'), disabled: false },
                            { complex: EditionComplexesService.getEditionComplexById('op25'), disabled: false },
                        ],
                        mnr: [
                            { complex: EditionComplexesService.getEditionComplexById('m212'), disabled: false },
                            { complex: EditionComplexesService.getEditionComplexById('m213'), disabled: false },
                            { complex: EditionComplexesService.getEditionComplexById('m216'), disabled: false },
                            { complex: EditionComplexesService.getEditionComplexById('m217'), disabled: false },
                        ],
                    },
                },

                disabled: true,
            },
        ],
    },
];
