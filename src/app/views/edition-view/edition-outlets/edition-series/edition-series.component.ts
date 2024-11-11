import { Component, inject, OnInit } from '@angular/core';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
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
})
export class EditionSeriesComponent implements OnInit {
    /**
     * Public variable: editionOutline.
     *
     * It keeps the outline of the edition as an array of routes.
     */
    editionOutline: EditionOutlineSeries[];

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
        this.clearSelections();
        this.getEditionOutline();
    }

    /**
     * Public method: clearSelectedSeries.
     *
     * It clears the selected series from the EditionStateService.
     *
     * @returns {void} Clears the edition series.
     */
    clearSelections(): void {
        this._editionStateService.clearSelectedEditionSeries();
        this._editionStateService.clearSelectedEditionSection();
    }

    /**
     * Public method: getEditionOutline.
     *
     * It gets the outline with array of series from the EditionStateService.
     *
     * @returns {void} Gets the edition outline.
     */
    getEditionOutline(): void {
        this.editionOutline = EditionOutlineService.getEditionOutline();
    }
}
