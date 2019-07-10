import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgSheet, EditionSvgOverlay, Textcritics } from '@awg-views/edition-view/models';

/**
 * The EditionAccolade component.
 *
 * It contains the edition accolade section
 * of the edition view of the app
 * with the {@link EditionSvgSheetNavComponent},
 * the {@link EditionSvgSheetComponent},
 * the {@link EditionDetailNotificationComponent}
 * and the {@link EditionTkaTableComponent}.
 */
@Component({
    selector: 'awg-edition-accolade',
    templateUrl: './edition-accolade.component.html',
    styleUrls: ['./edition-accolade.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionAccoladeComponent {
    /**
     * Input variable: svgSheetsData.
     *
     * It keeps the svg sheets data.
     */
    @Input()
    svgSheetsData: EditionSvgSheet[];

    /**
     * Input variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input()
    selectedSvgSheet: EditionSvgSheet;

    /**
     * Input variable: selectedTextcritics.
     *
     * It keeps the selected textcritics.
     */
    @Input()
    selectedTextcritics: Textcritics[];

    /**
     * Input variable: selectedOverlay.
     *
     * It keeps the selected svg overlay.
     */
    @Input()
    selectedOverlay: EditionSvgOverlay;

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
     * Output variable: selectTextcriticRequest.
     *
     * It keeps an event emitter for the selected textcritics.
     */
    @Output()
    selectTextcriticRequest: EventEmitter<EditionSvgOverlay> = new EventEmitter();

    /**
     * Public variable: showAccoladePanel.
     *
     * If the accolade panel shall be displayed.
     */
    showAccoladePanel = true;

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Emits the id.
     */
    openModal(id: string) {
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
     * Public method: selectTextcritic.
     *
     * It emits a given svg overlay
     * to the {@link selectTextcriticRequest}.
     *
     * @param {string} overlay The given svg overlay.
     * @returns {void} Emits the overlay.
     */
    selectTextcritic(overlay: EditionSvgOverlay): void {
        this.selectTextcriticRequest.emit(overlay);
    }

    /**
     * Public method: togglePanel.
     *
     * It toggles the showAccoladePanel flag.
     *
     * @returns {boolean} Sets the showAccoladePanel flag.
     */
    togglePanel(): boolean {
        return (this.showAccoladePanel = !this.showAccoladePanel);
    }
}
