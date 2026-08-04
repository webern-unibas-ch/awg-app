import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { UTILS } from '@awg-shared/utils/object-utils';
/**
 * The SourceDescriptionDetails component.
 *
 * It contains the source description details section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description-details',
    templateUrl: './source-description-details.component.html',
    styleUrls: ['./source-description-details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceDescriptionDetailsComponent {
    /**
     * Input variable: details.
     *
     * It keeps the details array.
     */
    @Input()
    details: string[];

    /**
     * Input variable: detailsClass.
     *
     * It keeps the class name for the details.
     */
    @Input()
    detailsClass: string;

    /**
     * Input variable: detailsLabel.
     *
     * It keeps the label for the details.
     */
    @Input()
    detailsLabel: string;

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
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionDetailsComponent = this;

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
     * It emits the given ids of a selected edition complex
     * and svg sheet to the {@link selectSvgSheetRequest}.
     *
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(sheetIds: { complexId: string; sheetId: string }): void {
        if (!sheetIds?.sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit(sheetIds);
    }
}
