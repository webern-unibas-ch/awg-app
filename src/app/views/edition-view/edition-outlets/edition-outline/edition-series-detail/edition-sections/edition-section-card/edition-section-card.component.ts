import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EditionOutlineSection } from '@awg-views/edition-view/models/edition-outline.model';

/**
 * The EditionSectionCard component.
 *
 * It contains the card for a single section
 * in the edition view of the app.
 */
@Component({
    selector: 'awg-edition-section-card',
    templateUrl: './edition-section-card.component.html',
    styleUrl: './edition-section-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class EditionSectionCardComponent {
    /**
     * Readonly input signal: displayedSection.
     *
     * It holds the data for the section to be displayed.
     */
    readonly displayedSection = input.required<EditionOutlineSection>();
}
