import { LabeledRoute } from '@awg-shared/models/labeled-route.model';
import {
    EDITION_ROUTE_CONSTANTS,
    EditionRouteConstant,
    EditionRouteConstantsKey,
} from '@awg-views/edition-view/edition-routes.constants';

import { EditionComplex, EditionComplexPartOf } from './edition-complex.model';

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
     * The parts of a composite edition complex in their order (only if there are parts).
     */
    readonly parts?: EditionOutlineComplexItem[];

    /**
     * The composite edition complexes that contain an edition complex (only if there are any).
     */
    readonly compositeComplexes?: EditionOutlineCompositeComplexItem[];
}

/**
 * The EditionOutlineCompositeComplexItem interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of a composite edition complex
 * together with the part number of the edition complex it contains.
 */
export interface EditionOutlineCompositeComplexItem extends EditionOutlineComplexItem {
    /**
     * The part number of the contained edition complex (starting at 1).
     */
    readonly partNumber: number;
}

/**
 * The EditionOutlineComplexLookup interface.
 *
 * It is used in the context of the edition view
 * to bundle the complex items and functions that resolve the edition complexes of an edition outline.
 */
interface EditionOutlineComplexLookup {
    /**
     * The complex items of the outline by the ids used in the outline.
     */
    readonly itemsById: Map<string, EditionOutlineComplexItem>;

    /**
     * The complex items of the outline by the routes of their edition complexes.
     */
    readonly itemsByRoute: Map<string, EditionOutlineComplexItem>;

    /**
     * Function to get the parts of a composite edition complex by id.
     */
    readonly getComplexParts: (id: string) => EditionComplex[];

    /**
     * Function to get the composite edition complexes that contain an edition complex, by id.
     */
    readonly getCompositeComplexes: (id: string) => EditionComplexPartOf[];
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
     * @param {EditionOutlineSeriesJsonData[] | null | undefined} outlineData The given edition outline.
     * @param {Function} getComplexById Function to get an edition complex by id.
     * @param {Function} [getComplexParts] Optional function to get the parts of a composite edition complex by id.
     * @param {Function} [getCompositeComplexes] Optional function to get the composite edition complexes that contain an edition complex, by id.
     */
    constructor(
        outlineData: EditionOutlineSeriesJsonData[] | null | undefined,
        getComplexById: (id: string) => EditionComplex | undefined,
        getComplexParts: (id: string) => EditionComplex[] = () => [],
        getCompositeComplexes: (id: string) => EditionComplexPartOf[] = () => []
    ) {
        if (!outlineData) {
            this.outline = [];
            return;
        }

        const itemsById = this._mapOutlineComplexItems(outlineData, getComplexById);
        const itemsByRoute = new Map([...itemsById.values()].map(item => [item.complex.complexId.route, item]));
        const lookup: EditionOutlineComplexLookup = {
            itemsById,
            itemsByRoute,
            getComplexParts,
            getCompositeComplexes,
        };

        this.outline = outlineData.map(data => this._mapSeries(data, lookup));
    }

    /**
     * Private method: _mapOutlineComplexItems.
     *
     * It maps the edition complexes of the given outline to complex items
     * (without parts and composite complexes), by the ids used in the outline.
     *
     * @param {EditionOutlineSeriesJsonData[]} outlineData The given edition outline.
     * @param {Function} getComplexById Function to get an edition complex by id.
     * @returns {Map<string, EditionOutlineComplexItem>} The complex items by the ids used in the outline.
     */
    private _mapOutlineComplexItems(
        outlineData: EditionOutlineSeriesJsonData[],
        getComplexById: (id: string) => EditionComplex | undefined
    ): Map<string, EditionOutlineComplexItem> {
        const itemsById = new Map<string, EditionOutlineComplexItem>();

        outlineData.forEach(({ sections }) =>
            sections.forEach(({ content }) =>
                [...content.complexTypes.opus, ...content.complexTypes.mnr].forEach(({ complex, disabled }) => {
                    const fullComplex = getComplexById(complex);
                    if (fullComplex) {
                        itemsById.set(complex, this._mapComplexItem(fullComplex, disabled));
                    }
                })
            )
        );

        return itemsById;
    }

