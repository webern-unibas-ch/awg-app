import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';

import { EditionSeriesCardComponent } from './edition-series-card/edition-series-card.component';

/**
 * The EditionOutline component.
 *
 * It contains the outline of series
 * of the edition view of the app.
 *
 * The selected edition state is reset by the {@link editionStateResetResolver}
 * during the navigation.
 */
@Component({
    selector: 'awg-edition-outline',
    templateUrl: './edition-outline.component.html',
    styleUrl: './edition-outline.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionSeriesCardComponent],
})
export class EditionOutlineComponent {
    /**
     * Private readonly injection variable: _editionOutlineService.
     *
     * It keeps the instance of the injected EditionOutlineService.
     */
    private readonly _editionOutlineService = inject(EditionOutlineService);

    /**
     * Readonly signal: editionOutline.
     *
     * It holds the outline of the edition as an array of routes.
     */
    readonly editionOutline = this._editionOutlineService.editionOutline;
}
