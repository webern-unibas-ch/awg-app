import { computed, inject, Injectable, signal } from '@angular/core';

import {
    EditionOutline,
    EditionOutlineJsonData,
    EditionOutlineSection,
    EditionOutlineSeries,
    EditionOutlineSeriesJsonData,
} from '../models/edition-outline.model';
import { EditionComplexesService } from './edition-complexes.service';

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
     * Private readonly injection variable: _editionComplexesService.
     *
     * It keeps the instance of the injected EditionComplexesService.
     */
    private readonly _editionComplexesService = inject(EditionComplexesService);

    /**
     * Private readonly signal holding the raw json data of the edition outline.
     */
    private readonly _rawOutlineDataSignal = signal<EditionOutlineSeriesJsonData[]>([]);

    /**
     * Readonly computed signal: editionOutline.
     *
     * It computes the edition outline based on the raw json data and the edition complexes list.
     */
    readonly editionOutline = computed<EditionOutlineSeries[]>(() => {
        const rawOutlineData = this._rawOutlineDataSignal();
        if (!rawOutlineData) {
            return [];
        }

        const complexesList = this._editionComplexesService.editionComplexesList();
        const outlineModel = new EditionOutline(rawOutlineData, id => complexesList[id.toLowerCase()]);

        return outlineModel.outline;
    });

    /**
     * Public method: initEditionOutline.
     *
     * It initializes the edition outline.
     *
     * @returns {void} Initializes the edition outline.
     */
    initializeEditionOutline(): void {
        const rawOutlineData: EditionOutlineJsonData = jsonEditionOutline as EditionOutlineJsonData;
        this._rawOutlineDataSignal.set(rawOutlineData['editionOutline']);
    }

    /**
     * Public method: getEditionSeriesById.
     *
     * It finds a series of the edition by a given id.
     *
     * @param {string} seriesId The given series id.
     * @returns {EditionOutlineSeries | undefined} The found edition series, otherwise undefined.
     */
    getEditionSeriesById(seriesId: string): EditionOutlineSeries | undefined {
        return this.editionOutline().find(series => series.series.route === seriesId);
    }

    /**
     * Public method: getEditionSectionById.
     *
     * It finds a section of an edition series by a given id.
     *
     * @param {string} seriesId The given series id.
     * @param {string} sectionId The given series id.
     * @returns {EditionOutlineSection | undefined} The found edition section, otherwise undefined.
     */
    getEditionSectionById(seriesId: string, sectionId: string): EditionOutlineSection | undefined {
        const series = this.getEditionSeriesById(seriesId);
        return series?.sections.find(section => section.section.route === sectionId);
    }
}
