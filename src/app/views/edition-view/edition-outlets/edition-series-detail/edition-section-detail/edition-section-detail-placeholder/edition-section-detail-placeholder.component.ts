import { Component, Input } from '@angular/core';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-app/views/edition-view/models';

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
})
export class EditionSectionDetailPlaceholderComponent {
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
