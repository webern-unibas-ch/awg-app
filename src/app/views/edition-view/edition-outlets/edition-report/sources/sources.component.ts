import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { SourceDescriptionList, SourceEvaluationList, SourceList } from '@awg-views/edition-view/models';

/**
 * The Sources component.
 *
 * It contains the sources section of the critical report
 * of the edition view of the app with a
 * {@link SourceListComponent}, a {@link SourceDescriptionComponent},
 * and the {@link SourceEvaluationComponent}.
 */
@Component({
    selector: 'awg-sources',
    templateUrl: './sources.component.html',
    styleUrls: ['./sources.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourcesComponent {
    /**
     * Input variable: sourceListData.
     *
     * It keeps the source list data.
     */
    @Input()
    sourceListData: SourceList;

    /**
     * Input variable: sourceDescriptionListData.
     *
     * It keeps the source description data.
     */
    @Input()
    sourceDescriptionListData: SourceDescriptionList;

    /**
     * Input variable: sourceEvaluationListData.
     *
     * It keeps the source evaluation data.
     */
    @Input()
    sourceEvaluationListData: SourceEvaluationList;

    /**
     * Output variable: navigateToReportFragment.
     *
     * It keeps an event emitter for a fragment id of the edition report.
     */
    @Output()
    navigateToReportFragmentRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<any> = new EventEmitter();

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public method: navigateToReportFragment.
     *
     * It emits a given fragment id of the edition report
     * to the {@link navigateToReportFragmentRquest}.
     *
     * @param {string}  fragmentId The given fragment id.
     * @returns {void} Navigates to the edition report.
     */
    navigateToReportFragment(fragmentId: string) {
        if (!fragmentId) {
            return;
        }
        this.navigateToReportFragmentRequest.emit(fragmentId);
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

    /**
     * Public method: selectSvgSheet.
     *
     * It emits a given id of a selected svg sheet
     * to the {@link selectSvgSheetRequest}.
     *
     * @param {string} id The given sheet id.
     * @returns {void} Emits the id.
     */
    selectSvgSheet(id: string): void {
        if (!id) {
            return;
        }
        this.selectSvgSheetRequest.emit(id);
    }
}