    /**
     * Private readonly method: _mapSeries.
     *
     * It maps the series data.
     *
     * @param {EditionOutlineSeriesJsonData} data The series data to map.
     * @param {string} data.series The given series string.
     * @param {EditionOutlineSectionsJsonData[]} data.sections The given sections data.
     * @param {EditionOutlineComplexLookup} lookup The complex items and functions to resolve the edition complexes.
     * @returns {EditionOutlineSeries} The mapped series.
     */
    private readonly _mapSeries = (
        { series, sections }: EditionOutlineSeriesJsonData,
        lookup: EditionOutlineComplexLookup
    ): EditionOutlineSeries => {
        const seriesConstant: EditionRouteConstant =
            EDITION_ROUTE_CONSTANTS[('SERIES_' + series) as EditionRouteConstantsKey];
        return {
            series: seriesConstant,
            sections: sections.map(section => this._mapSection(section, seriesConstant, lookup)),
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
     * @param {EditionOutlineComplexLookup} lookup The complex items and functions to resolve the edition complexes.
     * @returns {EditionOutlineSection} The mapped section.
     */
    private readonly _mapSection = (
        { section, disabled, content }: EditionOutlineSectionsJsonData,
        seriesConstant: EditionRouteConstant,
        lookup: EditionOutlineComplexLookup
    ): EditionOutlineSection => {
        const routes = EDITION_ROUTE_CONSTANTS;
        const sectionConstant: EditionRouteConstant =
            seriesConstant.route === '3' && section === '5'
                ? routes.SERIES_3_SECTION_5
                : routes[('SECTION_' + section) as EditionRouteConstantsKey];

        const labeledSectionRoute: LabeledRoute = {
            label: `${routes.EDITION.short} ${seriesConstant.short}/${sectionConstant.short}`,
            route: [
                routes.EDITION.route,
                routes.SERIES.route,
                seriesConstant.route,
                routes.SECTION.route,
                sectionConstant.route,
            ],
        };
        const labeledIntroRoute: LabeledRoute = {
            label: routes.EDITION_INTRO.full,
            route: [...labeledSectionRoute.route, routes.EDITION_INTRO.route],
        };

        return {
            seriesParent: seriesConstant,
            section: sectionConstant,
            labeledRoute: labeledSectionRoute,
            content: this._mapSectionContent(content, labeledIntroRoute, lookup),
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
     * @param {EditionOutlineComplexLookup} lookup The complex items and functions to resolve the edition complexes.
     * @returns {EditionOutlineSectionContent} The mapped content.
     */
    private readonly _mapSectionContent = (
        content: EditionOutlineSectionsContentJsonData,
        labeledIntroRoute: LabeledRoute,
        lookup: EditionOutlineComplexLookup
    ): EditionOutlineSectionContent => {
        const opus = this._mapComplexItems(content.complexTypes.opus, lookup);
        const mnr = this._mapComplexItems(content.complexTypes.mnr, lookup);
        const sectionComplexes = [...opus, ...mnr];

        return {
            intro: {
                disabled: content.intro.disabled,
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
     * It maps the complex items, together with their parts and composite complexes.
     *
     * @param {{ complex: string; disabled: boolean }[]} complexItems The complex items to map.
     * @param {EditionOutlineComplexLookup} lookup The complex items and functions to resolve the edition complexes.
     * @returns {EditionOutlineComplexItem[]} The mapped complex items.
     */
    private readonly _mapComplexItems = (
        complexItems: { complex: string; disabled: boolean }[],
        lookup: EditionOutlineComplexLookup
    ): EditionOutlineComplexItem[] =>
        complexItems.flatMap(({ complex }) => {
            const item = lookup.itemsById.get(complex);

            if (!item) {
                return [];
            }

            const parts = lookup.getComplexParts(complex).map(part => this._getComplexItem(part, lookup));
            const compositeComplexes = lookup
                .getCompositeComplexes(complex)
                .map(({ compositeComplex, partNumber }) => ({
                    ...this._getComplexItem(compositeComplex, lookup),
                    partNumber,
                }));

            return [
                {
                    ...item,
                    ...(parts.length ? { parts } : {}),
                    ...(compositeComplexes.length ? { compositeComplexes } : {}),
                },
            ];
        });

    /**
     * Private readonly method: _getComplexItem.
     *
     * It returns the complex item of an edition complex from the outline.
     * Complexes missing from the outline are mapped as disabled.
     *
     * @param {EditionComplex} complex The edition complex.
     * @param {EditionOutlineComplexLookup} lookup The complex items and functions to resolve the edition complexes.
     * @returns {EditionOutlineComplexItem} The complex item.
     */
    private readonly _getComplexItem = (
        complex: EditionComplex,
        lookup: EditionOutlineComplexLookup
    ): EditionOutlineComplexItem =>
        lookup.itemsByRoute.get(complex.complexId.route) ?? this._mapComplexItem(complex, true);

    /**
     * Private readonly method: _mapComplexItem.
     *
     * It maps an edition complex to a complex item.
     *
     * @param {EditionComplex} complex The edition complex to map.
     * @param {boolean} disabled The disabled flag of the edition complex.
     * @returns {EditionOutlineComplexItem} The mapped complex item.
     */
    private readonly _mapComplexItem = (complex: EditionComplex, disabled: boolean): EditionOutlineComplexItem => ({
        complex,
        labeledRoute: {
            label: complex.complexId?.full,
            route: [complex.baseRoute, EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route],
        },
        disabled,
    });
}
