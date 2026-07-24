import { Component, DestroyRef, inject } from '@angular/core';

import { EditionDataService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionRowTables component.
 *
 * It contains the row tables overview
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-row-tables',
    templateUrl: './edition-row-tables.component.html',
    styleUrls: ['./edition-row-tables.component.scss'],
    standalone: false,
})
export class EditionRowTablesComponent {
    /**
     * Private readonly injection variable: _editionDataService.
     *
     * It keeps the instance of the injected EditionDataService.
     */
    private readonly _editionDataService = inject(EditionDataService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Readoly signal: viewData.
     *
     * It holds the state of the row tables view data.
     */
    readonly viewData = this._editionDataService.rowTablesViewData;

    /**
     * Constructor of the EditionRowTablesComponent.
     *
     * It updates the edition state to indicate if the row table view is active.
     */
    constructor() {
        this._editionStateService.updateIsRowTableView(true);

        inject(DestroyRef).onDestroy(() => {
            this._editionStateService.updateIsRowTableView(false);
        });
    }
}
