import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilityService } from '@awg-app/core/services';

import { SourceList } from '@awg-views/edition-view/models';

/**
 * The SourceList component.
 *
 * It contains the source list section
 * of the criitical report
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-source-list',
    templateUrl: './source-list.component.html',
    styleUrls: ['./source-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceListComponent {
    /**
     * Input variable: sourceListData.
     *
     * It keeps the source list data.
     */
    @Input()
    sourceListData: SourceList;

    /**
     * Output variable: navigateToReportFragment.
     *
     * It keeps an event emitter for the selected ids of an edition complex and report fragment.
     */
    @Output()
    navigateToReportFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();

    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceListComponent;

    /**
     * Constructor of the SourceListComponent.
     *
     * It initializes the self-referring ref variable needed for CompileHtml library,
     * and declares a public {@link UtilityService} instance.
     *
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(public utils: UtilityService) {
        this.ref = this;
    }

    /**
     * Public method: navigateToReportFragment.
     *
     * It emits the given ids of a selected edition complex and report fragment
     * to the {@link navigateToReportFragmentRequest}.
     *
     * @param {object} reportIds The given report ids as { complexId: string, fragmentId: string }.
     * @returns {void} Emits the ids.
     */
    navigateToReportFragment(reportIds: { complexId: string; fragmentId: string }): void {
        if (!reportIds?.fragmentId) {
            return;
        }
        this.navigateToReportFragmentRequest.emit(reportIds);
    }

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     *
     * @returns {void} Emits the id.
     */
    openModal(id: string): void {
        if (!id) {
            return;
        }
        this.openModalRequest.emit(id);
    }
}
