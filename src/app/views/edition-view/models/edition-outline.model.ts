import { LabeledRoute } from '@awg-shared/models/labeled-route.model';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionRouteConstant } from '@awg-views/edition-view/models';
import { EditionComplexesService } from '@awg-views/edition-view/services';

import { EditionComplex } from './edition-complex.model';

/**
 * The EditionSectionLink class.
 *
 * It is used in the context of the edition view
 * to structure information for the edition section links,
 * e.g., in the home view.
 */
export class EditionSectionLink {
    /**
     * The route for the edition section.
     */
    readonly route: string[];

    /**
     * The shortTitle for the edition section.
     */
    readonly shortTitle: string;

    /**
     * The full title of the navbar section.
     */
    readonly fullTitle: string;

    /**
     * The separator for the edition section.
     */
    readonly separator: string;

    /**
     * Constructor of the EditionSectionLink class.
     *
     * It initializes the class with an EditionOutlineSection object.
     *
     * @param {EditionOutlineSection} section The edition outline section to be mapped to a navbar section.
     */
    constructor(section: EditionOutlineSection, index: number = 0, totalLength: number = 1) {
        if (!section?.seriesParent || !section?.section) {
            throw new Error('[EditionSectionLink]: invalid edition outline section');
        }
        this.route = section.labeledRoute.route;
        this.shortTitle = section.labeledRoute.label;
        this.fullTitle = section.section.full;
        this.separator = EditionSectionLink._getSeparator(index, totalLength);
    }

    /**
     * Private static method: _getSeparator.
     *
     * It returns the appropriate separator for the displayed sections.
     *
     * @param {number} index The index of the current section in the displayed sections array.
     * @param {number} length The total length of the displayed sections array.
     * @returns {string} The appropriate separator for the displayed sections.
     */
    private static _getSeparator(index: number, length: number): string {
        if (length <= 1 || index === length - 1) {
            return '';
        }
        if (index === length - 2) {
            return ' und ';
        }
        return ', ';
    }
}

/**
 * The EditionOutlineSectionsContentJsonData interface.
 *
 * It is used in the context of the edition view
 * to describe the structure of a JSON data for an edition outline sections content.
 */
export interface EditionOutlineSectionsContentJsonData {
    /**
     * The intro data.
     */
    intro: {
        disabled: boolean;
        preview?: string;
    };

    /**
     * The complex types data.
     */
    complexTypes: {
        opus: { complex: string; disabled: boolean }[];
        mnr: { complex: string; disabled: boolean }[];
    };
}

/**
 * The EditionOutlineSectionsJsonData interface.
 *
 * It is used in the context of the edition view
 * to describe the structure of a JSON data for an edition outline sections.
 */
export interface EditionOutlineSectionsJsonData {
    /**
     * The section data.
     */
    section: string;

    /**
     * The section content data.
     */
    content: EditionOutlineSectionsContentJsonData;

    /**
     * Boolean flag if a section is disabled.
     */
    disabled: boolean;
}

/**
 * The EditionOutlineSeriesJsonData interface.
 *
 * It is used in the context of the edition view
 * to describe the structure of a JSON data for an edition outline series.
 */
export interface EditionOutlineSeriesJsonData {
    /**
     * The series data.
     */
    series: string;

    /**
     * The sections data.
     */
    sections: EditionOutlineSectionsJsonData[];
}

/**
 * The EditionOutlineJsonData interface.
 *
 * It is used in the context of the edition view
 * to describe the structure of a JSON data for an edition outline.
 */
export interface EditionOutlineJsonData {
    /**
     * The edition outline data.
     */
    editionOutline: EditionOutlineSeriesJsonData[];
}

/**
 * The EditionOutlineComplex interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of an edition complex.
 */
export interface EditionOutlineComplexItem {
    /**
     * The edition complex.
     */
    readonly complex: EditionComplex;

    /**
     * Boolean flag if an edition complex is disabled.
     */
    readonly disabled: boolean;

    /**
     * The labeled route of an edition complex.
     */
    readonly labeledRoute: LabeledRoute;

    /**
     * The sub-complexes of an edition complex.
     */
    readonly subComplexes?: EditionOutlineComplexItem[];
}

/**
 * The EditionOutlineComplexTypes interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of the edition complex types.
 */
export interface EditionOutlineComplexTypes {
    /**
     * The opus parts of an edition complex.
     */
    readonly opus: EditionOutlineComplexItem[];

    /**
     * The mnr parts of an edition complex.
     */
    readonly mnr: EditionOutlineComplexItem[];
}

/**
 * The EditionOutlineIntroItem interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of the edition intro.
 */
export interface EditionOutlineIntroItem {
    /**
     * Boolean flag if an intro is disabled.
     */
    readonly disabled: boolean;

    /**
     * The labeled route of an intro.
     */
    readonly labeledRoute: LabeledRoute;

    /**
     * The preview of an intro.
     */
    readonly preview?: string;
}

/**
 * The EditionOutlineSectionContent interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of the edition section content.
 */
export interface EditionOutlineSectionContent {
    /**
     * The intro of an edition section.
     */
    readonly intro: EditionOutlineIntroItem;

    /**
     * The edition complex types of an edition section.
     */
    readonly complexTypes: EditionOutlineComplexTypes;

    /**
     * The edition complexes of an edition section.
     */
    readonly sectionComplexes: EditionOutlineComplexItem[];
}

/**
 * The EditionOutlineSection interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of the edition sections.
 */
export interface EditionOutlineSection {
    /**
     * The series parent route of an edition section.
     */
    readonly seriesParent: EditionRouteConstant;

