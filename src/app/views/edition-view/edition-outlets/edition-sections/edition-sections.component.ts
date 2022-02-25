import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { EditionSeriesRoutes } from '@awg-views/edition-view/models';
import { EditionService } from '@awg-views/edition-view/services';

/**
 * The EditionSection component.
 *
 * It contains the section section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-sections',
    templateUrl: './edition-sections.component.html',
    styleUrls: ['./edition-sections.component.css'],
})
export class EditionSectionsComponent implements OnInit {
    /**
     * Public variable: selectedSeries$.
     *
     * It keeps the selected series of the edition as an Observable of EditionSeriesRoutes.
     */
    selectedSeries$: Observable<EditionSeriesRoutes>;

    /**
     * Constructor of the EditionSectionsComponent.
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
        this.clearSelectedSection();
        this.getSeries();
    }

    /**
     * Public method: getSeries.
     *
     * It gets the selected series from the EditionService.
     *
     * @returns {void} Gets the edition series.
     */
    getSeries(): void {
        this.selectedSeries$ = this.editionService.getSelectedEditionSeries();
    }

    /**
     * Public method: clearSelectedSection.
     *
     * It clears the selected section from the EditionService.
     *
     * @returns {void} Clears the edition section.
     */
    clearSelectedSection(): void {
        this.editionService.clearSelectedEditionSection();
    }
}
