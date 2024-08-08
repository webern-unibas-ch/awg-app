import { MetaPerson } from '@awg-core/core-models/meta.model';
import {
    EDITION_CATALOGUE_TYPE_CONSTANTS,
    EDITION_ROUTE_CONSTANTS,
} from '@awg-views/edition-view/edition-route-constants';
import { EditionRouteConstant } from './edition-route-constant.model';

/**
 * The EditionComplexJsonInput interface.
 *
 * It is used in the context of the edition view
 * to describe the structure of a JSON input for an edition complex.
 */
export interface EditionComplexJsonInput {
    /**
     * The edition complex input.
     */
    [key: string]: {
        titleStatement: { title: string; catalogueType: string; catalogueNumber: string };
        respStatement: { editors: { name: string; homepage: string }[]; lastModified: string };
        pubStatement: { series: string; section: string };
    };
}

/**
 * The EditionComplexesJsonInput interface.
 *
 * It is used in the context of the edition view
 * to describe the structure of a JSON input for edition complexes.
 */
export interface EditionComplexesJsonInput {
    /**
     * The edition complexes input.
     */
    editionComplexes: EditionComplexJsonInput[];
}

/**
 * The EditionComplexTitleStatement class.
 *
 * It is used in the context of the edition view
 * to store information about the title statement of an edition complex.
 */
export class EditionComplexTitleStatement {
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
 * The EditionComplexRespStatement class.
 *
 * It is used in the context of the edition view
 * to store information about the responsibility statement of an edition complex.
 */
export class EditionComplexRespStatement {
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
 * The EditionComplexPubStatement class.
 *
 * It is used in the context of the edition view
 * to store information about the publication statement of an edition complex.
 */
export class EditionComplexPubStatement {
    /**
     * The route for the current series.
     */
    series: EditionRouteConstant;

    /**
     * The route for the current section.
     */
    section: EditionRouteConstant;
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
    titleStatement: EditionComplexTitleStatement;

    /**
     * The responsibility statement of the current edition complex.
     */
    respStatement: EditionComplexRespStatement;

    /**
     * The publication statement of the current edition complex.
     */
    pubStatement: EditionComplexPubStatement;

    /**
     * The id for the current edition complex.
     */
    complexId: EditionRouteConstant;

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
     * @param {{ title: string; catalogueType: string; catalogueNumber: string }} titleStatement The given TitleStatement for the edition complex.
     * @param {EditionComplexRespStatement} respStatement The given ResponsibilityStatement for the edition complex.
     * @param {{ series: string; section: string }} pubStatement The given PublicationStatement for the edition complex.
     */
    constructor(
        titleStatement: { title: string; catalogueType: string; catalogueNumber: string },
        respStatement: EditionComplexRespStatement,
        pubStatement: { series: string; section: string }
    ) {
        if (!titleStatement?.catalogueType || !titleStatement?.catalogueNumber) {
            return;
        }

        // Helper constants
        const delimiter = '/';
        const spacer = '&nbsp;';

        // Set dynamic routes
        this.titleStatement = {
            ...titleStatement,
            catalogueType: this._mapCatalogueType(titleStatement.catalogueType),
        };

        this.respStatement = respStatement ?? new EditionComplexRespStatement();

        this.pubStatement = {
            series: this._mapPubStatement('SERIES_', pubStatement?.series),
            section: this._mapPubStatement('SECTION_', pubStatement?.section),
        };

        this.complexId = new EditionRouteConstant();
        this.complexId.route = this.titleStatement.catalogueType.route;
        // For routes, replace slashes in catalogue number with underscores
        this.complexId.route += this.titleStatement.catalogueNumber.replace(/\//g, '_');
        this.complexId.short = `${this.titleStatement.catalogueType.short}${spacer}${this.titleStatement.catalogueNumber}`;
        this.complexId.full = `${this.titleStatement.title} ${this.complexId.short}`;

        // Set base route
        const rootPath = `${EDITION_ROUTE_CONSTANTS.EDITION.route}${EDITION_ROUTE_CONSTANTS.COMPLEX.route}`;
        this.baseRoute = `${rootPath}${this.complexId.route}${delimiter}`;
    }

    /**
     * Private method: _mapCatalogueType.
     *
     * It maps the catalogue type to the corresponding route constant.
     *
     * @param {string} catalogueType The given catalogue type.
     *
     * @returns {EditionRouteConstant} The corresponding route constant.
     */
    private _mapCatalogueType(catalogueType: string): EditionRouteConstant {
        return EDITION_CATALOGUE_TYPE_CONSTANTS[catalogueType.toUpperCase()];
    }

    /**
     * Private method: _mapPubStatement.
     *
     * It maps the publication statement to the corresponding route constant.
     *
     * @param {string} prefix The given prefix.
     * @param {string} value The given value.
     *
     * @returns {EditionRouteConstant} The corresponding route constant.
     */
    private _mapPubStatement(prefix: string, value?: string): EditionRouteConstant {
        return EDITION_ROUTE_CONSTANTS[`${prefix}${value?.toUpperCase()}`];
    }
}

/**
 * The EditionComplexesList class.
 *
 * It is used in the context of the edition view
 * to describe a list of edition complexes.
 */
export class EditionComplexesList {
    /**
     * The list of edition complexes.
     */
    [key: string]: EditionComplex;
}