    /**
     * The section route of an edition section.
     */
    readonly section: EditionRouteConstant;

    /**
     * The labeled route of an edition section.
     */
    readonly labeledRoute: LabeledRoute;

    /**
     * The section content of an edition section.
     */
    readonly content: EditionOutlineSectionContent;

    /**
     * Boolean flag if an edition section is disabled.
     */
    readonly disabled: boolean;
}

/**
 * The EditionOutlineSeries interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of the edition series.
 */
export interface EditionOutlineSeries {
    /**
     * The series route of an edition series.
     */
    readonly series: EditionRouteConstant;

    /**
     * The section route of an edition series.
     */
    readonly sections: EditionOutlineSection[];
}

/**
 * The EditionOutline interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of the edition.
 */
export class EditionOutline {
    /**
     * The outline of the edition.
     */
    readonly outline: EditionOutlineSeries[];

    /**
     * Constructor of the EditionOutline class.
     *
     * It initializes the class with an edition outline Object.
     *
     * @param {EditionOutlineSeriesJsonData[]} outlineData The given edition outline.
     */
    constructor(outlineData: EditionOutlineSeriesJsonData[]) {
        if (!outlineData) {
            this.outline = [];
            return;
        }

        this.outline = outlineData.map(this._mapSeries);
    }

    /**
     * Private readonly method: _mapSeries.
     *
     * It maps the series data.
     *
     * @param {EditionOutlineSeriesJsonData} data The series data to map.
     * @param {string} data.series The given series string.
     * @param {EditionOutlineSectionsJsonData[]} data.sections The given sections data.
     *
     * @returns {EditionOutlineSeries} The mapped series.
     */
    private readonly _mapSeries = ({ series, sections }: EditionOutlineSeriesJsonData): EditionOutlineSeries => {
        const seriesConstant: EditionRouteConstant = EDITION_ROUTE_CONSTANTS['SERIES_' + series];
        return {
            series: seriesConstant,
            sections: sections.map(section => this._mapSection(section, seriesConstant)),
        };
    };

    /**
     * Private readonly method: _mapSection.
     *
     * It maps the section data.
     *
     * @param {EditionOutlineSectionsJsonData} data The section data to map.
     * @param {string} data.section The given section string.
     * @param {Object} data.complexTypes The given complex types data.
     * @param {boolean} data.disabled The given disabled flag.
     *
     * @returns {EditionOutlineSection} The mapped section.
     */
    private readonly _mapSection = (
        { section, disabled, content }: EditionOutlineSectionsJsonData,
        seriesConstant: EditionRouteConstant
    ): EditionOutlineSection => {
        const sectionConstant: EditionRouteConstant =
            seriesConstant.route === '3' && section === '5'
                ? EDITION_ROUTE_CONSTANTS.SERIES_3_SECTION_5
                : EDITION_ROUTE_CONSTANTS['SECTION_' + section];

        const labeledSectionRoute: LabeledRoute = {
            label: `${EDITION_ROUTE_CONSTANTS.EDITION.short} ${seriesConstant.short}/${sectionConstant.short}`,
            route: [
                EDITION_ROUTE_CONSTANTS.EDITION.route,
                EDITION_ROUTE_CONSTANTS.SERIES.route,
                seriesConstant.route,
                EDITION_ROUTE_CONSTANTS.SECTION.route,
                sectionConstant.route,
            ],
        };
        const labeledIntroRoute: LabeledRoute = {
            label: EDITION_ROUTE_CONSTANTS.EDITION_INTRO.full,
            route: [...labeledSectionRoute.route, EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route],
        };

        return {
            seriesParent: seriesConstant,
            section: sectionConstant,
            labeledRoute: labeledSectionRoute,
            content: this._mapSectionContent(content, labeledIntroRoute),
            disabled,
        };
    };

    /**
     * Private readonly method: _mapContent.
     *
     * It maps the content data.
     *
     * @param {EditionOutlineSectionsContentJsonData} content The content data to map.
     * @param {LabeledRoute} labeledIntroRoute The labeled intro route for the edition section.
     *
     * @returns {EditionOutlineSectionContent} The mapped content.
     */
    private readonly _mapSectionContent = (
        content: EditionOutlineSectionsContentJsonData,
        labeledIntroRoute: LabeledRoute
    ): EditionOutlineSectionContent => {
        const opus = this._mapComplexItems(content.complexTypes.opus);
        const mnr = this._mapComplexItems(content.complexTypes.mnr);
        const sectionComplexes = [...opus, ...mnr];

        return {
            intro: {
                disabled: content.intro.disabled ?? true,
                labeledRoute: labeledIntroRoute,
                preview: content.intro.preview ?? '',
            },
            complexTypes: {
                opus,
                mnr,
            },
            sectionComplexes,
        };
    };

    /**
     * Private readonly method: _mapComplexItems.
     *
     * It maps the complex items.
     *
     * @param {EditionOutlineComplexItem[]} complexItems The complex items to map.
     *
     * @returns {EditionOutlineComplexItem[]} The mapped complex items.
     */
    private readonly _mapComplexItems = (
        complexItems: { complex: string; disabled: boolean }[]
    ): EditionOutlineComplexItem[] => {
        return complexItems.map(({ complex, disabled }) => {
            const fullComplex = EditionComplexesService.getEditionComplexById(complex);

            const labeledRoute: LabeledRoute = {
                label: fullComplex?.complexId?.full ?? '',
                route: [fullComplex?.baseRoute ?? '', EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route],
            };

            return {
                complex: fullComplex,
                labeledRoute,
                disabled,
            };
        });
    };
}
