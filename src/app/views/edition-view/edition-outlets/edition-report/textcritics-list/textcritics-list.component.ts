import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TextcriticalComment, TextcriticsList } from '@awg-views/edition-view/models';

/**
 * The CriticsList component.
 *
 * It contains the list of textcritical comments
 * of the critical report of the edition view of the app
 * with an {@link EditionTkaTableComponent}.
 */
@Component({
    selector: 'awg-textcritics-list',
    templateUrl: './textcritics-list.component.html',
    styleUrls: ['./textcritics-list.component.css'],
})
export class TextcriticsListComponent {
    /**
     * Input variable: textcriticsData.
     *
     * It keeps the textcritics data.
     */
    @Input()
    textcriticsData: TextcriticsList;

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
     * Self-referring variable needed for CompileHtml library.
     */
    ref: TextcriticsListComponent;

    /**
     * Constructor of the TextcriticsComponent.
     *
     * It initializes the self-referring ref variable needed for CompileHtml library.
     */
    constructor() {
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
        this.selectSvgSheetRequest.emit(id);
    }

    /**
     * Public method: isNotEmptyArray.
     *
     * It checks if a given array of the textcritical comment input
     * is not empty.
     *
     * @param {TextcriticalComment[] | string[]} part The given array input.
     * @returns {boolean} The boolean result of the check.
     */
    isNotEmptyArray(checkArray: TextcriticalComment[] | string[]): boolean {
        return checkArray && checkArray.constructor === Array && checkArray.length > 0;
    }
}
