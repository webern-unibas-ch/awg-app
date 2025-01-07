/* eslint-disable @typescript-eslint/naming-convention */

import {
    EDITION_CATALOGUE_TYPE_CONSTANTS,
    EDITION_ROUTE_CONSTANTS,
} from '@awg-views/edition-view/edition-route-constants';

/**
 * Test helper data file: mockEditionData.
 *
 * It provides mocks for data used in the context of the edition view of the app.
 *
 * Exposed to be called from tests.
 */
export const mockEditionData = {
    /**
     * Test helper data constant: mockEditionComplexesList.
     *
     * It provides a mocked editionComplexesList object.
     */
    mockEditionComplexesList: {
        OP3: {
            titleStatement: {
                title: '<em>Vier Lieder</em>',
                catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
                catalogueNumber: '12',
            },
            publicationStatement: {
                series: EDITION_ROUTE_CONSTANTS.SERIES_1,
                section: EDITION_ROUTE_CONSTANTS.SECTION_5,
            },
            respStatement: {
                editors: [
                    {
                        name: 'Thomas Ahrend',
                        homepage: 'https://www.anton-webern.ch/index.php?id',
                    },
                ],
                lastModified: '7. August 2024',
            },
            complexId: {
                route: '/op12',
                short: 'op.&nbsp;12',
                full: '<em>Vier Lieder</em> op.&nbsp;12',
            },
            baseRoute: '/edition/complex/op12/',
        },
        OP25: {
            titleStatement: {
                title: '<em>Drei Lieder nach Gedichten von Hildegard Jone</em>',
                catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS,
                catalogueNumber: '25',
            },
            publicationStatement: {
                series: EDITION_ROUTE_CONSTANTS.SERIES_1,
                section: EDITION_ROUTE_CONSTANTS.SECTION_5,
            },
            respStatement: {
                editors: [
                    {
                        name: 'Thomas Ahrend',
                        homepage: 'https://www.anton-webern.ch/index.php?id',
                    },
                ],
                lastModified: '7. August 2024',
            },
            complexId: {
                route: '/op25',
                short: 'op.&nbsp;25',
                full: '<em>Drei Lieder nach Gedichten von Hildegard Jone</em> op.&nbsp;25',
            },
            baseRoute: '/edition/complex/op25/',
        },
        M22: {
            titleStatement: {
                title: 'Studienkomposition für Klavier/Streichquartett',
                catalogueType: EDITION_CATALOGUE_TYPE_CONSTANTS.MNR,
                catalogueNumber: '22',
            },
            publicationStatement: {
                series: EDITION_ROUTE_CONSTANTS.SERIES_1,
                section: EDITION_ROUTE_CONSTANTS.SECTION_5,
            },
            respStatement: {
                editors: [
                    {
                        name: 'Michael Matter',
                        homepage: 'https://www.anton-webern.ch/index.php?id',
                    },
                ],
                lastModified: '7. August 2024',
            },
            complexId: {
                route: '/m22',
                short: 'M&nbsp;22',
                full: 'Studienkomposition für Klavier/Streichquartett M&nbsp;22',
            },
            baseRoute: '/edition/complex/m22/',
        },
    },

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
                                complexId: 'op12',
                                sheetId: 'M_212_Sk1',
                                sigle: 'M 212 Sk1',
                                sigleAddendum: 'T. 1–2, [3–6]',
                                selectable: true,
                                linkTo: 'OP12_SOURCE_NOT_AVAILABLE',
                                sectionPartition: 1,
                                sections: [
                                    {
                                        position: 1,
                                        startSystem: 2,
                                        endSystem: 4,
                                    },
                                ],
                            },
                            {
                                complexId: 'op12',
                                sheetId: 'M_212_Sk3',
                                sigle: 'M 212 Sk3',
                                sigleAddendum: 'T. 3',
                                sectionPartition: 1,
                                sections: [
                                    {
                                        position: 1,
                                        startSystem: 5,
                                        endSystem: 7,
                                        relativeToSystem: 'above',
                                    },
                                ],
                            },
                            {
                                complexId: 'op12',
                                sheetId: 'M_212_Sk2',
                                sigle: 'M 212 Sk2',
                                sigleAddendum: 'T. 2',
                                sectionPartition: 1,
                                sections: [
                                    {
                                        position: 1,
                                        startSystem: 5,
                                        endSystem: 7,
                                        relativeToSystem: 'below',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                convoluteId: 'B',
                convoluteLabel: 'Test convolute B',
                folios: [],
                linkTo: 'OP12_SOURCE_NOT_AVAILABLE',
            },
        ],
    },

    /**
     * Test helper data constant: mockReversedFolio.
     *
     * It provides a mocked reversed folio object.
     */
    mockReversedFolio: {
        folioId: '1',
        systems: '12',
        format: {
            height: 180,
            width: 267,
        },
        content: [
            {
                complexId: 'op12',
                sheetId: 'M_212_Sk1_1',
                sigle: 'M 212 Sk1.1',
                sigleAddendum: '',
                selectable: undefined,
                reversed: true,
                linkTo: undefined,
                sectionPartition: 1,
                sections: [
                    {
                        position: 1,
                        startSystem: 2,
                        endSystem: 4,
                    },
                ],
            },
        ],
    },

    /**
     * Test helper data constant: mockGraphEmptyData.
     *
     * It provides a mocked graph data object with empty content.
     */
    mockGraphEmptyData: {
        graph: [
            {
                id: 'test-graph-empty-id',
                title: 'Test graph empty',
                description: [],
                rdfData: {
                    queryList: [],
                    triples: '',
                },
            },
        ],
    },

    /**
     * Test helper data constant: mockIntroData.
     *
     * It provides a mocked intro data object.
     */
    mockIntroData: {
        intro: [
            {
                id: 'test_intro',
                content: [
                    {
                        blockId: 'test_block_id_1',
                        blockHeader: 'Test block header 1',
                        blockContent: [
                            "Die Skizzen in <a (click)=\"ref.navigateToReportFragment({complexId: 'testComplex1', fragmentId: 'source_A'})\"><strong>A</strong></a> enthalten datierte Verlaufsskizzen zu allen vier Liedern.",
                            "In <a (click)=\"ref.selectSvgSheet({complexId: 'testComplex1', sheetId: 'test-1'})\"><strong>Test Sk1</strong></a> werden T. [11]–[12] aus <a (click)=\"ref.openModal('OP12_SHEET_COMING_SOON')\"><strong>Test Sk1</strong></a> neu skizziert.<sup id='note-80-backlink' class='note-link'><a (click)=\"ref.navigateToIntroFragment({complexId: 'testComplex1', fragmentId: 'note-80'})\">80</a></sup>",
                            '<span class="glyph">{{ref.getGlyph("[a]")}}</span> überschreibt <span class="glyph">{{ref.getGlyph("[b]")}}</span>.',
                        ],
                        blockNotes: [
                            "<span id='note-80' class='note'><a class='note-backlink' (click)=\"ref.navigateToIntroFragment({complexId: 'testComplex1', fragmentId: 'note-80-backlink'})\">80</a> | Webern an Schönberg, 21. Januar 1915 (US-Wc [zitiert nach Digitalisat in A-Was: ID 18240]).</span>",
                        ],
                    },
                    {
                        blockId: 'test_block_id_2',
                        blockHeader: 'Test block header 2',
                        blockContent: ['Test block content 2'],
                        blockNotes: ['Test block notes 2'],
                    },
                ],
            },
        ],
    },

    /**
     * Test helper data constant: mockIntroFilteredData.
     *
     * It provides a mocked intro data object with filtered content.
     */
    mockIntroFilteredData: {
        intro: [
            {
                id: 'test_intro',
                content: [
                    {
                        blockId: 'test_block_id_2',
                        blockHeader: 'Test block header 2',
                        blockContent: ['Test block content 2'],
                        blockNotes: ['Test block notes 2'],
                    },
                ],
            },
        ],
    },

    /**
     * Test helper data constant: mockIntroComplexData.
     *
     * It provides a mocked intro data object of an edition complex.
     */
    mockIntroComplexData: {
        intro: [
            {
                id: 'test_block_id_2',
                content: [],
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
     * Test helper data constant: mockPreface Data.
     *
     * It provides a mocked preface data object.
     */
    mockPrefaceData: {
        preface: [
            {
                id: 'de',
                content: [
                    "<span class='no-indent'>Die AWG gliedert sich in drei Serien:</span>",
                    "<span class='no-indent spacebreak'>Sie werden nicht zu dem für den Druck typischen <span class='glyph unicode'>{{ref.getGlyph('[ped]')}}</span>.-Zeichen vereinheitlicht.</span>",
                    "<span class='small spacebreak'>Zugang zur AWG-Online-Edition: <a href='https://edition.anton-webern.ch' class='link'>edition.anton-webern.ch</a></span>",
                ],
            },
            {
                id: 'en',
                content: [
                    "<span class='no-indent'>The AWG is divided into three series:</span>",
                    "<span class='no-indent spacebreak'>They are not unified to the <span class='glyph unicode'>{{ref.getGlyph('[ped]')}}</span>. character typical for printing.</span>",
                    "<span class='small spacebreak'>Access to the AWG online edition: <a href='https://edition.anton-webern.ch' class='link'>edition.anton-webern.ch</a></span>",
                ],
            },
        ],
    },

    /**
     * Test helper data constant: mockRowTablesData.
     *
     * It provides a mocked rowTablesData object.
     */
    mockRowTablesData: {
        rowTables: [
            { route: '/enrt1', short: 'En RT1', full: 'Enabled Test Rowtable 1', id: 'SkRT', disabled: false },
            { route: '/enrt2', short: 'En RT2', full: 'Enabled Test Rowtable 2', id: 'SkRT', disabled: false },
            { route: '/disrt1', short: 'Dis RT1', full: 'Diabled Test Rowtable 1', id: 'SkRT', disabled: true },
            { route: '/disrt2', short: 'Dis RT2', full: 'Disabled Test Rowtable 2', id: 'SkRT', disabled: true },
        ],
    },

    /**
     * Test helper data constant: mockSourceListData.
     *
     * It provides a mocked sourceListData object.
     */
    mockSourceListData: {
        sources: [
            {
                siglum: 'A',
                siglumAddendum: '',
                type: 'Test type 1',
                location: 'Test location 1.',
                hasDescription: true,
                linkTo: 'source_A',
            },
            {
                siglum: 'B',
                siglumAddendum: '',
                type: 'Test type 2',
                location: 'Test location 2.',
                hasDescription: false,
                linkTo: 'OP12_SOURCE_NOT_AVAILABLE',
            },
            {
                siglum: 'C',
                siglumAddendum: '',
                missing: true,
                type: 'Test type 3',
                location: 'Test location 3.',
                hasDescription: false,
                linkTo: 'OP12_SOURCE_NOT_AVAILABLE',
            },
        ],
    },

    /**
     * Test helper data constant: mockSourceListDataWithTexts.
     *
     * It provides a mocked sourceListData object with text sources.
     */
    mockSourceListDataWithTexts: {
        sources: [
            {
                siglum: 'A',
                siglumAddendum: 'a',
                type: 'Test type 1',
                location: 'Test location 1.',
                hasDescription: true,
                linkTo: 'source_Aa',
            },
            {
                siglum: 'B',
                siglumAddendum: 'H',
                type: 'Test type 2',
                location: 'Test location 2.',
                hasDescription: false,
                linkTo: 'OP12_SOURCE_NOT_AVAILABLE',
            },
        ],
        textSources: [
            {
                id: 'text_textA',
                siglum: 'textA',
                siglumAddendum: '',
                type: 'Text type 1',
                location: 'Text location 1.',
            },
            {
                id: 'text_textB',
                siglum: 'textB',
                siglumAddendum: 'H',
                type: 'Text type 2',
                location: 'Text location 2.',
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
                id: 'source_A',
                siglum: 'A',
                siglumAddendum: '',
                type: 'Skizzen',
                location: 'CH-Bps, Sammlung Anton Webern.',
                description: {},
            },
            {
                id: 'source_Aa',
                siglum: 'A',
                siglumAddendum: 'a',
                type: '',
                location: 'Wien, Testcentre.',
                description: {
                    desc: [
                        '2 Blätter (Bl. 1–2). Archivalische Paginierung <em>[1]</em> bis <em>[4]</em> unten links (recto) bzw. rechts (verso) mit Bleistift. Bl. 2<sup>v</sup> mit Ausnahme der archivalischen Paginierung unbeschriftet. Rissspuren am linken und oberen Rand: Blätter von Bogen abgetrennt und im Format verändert. Zeichen ergänzt mit Blick auf <a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')" ><strong>Textfassung 2</strong></a>',
                    ],
                    writingMaterialStrings: [
                        'Notenpapier, 14 Systeme, Format: quer ca. 160–180 × 267 mm, Firmenzeichen:<br /><img class="img-thumbnail" [src]="ref.FIRM_SIGNS.FIRM_JE_NO_2_LIN_12.route" [title]="ref.FIRM_SIGNS.FIRM_JE_NO_2_LIN_12.full" [alt]="ref.FIRM_SIGNS.FIRM_JE_NO_2_LIN_12.short" /><br />auf Bl. 1<sup>r</sup> unten links (Bl. 1)',
                        'Notenpapier, 16 Systeme, Format: quer 175 × 270 mm, kein Firmenzeichen (Bl. 2)',
                    ],
                    writingInstruments: {
                        main: 'Bleistift',
                        secondary: ['roter Buntstift', 'blaue Tinte', 'Kopierstift'],
                    },
                    titles: ['test titles 1', 'test titles 2'],
                    dates: ['test dates 1', 'test dates 2'],
                    paginations: ['test paginations 1', 'test paginations 2'],
                    measureNumbers: ['test measure numbers 1', 'test measure numbers 2'],
                    instrumentations: ['test instrumentations 1', 'test instrumentations 2'],
                    annotations: ['test annotations'],
                    contents: [
                        {
                            item: 'Test item',
                            itemLinkTo: {
                                complexId: 'testComplex1',
                                sheetId: 'test_item_id_1',
                            },
                            itemDescription: '(test description)',
                            folios: [
                                {
                                    folio: '1r',
                                    folioLinkTo: 'test_folio_id_1',
                                    folioDescription: '',
                                    systemGroups: [
                                        [
                                            {
                                                system: '1–2',
                                                measure: '1–3',
                                                linkTo: 'test_id_1',
                                            },
                                        ],
                                        [
                                            {
                                                system: '3–4',
                                                systemDescription: '(test system description)',
                                                measure: '4–6',
                                                linkTo: 'test_id_2',
                                            },
                                        ],
                                    ],
                                },
                                {
                                    folio: '29v',
                                    folioLinkTo: '',
                                    folioDescription: '',
                                    systemGroups: [
                                        [
                                            {
                                                system: '7–8',
                                                measure: '10–12',
                                                linkTo: 'test_id_4',
                                            },
                                        ],
                                        [
                                            {
                                                system: '9–10',
                                                measure: '13–15',
                                                linkTo: 'test_id_5',
                                            },
                                        ],
                                    ],
                                },
                                {
                                    folio: '2',
                                    isPage: true,
                                    folioLinkTo: 'test_folio_id_2',
                                    folioDescription: '',
                                    systemGroups: [
                                        [
                                            {
                                                system: '1–2',
                                                measure: '1–3',
                                                linkTo: 'test_id_2_1',
                                            },
                                        ],
                                        [
                                            {
                                                system: '3–4',
                                                systemDescription: '(test system description)',
                                                measure: '4–6',
                                                linkTo: 'test_id_2_2',
                                            },
                                        ],
                                    ],
                                },
                                {
                                    folio: '100v',
                                    folioLinkTo: '',
                                    folioDescription: '',
                                    systemGroups: [
                                        [
                                            {
                                                system: '7–8',
                                                measure: '',
                                                linkTo: '',
                                            },
                                        ],
                                    ],
                                },
                            ],
                        },
                        {
                            item: 'Test item 2 without link',
                            itemLinkTo: {},
                            itemDescription: '(test description 2)',
                            folios: [
                                {
                                    folio: '1r',
                                    folioLinkTo: 'test_folio_id_1',
                                    folioDescription: '',
                                    systemGroups: [
                                        [
                                            {
                                                system: '1a',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'G',
                                                    rowBase: 'g',
                                                    rowNumber: '1',
                                                },
                                            },
                                            {
                                                system: '1b',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'K',
                                                    rowBase: 'gis',
                                                    rowNumber: '2',
                                                },
                                            },
                                        ],
                                        [
                                            {
                                                system: '2a',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'U',
                                                    rowBase: 'g',
                                                    rowNumber: '3',
                                                },
                                            },
                                            {
                                                system: '2b',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'KU',
                                                    rowBase: 'fis',
                                                    rowNumber: '4',
                                                },
                                            },
                                        ],
                                    ],
                                },
                                {
                                    folio: '29v',
                                    folioLinkTo: '',
                                    folioDescription: '',
                                    systemGroups: [
                                        [
                                            {
                                                system: '1a',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'G',
                                                    rowBase: 'g',
                                                    rowNumber: '1',
                                                },
                                            },
                                            {
                                                system: '1b',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'K',
                                                    rowBase: 'gis',
                                                    rowNumber: '2',
                                                },
                                            },
                                        ],
                                        [
                                            {
                                                system: '2a',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'U',
                                                    rowBase: 'g',
                                                    rowNumber: '3',
                                                },
                                            },
                                            {
                                                system: '2b',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'KU',
                                                    rowBase: 'fis',
                                                    rowNumber: '4',
                                                },
                                            },
                                        ],
                                    ],
                                },
                                {
                                    folio: '2',
                                    folioLinkTo: '',
                                    folioDescription: '',
                                    systemGroups: [
                                        [
                                            {
                                                system: '1a',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'G',
                                                    rowBase: 'g',
                                                    rowNumber: '1',
                                                },
                                            },
                                            {
                                                system: '1b',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'K',
                                                    rowBase: 'gis',
                                                    rowNumber: '2',
                                                },
                                            },
                                        ],
                                        [
                                            {
                                                system: '2a',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'U',
                                                    rowBase: 'g',
                                                    rowNumber: '3',
                                                },
                                            },
                                            {
                                                system: '2b',
                                                measure: '',
                                                linkTo: '',
                                                row: {
                                                    rowType: 'KU',
                                                    rowBase: 'fis',
                                                    rowNumber: '4',
                                                },
                                            },
                                        ],
                                    ],
                                },
                            ],
                        },
                        {
                            item: 'Test item 3 without description',
                            itemLinkTo: {
                                complexId: 'testComplex1',
                                sheetId: 'test_item_id_2',
                            },
                            itemDescription: '',
                            folios: [],
                        },
                        {
                            item: '',
                            itemLinkTo: {},
                            itemDescription: '',
                            folios: [
                                {
                                    folio: '2v',
                                    folioLinkTo: '',
                                    folioDescription: 'Test item 4 without item',
                                    systemGroups: [],
                                },
                            ],
                        },
                    ],
                    corrections: [
                        {
                            id: 'source_Aa_corr_1',
                            label: 'Korrekturen 1 in <strong>B</strong> (mit Tinte)',
                            evaluations: [
                                'Die Beschreibung der Korrekturen bezieht sich auf „Der Tag ist vergangen“ M 212: Textfassung 1.',
                            ],
                            commentary: {
                                preamble: 'Korrekturen 1:',
                                comments: [
                                    {
                                        measure: '3–4',
                                        system: '',
                                        position: '',
                                        comment: 'Auf Tektur. ##Unter Tektur: ##Notenbeispiel?####',
                                    },
                                    {
                                        measure: '4',
                                        system: 'Klav. o.',
                                        position: '',
                                        comment:
                                            'Auf Rasur. Ante correcturam: Ganze Pause? Bassschlüssel nach Korrektur hinzugefügt.',
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
            {
                id: 'source_BH',
                siglum: 'B',
                siglumAddendum: 'H',
                missing: true,
                type: 'Handexemplar von <strong>G</strong>.',
                location: 'US-Wc, Moldenhauer Archives, Box-Folder: 59/10.',
                description: {
                    desc: [
                        "Siehe <a (click)=\"ref.navigateToReportFragment({complexId: '', fragmentId: 'source_G'})\"><strong>G</strong></a>.",
                    ],
                },
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
                    '<small class="text-muted">[Die Quellenbewertung zum gesamten Editionskomplex <em>Drei Lieder nach Gedichten von Hildegard Jone</em> op. 25 erscheint im Zusammenhang der vollständigen Edition von Opus 25 in AWG I/5.]</small>',
                    "Die Skizzen in <a (click)=\"ref.navigateToReportFragment({complexId: '', fragmentId: 'source_A'})\"><strong>A</strong></a> enthalten u. a. <a (click)=\"ref.openModal('OP12_SHEET_COMING_SOON')\"><strong>Test Sk1</strong></a> (13. Januar 1915) als Korrekturen einer in <strong>B</strong> und in <a (click)=\"ref.selectSvgSheet({complexId: 'testComplex1', sheetId: 'test_item_id_1'})\"><strong>Test Sk1</strong></a> vorformulierten Fassung dar.",
                ],
            },
        ],
    },

    /**
     * Test helper data constant: mockSourceEvaluationListEmptyData.
     *
     * It provides a mocked sourceEvaluationListData object with empty content.
     */
    mockSourceEvaluationListEmptyData: {
        sources: [
            {
                id: 'op25',
                content: [],
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_WE1.
     *
     * It provides a mocked svg sheet workEdition object.
     */
    mockSvgSheet_WE1: {
        id: 'test-WE1',
        label: 'Test WE1',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op25/M317_TextfassungWE_1von2_path.svg',
                image: '',
                partial: 'a',
                convolute: '',
            },
            {
                svg: 'assets/img/edition/series/1/section/5/op25/M317_TextfassungWE_2von2_path.svg',
                image: '',
                partial: 'b',
                convolute: '',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_TF1.
     *
     * It provides a mocked svg sheet textEdition object.
     */
    mockSvgSheet_TF1: {
        id: 'test-TF1',
        label: 'Test TF1',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op25/M317_Textfassung1_1von2_path.svg',
                image: '',
                partial: 'a',
                convolute: 'B',
            },
            {
                svg: 'assets/img/edition/series/1/section/5/op25/M317_Textfassung1_2von2_path.svg',
                image: '',
                partial: 'b',
                convolute: 'B',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk1.
     *
     * It provides a mocked svg sheet sketchEdition object.
     */
    mockSvgSheet_Sk1: {
        id: 'test-1',
        label: 'Test Sk1',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk1_1von1_220610_path.svg',
                image: '',
                partial: '',
                convolute: 'A',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk2.
     *
     * It provides a mocked svg sheet sketchEdition object with partials.
     */
    mockSvgSheet_Sk2: {
        id: 'test-2',
        label: 'Test Sk2 with partials',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk2_1von2_220610_path.svg',
                image: '',
                partial: 'a',
                convolute: 'A',
            },
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk2_2von2_220610_path.svg',
                image: '',
                partial: 'b',
                convolute: 'A',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk2a.
     *
     * It provides a mocked partial svg sheet sketchEdition object.
     */
    mockSvgSheet_Sk2a: {
        id: 'test-2',
        label: 'Test Sk2 with partials',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk2_1von2_220610_path.svg',
                image: '',
                partial: 'a',
                convolute: 'A',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk2b.
     *
     * It provides a mocked partial svg sheet sketchEdition object.
     */
    mockSvgSheet_Sk2b: {
        id: 'test-2',
        label: 'Test Sk2 with partials',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk2_2von2_220610_path.svg',
                image: '',
                partial: 'b',
                convolute: 'A',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk3.
     *
     * It provides a mocked svg sheet sketchEdition object with partials.
     */
    mockSvgSheet_Sk3: {
        id: 'test-3',
        label: 'Test Sk3 with partials',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk3_1von3_220610_path.svg',
                image: '',
                partial: 'a',
                convolute: 'B',
            },
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk3_2von3_220610_path.svg',
                image: '',
                partial: 'b',
                convolute: 'B',
            },
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk3_3von3_220610_path.svg',
                image: '',
                partial: 'c',
                convolute: 'B',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk3a.
     *
     * It provides another mocked svg sheet sketchEdition object.
     */
    mockSvgSheet_Sk3a: {
        id: 'test-3',
        label: 'Test Sk3 with partials',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk3_1von3_220610_path.svg',
                image: '',
                partial: 'a',
                convolute: 'B',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk3b.
     *
     * It provides another mocked svg sheet sketchEdition object.
     */
    mockSvgSheet_Sk3b: {
        id: 'test-3',
        label: 'Test Sk3 with partials',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/SkI_3n_small_cut_opt.svg',
                image: '',
                partial: 'b',
                convolute: 'B',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk3c.
     *
     * It provides another mocked svg sheet sketchEdition object.
     */
    mockSvgSheet_Sk3c: {
        id: 'test-3',
        label: 'Test Sk3 with partials',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk3_3von3_220610_path.svg',
                image: '',
                partial: 'c',
                convolute: 'B',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk4.
     *
     * It provides another mocked svg sheet sketchEdition object.
     */
    mockSvgSheet_Sk4: {
        id: 'test-4',
        label: 'Test Sk4',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/SkI_3n_small_cut_opt.svg',
                image: 'assets/img/edition/series/1/section/5/op12/SkI_3_small.jpg',
                partial: '',
                convolute: 'B',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk5.
     *
     * It provides another mocked svg sheet sketchEdition object.
     */
    mockSvgSheet_Sk5: {
        id: 'test-5',
        label: 'Test Sk5',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/SkI_5n_small_cut_opt.svg',
                image: 'assets/img/edition/series/1/section/5/op12/SkI_5_small.jpg',
                partial: '',
                convolute: 'C',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheet_Sk6.
     *
     * It provides another mocked svg sheet sketchEdition object.
     */
    mockSvgSheet_Sk6: {
        id: 'test-6',
        label: 'Test Sk6',
        content: [
            {
                svg: 'assets/img/edition/series/1/section/5/op12/SkI_5n_small_cut_opt.svg',
                image: 'assets/img/edition/series/1/section/5/op12/SkI_5_small.jpg',
                partial: '',
                convolute: 'D',
            },
        ],
    },

    /**
     * Test helper data constant: mockSvgSheetList.
     *
     * It provides a mocked svg sheet list object.
     */
    mockSvgSheetList: {
        sheets: {
            workEditions: [
                {
                    id: 'test-WE1',
                    label: 'Test WE1',
                    content: [
                        {
                            svg: 'assets/img/edition/series/1/section/5/op25/M317_TextfassungWE_1von2_path.svg',
                            image: '',
                            partial: 'a',
                            convolute: '',
                        },
                        {
                            svg: 'assets/img/edition/series/1/section/5/op25/M317_TextfassungWE_2von2_path.svg',
                            image: '',
                            partial: 'b',
                            convolute: '',
                        },
                    ],
                },
            ],
            textEditions: [
                {
                    id: 'test-TF1',
                    label: 'Test TF1',
                    content: [
                        {
                            svg: 'assets/img/edition/series/1/section/5/op25/M317_Textfassung1_1von2_path.svg',
                            image: '',
                            partial: 'a',
                            convolute: 'B',
                        },
                        {
                            svg: 'assets/img/edition/series/1/section/5/op25/M317_Textfassung1_2von2_path.svg',
                            image: '',
                            partial: 'b',
                            convolute: 'B',
                        },
                    ],
                },
            ],
            sketchEditions: [
                {
                    id: 'test-1',
                    label: 'Test Sk1',
                    content: [
                        {
                            svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk1_1von1_220610_path.svg',
                            image: '',
                            partial: '',
                            convolute: 'A',
                        },
                    ],
                },
                {
                    id: 'test-2',
                    label: 'Test Sk2 with partials',
                    content: [
                        {
                            svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk2_1von2_220610_path.svg',
                            image: '',
                            partial: 'a',
                            convolute: 'A',
                        },
                        {
                            svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk2_2von2_220610_path.svg',
                            image: '',
                            partial: 'b',
                            convolute: 'A',
                        },
                    ],
                },
                {
                    id: 'test-3',
                    label: 'Test Sk3 with partials',
                    content: [
                        {
                            svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk3_1von3_220610_path.svg',
                            image: '',
                            partial: 'a',
                            convolute: 'B',
                        },
                        {
                            svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk3_2von3_220610_path.svg',
                            image: '',
                            partial: 'b',
                            convolute: 'B',
                        },
                        {
                            svg: 'assets/img/edition/series/1/section/5/op12/M212_Sk3_3von3_220610_path.svg',
                            image: '',
                            partial: 'c',
                            convolute: 'B',
                        },
                    ],
                },
                {
                    id: 'test-4',
                    label: 'Test Sk4',
                    content: [
                        {
                            svg: 'assets/img/edition/series/1/section/5/op12/SkI_3n_small_cut_opt.svg',
                            image: 'assets/img/edition/series/1/section/5/op12/SkI_3_small.jpg',
                            partial: '',
                            convolute: 'B',
                        },
                    ],
                },
                {
                    id: 'test-5',
                    label: 'Test Sk5',
                    content: [
                        {
                            svg: 'assets/img/edition/series/1/section/5/op12/SkI_5n_small_cut_opt.svg',
                            image: 'assets/img/edition/series/1/section/5/op12/SkI_5_small.jpg',
                            partial: '',
                            convolute: 'C',
                        },
                    ],
                },
            ],
        },
    },

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
                evaluations: [],
                commentary: { preamble: '', comments: [] },
                linkBoxes: [],
            },
            {
                id: 'test-2',
                label: 'test2',
                evaluations: [
                    'test description 1',
                    "In <strong>Sk2</strong> werden T. 11–12 aus <a (click)=\"ref.selectSvgSheet({complexId: 'testComplex1', sheetId: 'test-1'})\"><strong>Sk1</strong></a> bzw. T. 10–11 aus <a (click)=\"ref.navigateToReportFragment({complexId: '', fragmentId: 'source_B'})\"><strong>B</strong></a> neu skizziert, weiter modifiziert und zu einer Formulierung gebracht, die T. 10–11 aus <a (click)=\"ref.openModal('OP12_SHEET_COMING_SOON')\"><strong>C</strong></a> entspricht.",
                ],
                rowtable: true,
                commentary: {
                    preamble: 'This is a preamble.',
                    comments: [
                        {
                            blockHeader: 'blockheader 1',
                            blockComments: [
                                {
                                    svgGroupId: 'svg-group-1',
                                    measure: '10',
                                    system: '12',
                                    position: '1. Note',
                                    comment: 'Viertelnote überschreibt Halbe Note.',
                                },
                                {
                                    svgGroupId: 'svg-group-2',
                                    measure: '10',
                                    system: '12',
                                    position: '2. Note',
                                    comment:
                                        "Die Skizzen in <a (click)=\"ref.navigateToReportFragment({complexId: '', fragmentId: 'source_A'})\"><strong>A</strong></a> enthalten datierte Verlaufsskizzen zu allen vier Liedern. Siehe <a (click)=\"ref.openModal('OP12_SHEET_COMING_SOON')\"><strong>Test SkXYZ</strong></a> T. [11] und <a (click)=\"ref.selectSvgSheet({complexId: 'testComplex1', sheetId: 'test-1'})\"><strong>Test Sk1</strong></a>.",
                                },
                                {
                                    svgGroupId: 'svg-group-3',
                                    measure: '{13}',
                                    system: '12',
                                    position: '3. Note',
                                    comment:
                                        '<span class="glyph">{{ref.getGlyph("[a]")}}</span> überschreibt <span class="glyph">{{ref.getGlyph("[b]")}}</span>.',
                                },
                                {
                                    svgGroupId: 'svg-group-4',
                                    measure: '[12]',
                                    system: '13',
                                    position: '',
                                    comment: 'radierte, nicht entzifferbare Schicht.',
                                },
                            ],
                        },
                        {
                            blockHeader: 'blockheader 2',
                            blockComments: [
                                {
                                    svgGroupId: 'svg-group-5',
                                    measure: '11',
                                    system: '13',
                                    position: '1. Note',
                                    comment: 'Viertelnote überschreibt Halbe Note.',
                                },
                                {
                                    svgGroupId: 'svg-group-6',
                                    measure: '11',
                                    system: '13',
                                    position: '2. Note',
                                    comment: 'Halbe Note überschreibt Viertelnote.',
                                },
                            ],
                        },
                    ],
                },
                linkBoxes: [],
            },
        ],
    },
};
