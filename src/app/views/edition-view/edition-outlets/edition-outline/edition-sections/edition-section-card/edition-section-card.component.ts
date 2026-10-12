import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ButtonMoreComponent } from '@awg-shared/button-more/button-more.component';
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
    imports: [ButtonMoreComponent],
})
export class EditionSectionCardComponent {
    /**
     * Readonly input signal: displayedSection.
     *
     * It holds the section to be displayed.
     */
    readonly displayedSection = input.required<EditionOutlineSection | null>();
}
