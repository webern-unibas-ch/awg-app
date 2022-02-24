/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Test helper data file: mockEditionData.
 *
 * It provides mocks for data used in the context of the edition view of the app.
 *
 * Exposed to be called from tests.
 */
export const mockEditionData = {
    /**
     * Test helper data constant: mockFolioConvoluteData.
     *
     * It provides a mocked folioConvoluteData object.
     */
    mockFolioConvoluteData: {
        convolutes: [
            {
                convoluteId: 'A',
                convoluteLabel: 'Test convolute A',
                folios: [
                    {
                        folioId: '1',
                        systems: '12',
                        format: {
                            height: 180,
                            width: 267,
                        },
                        content: [
                            {
                                id: 'Aa:SkI/1a',
                                sigle: 'Aa:SkI/1a',
                                sigleAddendum: 'T. 1–2, [3–6]',
                                selectable: false,
                                linkTo: 'OP12_SOURCE_NOT_A',
                                sectionPartition: 1,
                                sections: [
                                    {
                                        startSystem: 2,
                                        endSystem: 4,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                convoluteId: 'Test convolute B',
                convoluteLabel: 'B',
                folios: [],
                linkTo: 'OP12_SOURCE_NOT_A',
            },
        ],
    },

    /**
     * Test helper data constant: mockModalSnippet.
     *
     * It provides a mocked modal snippet string.
     */
    mockModalSnippet: 'OP12_SHEET_COMING_SOON',

    /**
     * Test helper data constant: mockSourceListData.
     *
     * It provides a mocked sourceListData object.
     */
    mockSourceListData: {
        sources: [
            {
                siglum: 'A',
                type: 'Skizzen',
                location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                hasDescription: true,
                linkTo: 'sourceA',
            },
            {
                siglum: 'B',
                type: 'Autograph von Nr. I.',
                location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                hasDescription: false,
                linkTo: 'OP12_SOURCE_NOT_A',
            },
            {
                siglum: 'C',
                type: 'Autograph von Nr. I–IV.',
                location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                hasDescription: false,
                linkTo: 'OP12_SOURCE_NOT_A',
            },
        ],
    },

    /**
     * Test helper data constant: mockSourceDescriptionListData.
     *
     * It provides a mocked sourceDescriptionListData object.
     */
    mockSourceDescriptionListData: {
        sources: [
            {
                id: 'sourceA',
                siglum: 'A',
                type: 'Skizzen',
                location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                description: [],
            },
            {
                id: 'sourceAa',
                siglum: 'Aa',
                type: '',
                location: 'Wien, Testcentre.',
                description: [
                    '<img class="img-thumbnail" [src]="ref.FIRM_SIGNS.OP12.A[0].route" [title]="ref.FIRM_SIGNS.OP12.A[0].full" [alt]="ref.FIRM_SIGNS.OP12.A[0].short" /> <br /> auf Bl. 1<sup>r</sup> unten links (Bl. 1); <br />Notenpapier, 16 Systeme, Format: quer 175 × 270 mm, kein Firmenzeichen (Bl. 2).',
                    '<span class="caps">Inhalt</span>: (<a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>SkI/1a</strong></a>). (<a (click)="ref.selectSvgSheet(\'Aa:SkI/2\')"><strong>SkI/2</strong></a>).',
                ],
            },
        ],
    },

    /**
     * Test helper data constant: mockSourceEvaluationListData.
     *
     * It provides a mocked sourceEvaluationListData object.
     */
    mockSourceEvaluationListData: {
        sources: [
            {
                id: 'op25',
                content: [
                    '<small class="text-muted">[Die Quellenbewertung zum gesamten Werkkomplex <em>Drei Lieder nach Gedichten von Hildegard Jone</em> op. 25 erscheint im Zusammenhang der vollständigen Edition von Opus 25 in AWG I/5.]</small>',
                    'Die Skizzen in <a (click)="ref.navigateToReportFragment(\'sourceA\')"><strong>A</strong></a> enthalten u. a. <a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>Aa:SkI/1</strong></a> (13. Januar 1915) als Korrekturen einer in <strong>B</strong> und in <a (click)="ref.selectSvgSheet(\'Aa:SkI/2\')"><strong>Aa:SkI/2–5</strong></a> vorformulierten Fassung dar.',
                ],
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk2.
     *
     * It provides a mocked svg sheet object.
     */
    mockSvgSheet_Sk2: {
        id: 'Aa:SkI/2',
        svg: 'assets/img/edition/series/1/section/5/op12/SkI_2n_small_cut_opt.svg',
        image: 'assets/img/edition/series/1/section/5/op12/SkI_2_small.jpg',
        alt: 'Aa:SkI/2',
        convolute: 'A',
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk3.
     *
     * It provides another mocked svg sheet object.
     */
    mockSvgSheet_Sk3: {
        id: 'Aa:SkI/3',
        svg: 'assets/img/edition/series/1/section/5/op12/SkI_3n_small_cut_opt.svg',
        image: 'assets/img/edition/series/1/section/5/op12/SkI_3_small.jpg',
        alt: 'Aa:SkI/3',
        convolute: 'A',
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk5.
     *
     * It provides another mocked svg sheet object.
     */
    mockSvgSheet_Sk5: {
        id: 'Aa:SkI/5',
        svg: 'assets/img/edition/series/1/section/5/op12/SkI_5n_small_cut_opt.svg',
        image: 'assets/img/edition/series/1/section/5/op12/SkI_5_small.jpg',
        alt: 'Aa:SkI/5',
        convolute: 'A',
    },

    /**
     * Test helper data constant: mockTextcriticalComments.
     *
     * It provides a mocked textcriticalComments object.
     */
    mockTextcriticalComments: [
        {
            measure: '10',
            system: '12',
            position: '1. Note',
            comment: 'Viertelnote überschreibt Halbe Note.',
        },
        {
            measure: '10',
            system: '12',
            position: '2. Note',
            comment:
                'Siehe <a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>Aa:SkI/1</strong></a> T. [11] und <a (click)="ref.selectSvgSheet(\'Aa:SkI/5\')"><strong>Aa:SkI/5</strong></a>.',
        },
        {
            measure: '[12]',
            system: '13',
            position: '',
            comment: 'radierte, nicht entzifferbare Schicht.',
        },
    ],

    /**
     * Test helper data constant: mockTextcriticsData.
     *
     * It provides a mocked textcriticsData object.
     */
    mockTextcriticsData: {
        textcritics: [
            {
                id: 'test-1',
                label: 'test1',
                description: ['test description'],
                comments: [],
            },
            {
                id: 'test-2',
                label: 'test2',
                description: [],
                comments: [
                    {
                        measure: '10',
                        system: '12',
                        position: '1. Note',
                        comment: 'Viertelnote überschreibt Halbe Note.',
                    },
                    {
                        measure: '10',
                        system: '12',
                        position: '2. Note',
                        comment:
                            "Modal click: <a (click)=\"ref.openModal('OP12_SHEET_COMING_SOON'); SVG Sheet select: <a (click)=\"ref.selectSvgSheet('Aa:SkI/3')\">Aa:SkI/3</a>",
                    },
                ],
            },
        ],
    },
};
