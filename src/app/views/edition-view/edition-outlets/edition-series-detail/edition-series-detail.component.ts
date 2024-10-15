import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
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
     * Public variable: selectedSeries.
     *
     * It keeps the selected series of the edition.
     */
    selectedSeries: EditionOutlineSeries;

    /**
     * Constructor of the EditionSeriesDetailComponent.
     *
     * It declares private instances of the Angular ActivatedRoute and the EditionStateService.
     *
     * @param {ActivatedRoute} route Instance of the ActivatedRoute.
     * @param {EditionStateService} editionStateService Instance of the EditionStateService.
     */
    constructor(
        private route: ActivatedRoute,
        private editionStateService: EditionStateService
    ) {
        // Intentionally left empty until implemented
    }

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
        const id = this.route.snapshot.paramMap.get('id');

        this.selectedSeries = EditionOutlineService.getEditionSeriesById(id);
        this.editionStateService.updateSelectedEditionSeries(this.selectedSeries);
    }
}
