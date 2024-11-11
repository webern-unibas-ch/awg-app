import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { UtilityService } from '@awg-core/services';
import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionStateService } from '@awg-views/edition-view/services';
import { Observable } from 'rxjs';

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
})
export class EditionSectionDetailOverviewComponent implements OnInit {
    /**
     * Public variable: selectedSeries.
     *
     * It keeps the observable of the selected series of the edition.
     */
    selectedSeries$: Observable<EditionOutlineSeries>;

    /**
     * Public variable: selectedSection$.
     *
     * It keeps the observable of the selected section of the edition.
     */
    selectedSection$: Observable<EditionOutlineSection>;

    /**
     * Public readonly injection variable: UTILS.
     *
     * It keeps the instance of the injected UtilityService.
     */
    readonly UTILS = inject(UtilityService);

    /**
     * Private readonly injection variable: _editionStateService.
     *
     * It keeps the instance of the injected EditionStateService.
     */
    private readonly _editionStateService = inject(EditionStateService);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.setupSectionDetailOverview();
    }

    /**
     * Public method: setupSectionDetailOverview.
     *
     * It sets up the section detail ovewview.
     *
     * @returns {void} Sets up the section detail overview.
     */
    setupSectionDetailOverview(): void {
        this.selectedSeries$ = this._editionStateService.getSelectedEditionSeries();
        this.selectedSection$ = this._editionStateService.getSelectedEditionSection();
    }
}
