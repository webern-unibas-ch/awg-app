import { MetaPerson } from '@awg-core/core-models/meta.model';
import {
    EDITION_CATALOGUE_TYPE_CONSTANTS,
    EDITION_ROUTE_CONSTANTS,
} from '@awg-views/edition-view/edition-route-constants';
import { EditionRouteConstant } from './edition-route-constant.model';

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
 * The EditionRespStatement class.
 *
 * It is used in the context of the edition view
 * to store information about the responsibility statement of an edition complex.
 */
export class EditionRespStatement {
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
    respStatement: EditionRespStatement;

    /**
     * The id for the current edition complex.
     */
    complexId: EditionRouteConstant;

    /**
     * The route for the current series.
     */
    series: EditionRouteConstant;

    /**
     * The route for the current section.
     */
    section: EditionRouteConstant;

    /**
     * The base route of an edition complex.
     *
     * @example 'edition/complex/op12
     */
    baseRoute: string;

    /**
     * Constructor of the EditionComplex class.
     *
     * It initializes the class with an edition complex Object from the EditionConstants.
     *
     * @param {EditionTitleStatement} titleStatement The given TitleStatement for the edition complex.
     * @param {EditionRespStatement} respStatement The given ResponsibilityStatement for the edition complex.
     * @param {EditionRouteConstant} series The given series.
     * @param {EditionRouteConstant} section The given section.
     * @param {EditionRouteConstant} type The given edition type.
     */
    constructor(
        titleStatement: EditionTitleStatement,
        respStatement: EditionRespStatement,
        series?: EditionRouteConstant,
        section?: EditionRouteConstant
    ) {
        if (!titleStatement?.catalogueType || !titleStatement?.catalogueNumber) {
            return;
        }

        // Helper constants
        const delimiter = '/';
        const spacer = '&nbsp;';

        // Set dynamic routes
        this.titleStatement = titleStatement;
        this.respStatement = respStatement || new EditionRespStatement();

        this.complexId = new EditionRouteConstant();
        if (this.titleStatement.catalogueType === EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS) {
            this.complexId.route = EDITION_CATALOGUE_TYPE_CONSTANTS.OPUS.route;
        } else if (this.titleStatement.catalogueType === EDITION_CATALOGUE_TYPE_CONSTANTS.MNR) {
            this.complexId.route = EDITION_CATALOGUE_TYPE_CONSTANTS.MNR.route;
        } else if (this.titleStatement.catalogueType === EDITION_CATALOGUE_TYPE_CONSTANTS.MNR_PLUS) {
            this.complexId.route = EDITION_CATALOGUE_TYPE_CONSTANTS.MNR_PLUS.route;
        }
        // For routes, replace slashes in catalogue number with underscores
        this.complexId.route += this.titleStatement.catalogueNumber.replace(/\//g, '_');
        this.complexId.short = this.titleStatement.catalogueType.short + spacer + this.titleStatement.catalogueNumber;
        this.complexId.full = `${this.titleStatement.title} ${this.complexId.short}`;

        this.series = series || new EditionRouteConstant();
        this.section = section || new EditionRouteConstant();

        // Set base route
        const rootPath = EDITION_ROUTE_CONSTANTS.EDITION.route + EDITION_ROUTE_CONSTANTS.COMPLEX.route;
        this.baseRoute = rootPath + this.complexId.route + delimiter;
    }
}
