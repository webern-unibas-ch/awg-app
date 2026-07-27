import { Component, DestroyRef, inject } from '@angular/core';

import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

/**
 * The EditionRowtables component.
 *
 * It contains the rowtables overview
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-rowtables',
    templateUrl: './edition-rowtables.component.html',
    styleUrls: ['./edition-rowtables.component.scss'],
    standalone: false,
})
export class EditionRowtablesComponent {
    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _editionViewService.
     *
     * It keeps the instance of the injected EditionViewService.
     */
    private readonly _editionViewService = inject(EditionViewService);

    /**
     * Readoly signal: viewData.
     *
     * It holds the state of the rowtables view data.
     */
    readonly viewData = this._editionViewService.rowtablesViewData;

    /**
     * Constructor of the EditionRowtablesComponent.
     *
     * It updates the edition state to indicate if the rowtables view is active.
     */
    constructor() {
        this._editionStateService.updateIsRowtablesView(true);

        inject(DestroyRef).onDestroy(() => {
            this._editionStateService.updateIsRowtablesView(false);
        });
    }
}
