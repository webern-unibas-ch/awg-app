import { Component, EventEmitter, Input, Output } from '@angular/core';

import { UtilityService } from '@awg-core/services';
import { TextcriticsList } from '@awg-views/edition-view/models';

/**
 * The TextcriticsList component.
 *
 * It contains the list of textcritical comments
 * of the critical report of the edition view of the app
 * with an {@link EditionTkaTableComponent}.
 */
@Component({
    selector: 'awg-textcritics-list',
    templateUrl: './textcritics-list.component.html',
    styleUrls: ['./textcritics-list.component.scss'],
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
        this.selectSvgSheetRequest.emit(id);
    }
}
