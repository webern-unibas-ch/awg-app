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
    route = '';

    /**
     * The short label of a route constant.
     */
    short = '';

    /**
     * The full label of a route constant.
     */
    full = '';
}

/**
 * The EDITION_CATALOGUE_TYPE_CONSTANTS constant.
 *
 * It is used in the context of the edition view
 * to store the route constants of the edition catalogue types.
 */
export const EDITION_CATALOGUE_TYPE_CONSTANTS = {
    /**
     * The route constant for the opus number.
     */
    OPUS: {
        route: '/op',
        short: 'op.',
        full: 'Opus',
    },

    /**
     * The route constant for the Moldenhauer number.
     */
    MNR: {
        route: '/m',
        short: 'M',
        full: 'Moldenhauer-Nr.',
    },

    /**
     * The route constant for an extended Moldenhauer number (AWG-ID).
     */
    MNR_X: {
        route: '/mx',
        short: 'M*',
        full: 'Moldenhauer-Nr. (AWG-ID)',
    },
} satisfies Record<string, EditionRouteConstant>;

/**
 * The EDITION_TYPE_CONSTANTS class.
 *
 * It is used in the context of the edition view
 * to store the route constants of the edition types.
 */
export const EDITION_TYPE_CONSTANTS = {
    /**
     * The route constant for a work edition.
     */
    WORK_EDITION: {
        route: 'work-edition',
        short: 'WE',
        full: 'Werkedition',
    },

    /**
     * The route constant for a text edition.
     */
    TEXT_EDITION: {
        route: 'text-edition',
        short: 'TE',
        full: 'Textedition',
    },

    /**
     * The route constant for a sketch edition.
     */
    SKETCH_EDITION: {
        route: 'sketch-edition',
        short: 'SE',
        full: 'Skizzenedition',
    },
} satisfies Record<string, EditionRouteConstant>;

/**
 * The EDITION_ROUTE_CONSTANTS constant.
 *
 * It is used in the context of the edition view
 * to store route constants of the editions.
 */
export const EDITION_ROUTE_CONSTANTS = {
    /**
     * The route constant for the edition.
     */
    EDITION: {
        route: '/edition',
        short: 'AWG',
        full: 'Anton Webern Gesamtausgabe',
    },

    /**
     * The route constant for the preface.
     */
    PREFACE: {
        route: 'preface',
        short: 'Vorwort',
        full: 'Vorwort / Preface',
    },

    /**
     * The route constant for the rowtables.
     */
    ROWTABLES: {
        route: 'rowtables',
        short: 'Reihentabellen',
        full: 'Reihentabellen',
    },

    /**
     * The route constant for an edition complex.
     */
    COMPLEX: {
        route: '/complex',
        short: 'Editionskomplex',
        full: 'Editionskomplex',
    },

    /**
     * The route constant for the series.
     */
    SERIES: {
        route: 'series',
        short: 'Serien',
        full: 'Editionsübersicht',
    },

    /**
     * The route constant for series I.
     */
    SERIES_1: {
        route: '1',
        short: 'I',
        full: 'Serie I (Werke mit Opuszahlen)',
    },

    /**
     * The route constant for series II.
     */
    SERIES_2: {
        route: '2',
        short: 'II',
        full: 'Serie II (Nachgelassene Kompositionen und Fragmente)',
    },

    /**
     * The route constant for series III.
     */
    SERIES_3: {
        route: '3',
        short: 'III',
        full: 'Serie III (Bearbeitungen von Werken anderer Komponisten)',
    },

    /**
     * The route constant for the series.
     */
    SECTION: {
        route: 'section',
        short: 'Abteilung',
        full: 'Abteilungsübersicht',
    },

    /**
     * The route constant for section 1.
     */
    SECTION_1: {
        route: '1',
        short: '1',
        full: 'Abteilung 1 (Orchestermusik)',
    },

    /**
     * The route constant for section 2.
     */
    SECTION_2: {
        route: '2',
        short: '2',
        full: 'Abteilung 2 (Kammer- und Klaviermusik)',
    },

    /**
     * The route constant for section 2a.
     */
    SECTION_2A: {
        route: '2a',
        short: '2a',
        full: 'Abteilung 2a (Kammer- und Klaviermusik: Klaviermusik)',
    },

    /**
     * The route constant for section 2b.
     */
    SECTION_2B: {
        route: '2b',
        short: '2b',
        full: 'Abteilung 2b (Kammer- und Klaviermusik: Kammermusik)',
    },

    /**
     * The route constant for section 3.
     */
    SECTION_3: {
        route: '3',
        short: '3',
        full: 'Abteilung 3 (Chormusik)',
    },

    /**
     * The route constant for section 4.
     */
    SECTION_4: {
        route: '4',
        short: '4',
        full: 'Abteilung 4 (Vokalmusik mit Ensemblebegleitung)',
    },

    /**
     * The route constant for section 5.
     */
    SECTION_5: {
        route: '5',
        short: '5',
        full: 'Abteilung 5 (Klavierlieder)',
    },

    /**
     * The route constant for section 5.
     */
    SERIES_3_SECTION_5: {
        route: '5',
        short: '5',
        full: 'Abteilung 5 (Klavierauszüge)',
    },

    /**
     * The route constant for the graph section of an edition.
     */
    EDITION_GRAPH: {
        route: 'graph',
        short: 'Graph',
        full: 'Graph',
    },

    /**
     * The route constant for the intro section of an edition.
     */
    EDITION_INTRO: {
        route: 'intro',
        short: 'Einleitung',
        full: 'Einleitung / Introduction',
    },

    /**
     * The route constant for the sheets section of an edition.
     */
    EDITION_SHEETS: {
        route: 'sheets',
        short: 'Edierte Notentexte',
        full: 'Edierte Notentexte',
    },

    /**
     * The route constant for the report section of an edition.
     */
    EDITION_REPORT: {
        route: 'report',
        short: 'Kritischer Bericht',
        full: 'Kritischer Bericht',
    },
} satisfies Record<string, EditionRouteConstant>;

/**
 * The EditionCatalogueTypeConstantsKey type.
 *
 * It is used in the context of the edition view
 * to store the keys of the edition catalogue type constants.
 */
export type EditionCatalogueTypeConstantsKey = keyof typeof EDITION_CATALOGUE_TYPE_CONSTANTS;

/**
 * The EditionRouteConstantsKey type.
 *
 * It is used in the context of the edition view
 * to store the keys of the edition route constants.
 */
export type EditionRouteConstantsKey = keyof typeof EDITION_ROUTE_CONSTANTS;
