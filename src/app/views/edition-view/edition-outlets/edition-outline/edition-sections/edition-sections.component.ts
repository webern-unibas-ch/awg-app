import { Component, inject } from '@angular/core';

import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionSectionCardComponent } from './edition-section-card/edition-section-card.component';

/**
 * The EditionSections component.
 *
 * It contains the sections
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-sections',
    templateUrl: './edition-sections.component.html',
    styleUrl: './edition-sections.component.scss',
    imports: [EditionSectionCardComponent],
})
export class EditionSectionsComponent {
    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Readonly signal: selectedSeries.
     *
     * It holds the state of the selected edition series.
     */
    readonly selectedSeries = this._editionStateService.selectedEditionSeries;
}
