import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

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
     * It declares private instances of the Angular ActivatedRoute and the EditionService.
     *
     * @param {ActivatedRoute} route Instance of the ActivatedRoute.
     * @param {EditionService} editionService Instance of the EditionService.
     */
    constructor(private route: ActivatedRoute, private editionService: EditionService) {
        // Intentionally left empty until implemented
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getSeries();
    }

    /**
     * Public method: getSeries.
     *
     * It gets the selected series by ID from the EditionService.
     *
     * @returns {void} Gets the edition series.
     */
    getSeries(): void {
        const id = this.route.snapshot.paramMap.get('id');

        this.selectedSeries = this.editionService.getEditionSeriesById(id);
        this.editionService.updateSelectedEditionSeries(this.selectedSeries);
    }
}
