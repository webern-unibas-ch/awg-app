import { Component, inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
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
export class EditionSectionsComponent implements OnInit {
    /**
     * Public variable: selectedSeries$.
     *
     * It keeps the selected series of the edition as an Observable of EditionOutlineSeries.
     */
    selectedSeries$: Observable<EditionOutlineSeries>;

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

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
     * Public method: clearSelectedSection.
     *
     * It clears the selected section from the EditionStateService.
     *
     * @returns {void} Clears the edition section.
     */
    clearSelectedSection(): void {
        this._editionStateService.clearSelectedEditionSection();
    }

    /**
     * Public method: getSeries.
     *
     * It gets the selected series from the EditionStateService.
     *
     * @returns {void} Gets the edition series.
     */
    getSeries(): void {
        this.selectedSeries$ = this._editionStateService.getSelectedEditionSeries();
    }
}
