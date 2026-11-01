import { EditionComplex, EditionComplexesList } from '@awg-views/edition-view/models/edition-complex.model';
import {
    EditionOutline,
    EditionOutlineComplexItem,
    EditionOutlineSection,
    EditionOutlineSeries,
} from '@awg-views/edition-view/models/edition-outline.model';
import { EditionComplexesService } from '@awg-views/edition-view/services/edition-complexes.service';

import jsonEditionOutline from 'assets/data/edition/edition-outline.json';

let initializedOutline: EditionOutlineSeries[] | null = null;
let initializedComplexesService: EditionComplexesService | null = null;

/**
 * Private helper function: _getInitializedComplexesService.
 *
 * It initializes an edition complexes service with the edition complexes data
 * if it hasn't been initialized yet and returns the initialized service.
 *
 * @returns {EditionComplexesService} The initialized edition complexes service.
 */
function _getInitializedComplexesService(): EditionComplexesService {
    if (!initializedComplexesService) {
        initializedComplexesService = new EditionComplexesService();
        initializedComplexesService.initializeEditionComplexesList();
    }
    return initializedComplexesService;
}

/**
 * Private helper function: _getInitializedComplexesList.
 *
 * It returns the initialized edition complexes list.
 *
 * @returns {{ [key: string]: EditionComplex }} The initialized edition complexes list.
 */
function _getInitializedComplexesList(): EditionComplexesList {
    return _getInitializedComplexesService().editionComplexesList();
}

/**
 * Private helper function: _getInitializedOutline.
 *
 * It initializes the edition outline if it hasn't been initialized yet and returns the initialized outline.
 *
 * @returns {EditionOutlineSeries[]} The initialized edition outline.
 */
function _getInitializedOutline(): EditionOutlineSeries[] {
    if (!initializedOutline) {
        const rawOutlineData = jsonEditionOutline.editionOutline;
        const complexesService = _getInitializedComplexesService();
        const complexesList = complexesService.editionComplexesList();
        const getComplexById = (id: string) => complexesList[id.toLowerCase()];
        const getComplexParts = (id: string) => complexesService.getComplexParts(id);
        const getCompositeComplexes = (id: string) => complexesService.getCompositeComplexes(id);

        const outlineModel = new EditionOutline(rawOutlineData, getComplexById, getComplexParts, getCompositeComplexes);

        initializedOutline = outlineModel.outline;
    }
    return initializedOutline;
}

/**
 * Test helper class: EditionStateHelper.
 *
 * It provides methods to retrieve mock data for edition series, sections, and complexes.
 */
export const EditionStateHelper = {
    /**
     * Test helper method: getOutline.
     *
     * It retrieves the complete initialized edition outline data.
     *
     * @returns {EditionOutlineSeries[]} The complete edition outline.
     */
    getOutline(): EditionOutlineSeries[] {
        return structuredClone(_getInitializedOutline());
    },

    /**
     * Test helper method: getSeries.
     *
     * It retrieves a specific series from the edition outline data based on the provided series id.
     * If no series id is provided, it defaults to the first series (seriesId = '1').
     *
     * @param {string} [seriesId='1'] The id of the series to retrieve.
     * @returns {EditionOutlineSeries} The corresponding edition outline series.
     * @throws {Error} If the series is not found in the edition outline data.
     */
    getSeries(seriesId: string = '1'): EditionOutlineSeries {
        const outline = _getInitializedOutline();

        const seriesData = outline.find(series => series.series.route === seriesId);
        if (!seriesData) {
            throw new Error(`[EditionStateHelper] Series ${seriesId} not found in the edition outline data!`);
        }

        return structuredClone(seriesData);
    },

    /**
     * Test helper method: getSection.
     *
     * It retrieves a specific section from the edition outline data based on the provided series id and section id.
     * If no series id is provided, it defaults to the first series (seriesId = '1').
     * If no section id is provided, it defaults to the fifth section (sectionId = '5').
     *
     * @param {string} [seriesId='1'] The id of the series to retrieve.
     * @param {string} [sectionId='5'] The id of the section to retrieve.
     * @returns {EditionOutlineSection} The corresponding edition outline section.
     * @throws {Error} If the series or section is not found in the edition outline data.
     */
    getSection(seriesId: string = '1', sectionId: string = '5'): EditionOutlineSection {
        const outline = _getInitializedOutline();

        const seriesData = outline.find(series => series.series.route === seriesId);
        if (!seriesData) {
            throw new Error(`[EditionStateHelper] Series ${seriesId} not found in the edition outline data!`);
        }

        const sectionData = seriesData.sections?.find(section => section.section.route === sectionId);
        if (!sectionData) {
            throw new Error(
                `[EditionStateHelper] Section ${sectionId} not found in series ${seriesId} of the edition outline data!`
            );
        }

        return structuredClone(sectionData);
    },

    /**
     * Test helper method: getComplexesList.
     *
     * It retrieves the complete initialized edition complexes list data.
     *
     * @returns {EditionComplexesList} The complete edition complexes list.
     */
    getComplexesList(): EditionComplexesList {
        return structuredClone(_getInitializedComplexesList());
    },

    /**
     * Test helper method: getComplex.
     *
     * It retrieves a specific complex from the edition complexes data based on the provided complex ID.
     * If the complex with the given ID is not found, it throws an error.
     *
     * @param {string} complexId The ID of the complex to retrieve.
     * @returns {EditionComplex} The corresponding edition complex.
     * @throws {Error} If the complex with the given ID is not found.
     */
    getComplex(complexId: string): EditionComplex {
        const complexesList = _getInitializedComplexesList();
        const complex = complexesList[complexId.toLowerCase()];

        if (!complex) {
            throw new Error(`[EditionStateHelper] Complex ${complexId} not found in the edition complexes data!`);
        }
        return structuredClone(complex);
    },

    /**
     * Test helper method: getOutlineComplexItem.
     *
     * It retrieves the outline item of a specific complex from the edition outline data
     * based on the provided complex ID.
     * If the complex with the given ID is not found in the outline, it throws an error.
     *
     * @param {string} complexId The ID of the complex to retrieve.
     * @returns {EditionOutlineComplexItem} The corresponding outline item of the edition complex.
     * @throws {Error} If the complex with the given ID is not found in the edition outline data.
     */
    getOutlineComplexItem(complexId: string): EditionOutlineComplexItem {
        const complex = this.getComplex(complexId);
        const complexItem = _getInitializedOutline()
            .flatMap(series => series.sections.flatMap(section => section.content.sectionComplexes))
            .find(item => item.complex.complexId.route === complex.complexId.route);

        if (!complexItem) {
            throw new Error(`[EditionStateHelper] Complex ${complexId} not found in the edition outline data!`);
        }
        return structuredClone(complexItem);
    },
};
