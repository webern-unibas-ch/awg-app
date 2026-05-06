import { Injectable } from '@angular/core';

import { PERSONS_DATA } from '@awg-core/core-data';
import { EditionComplex, EditionComplexesList, EditionComplexJsonData } from '@awg-views/edition-view/models';

import * as jsonEditionComplexes from 'assets/data/edition/edition-complexes.json';

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
export class EditionComplexesService {
    /**
     * Static variable: _editionComplexesList.
     *
     * It keeps the edition complexes list.
     */
    private static _editionComplexesList: EditionComplexesList = {};

    /**
     * Static method: initEditionComplexesList.
     *
     * It initializes the edition complexes list.
     *
     * @returns {void} Initializes the edition complexes list.
     */
    static initializeEditionComplexesList(): void {
        const complexes = EditionComplexesService._fetchEditionComplexesData();
        EditionComplexesService.setEditionComplexesList(complexes);
    }

    /**
     * Static method: getEditionComplexById.
     *
     * It finds an edition complex by a given id.
     * The input id is normalized to lowercase to match against lowercase keys
     * in the edition complexes list.
     *
     * @param {string} id The given id (will be normalized to lowercase).
     *
     * @returns {EditionComplex} The found edition complex.
     */
    static getEditionComplexById(id: string): EditionComplex {
        return EditionComplexesService._editionComplexesList[id.toLowerCase()];
    }

    /**
     * Static method: getEditionComplexesList.
     *
     * It gets the edition complexes list.
     *
     * @returns {EditionComplexesList} The edition complexes list.
     */
    static getEditionComplexesList(): EditionComplexesList {
        return EditionComplexesService._editionComplexesList;
    }

    /**
     * Static method: setEditionComplexesList.
     *
     * It sets the edition complexes list.
     *
     * @param {EditionComplexesList} complexesList The given edition complexes list.
     *
     * @returns {void} Sets the edition complexes list.
     */
    static setEditionComplexesList(complexesList: EditionComplexesList): void {
        EditionComplexesService._editionComplexesList = complexesList;
    }

    /**
     * Public method: _fetchEditionComplexesData.
     *
     * It fetches the data from a JSON file
     * for the complexes of the edition view.
     *
     * @returns {EditionComplexesList} The EditionComplexesList data.
     */
    private static _fetchEditionComplexesData(): EditionComplexesList {
        // Load the JSON data directly from the file
        const complexesData = (jsonEditionComplexes as any).default;
        const editionComplexesList: EditionComplexesList = {};

        complexesData.editionComplexes.forEach((complex: EditionComplexJsonData) => {
            Object.entries(complex).forEach(([complexKey, complexValue]) => {
                if (complexValue.respStatement?.editors) {
                    complexValue.respStatement.editors = complexValue.respStatement.editors.map((editor: any) =>
                        EditionComplexesService._resolvePerson(editor)
                    );
                }
                editionComplexesList[complexKey] = new EditionComplex(
                    complexValue.titleStatement,
                    complexValue.respStatement,
                    complexValue.pubStatement
                );
            });
        });

        return editionComplexesList;
    }

    /**
     * Private static method: _resolvePerson.
     *
     * It resolves a person entry: if the entry has a `$ref` key, it looks up
     * the corresponding person in PERSONS_DATA. If the key is not found,
     * it falls back to the raw person object.
     *
     * @param {any} person The raw person entry from JSON.
     *
     * @returns {any} The resolved person object.
     */
    private static _resolvePerson(person: any): any {
        return (person['$ref'] ? PERSONS_DATA[person['$ref']] : person) ?? person;
    }
}
