import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Textcritics } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-source-description-corrections',
    templateUrl: './source-description-corrections.component.html',
    styleUrl: './source-description-corrections.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceDescriptionCorrectionsComponent {
    /**
     * Input variable: corrections.
     *
     * It keeps the corrections data.
     */
    @Input()
    corrections: Textcritics[];

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
    openModalRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionCorrectionsComponent;

    /**
     * Constructor of the SourceDescriptionComponent.
     *
     * It initializes the self-referring variable needed for CompileHtml library.
     */
    constructor() {
        this.ref = this;
    }

    /**
     * Public method: navigateToReportFragment.
     *
     * It emits a given id of a fragment of the edition report
     * to the {@link navigateToReportFragmentRequest}.
     *
     * @param {string} id The given fragment id.
     * @returns {void} Navigates to the edition report.
     */
    navigateToReportFragment(id: string): void {
        if (!id) {
            return;
        }
        this.navigateToReportFragmentRequest.emit(id);
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
     * @param {string} complexId The given complex id.
     * @param {string} sheetId The given sheet id.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(complexId: string, sheetId: string): void {
        if (!sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit({ complexId: complexId, sheetId: sheetId });
    }
}
