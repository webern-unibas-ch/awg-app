import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
})
export class EditionSeriesDetailComponent implements OnInit {
    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Private readonly injection variable: _route.
     *
     * It keeps the instance of the injected Angular ActivatedRoute.
     */
    private readonly _route = inject(ActivatedRoute);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
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
        const id = this._route.snapshot.paramMap.get('id');

        const selectedSeries = EditionOutlineService.getEditionSeriesById(id);
        this._editionStateService.updateSelectedEditionSeries(selectedSeries);
    }
}
