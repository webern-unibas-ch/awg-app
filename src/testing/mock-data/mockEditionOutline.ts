import { EditionOutline, EditionOutlineSeriesJsonData } from '@awg-views/edition-view/models/edition-outline.model';

/**
 * Object const: rawMockData.
 *
 * It provides a mocked EditionOutlineSeriesJsonData array
 * for the edition view.
 */
const rawMockData: EditionOutlineSeriesJsonData[] = [
    {
        series: '1',
        sections: [
            {
                section: '1',
                disabled: true,
                content: { intro: { disabled: true }, complexTypes: { opus: [], mnr: [] } },
            },
            {
                section: '2',
                disabled: true,
                content: { intro: { disabled: true }, complexTypes: { opus: [], mnr: [] } },
            },
            {
                section: '3',
                disabled: true,
                content: { intro: { disabled: true }, complexTypes: { opus: [], mnr: [] } },
            },
            {
                section: '4',
                disabled: true,
                content: { intro: { disabled: true }, complexTypes: { opus: [], mnr: [] } },
            },
            {
                section: '5',
                disabled: true,
                content: {
                    intro: {
                        disabled: false,
                        preview: 'This is a preview for the intro of section 5.',
                    },
                    complexTypes: {
                        opus: [
                            { complex: 'op12', disabled: false },
                            { complex: 'op23', disabled: false },
                            { complex: 'op25', disabled: false },
                        ],
                        mnr: [
                            { complex: 'm212', disabled: false },
                            { complex: 'm213', disabled: false },
                            { complex: 'm216', disabled: false },
                            { complex: 'm217', disabled: false },
                        ],
                    },
                },
            },
        ],
    },
];

/**
 * Test helper const: mockEditionOutline.
 *
 * It provides a mocked EditionOutline
 * for the edition view.
 *
 * Exposed to be called from tests.
 */
export const mockEditionOutline = new EditionOutline(rawMockData).outline;
