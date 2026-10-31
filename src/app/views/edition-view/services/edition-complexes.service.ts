import { computed, Service, signal } from '@angular/core';

import {
    EditionComplex,
    EditionComplexesJsonData,
    EditionComplexesList,
    EditionComplexPartOf,
} from '../models/edition-complex.model';

import jsonEditionComplexes from 'assets/data/edition/edition-complexes.json';

/**
 * The EditionComplexes service.
 *
 * It handles the provision of the edition complexes.
 */
@Service()
export class EditionComplexesService {
    /**
     * Private readonly signal holding the edition complexes list.
     */
    private readonly _editionComplexesListSignal = signal<EditionComplexesList>({});

    /**
     * Private readonly signal holding the part ids of the composite edition complexes (in their order).
     */
    private readonly _complexPartIdsSignal = signal<Record<string, string[]>>({});

    /**
     * Private readonly computed signal: _compositeComplexRefs.
     *
     * It computes for each part id the ids of the composite edition complexes that contain the part,
     * each with the part number.
     */
    private readonly _compositeComplexRefs = computed<Map<string, { compositeId: string; partNumber: number }[]>>(
        () => {
            const compositeRefs = new Map<string, { compositeId: string; partNumber: number }[]>();

            Object.entries(this._complexPartIdsSignal()).forEach(([compositeId, partIds]) => {
                partIds.forEach((partId, index) => {
                    const refs = compositeRefs.get(partId) ?? [];
                    compositeRefs.set(partId, [...refs, { compositeId, partNumber: index + 1 }]);
                });
            });

            return compositeRefs;
        }
    );

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
        const partIds = this._fetchEditionComplexPartIds();
        this.setEditionComplexesList(complexes, partIds);
    }

    /**
     * Public method: getEditionComplexById.
     *
     * It finds an edition complex by a given id.
     * The input id is normalized to lowercase to match against lowercase keys
     * in the edition complexes list.
     *
     * @param {string} id The given id (will be normalized to lowercase).
     * @returns {EditionComplex | undefined} The found edition complex, otherwise undefined.
     */
    getEditionComplexById(id: string): EditionComplex | undefined {
        return this._editionComplexesListSignal()[id.toLowerCase()];
    }

    /**
     * Public method: getComplexParts.
     *
     * It returns the parts of a composite edition complex in their order.
     *
     * @param {string} id The given id of the composite edition complex (will be normalized to lowercase).
     * @returns {EditionComplex[]} The parts of the edition complex, empty if it has none.
     */
    getComplexParts(id: string): EditionComplex[] {
        const complexesList = this._editionComplexesListSignal();
        const partIds = this._complexPartIdsSignal()[id.toLowerCase()] ?? [];

        return partIds.flatMap(partId => complexesList[partId] ?? []);
    }

    /**
     * Public method: getCompositeComplexes.
     *
     * It returns the composite edition complexes that contain a given edition complex,
     * each with the part number of the edition complex.
     *
     * @param {string} id The given id of the edition complex (will be normalized to lowercase).
     * @returns {EditionComplexPartOf[]} The composite edition complexes, empty if there are none.
     */
    getCompositeComplexes(id: string): EditionComplexPartOf[] {
        const complexesList = this._editionComplexesListSignal();
        const compositeRefs = this._compositeComplexRefs().get(id.toLowerCase()) ?? [];

        return compositeRefs.flatMap(({ compositeId, partNumber }) => {
            const compositeComplex = complexesList[compositeId];
            return compositeComplex ? [{ compositeComplex, partNumber }] : [];
        });
    }

    /**
     * Public method: setEditionComplexesList.
     *
     * It sets the edition complexes list and the part ids of its composite complexes.
     *
     * @param {EditionComplexesList} complexesList The given edition complexes list.
     * @param {Record<string, string[]>} [partIds={}] The given part ids by the ids of the composite complexes.
     * @returns {void} Sets the edition complexes list.
     */
    setEditionComplexesList(complexesList: EditionComplexesList, partIds: Record<string, string[]> = {}): void {
        this._editionComplexesListSignal.set(complexesList);
        this._complexPartIdsSignal.set(partIds);
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
        const complexesData: EditionComplexesJsonData = jsonEditionComplexes;
        const editionComplexesList: EditionComplexesList = {};

        complexesData.editionComplexes.forEach(complex => {
            Object.entries(complex).forEach(([complexKey, complexValue]) => {
                if (!complexValue) {
                    return;
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
     * Private method: _fetchEditionComplexPartIds.
     *
     * It fetches the part ids of the composite complexes
     * from the JSON file of the edition complexes.
     *
     * @returns {Record<string, string[]>} The part ids by the ids of the composite complexes.
     */
    private _fetchEditionComplexPartIds(): Record<string, string[]> {
        const complexesData: EditionComplexesJsonData = jsonEditionComplexes;
        const partIds: Record<string, string[]> = {};

        complexesData.editionComplexes.forEach(complex => {
            Object.entries(complex).forEach(([complexKey, complexValue]) => {
                if (!complexValue?.parts?.length) {
                    return;
                }
                partIds[complexKey] = complexValue.parts.map(part => part.complex);
            });
        });

        return partIds;
    }
}
