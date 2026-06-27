import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { UtilityService } from '@awg-core/services/utility-service/utility.service';
import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionStateService } from '@awg-views/edition-view/services';
import { combineLatest, map, Observable } from 'rxjs';

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
export class EditionSectionDetailOverviewComponent implements OnInit {
    /**
     * Public variable: editionData$.
     *
     * It keeps the observable of the selected series and section of the edition.
     */
    editionData$: Observable<{ series: EditionOutlineSeries; section: EditionOutlineSection }>;

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
        this.editionData$ = combineLatest([
            this._editionStateService.getSelectedEditionSeries(),
            this._editionStateService.getSelectedEditionSection(),
        ]).pipe(map(([series, section]) => ({ series, section })));
    }
}
