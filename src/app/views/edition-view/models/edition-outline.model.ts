import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplexesService } from '@awg-views/edition-view/services';

import { EditionComplex } from './edition-complex.model';
import { EditionRouteConstant } from './edition-route-constant.model';

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
     * The complexTypes data
     */
    complexTypes: {
        opus: [{ complex: string; disabled: boolean }];
        mnr: [{ complex: string; disabled: boolean }];
    };

    /**
     * Boolean flag if a section is disabled.
     */
    disabled: boolean;
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
    complex: EditionComplex;

    /**
     * Boolean flag if an edition complex is disabled.
     */
    disabled: boolean;

    /**
     * The sub-complexes of an edition complex.
     */
    subComplexes?: EditionOutlineComplexItem[];
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
    opus: EditionOutlineComplexItem[];

    /**
     * The mnr parts of an edition complex.
     */
    mnr: EditionOutlineComplexItem[];
}

/**
 * The EditionOutlineSection interface.
 *
 * It is used in the context of the edition view
 * to structure outline information of the edition sections.
 */
export interface EditionOutlineSection {
    /**
     * The section route of an edition section.
     */
    section: EditionRouteConstant;

    /**
     * The edition complex types of an edition section.
     */
    complexTypes: EditionOutlineComplexTypes;

    /**
     * Boolean flag if an edition section is disabled.
     */
    disabled: boolean;
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
    series: EditionRouteConstant;

    /**
     * The section route of an edition series.
     */
    sections: EditionOutlineSection[];
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
    outline: EditionOutlineSeries[];

    /**
     * Constructor of the EditionOutline class.
     *
     * It initializes the class with an edition outline Object.
     *
     * @param {EditionOutlineSeriesJsonData[]} outlineData The given edition outline.
     */
    constructor(outlineData: EditionOutlineSeriesJsonData[]) {
        if (!outlineData) {
            return;
        }

        this.outline = outlineData.map(this._mapSeries);
    }

    /**
     * Private method: _mapSeries.
     *
     * It maps the series data.
     *
     * @param {EditionOutlineSeriesJsonData} series The given series data.
     *
     * @returns {EditionOutlineSeries} The mapped series.
     */
    private _mapSeries = ({ series, sections }: EditionOutlineSeriesJsonData): EditionOutlineSeries => ({
        series: EDITION_ROUTE_CONSTANTS['SERIES_' + series],
        sections: sections.map(this._mapSection),
    });

    /**
     * Private method: _mapSection.
     *
     * It maps the section data.
     *
     * @param {EditionOutlineSectionsJsonData} section The given section data.
     *
     * @returns {EditionOutlineSection} The mapped section.
     */
    private _mapSection = ({
        section,
        complexTypes,
        disabled,
    }: EditionOutlineSectionsJsonData): EditionOutlineSection => ({
        section: EDITION_ROUTE_CONSTANTS['SECTION_' + section],
        complexTypes: {
            opus: this._mapComplexItems(complexTypes.opus),
            mnr: this._mapComplexItems(complexTypes.mnr),
        },
        disabled,
    });

    /**
     * Private method: _mapComplexItems.
     *
     * It maps the complex items.
     *
     * @param {EditionOutlineComplexItem[]} complexItems The given complex items.
     *
     * @returns {EditionOutlineComplexItem[]} The mapped complex items.
     */
    private _mapComplexItems = (complexItems: { complex: string; disabled: boolean }[]): EditionOutlineComplexItem[] =>
        complexItems.map(({ complex, disabled }) => ({
            complex: EditionComplexesService.getEditionComplexById(complex),
            disabled,
        }));
}
