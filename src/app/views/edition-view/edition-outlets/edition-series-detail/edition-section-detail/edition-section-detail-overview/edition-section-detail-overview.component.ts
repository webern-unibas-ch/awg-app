import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UTILS } from '@awg-shared/utils/object-utils';
import { EditionStateService } from '@awg-views/edition-view/services';

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
    standalone: false,
})
export class EditionSectionDetailOverviewComponent {
    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Readonly signal: selectedSection.
     *
     * It holds the state of the selected edition section.
     */
    readonly selectedSection = inject(EditionStateService).selectedEditionSection;
}
