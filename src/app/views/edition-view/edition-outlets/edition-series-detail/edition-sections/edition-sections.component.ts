import { Component, inject } from '@angular/core';

import { EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionSection component.
 *
 * It contains the section section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-sections',
    templateUrl: './edition-sections.component.html',
    styleUrls: ['./edition-sections.component.scss'],
    standalone: false,
})
export class EditionSectionsComponent {
    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Readonly signal: selectedSeries.
     *
     * It holds the state of the selected edition series.
     */
    readonly selectedSeries = this._editionStateService.selectedEditionSeries;
}
