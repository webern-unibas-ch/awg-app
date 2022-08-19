/**
 * The EditionRoute class.
 *
 * It is used in the context of the edition view
 * to store routing constants of the editions parts.
 */
export class EditionRoute {
    /**
     * The route path of an edition route.
     */
    route: string;

    /**
     * The short label of an edition route.
     */
    short: string;

    /**
     * The full label of an edition route.
     */
    full: string;
}

/**
 * The EditionSeriesRoutes class.
 *
 * It is used in the context of the edition view
 * to store routing constants of the edition series.
 */
export class EditionSeriesRoutes {
    /**
     * The series route of an edition series.
     */
    series: EditionRoute;

    /**
     * The sections routes of an edition series.
     */
    sections: EditionRoute[];
}

/**
 * The EditionConstants class.
 *
 * It is used in the context of the edition view
 * to store string constants of the editions.
 */
export class EditionConstants {
    /**
     * The edition route for the edition.
     */
    static readonly EDITION: EditionRoute = {
        route: '/edition',
        short: 'AWG',
        full: 'Anton Webern Gesamtausgabe',
    };

    /**
     * The edition route for the row tables.
     */
    static readonly ROWTABLES: EditionRoute = {
        route: '/row-tables',
        short: 'Reihentabellen',
        full: 'Reihentabellen',
    };

    /**
     * The edition route for a composition.
     */
    static readonly COMPOSITION: EditionRoute = {
        route: '/composition',
        short: 'Komposition',
        full: 'Komposition',
    };

    /**
     * The edition route for the opus number.
     */
    static readonly OPUS: EditionRoute = {
        route: '/opus',
        short: 'op.',
        full: 'Opus',
    };

    /**
     * The editon route for the Moldenhauer number.
     */
    static readonly MNR: EditionRoute = {
        route: '/mnr',
        short: 'M',
        full: 'Moldenhauer-Nr.',
    };

    /**
     * The edition route for the series.
     */
    static readonly SERIES: EditionRoute = {
        route: '/series/',
        short: 'Serien',
        full: 'Serienübersicht',
    };

    /**
     * The edition route for series I.
     */
    static readonly SERIES_1: EditionRoute = {
        route: '1',
        short: 'I',
        full: 'Serie I (Werke mit Opuszahlen)',
    };

    /**
     * The edition route for series II.
     */
    static readonly SERIES_2: EditionRoute = {
        route: '2',
        short: 'II',
        full: 'Serie II (Nachgelassene Kompositionen und Fragmente)',
    };

    /**
     * The edition route for series III.
     */
    static readonly SERIES_3: EditionRoute = {
        route: '3',
        short: 'III',
        full: 'Serie III (Bearbeitungen von Werken anderer Komponisten)',
    };

    /**
     * The edition route for the series.
     */
    static readonly SECTION: EditionRoute = {
        route: '/section/',
        short: 'Abteilung',
        full: 'Abteilungsübersicht',
    };

    /**
     * The edition route for section 1.
     */
    static readonly SECTION_1: EditionRoute = {
        route: '1',
        short: '1',
        full: 'Abteilung 1 (Orchestermusik)',
    };

    /**
     * The edition route for section 2.
     */
    static readonly SECTION_2: EditionRoute = {
        route: '2',
        short: '2',
        full: 'Abteilung 2 (Kammer- und Klaviermusik)',
    };

    /**
     * The edition route for section 2.
     */
    static readonly SECTION_2A: EditionRoute = {
        route: '2a',
        short: '2a',
        full: 'Abteilung 2a (Klaviermusik)',
    };

    /**
     * The edition route for section 3.
     */
    static readonly SECTION_3: EditionRoute = {
        route: '3',
        short: '3',
        full: 'Abteilung 3 (Chormusik)',
    };

    /**
     * The edition route for section 4.
     */
    static readonly SECTION_4: EditionRoute = {
        route: '4',
        short: '4',
        full: 'Abteilung 4 (Vokalmusik mit Ensemblebegleitung)',
    };

    /**
     * The edition route for section 5.
     */
    static readonly SECTION_5 = {
        route: '5',
        short: '5',
        full: 'Abteilung 5 (Klavierlieder)',
    };

