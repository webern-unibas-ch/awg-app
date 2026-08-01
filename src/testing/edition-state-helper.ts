import {
    EditionComplex,
    EditionComplexesList,
    EditionOutline,
    EditionOutlineSection,
    EditionOutlineSeries,
} from '@awg-views/edition-view/models';

import jsonEditionComplexes from 'assets/data/edition/edition-complexes.json';
import jsonEditionOutline from 'assets/data/edition/edition-outline.json';

let initializedOutline: EditionOutlineSeries[] | null = null;
let initializedComplexesList: EditionComplexesList | null = null;

/**
 * Private helper function: _getInitializedComplexesList.
 *
 * It initializes the edition complexes list if it hasn't been initialized yet and returns the initialized list.
 *
 * @returns {{ [key: string]: EditionComplex }} The initialized edition complexes list.
 */
function _getInitializedComplexesList(): EditionComplexesList {
    if (!initializedComplexesList) {
        const complexesData = (jsonEditionComplexes as any).default ?? jsonEditionComplexes;
        const complexesList: { [key: string]: EditionComplex } = {};

        complexesData.editionComplexes.forEach((complex: any) => {
            Object.entries(complex).forEach(([complexKey, complexValue]: [string, any]) => {
                complexesList[complexKey] = new EditionComplex(
                    complexValue.titleStatement,
                    complexValue.respStatement,
                    complexValue.pubStatement
                );
            });
        });
        initializedComplexesList = complexesList;
    }
    return initializedComplexesList;
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
        const rawOutlineData = jsonEditionOutline['editionOutline'];
        const complexesList = _getInitializedComplexesList();

        const outlineModel = new EditionOutline(rawOutlineData, id => complexesList[id.toLowerCase()]);

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
};
