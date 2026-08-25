import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EditionOutlineSection } from '@awg-views/edition-view/models/edition-outline.model';

/**
 * The EditionSectionDetailPlaceholder component.
 *
 * It contains a placeholder for the section detail
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-section-detail-placeholder',
    templateUrl: './edition-section-detail-placeholder.component.html',
    styleUrls: ['./edition-section-detail-placeholder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionSectionDetailPlaceholderComponent {
    /**
     * Readonly input signal: selectedSection.
     *
     * It holds the selected section of the edition.
     */
    readonly selectedSection = input.required<EditionOutlineSection | null>();
}
