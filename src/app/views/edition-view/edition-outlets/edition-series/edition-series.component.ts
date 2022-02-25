import { Component, OnInit } from '@angular/core';

import { EditionConstants, EditionRoute, EditionSeriesRoutes } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

/**
 * The EditionSeries component.
 *
 * It contains the series section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-series',
    templateUrl: './edition-series.component.html',
    styleUrls: ['./edition-series.component.css'],
})
export class EditionSeriesComponent implements OnInit {
    /**
     * Public variable: editionRoute.
     *
     * It keeps the edition route of the edition.
     */
    editionRoute: EditionRoute;

    /**
     * Public variable: editionOutline.
     *
     * It keeps the outline of the edition as an array of routes.
     */
    editionOutline: EditionSeriesRoutes[];

    /**
     * Constructor of the EditionSeriesComponent.
     *
     * It declares a private instance of the EditionService.
     *
     * @param {EditionService} editionService Instance of the EditionService.
     */
    constructor(private editionService: EditionService) {
        // Intentionally left empty until implemented
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.clearSelections();
        this.getEditionOutline();
    }

    /**
     * Public method: getEditionOutline.
     *
     * It gets the outline with array of series from the EditionService and sets the editionRoute constant.
     *
     * @returns {void} Gets the edition outline.
     */
    getEditionOutline(): void {
        this.editionOutline = this.editionService.getEditionOutline();
        this.editionRoute = EditionConstants.EDITION;
    }

    /**
     * Public method: clearSelectedSeries.
     *
     * It clears the selected series from the EditionService.
     *
     * @returns {void} Clears the edition series.
     */
    clearSelections(): void {
        this.editionService.clearSelectedEditionSeries();
        this.editionService.clearSelectedEditionSection();
    }
}
