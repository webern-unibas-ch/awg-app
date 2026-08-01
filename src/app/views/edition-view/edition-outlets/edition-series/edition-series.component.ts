import { Component, inject } from '@angular/core';

import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionSeries component.
 *
 * It contains the series section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-series',
    templateUrl: './edition-series.component.html',
    styleUrls: ['./edition-series.component.scss'],
    standalone: false,
})
export class EditionSeriesComponent {
    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Public signal: editionOutline.
     *
     * It holds the outline of the edition as an array of routes.
     */
    readonly editionOutline = inject(EditionOutlineService).editionOutline;

    /**
     * Constructor of the EditionSeriesComponent.
     *
     * It clears the selected edition series in the EditionStateService.
     */
    constructor() {
        this._editionStateService.updateSelectedEditionSeries(null);
    }
}
