import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionSeriesCardComponent } from './edition-series-card/edition-series-card.component';

/**
 * The EditionOutline component.
 *
 * It contains the outline of series
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-outline',
    templateUrl: './edition-outline.component.html',
    styleUrls: ['./edition-outline.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionSeriesCardComponent],
})
export class EditionOutlineComponent {
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