    /**
     * The edition route for section 5.
     */
    static readonly SERIES_3_SECTION_5 = {
        route: '5',
        short: '5',
        full: 'Abteilung 5 (Klavierauszüge)',
    };

    /**
     * The edition route for a work edition.
     */
    static readonly WORK_EDITION: EditionRoute = {
        route: '/work-edition',
        short: 'WE',
        full: 'Werkedition',
    };

    /**
     * The edition route for a text edition.
     */
    static readonly TEXT_EDITION: EditionRoute = {
        route: '/text-edition',
        short: 'TE',
        full: 'Textedition',
    };

    /**
     * The edition route for a sketch edition.
     */
    static readonly SKETCH_EDITION: EditionRoute = {
        route: '/sketch-edition',
        short: 'SE',
        full: 'Skizzenedition',
    };

    /**
     * The edition route for the graph section of an edition.
     */
    static readonly EDITION_GRAPH: EditionRoute = {
        route: 'graph',
        short: 'Graph',
        full: 'Graph',
    };

    /**
     * The edition route for the intro section of an edition.
     */
    static readonly EDITION_INTRO: EditionRoute = {
        route: 'intro',
        short: 'Einleitung',
        full: 'Einleitung',
    };

    /**
     * The edition route for the sheets section of an edition.
     */
    static readonly EDITION_SHEETS: EditionRoute = {
        route: 'sheets',
        short: 'Edierte Notentexte',
        full: 'Edierte Notentexte',
    };

    /**
     * The edition route for the report section of an edition.
     */
    static readonly EDITION_REPORT: EditionRoute = {
        route: 'report',
        short: 'Kritischer Bericht',
        full: 'Kritischer Bericht',
    };

    /**
     * ASSETS
     */

    /**
     * The paths to the edition assets JSON files.
     */
    static readonly EDITION_ASSETS = {
        baseRoute: 'assets/data/edition',
        folioConvoluteFile: 'folio-convolute.json',
        graphFile: 'graph.json',
        introFile: 'intro.json',
        svgSheetsFile: 'svg-sheets.json',
        sourceListFile: 'source-list.json',
        sourceDescriptionListFile: 'source-description.json',
        sourceEvaluationListFile: 'source-evaluation.json',
        textcriticsFile: 'textcritics.json',
    };

    /**
     * The path to the assets image of a firm sign: JE No. 3, 14 Lines.
     */
    static readonly FIRM_JE_NO_3_LIN_14: EditionRoute = {
        route: 'assets/img/edition/firm-signs/firm_je_no3_lin14.png',
        short: '[JE] | No. 3 | 14 linig.',
        full: 'J. E. & Co. [diagonal ansteigend auf schildförmiger Papierrolle, rechts von einem Löwen gehalten, links und unten Blattgirlande] | No. 3 | 14 linig.',
    };

    /**
     * The path to the assets image of a firm sign: JE No. 9, 28 Lines.
     */
    static readonly FIRM_JE_NO_9_LIN_28: EditionRoute = {
        route: 'assets/img/edition/firm-signs/firm_je_no9_lin28.png',
        short: '[JE] | No. 9 | 28 linig.',
        full: 'J. E. & Co. [diagonal ansteigend auf schildförmiger Papierrolle, rechts von einem Löwen gehalten, links und unten Blattgirlande] | No. 9 | 28 linig.',
    };

    /**
     * The edition route to the assets image of a firm sign: JE No. 15, 16 Lines.
     */
    static readonly FIRM_JE_NO_15_LIN_16: EditionRoute = {
        route: 'assets/img/edition/firm-signs/firm_je_no15_lin16.png',
        short: '[JE] | No. 15 | 16 linig.',
        full: 'J. E. & Co. [diagonal ansteigend auf schildförmiger Papierrolle, rechts von einem Löwen gehalten, links und unten Blattgirlande] | No. 15 | 16 linig.',
    };

    /**
     * The path to the assets image of the graph for op 25.
     */
    static readonly GRAPH_IMAGE_OP25: EditionRoute = {
        route: 'assets/img/edition/series/1/section/5/op25/graph_op25_1.png',
        short: 'Statischer Graph op. 25/I',
        full: 'Statischer Graph der Skizzen von Opus 25/I.',
    };
}
