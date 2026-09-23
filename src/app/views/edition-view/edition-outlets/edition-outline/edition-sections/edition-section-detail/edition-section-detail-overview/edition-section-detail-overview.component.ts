import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

import { EditionSectionDetailComplexCardComponent } from '../edition-section-detail-complex-card/edition-section-detail-complex-card.component';
import { EditionSectionDetailCoverComponent } from '../edition-section-detail-cover/edition-section-detail-cover.component';
import { EditionSectionDetailDisclaimerComponent } from '../edition-section-detail-disclaimer/edition-section-detail-disclaimer.component';
import { EditionSectionDetailIntroCardComponent } from '../edition-section-detail-intro-card/edition-section-detail-intro-card.component';
import { EditionSectionDetailPlaceholderComponent } from '../edition-section-detail-placeholder/edition-section-detail-placeholder.component';

/**
 * The EditionSectionDetailOverview component.
 *
 * It contains the detail overview of a section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-section-detail-overview',
    templateUrl: './edition-section-detail-overview.component.html',
    styleUrls: ['./edition-section-detail-overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        EditionSectionDetailComplexCardComponent,
        EditionSectionDetailCoverComponent,
        EditionSectionDetailDisclaimerComponent,
        EditionSectionDetailIntroCardComponent,
        EditionSectionDetailPlaceholderComponent,
    ],
})
export class EditionSectionDetailOverviewComponent {
    /**
     * Readonly signal: selectedSection.
     *
     * It holds the state of the selected edition section.
     */
    readonly selectedSection = inject(EditionStateService).selectedEditionSection;
}
