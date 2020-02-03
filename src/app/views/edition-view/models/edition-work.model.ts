import { EditionConstants, EditionRoute } from './edition-constants';

/**
 * The EditionWork class.
 *
 * It is used in the context of the edition view
 * to store information about the url path of an edition.
 */
export class EditionWork {
    /**
     * The edition route for edition.
     */
    edition: EditionRoute = EditionConstants.edition;

    /**
     * The edition route for series.
     */
    series: EditionRoute;

    /**
     * The edition route for section.
     */
    section: EditionRoute;

    /**
     * The edition route for composition.
     */
    composition: EditionRoute = EditionConstants.composition;

    /**
     * The edition route for the current work.
     */
    work: EditionRoute;

    /**
     * The edition route for the type of an edition.
     */
    type: EditionRoute;

    /**
     * The route to the graph section of an edition.
     */
    graphRoute: string = EditionConstants.editionGraph.route;

    /**
     * The route to the intro section of an edition.
     */
    introRoute: string = EditionConstants.editionIntro.route;

    /**
     * The route to the detail section of an edition.
     */
    detailRoute: string = EditionConstants.editionDetail.route;

    /**
     * The route to the report section of an edition.
     */
    reportRoute: string = EditionConstants.editionReport.route;

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
     * @param {EditionRoute} workRoute The given EditionRoute for the composition.
     * @param {EditionRoute} seriesRoute The given EditionRoute for the series.
     * @param {EditionRoute} sectionRoute The given EditionRoute for the section.
     * @param {EditionRoute} typeRoute The given EditionRoute for the edition type.
     */
    constructor(
        workRoute: EditionRoute,
        seriesRoute?: EditionRoute,
        sectionRoute?: EditionRoute,
        typeRoute?: EditionRoute
    ) {
        if (!workRoute) {
            return;
        }

        // set dynamic routes
        const delimiter = '/';
        this.series = seriesRoute ? seriesRoute : new EditionRoute(); // EditionConstants.series1.path;
        this.section = sectionRoute ? sectionRoute : new EditionRoute(); // EditionConstants.section1.path;
        this.work = workRoute ? workRoute : new EditionRoute();
        this.type = typeRoute ? typeRoute : new EditionRoute(); // EditionConstants.textEdition.path;

        let rootPath = this.edition.route; // '/edition'
        // rootPath += this.series.route;     // '/series'
        // rootPath += this.section.route;    // '/section'
        rootPath += this.composition.route; // '/composition'
        // rootPath += this.type.route;       // '/sketches' or // '/texts'

        this.baseRoute = rootPath + this.work.route + delimiter;
        console.log(this.baseRoute);
    }
}
