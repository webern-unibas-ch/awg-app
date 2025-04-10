import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';

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
     * Input variable: selectedSeries.
     *
     * It keeps the selected series of the edition.
     */
    @Input()
    selectedSeries: EditionOutlineSeries;

    /**
     * Input variable: selectedSection.
     *
     * It keeps the selected section of the edition.
     */
    @Input()
    selectedSection: EditionOutlineSection;
}
