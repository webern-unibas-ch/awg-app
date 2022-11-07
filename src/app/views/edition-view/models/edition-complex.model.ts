import { MetaPerson } from '@awg-core/core-models/meta.model';
import { EditionConstants, EditionRouteConstant } from './edition-constants';

/**
 * The EditionTitleStatement class.
 *
 * It is used in the context of the edition view
 * to store information about the title statement of an edition complex.
 */
export class EditionTitleStatement {
    /**
     * The title of a title statement.
     */
    title: string;

    /**
     * The catalogue type of a title statement.
     */
    catalogueType: EditionRouteConstant;

    /**
     * The catalogue number of a title statement.
     */
    catalogueNumber: string;
}

/**
 * The EditionResponsibilityStatement class.
 *
 * It is used in the context of the edition view
 * to store information about the responsibility statement of an edition complex.
 */
export class EditionResponsibilityStatement {
    /**
     * The editors of an edition complex.
     */
    editors: MetaPerson[];

    /**
     * The last modification date of an edition complex.
     */
    lastModified: string;
}

/**
 * The EditionComplex class.
 *
 * It is used in the context of the edition view
 * to store information about an edition complex.
 */
export class EditionComplex {
    /**
     * The title statement of the current edition complex.
     */
    titleStatement: EditionTitleStatement;

    /**
     * The responsibility statement of the current edition complex.
     */
    responsibilityStatement: EditionResponsibilityStatement;

    /**
     * The id for the current edition complex.
     */
    complexId: EditionRouteConstant;

    /**
     * The route info for the current series.
     */
    series: EditionRouteConstant;

    /**
     * The route info for the current section.
     */
    section: EditionRouteConstant;

    /**
     * The route info for the current type of an edition.
     */
    type: EditionRouteConstant;

    /**
     * The edition route info.
     */
    editionRoute: EditionRouteConstant = EditionConstants.EDITION;

    /**
     * The complex route info.
     */
    complexRoute: EditionRouteConstant = EditionConstants.COMPLEX;

    /**
     * The graph route info.
     */
    graphRoute: EditionRouteConstant = EditionConstants.EDITION_GRAPH;

    /**
     * The intro route info.
     */
    introRoute: EditionRouteConstant = EditionConstants.EDITION_INTRO;

    /**
     * The sheets route info.
     */
    sheetsRoute: EditionRouteConstant = EditionConstants.EDITION_SHEETS;

    /**
     * The report route info.
     */
    reportRoute: EditionRouteConstant = EditionConstants.EDITION_REPORT;

    /**
     * The base route of an edition complex.
     *
     * @example 'edition/{series/1/section/5/}complex/op12
     * TODO: Parts in {} muted at the moment.
     */
    baseRoute: string;

    /**
     * Constructor of the EditionComplex class.
     *
     * It initializes the class with an edition complex Object from the EditionConstants.
     *
     * @param {EditionTitleStatement} titleStatement The given TitleStatement for the edition complex.
     * @param {EditionResponsibilityStatement} responsibilityStatement The given ResponsibilityStatement for the edition complex.
     * @param {EditionRouteConstant} series The given series.
     * @param {EditionRouteConstant} section The given section.
     * @param {EditionRouteConstant} type The given edition type.
     */
    constructor(
        titleStatement: EditionTitleStatement,
        responsibilityStatement: EditionResponsibilityStatement,
        series?: EditionRouteConstant,
        section?: EditionRouteConstant,
        type?: EditionRouteConstant
    ) {
        if (!titleStatement || !titleStatement.catalogueType || !titleStatement.catalogueNumber) {
            return;
        }

        // Helper constants
        const delimiter = '/';
        const spacer = ' ';

        // Set dynamic routes
        this.titleStatement = titleStatement ? titleStatement : new EditionTitleStatement();
        this.responsibilityStatement = responsibilityStatement
            ? responsibilityStatement
            : new EditionResponsibilityStatement();

        this.complexId = new EditionRouteConstant();
        if (this.titleStatement.catalogueType === EditionConstants.OPUS) {
            this.complexId.route = EditionConstants.OPUS.route;
        } else if (this.titleStatement.catalogueType === EditionConstants.MNR) {
            this.complexId.route = EditionConstants.MNR.route;
        }
        this.complexId.route += this.titleStatement.catalogueNumber;
        this.complexId.short = this.titleStatement.catalogueType.short + spacer + this.titleStatement.catalogueNumber;
        this.complexId.full = this.titleStatement.title + spacer + this.complexId.short;

        this.series = series ? series : new EditionRouteConstant(); // EditionConstants.SERIES_1;
        this.section = section ? section : new EditionRouteConstant(); // EditionConstants.SECTION_5;
        this.type = type ? type : new EditionRouteConstant(); // EditionConstants.SKETCH_EDITION;

        // Set base route
        let rootPath = this.editionRoute.route; // '/edition'
        // RootPath += this.series.route;     // '/series'
        // RootPath += this.section.route;    // '/section'
        rootPath += this.complexRoute.route; // '/complex'
        // RootPath += this.type.route;       // '/sketches' or // '/texts'

        this.baseRoute = rootPath + this.complexId.route + delimiter;
    }
}
