import { MetaPerson } from '@awg-shared/meta/meta.model';
import { PERSONS_DATA } from '@awg-shared/meta/persons.data';
import { LabeledRoute } from '@awg-shared/models/labeled-route.model';

import {
    EDITION_CATALOGUE_TYPE_CONSTANTS,
    EDITION_ROUTE_CONSTANTS,
    EditionCatalogueTypeConstantsKey,
    EditionRouteConstant,
    EditionRouteConstantsKey,
} from '../edition-routes.constants';

/**
 * The EditionComplexJsonPersonRef interface.
 *
 * It is used in the context of the edition view
 * to describe a `$ref` pointer to a person in the edition complexes JSON data.
 */
export interface EditionComplexJsonPersonRef {
    /**
     * The reference key of a person.
     */
    $ref: string;
}

/**
 * The EditionComplexJsonData interface.
 *
 * It is used in the context of the edition view
 * to describe the structure of a JSON data for an edition complex.
 */
export interface EditionComplexJsonData {
    /**
     * The edition complex data.
     */
    [key: string]: {
        titleStatement: { title: string; catalogueType: string; catalogueNumber: string };
        respStatement: { editors: EditionComplexJsonPersonRef[]; lastModified: string };
        pubStatement: { series: string; section: string };
    };
}

/**
 * The EditionComplexesJsonData interface.
 *
 * It is used in the context of the edition view
 * to describe the structure of a JSON data for edition complexes.
 */
export interface EditionComplexesJsonData {
    /**
     * The edition complexes data.
     */
    editionComplexes: EditionComplexJsonData[];
}

/**
 * The EditionComplexTitleStatement interface.
 *
 * It is used in the context of the edition view
 * to store information about the title statement of an edition complex.
 */
export interface EditionComplexTitleStatement {
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
 * The EditionComplexRespStatement interface.
 *
 * It is used in the context of the edition view
 * to store information about the responsibility statement of an edition complex.
 */
export interface EditionComplexRespStatement {
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
     * The labeled route for the series/section of the current edition complex.
     */
    labeledSectionRoute: LabeledRoute = { label: '', route: [] };

    /**
     * The route for the current series.
     */
    series: EditionRouteConstant = new EditionRouteConstant();

    /**
     * The route for the current section.
     */
    section: EditionRouteConstant = new EditionRouteConstant();
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
     * @param {{ editors: EditionComplexJsonPersonRef[]; lastModified: string }} respStatement The given ResponsibilityStatement for the edition complex.
     * @param {{ series: string; section: string }} pubStatement The given PublicationStatement for the edition complex.
     */
    constructor(
        titleStatement: { title: string; catalogueType: string; catalogueNumber: string },
        respStatement: { editors: EditionComplexJsonPersonRef[]; lastModified: string },
        pubStatement: { series: string; section: string }
    ) {
        if (!titleStatement?.catalogueType || !titleStatement?.catalogueNumber) {
            throw new Error('[EditionComplex] Cannot instantiate complex: Missing catalogueType or catalogueNumber.');
        }

        // Helper constants
        const delimiter = '/';
        const spacer = '&nbsp;';
        const routes = EDITION_ROUTE_CONSTANTS;

        // Set dynamic routes
        this.titleStatement = {
            ...titleStatement,
            catalogueType: this._mapCatalogueType(titleStatement.catalogueType),
        };

        this.respStatement = this._mapRespStatement(respStatement);

        const seriesKey = `SERIES_${pubStatement?.series?.toUpperCase()}` as EditionRouteConstantsKey;
        const seriesConstant = EDITION_ROUTE_CONSTANTS[seriesKey] ?? new EditionRouteConstant();

        const sectionKey = `SECTION_${pubStatement?.section?.toUpperCase()}` as EditionRouteConstantsKey;
        const sectionConstant = EDITION_ROUTE_CONSTANTS[sectionKey] ?? new EditionRouteConstant();

        this.pubStatement =
            seriesConstant.route && sectionConstant.route
                ? {
                      labeledSectionRoute: {
                          label: `${routes.EDITION.short} ${seriesConstant.short}/${sectionConstant.short}`,
                          route: [
                              routes.EDITION.route,
                              routes.SERIES.route,
                              seriesConstant.route,
                              routes.SECTION.route,
                              sectionConstant.route,
                          ],
                      },
                      series: seriesConstant,
                      section: sectionConstant,
                  }
                : new EditionComplexPubStatement();

        this.complexId = new EditionRouteConstant();
        this.complexId.route = this.titleStatement.catalogueType.route;
        // For routes, replace slashes in catalogue number with underscores
        this.complexId.route += this.titleStatement.catalogueNumber.replaceAll(delimiter, '_');
        this.complexId.short = `${this.titleStatement.catalogueType.short}${spacer}${this.titleStatement.catalogueNumber}`;
        this.complexId.full = `${this.titleStatement.title} ${this.complexId.short}`;

        // Set base route
        const rootPath = `${routes.EDITION.route}${routes.COMPLEX.route}`;
        this.baseRoute = `${rootPath}${this.complexId.route}`;
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
        const key = catalogueType.toUpperCase() as EditionCatalogueTypeConstantsKey;

        return EDITION_CATALOGUE_TYPE_CONSTANTS[key] ?? new EditionRouteConstant();
    }

    /**
     * Private method: _mapRespStatement.
     *
     * It maps the responsibility statement by resolving `$ref` person entries
     * to their corresponding MetaPerson from PERSONS_DATA.
     *
     * @param {{ editors: EditionComplexJsonPersonRef[]; lastModified: string }} respStatement The given responsibility statement.
     *
     * @returns {EditionComplexRespStatement} The resolved EditionComplexRespStatement.
     */
    private _mapRespStatement(respStatement: {
        editors: EditionComplexJsonPersonRef[];
        lastModified: string;
    }): EditionComplexRespStatement {
        const editors: MetaPerson[] =
            respStatement?.editors?.map(
                editor => PERSONS_DATA[editor.$ref] ?? { name: editor.$ref, homepage: '', identifiers: {} }
            ) ?? [];
        return { editors, lastModified: respStatement?.lastModified ?? '' };
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
