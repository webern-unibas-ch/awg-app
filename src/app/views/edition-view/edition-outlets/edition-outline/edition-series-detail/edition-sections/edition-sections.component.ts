import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

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
    styleUrls: ['./edition-sections.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditionSectionCardComponent],
})
export class EditionSectionsComponent {
    /**
     * Readonly signal: selectedSeries.
     *
     * It holds the state of the selected edition series.
     */
    readonly selectedSeries = inject(EditionStateService).selectedEditionSeries;
}
