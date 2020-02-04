/**
 * The EditionRoute class.
 *
 * It is used in the context of the edition view
 * to store string constants of the editions.
 */
export class EditionRoute {
    route: string;
    short: string;
    full: string;
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
    static readonly edition: EditionRoute = {
        route: '/edition',
        short: 'AWG',
        full: 'Anton Webern Gesamtausgabe'
    };

    /**
     * The edition route for a composition.
     */
    static readonly composition: EditionRoute = {
        route: '/composition',
        short: 'Komposition',
        full: 'Komposition'
    };

    /**
     * The edition route for series I.
     */
    static readonly series1: EditionRoute = {
        route: '/series1',
        short: 'Serie I',
        full: 'Serie I (Werke mit Opuszahlen)'
    };

    /**
     * The edition route for series II.
     */
    static readonly series2: EditionRoute = {
        route: '/series2',
        short: 'Serie II',
        full: 'Serie II (Nachgelassene Kompositionen und Fragmente)'
    };

    /**
     * The edition route for series III.
     */
    static readonly series3: EditionRoute = {
        route: '/series3',
        short: 'Serie III',
        full: 'Serie III (Bearbeitungen von Werken anderer Komponisten)'
    };

    /**
     * The edition route for section 1.
     */
    static readonly section1: EditionRoute = {
        route: '/section1',
        short: 'Abteilung 1',
        full: 'Abteilung 1 (Orchestermusik)'
    };

    /**
     * The edition route for section 2.
     */
    static readonly section2: EditionRoute = {
        route: '/section2',
        short: 'Abteilung 2',
        full: 'Abteilung 2 (Kammer- und Klaviermusik)'
    };

    /**
     * The edition route for section 3.
     */
    static readonly section3: EditionRoute = {
        route: '/section3',
        short: 'Abteilung 3',
        full: 'Abteilung 3 (Chormusik)'
    };

    /**
     * The edition route for section 4.
     */
    static readonly section4: EditionRoute = {
        route: '/section4',
        short: 'Abteilung 4',
        full: 'Abteilung 4 (Vokalmusik mit Ensemblebegleitung)'
    };

    /**
     * The edition route for section 5.
     */
    static readonly section5 = {
        route: '/section5',
        short: 'Abteilung 5',
        full: 'Abteilung 5 (Klavierlieder)'
    };

    /**
     * The edition route for a text edition.
     */
    static readonly textEdition: EditionRoute = {
        route: '/texts',
        short: 'Textedition',
        full: 'Textedition'
    };

    /**
     * The edition route for a sketch edition.
     */
    static readonly sketchEdition: EditionRoute = {
        route: '/sketches',
        short: 'Skizzenedition',
        full: 'Skizzenedition'
    };

    /**
     * The edition route for the graph section of an edition.
     */
    static readonly editionGraph: EditionRoute = {
        route: 'graph',
        short: 'Graph',
        full: 'Graph'
    };

    /**
     * The edition route for the intro section of an edition.
     */
    static readonly editionIntro: EditionRoute = {
        route: 'intro',
        short: 'Einleitung',
        full: 'Einleitung'
    };

    /**
     * The edition route for the detail section of an edition.
     */
    static readonly editionDetail: EditionRoute = {
        route: 'detail',
        short: 'Edierter Notentext',
        full: 'Edierter Notentext'
    };

    /**
     * The edition route for the report section of an edition.
     */
    static readonly editionReport: EditionRoute = {
        route: 'report',
        short: 'Kritischer Bericht',
        full: 'Kritischer Bericht'
    };

    /**
     * ASSETS
     */

    /**
     * The paths to the edition assets JSON files.
     */
    static readonly editionAssets = {
        baseRoute: 'assets/data/edition',
        folioConvoluteFile: 'folio-convolute.json',
        graphFile: 'graph.json',
        introFile: 'intro.json',
        svgSheetsFile: 'svg-sheets.json',
        sourceListFile: 'source-list.json',
        sourceDescriptionListFile: 'source-description.json',
        sourceEvaluationListFile: 'source-evaluation.json',
        textcriticsFile: 'textcritics.json'
    };

    /**
     * The path to the assets image of a firm sign: JE No. 9, 28 Lines.
     */
    static readonly firmJENo9Lin28 = 'assets/img/edition/series1/section5/op12/firm_je_no9_lin28.png';

    /**
     * The path to the assets image of the graph for op 25.
     */
    static readonly graphImageOp25: EditionRoute = {
        route: 'assets/img/edition/series1/section5/op25/graph_op25_1.png',
        short: 'Graph op. 25/I',
        full: 'Graph der Skizzen von Opus 25/I.'
    };
}
