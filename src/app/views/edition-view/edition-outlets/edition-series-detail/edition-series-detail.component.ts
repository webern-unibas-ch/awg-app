import { Component, effect, inject, input } from '@angular/core';

import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

/**
 * The EditionSeriesDetail component.
 *
 * It contains the detail of a series
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-series-detail',
    templateUrl: './edition-series-detail.component.html',
    styleUrls: ['./edition-series-detail.component.scss'],
    standalone: false,
})
export class EditionSeriesDetailComponent {
    /**
     * Private readonly injection variable: _editionOutlineService.
     *
     * It keeps the instance of the injected EditionOutlineService.
     */
    private readonly _editionOutlineService = inject(EditionOutlineService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Input signal: seriesId.
     *
     * It holds the route param id of the edition series (automatically bound by the router).
     */
    seriesId = input<string | null>(null);

    /**
     * Constructor of the EditionSeriesDetailComponent.
     *
     * It calls a method to update the edition series from the route.
     *
     */
    constructor() {
        this.updateSeriesFromRoute();
    }

    /**
     * Public method: updateSeriesFromRoute.
     *
     * It fetches the route params to get the id of the current series
     * and updates the EditionStateService.
     *
     * @returns {void} Updates the edition series.
     */
    updateSeriesFromRoute(): void {
        effect(() => {
            const currentSeriesId = this.seriesId();

            if (!currentSeriesId) {
                this._editionStateService.updateSelectedEditionSeries(null);
                return;
            }

            const selectedSeries = this._editionOutlineService.getEditionSeriesById(currentSeriesId) ?? null;
            this._editionStateService.updateSelectedEditionSeries(selectedSeries);
        });
    }
}
