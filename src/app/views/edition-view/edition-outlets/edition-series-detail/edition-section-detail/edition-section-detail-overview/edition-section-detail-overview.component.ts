import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

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
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Readonly signal: editionData.
     *
     * It holds the synchronized state of the selected edition series and section.
     */
    readonly editionData = computed(() => ({
        series: this._editionStateService.selectedEditionSeries(),
        section: this._editionStateService.selectedEditionSection(),
    }));
}
