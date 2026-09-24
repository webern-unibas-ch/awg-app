import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EditionOutlineSection } from '@awg-views/edition-view/models/edition-outline.model';

/**
 * The EditionSectionDetailIntroCard component.
 *
 * It contains the cover for the section detail
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-section-detail-cover',
    templateUrl: './edition-section-detail-cover.component.html',
    styleUrl: './edition-section-detail-cover.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class EditionSectionDetailCoverComponent {
    /**
     * Readonly input signal: selectedSection.
     *
     * It holds the selected section of the edition.
     */
    readonly selectedSection = input.required<EditionOutlineSection | null>();
}
