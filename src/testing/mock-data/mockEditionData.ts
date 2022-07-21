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
                                id: 'M_212_Sk1',
                                sigle: 'M 212 Sk1',
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
     * Test helper data constant: mockIntroData.
     *
     * It provides a mocked folioConvoluteData object.
     */
    mockIntroData: {
        intro: [
            {
                id: 'op12',
                content: [
                    'Die Skizzen in <a (click)="ref.navigateToReportFragment(\'sourceA\')"><strong>A</strong></a> enthalten datierte Verlaufsskizzen zu allen vier Liedern.',
                    'In <a (click)="ref.selectSvgSheet(\'M_212_Sk2\')"><strong>M 212 Sk2</strong></a> werden T. [11]–[12] aus <a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>M 212 Sk1</strong></a> neu skizziert',
                ],
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
                    '<span class="caps">Inhalt</span>: (<a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>M 212 Sk1a</strong></a>). (<a (click)="ref.selectSvgSheet(\'M_212_Sk2\')"><strong>M 212 Sk2</strong></a>).',
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
                    'Die Skizzen in <a (click)="ref.navigateToReportFragment(\'sourceA\')"><strong>A</strong></a> enthalten u. a. <a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>M 212 Sk1</strong></a> (13. Januar 1915) als Korrekturen einer in <strong>B</strong> und in <a (click)="ref.selectSvgSheet(\'M_212_Sk2\')"><strong>M 212 Sk2–5</strong></a> vorformulierten Fassung dar.',
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
        id: 'M_212_Sk2',
        label: 'M 212 Sk2',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk2_1von1_220610_path.svg',
                image: '',
            },
        ],
        convolute: 'A',
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk2_with_partials.
     *
     * It provides a mocked svg sheet object with partials.
     */
    mockSvgSheet_Sk2_with_partials: {
        id: 'M_212_Sk2',
        label: 'M 212 Sk2',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk2_1von1_220610_path.svg',
                image: '',
                partial: 'a',
            },
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk3_1von1_220610_path.svg',
                image: '',
                partial: 'b',
            },
        ],
        convolute: 'A',
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk2a.
     *
     * It provides a mocked partial svg sheet object.
     */
    mockSvgSheet_Sk2a: {
        id: 'M_212_Sk2',
        label: 'M 212 Sk2',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk2_1von1_220610_path.svg',
                image: '',
                partial: 'a',
            },
        ],
        convolute: 'A',
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk3.
     *
     * It provides another mocked svg sheet object.
     */
    mockSvgSheet_Sk3: {
        id: 'M_212_Sk3',
        label: 'M 212 Sk3',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/SkI_3n_small_cut_opt.svg',
                image: 'assets/img/edition/series/1/section/5/op12/SkI_3_small.jpg',
            },
        ],
        convolute: 'A',
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk5.
     *
     * It provides another mocked svg sheet object.
     */
    mockSvgSheet_Sk5: {
        id: 'M_212_Sk5',
        label: 'M 212 Sk5',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/SkI_5n_small_cut_opt.svg',
                image: 'assets/img/edition/series/1/section/5/op12/SkI_5_small.jpg',
            },
        ],
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
                'Siehe <a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>M 212 Sk1</strong></a> T. [11] und <a (click)="ref.selectSvgSheet(\'M_212_Sk5\')"><strong>M 212 Sk5</strong></a>.',
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
                            "Modal click: <a (click)=\"ref.openModal('OP12_SHEET_COMING_SOON'); SVG Sheet select: <a (click)=\"ref.selectSvgSheet('M_212_Sk3')\">M 212 Sk3</a>",
                    },
                ],
            },
        ],
    },
};
