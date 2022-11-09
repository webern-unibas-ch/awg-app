import { EditionComplex } from './edition-complex.model';

/**
 * The EditionRouteConstant class.
 *
 * It is used in the context of the edition view
 * to store routing information of the editions parts.
 */
export class EditionRouteConstant {
    /**
     * The route path of a route constant.
     */
    route: string;

    /**
     * The short label of a route constant.
     */
    short: string;

    /**
     * The full label of a route constant.
     */
    full: string;
}

/**
 * The EditionSeriesRoute class.
 *
 * It is used in the context of the edition view
 * to store routing information of the edition series.
 */
export class EditionSeriesRoute {
    /**
     * The series route of an edition series.
     */
    series: EditionRouteConstant;

    /**
     * The section route of an edition series.
     */
    sections: EditionSectionRoute[];
}

/**
 * The EditionSectionRoute class.
 *
 * It is used in the context of the edition view
 * to store routing information of the edition sections.
 */
export class EditionSectionRoute {
    /**
     * The section route of an edition section.
     */
    section: EditionRouteConstant;

    /**
     * The edition complexes of an edition section.
     */
    complexes: EditionComplexRoute[];

    /**
     * Boolean flag if an edition section is disabled.
     */
    disabled: boolean;
}

/**
 * The EditionComplexRoute class.
 *
 * It is used in the context of the edition view
 * to store routing information of an edition complex.
 */
export class EditionComplexRoute {
    /**
     * The edition complex.
     */
    complex: EditionComplex;

    /**
     * Boolean flag if an edition complex is disabled.
     */
    disabled: boolean;
}

/**
 * The EditionConstants class.
 *
 * It is used in the context of the edition view
 * to store string constants of the editions.
 */
export class EditionConstants {
    /**
     * The route info for the edition.
     */
    static readonly EDITION: EditionRouteConstant = {
        route: '/edition',
        short: 'AWG',
        full: 'Anton Webern Gesamtausgabe',
    };

    /**
     * The route info for the row tables.
     */
    static readonly ROWTABLES: EditionRouteConstant = {
        route: '/row-tables',
        short: 'Reihentabellen',
        full: 'Reihentabellen',
    };

    /**
     * The route info for an edition complex.
     */
    static readonly COMPLEX: EditionRouteConstant = {
        route: '/complex',
        short: 'Editionskomplex',
        full: 'Editionskomplex',
    };

    /**
     * The route info for the opus number.
     */
    static readonly OPUS: EditionRouteConstant = {
        route: '/op',
        short: 'op.',
        full: 'Opus',
    };

    /**
     * The route info for the Moldenhauer number.
     */
    static readonly MNR: EditionRouteConstant = {
        route: '/m',
        short: 'M',
        full: 'Moldenhauer-Nr.',
    };

    /**
     * The route info for the series.
     */
    static readonly SERIES: EditionRouteConstant = {
        route: '/series/',
        short: 'Serien',
        full: 'Serienübersicht',
    };

    /**
     * The route info for series I.
     */
    static readonly SERIES_1: EditionRouteConstant = {
        route: '1',
        short: 'I',
        full: 'Serie I (Werke mit Opuszahlen)',
    };

    /**
     * The route info for series II.
     */
    static readonly SERIES_2: EditionRouteConstant = {
        route: '2',
        short: 'II',
        full: 'Serie II (Nachgelassene Kompositionen und Fragmente)',
    };

    /**
     * The route info for series III.
     */
    static readonly SERIES_3: EditionRouteConstant = {
        route: '3',
        short: 'III',
        full: 'Serie III (Bearbeitungen von Werken anderer Komponisten)',
    };

    /**
     * The route info for the series.
     */
    static readonly SECTION: EditionRouteConstant = {
        route: '/section/',
        short: 'Abteilung',
        full: 'Abteilungsübersicht',
    };

    /**
     * The route info for section 1.
     */
    static readonly SECTION_1: EditionRouteConstant = {
        route: '1',
        short: '1',
        full: 'Abteilung 1 (Orchestermusik)',
    };

    /**
     * The route info for section 2.
     */
    static readonly SECTION_2: EditionRouteConstant = {
        route: '2',
        short: '2',
        full: 'Abteilung 2 (Kammer- und Klaviermusik)',
    };

    /**
     * The route info for section 2a.
     */
    static readonly SECTION_2A: EditionRouteConstant = {
        route: '2a',
        short: '2a',
        full: 'Abteilung 2a (Klaviermusik)',
    };

    /**
     * The route info for section 2b.
     */
    static readonly SECTION_2B: EditionRouteConstant = {
        route: '2a',
        short: '2a',
        full: 'Abteilung 2b (Kammermusik)',
    };

    /**
     * The route info for section 3.
     */
    static readonly SECTION_3: EditionRouteConstant = {
        route: '3',
        short: '3',
        full: 'Abteilung 3 (Chormusik)',
    };

    /**
     * The route info for section 4.
     */
    static readonly SECTION_4: EditionRouteConstant = {
        route: '4',
        short: '4',
        full: 'Abteilung 4 (Vokalmusik mit Ensemblebegleitung)',
    };

    /**
     * The route info for section 5.
     */
    static readonly SECTION_5 = {
        route: '5',
        short: '5',
        full: 'Abteilung 5 (Klavierlieder)',
    };

    /**
     * The route info for section 5.
     */
    static readonly SERIES_3_SECTION_5 = {
        route: '5',
        short: '5',
        full: 'Abteilung 5 (Klavierauszüge)',
    };

    /**
     * The route info for a work edition.
     */
    static readonly WORK_EDITION: EditionRouteConstant = {
        route: '/work-edition',
        short: 'WE',
        full: 'Werkedition',
    };

    /**
     * The route info for a text edition.
     */
    static readonly TEXT_EDITION: EditionRouteConstant = {
        route: '/text-edition',
        short: 'TE',
        full: 'Textedition',
    };

    /**
     * The route info for a sketch edition.
     */
    static readonly SKETCH_EDITION: EditionRouteConstant = {
        route: '/sketch-edition',
        short: 'SE',
        full: 'Skizzenedition',
    };

    /**
     * The route info for the graph section of an edition.
     */
    static readonly EDITION_GRAPH: EditionRouteConstant = {
        route: 'graph',
        short: 'Graph',
        full: 'Graph',
    };

    /**
     * The route info for the intro section of an edition.
     */
    static readonly EDITION_INTRO: EditionRouteConstant = {
        route: 'intro',
        short: 'Einleitung',
        full: 'Einleitung',
    };

    /**
     * The route info for the sheets section of an edition.
     */
    static readonly EDITION_SHEETS: EditionRouteConstant = {
        route: 'sheets',
        short: 'Edierte Notentexte',
        full: 'Edierte Notentexte',
    };

    /**
     * The route info for the report section of an edition.
     */
    static readonly EDITION_REPORT: EditionRouteConstant = {
        route: 'report',
        short: 'Kritischer Bericht',
        full: 'Kritischer Bericht',
    };
}
