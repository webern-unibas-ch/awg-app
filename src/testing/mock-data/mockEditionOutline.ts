import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplexesService } from '@awg-views/edition-view/services';

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
                complexTypes: { opus: [], mnr: [] },
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_2,
                complexTypes: { opus: [], mnr: [] },
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_3,
                complexTypes: { opus: [], mnr: [] },
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_4,
                complexTypes: { opus: [], mnr: [] },
                disabled: true,
            },
            {
                section: EDITION_ROUTE_CONSTANTS.SECTION_5,
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
                disabled: true,
            },
        ],
    },
];
