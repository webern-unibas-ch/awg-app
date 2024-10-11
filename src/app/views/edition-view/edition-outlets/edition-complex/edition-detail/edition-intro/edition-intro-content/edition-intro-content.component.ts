import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { IntroBlock } from '@awg-views/edition-view/models';

/**
 * The EditionIntroContent component.
 *
 * It contains the content blocks for the intro
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-intro-content',
    templateUrl: './edition-intro-content.component.html',
    styleUrls: ['./edition-intro-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionIntroContentComponent {
    /**
     * Input variable: introBlockContent.
     *
     * It keeps the content blocks of the intro.
     */
    @Input()
    introBlockContent: IntroBlock[];

    /**
     * Input variable: notesLabel.
     *
     * It keeps the notes label of the intro.
     */
    @Input()
    notesLabel: string;

    /**
     * Output variable: navigateToIntroFragmentRequest.
     *
     * It keeps an event emitter for the selected ids of an edition complex and intro fragment.
     */
    @Output()
    navigateToIntroFragmentRequest: EventEmitter<{ complexId: string; fragmentId: string }> = new EventEmitter();

    /**
     * Output variable: navigateToReportFragmentRequest.
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
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionIntroContentComponent;

    /**
     * Constructor of the EditionIntroContentComponent.
     *
     * It initializes the self-referring variable needed for CompileHtml library.
     *
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor() {
        this.ref = this;
    }

    /**
     * Public method: navigateToIntroFragment.
     *
     * It emits the given ids of a selected edition complex and intro fragment
     * to the {@link navigateToIntroFragmentRequest}.
     *
     * @param {object} introIds The given intro ids as { complexId: string, fragmentId: string }.
     * @returns {void} Emits the ids.
     */
    navigateToIntroFragment(introIds: { complexId: string; fragmentId: string }): void {
        if (!introIds?.fragmentId) {
            return;
        }
        this.navigateToIntroFragmentRequest.emit(introIds);
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
