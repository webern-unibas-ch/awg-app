import { Component, EventEmitter, Input, Output } from '@angular/core';

import { faChevronRight, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { UtilityService } from '@awg-app/core/services';
import { TextcriticalComment, Textcritics } from '@awg-app/views/edition-view/models';

@Component({
    selector: 'awg-edition-svg-sheet-footer',
    templateUrl: './edition-svg-sheet-footer.component.html',
    styleUrls: ['./edition-svg-sheet-footer.component.scss'],
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
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

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
        this.showTextcritics = false;
        this.selectSvgSheetRequest.emit(id);
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
