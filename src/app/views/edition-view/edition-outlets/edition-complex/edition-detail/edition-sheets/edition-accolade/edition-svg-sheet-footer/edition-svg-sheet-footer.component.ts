import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { UtilityService } from '@awg-app/core/services';
import { TextcriticalComment, Textcritics } from '@awg-app/views/edition-view/models';

/**
 * The EditionSvgSheetFooter component.
 *
 * It contains the footer of the svg sheet navigation section
 * of the edition view of the app
 * and lets the user display textcritical comments.
 */
@Component({
    selector: 'awg-edition-svg-sheet-footer',
    templateUrl: './edition-svg-sheet-footer.component.html',
    styleUrls: ['./edition-svg-sheet-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionSvgSheetFooterComponent {
    /**
     * Input variable: selectedTextcriticalComments.
     *
     * It keeps the selected textcritical comments.
     */
    @Input()
    selectedTextcriticalComments: TextcriticalComment[];

    /**
     * Input variable: selectedTextcritics.
     *
     * It keeps the selected textcritics of a selected svg sheet.
     */
    @Input()
    selectedTextcritics: Textcritics;

    /**
     * Input variable: showTkA.
     *
     * If the textcritics shall be displayed.
     */
    @Input()
    showTkA: boolean;

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
     * Public variable: faChevronRight.
     *
     * It instantiates fontawesome's faChevronRight icon.
     */
    faChevronRight = faChevronRight;

    /**
     * Public variable: faChevronRight.
     *
     * It instantiates fontawesome's faChevronRight icon.
     */
    faChevronUp = faChevronUp;

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionSvgSheetFooterComponent;

    /**
     * Public variable: showTextcritics.
     *
     * It keeps a boolean flag if the textcritics shall be displayed.
     */
    showTextcritics = false;

    /**
     * Constructor of the EditionSvgSheetFooterComponent.
     *
     * It declares a public instance of the UtilityService and
     * initializes the self-referring ref variable needed for CompileHtml library.
     *
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(public utils: UtilityService) {
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
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(sheetIds: { complexId: string; sheetId: string }): void {
        if (!sheetIds || !sheetIds?.sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit(sheetIds);
    }

    /**
     * Public method: toggleTextcritics.
     *
     * It toogles the boolean switch for displaying the textcritics.
     *
     * @returns {void} Toggles the boolean flag.
     */
    toggleTextcritics(): void {
        this.showTextcritics = !this.showTextcritics;
    }
}
