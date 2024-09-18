import { Injectable } from '@angular/core';

import { EditionComplexesService, EditionOutlineService } from '@awg-views/edition-view/services';

/**
 * The EditionInit service.
 *
 * It handles the initialization of the edition view.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionInitService {
    /**
     * Public method: initializeEdition.
     *
     * It initializes the edition view by initializing
     * the edition complexes list and the edition outline.
     *
     * @returns {void} Initializes the edition view.
     */
    initializeEdition(): void {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    }
}
