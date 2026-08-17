import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EditionOutlineSection } from '@awg-views/edition-view/models';

/**
 * The EditionSectionDetailIntroCard component.
 *
 * It contains the intro card for the section detail
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-section-detail-intro-card',
    templateUrl: './edition-section-detail-intro-card.component.html',
    styleUrls: ['./edition-section-detail-intro-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionSectionDetailIntroCardComponent {
    /**
     * Readonly input signal: selectedSection.
     *
     * It holds the selected section of the edition.
     */
    readonly selectedSection = input.required<EditionOutlineSection | null>();
}
