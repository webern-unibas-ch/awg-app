import { MetaPerson } from '@awg-core/core-models/meta.model';
import { EditionConstants, EditionRoute } from './edition-constants';

/**
 * The EditionTitleStatement class.
 *
 * It is used in the context of the edition view
 * to store information about the title statement of a work.
 */
export class EditionTitleStatement {
    /**
     * The title of a title statement.
     */
    title: string;

    /**
     * The catalogue type of a title statement.
     */
    catalogueType: EditionRoute;

    /**
     * The catalogue number of a title statement.
     */
    catalogueNumber: string;
}

/**
 * The EditionResponsibilityStatement class.
 *
 * It is used in the context of the edition view
 * to store information about the responsibility statement of a work.
 */
export class EditionResponsibilityStatement {
    /**
     * The editors of an edition.
     */
    editors: MetaPerson[];

    /**
     * The last modification date of an edition.
     */
    lastModified: string;
}

/**
 * The EditionWork class.
 *
 * It is used in the context of the edition view
 * to store information about a work of an edition.
 */
export class EditionWork {
    /**
     * The title statement of the current work.
     */
    titleStatement: EditionTitleStatement;

    /**
     * The responsibility statement of the current work.
     */
    responsibilityStatement: EditionResponsibilityStatement;

    /**
     * The edition route for the current work.
     */
    work: EditionRoute;

    /**
     * The edition route for series.
     */
    series: EditionRoute;

    /**
     * The edition route for section.
     */
    section: EditionRoute;

    /**
     * The edition route for the type of an edition.
     */
    type: EditionRoute;

    /**
     * The edition route for edition.
     */
    edition: EditionRoute = EditionConstants.EDITION;

    /**
     * The edition route for composition.
     */
    composition: EditionRoute = EditionConstants.COMPOSITION;

    /**
     * The route to the graph section of an edition.
     */
    graphRoute: EditionRoute = EditionConstants.EDITION_GRAPH;

    /**
     * The route to the intro section of an edition.
     */
    introRoute: EditionRoute = EditionConstants.EDITION_INTRO;

    /**
     * The route to the detail section of an edition.
     */
    detailRoute: EditionRoute = EditionConstants.EDITION_DETAIL;

    /**
     * The route to the report section of an edition.
     */
    reportRoute: EditionRoute = EditionConstants.EDITION_REPORT;

    /**
     * The base route of a work.
     *
     * @example 'edition/{series/1/section/5/}composition/op12
     * TODO: Parts in {} muted at the moment.
     */
    baseRoute: string;

    /**
     * Constructor of the EditionWork class.
     *
     * It initializes the class with a composition Object from the EditionConstants.
     *
     * @param {EditionTitleStatement} titleStatement The given TitleStatement for the composition.
     * @param {EditionResponsibilityStatement} responsibilityStatement The given ResponsibilityStatement for the composition.
     * @param {EditionRoute} workRoute The given EditionRoute for the composition.
     * @param {EditionRoute} seriesRoute The given EditionRoute for the series.
     * @param {EditionRoute} sectionRoute The given EditionRoute for the section.
     * @param {EditionRoute} typeRoute The given EditionRoute for the edition type.
     */
    constructor(
        titleStatement: EditionTitleStatement,
        responsibilityStatement: EditionResponsibilityStatement,
        workRoute: EditionRoute,
        seriesRoute?: EditionRoute,
        sectionRoute?: EditionRoute,
        typeRoute?: EditionRoute
    ) {
        if (!workRoute) {
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

        this.work = workRoute ? workRoute : new EditionRoute();
        this.work.short = this.titleStatement.catalogueType.short + spacer + this.titleStatement.catalogueNumber;
        this.work.full = this.titleStatement.title + spacer + this.work.short;

        this.series = seriesRoute ? seriesRoute : new EditionRoute(); // EditionConstants.SERIES_1;
        this.section = sectionRoute ? sectionRoute : new EditionRoute(); // EditionConstants.SECTION_5;
        this.type = typeRoute ? typeRoute : new EditionRoute(); // EditionConstants.SKETCH_EDITION;

        // Set base route
        let rootPath = this.edition.route; // '/edition'
        // RootPath += this.series.route;     // '/series'
        // RootPath += this.section.route;    // '/section'
        rootPath += this.composition.route; // '/composition'
        // RootPath += this.type.route;       // '/sketches' or // '/texts'

        this.baseRoute = rootPath + this.work.route + delimiter;
    }
}
