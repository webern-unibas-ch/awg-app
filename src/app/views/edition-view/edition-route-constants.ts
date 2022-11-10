import { EditionRouteConstant } from '@awg-views/edition-view/models';

/**
 * The EDITION_ROUTE_CONSTANTS class.
 *
 * It is used in the context of the edition view
 * to store route constants of the editions.
 */
export class EDITION_ROUTE_CONSTANTS {
    /**
     * The route constant for the edition.
     */
    static readonly EDITION: EditionRouteConstant = {
        route: '/edition',
        short: 'AWG',
        full: 'Anton Webern Gesamtausgabe',
    };

    /**
     * The route constant for the row tables.
     */
    static readonly ROWTABLES: EditionRouteConstant = {
        route: '/row-tables',
        short: 'Reihentabellen',
        full: 'Reihentabellen',
    };

    /**
     * The route constant for an edition complex.
     */
    static readonly COMPLEX: EditionRouteConstant = {
        route: '/complex',
        short: 'Editionskomplex',
        full: 'Editionskomplex',
    };

    /**
     * The route constant for the opus number.
     */
    static readonly OPUS: EditionRouteConstant = {
        route: '/op',
        short: 'op.',
        full: 'Opus',
    };

    /**
     * The route constant for the Moldenhauer number.
     */
    static readonly MNR: EditionRouteConstant = {
        route: '/m',
        short: 'M',
        full: 'Moldenhauer-Nr.',
    };

    /**
     * The route constant for the series.
     */
    static readonly SERIES: EditionRouteConstant = {
        route: '/series/',
        short: 'Serien',
        full: 'Serienübersicht',
    };

    /**
     * The route constant for series I.
     */
    static readonly SERIES_1: EditionRouteConstant = {
        route: '1',
        short: 'I',
        full: 'Serie I (Werke mit Opuszahlen)',
    };

    /**
     * The route constant for series II.
     */
    static readonly SERIES_2: EditionRouteConstant = {
        route: '2',
        short: 'II',
        full: 'Serie II (Nachgelassene Kompositionen und Fragmente)',
    };

    /**
     * The route constant for series III.
     */
    static readonly SERIES_3: EditionRouteConstant = {
        route: '3',
        short: 'III',
        full: 'Serie III (Bearbeitungen von Werken anderer Komponisten)',
    };

    /**
     * The route constant for the series.
     */
    static readonly SECTION: EditionRouteConstant = {
        route: '/section/',
        short: 'Abteilung',
        full: 'Abteilungsübersicht',
    };

    /**
     * The route constant for section 1.
     */
    static readonly SECTION_1: EditionRouteConstant = {
        route: '1',
        short: '1',
        full: 'Abteilung 1 (Orchestermusik)',
    };

    /**
     * The route constant for section 2.
     */
    static readonly SECTION_2: EditionRouteConstant = {
        route: '2',
        short: '2',
        full: 'Abteilung 2 (Kammer- und Klaviermusik)',
    };

    /**
     * The route constant for section 2a.
     */
    static readonly SECTION_2A: EditionRouteConstant = {
        route: '2a',
        short: '2a',
        full: 'Abteilung 2a (Klaviermusik)',
    };

    /**
     * The route constant for section 2b.
     */
    static readonly SECTION_2B: EditionRouteConstant = {
        route: '2a',
        short: '2a',
        full: 'Abteilung 2b (Kammermusik)',
    };

    /**
     * The route constant for section 3.
     */
    static readonly SECTION_3: EditionRouteConstant = {
        route: '3',
        short: '3',
        full: 'Abteilung 3 (Chormusik)',
    };

    /**
     * The route constant for section 4.
     */
    static readonly SECTION_4: EditionRouteConstant = {
        route: '4',
        short: '4',
        full: 'Abteilung 4 (Vokalmusik mit Ensemblebegleitung)',
    };

    /**
     * The route constant for section 5.
     */
    static readonly SECTION_5 = {
        route: '5',
        short: '5',
        full: 'Abteilung 5 (Klavierlieder)',
    };

    /**
     * The route constant for section 5.
     */
    static readonly SERIES_3_SECTION_5 = {
        route: '5',
        short: '5',
        full: 'Abteilung 5 (Klavierauszüge)',
    };

    /**
     * The route constant for a work edition.
     */
    static readonly WORK_EDITION: EditionRouteConstant = {
        route: '/work-edition',
        short: 'WE',
        full: 'Werkedition',
    };

    /**
     * The route constant for a text edition.
     */
    static readonly TEXT_EDITION: EditionRouteConstant = {
        route: '/text-edition',
        short: 'TE',
        full: 'Textedition',
    };

    /**
     * The route constant for a sketch edition.
     */
    static readonly SKETCH_EDITION: EditionRouteConstant = {
        route: '/sketch-edition',
        short: 'SE',
        full: 'Skizzenedition',
    };

    /**
     * The route constant for the graph section of an edition.
     */
    static readonly EDITION_GRAPH: EditionRouteConstant = {
        route: 'graph',
        short: 'Graph',
        full: 'Graph',
    };

    /**
     * The route constant for the intro section of an edition.
     */
    static readonly EDITION_INTRO: EditionRouteConstant = {
        route: 'intro',
        short: 'Einleitung',
        full: 'Einleitung',
    };

    /**
     * The route constant for the sheets section of an edition.
     */
    static readonly EDITION_SHEETS: EditionRouteConstant = {
        route: 'sheets',
        short: 'Edierte Notentexte',
        full: 'Edierte Notentexte',
    };

    /**
     * The route constant for the report section of an edition.
     */
    static readonly EDITION_REPORT: EditionRouteConstant = {
        route: 'report',
        short: 'Kritischer Bericht',
        full: 'Kritischer Bericht',
    };
}
