import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import {
    EditionSvgSheet,
    EditionSvgSheetList,
    EditionSvgOverlay,
    TextcriticalComment,
} from '@awg-views/edition-view/models';

/**
 * The EditionAccolade component.
 *
 * It contains the edition accolade section
 * of the edition view of the app
 * with the {@link EditionSvgSheetNavComponent},
 * the {@link EditionSvgSheetListComponent}
 * and the {@link EditionTkaTableComponent}.
 */
@Component({
    selector: 'awg-edition-accolade',
    templateUrl: './edition-accolade.component.html',
    styleUrls: ['./edition-accolade.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionAccoladeComponent {
    /**
     * Input variable: svgSheetsData.
     *
     * It keeps the svg sheets data.
     */
    @Input()
    svgSheetsData: EditionSvgSheetList;

    /**
     * Input variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input()
    selectedSvgSheet: EditionSvgSheet;

    /**
     * Input variable: selectedTextcriticalComments.
     *
     * It keeps the selected textcritical comments.
     */
    @Input()
    selectedTextcriticalComments: TextcriticalComment[];

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
     * Output variable: selectOverlaysRequest.
     *
     * It keeps an event emitter for the selected svg overlays.
     */
    @Output()
    selectOverlaysRequest: EventEmitter<EditionSvgOverlay[]> = new EventEmitter();

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

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
     * Public method: selectOverlays.
     *
     * It emits the selected svg overlays
     * to the {@link selectOverlaysRequest}.
     *
     * @param {EditionSvgOverlay[]} overlays The given svg overlays.
     * @returns {void} Emits the overlays.
     */
    selectOverlays(overlays: EditionSvgOverlay[]): void {
        this.selectOverlaysRequest.emit(overlays);
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
