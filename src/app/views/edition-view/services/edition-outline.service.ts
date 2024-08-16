import { Injectable } from '@angular/core';

import {
    EditionOutline,
    EditionOutlineJsonData,
    EditionOutlineSection,
    EditionOutlineSeries,
} from '@awg-views/edition-view/models';

import * as jsonEditionOutline from 'assets/data/edition/edition-outline.json';

/**
 * The EditionComplexes service.
 *
 * It handles the provision of the edition complexes.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionOutlineService {
    /**
     * Static variable: _EditionOutline.
     *
     * It keeps the edition outline.
     */
    private static _editionOutline: EditionOutlineSeries[];

    /**
     * Static method: initEditionOutline.
     *
     * It initializes the edition outline.
     *
     * @returns {void} Initializes the edition outline.
     */
    static initializeEditionOutline(): void {
        const outline = EditionOutlineService._fetchEditionOutlineData();
        EditionOutlineService.setEditionOutline(outline.outline);
    }

    /**
     * Static method: getEditionOutline.
     *
     * It provides the edition outline with its series.
     *
     * @returns {EditionOutline} The edition outline.
     */
    static getEditionOutline(): EditionOutlineSeries[] {
        return EditionOutlineService._editionOutline;
    }

    /**
     * Static method: getEditionSeriesById.
     *
     * It finds a series of the edition by a given id.
     *
     * @param {string} seriesId The given series id.
     *
     * @returns {EditionOutlineSeries} The found edition series.
     */
    static getEditionSeriesById(seriesId: string): EditionOutlineSeries {
        return EditionOutlineService.getEditionOutline().find(series => series.series.route === seriesId);
    }

    /**
     * Static method: getEditionSectionById.
     *
     * It finds a section of an edition series by a given id.
     *
     * @param {string} seriesId The given series id.
     * @param {string} sectionId The given series id.
     *
     * @returns {EditionOutlineSection} The found edition section.
     */
    static getEditionSectionById(seriesId: string, sectionId: string): EditionOutlineSection {
        const series = EditionOutlineService.getEditionSeriesById(seriesId);
        return series.sections.find(section => section.section.route === sectionId);
    }

    /**
     * Static method: setEditionOutline.
     *
     * It sets the edition outline.
     *
     * @param {EditionOutline} outline The given edition outline.
     *
     * @returns {void} Sets the edition outline.
     */
    static setEditionOutline(outline: EditionOutlineSeries[]): void {
        EditionOutlineService._editionOutline = outline;
    }

    /**
     * Public method: _fetchEditionOutlineData.
     *
     * It fetches the data from a JSON file
     * for the outline of the edition view.
     *
     * @returns {EditionOutline} The EditionOutline data.
     */
    private static _fetchEditionOutlineData(): EditionOutline {
        // Load the JSON data directly from the file
        const outlineData: EditionOutlineJsonData = (jsonEditionOutline as any).default;

        return new EditionOutline(outlineData['editionOutline']);
    }
}
