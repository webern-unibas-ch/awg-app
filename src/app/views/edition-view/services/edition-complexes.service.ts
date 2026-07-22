import { Injectable, signal } from '@angular/core';

import { EditionComplex, EditionComplexesList, EditionComplexJsonData } from '../models';

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
     * Private readonly signal holding the edition complexes list.
     */
    private readonly _editionComplexesListSignal = signal<EditionComplexesList>({});

    /**
     * Readonly signal: editionComplexesList.
     *
     * It holds the state of the edition complexes list.
     */
    readonly editionComplexesList = this._editionComplexesListSignal.asReadonly();

    /**
     * Public method: initEditionComplexesList.
     *
     * It initializes the edition complexes list.
     *
     * @returns {void} Initializes the edition complexes list.
     */
    initializeEditionComplexesList(): void {
        const complexes = this._fetchEditionComplexesData();
        this.setEditionComplexesList(complexes);
    }

    /**
     * Public method: getEditionComplexById.
     *
     * It finds an edition complex by a given id.
     * The input id is normalized to lowercase to match against lowercase keys
     * in the edition complexes list.
     *
     * @param {string} id The given id (will be normalized to lowercase).
     *
     * @returns {EditionComplex | undefined} The found edition complex, otherwise undefined.
     */
    getEditionComplexById(id: string): EditionComplex | undefined {
        return this._editionComplexesListSignal()[id.toLowerCase()];
    }

    /**
     * Public method: setEditionComplexesList.
     *
     * It sets the edition complexes list.
     *
     * @param {EditionComplexesList} complexesList The given edition complexes list.
     *
     * @returns {void} Sets the edition complexes list.
     */
    setEditionComplexesList(complexesList: EditionComplexesList): void {
        this._editionComplexesListSignal.set(complexesList);
    }

    /**
     * Private method: _fetchEditionComplexesData.
     *
     * It fetches the data from a JSON file
     * for the complexes of the edition view.
     *
     * @returns {EditionComplexesList} The EditionComplexesList data.
     */
    private _fetchEditionComplexesData(): EditionComplexesList {
        // Load the JSON data directly from the file
        const complexesData = (jsonEditionComplexes as any).default;
        const editionComplexesList: EditionComplexesList = {};

        complexesData.editionComplexes.forEach((complex: EditionComplexJsonData) => {
            Object.entries(complex).forEach(([complexKey, complexValue]) => {
                editionComplexesList[complexKey] = new EditionComplex(
                    complexValue.titleStatement,
                    complexValue.respStatement,
                    complexValue.pubStatement
                );
            });
        });

        return editionComplexesList;
    }
}
