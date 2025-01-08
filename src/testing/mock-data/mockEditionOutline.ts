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
                        { complex: EditionComplexesService.getEditionComplexById('OP12'), disabled: false },
                        { complex: EditionComplexesService.getEditionComplexById('OP23'), disabled: false },
                        { complex: EditionComplexesService.getEditionComplexById('OP25'), disabled: false },
                    ],
                    mnr: [
                        { complex: EditionComplexesService.getEditionComplexById('M212'), disabled: false },
                        { complex: EditionComplexesService.getEditionComplexById('M213'), disabled: false },
                        { complex: EditionComplexesService.getEditionComplexById('M216'), disabled: false },
                        { complex: EditionComplexesService.getEditionComplexById('M217'), disabled: false },
                    ],
                },
                disabled: true,
            },
        ],
    },
];
