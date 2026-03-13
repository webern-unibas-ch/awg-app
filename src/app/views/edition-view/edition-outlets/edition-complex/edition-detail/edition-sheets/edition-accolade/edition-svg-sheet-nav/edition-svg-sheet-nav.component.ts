import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { faAnglesLeft, faListUl } from '@fortawesome/free-solid-svg-icons';

import { EditionSvgSheet, EditionSvgSheetList } from '@awg-views/edition-view/models';

/**
 * The EditionSvgSheetNav component.
 *
 * It contains the svg sheet navigation section
 * of the edition view of the app
 * and lets the user select an SVG sheet.
 */
@Component({
    selector: 'awg-edition-svg-sheet-nav',
    templateUrl: './edition-svg-sheet-nav.component.html',
    styleUrls: ['./edition-svg-sheet-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionSvgSheetNavComponent {
    /**
     * Public variable: isMinimized.
     *
     * It keeps the toggle state of the sheet navigation.
     */
    @Input()
    isMinimized = false;

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
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

    /**
     * Output variable: toggleSheetNavRequest.
     *
     * It keeps an event emitter for the toggle state of the sheet navigation.
     */
    @Output()
    toggleSheetNavRequest: EventEmitter<boolean> = new EventEmitter();

    /**
     * Public variable: faAnglesLeft.
     *
     * It instantiates fontawesome's faAnglesLeft icon.
     */
    faAnglesLeft = faAnglesLeft;

    /**
     * Public variable: faListUl.
     *
     * It instantiates fontawesome's faListUl icon.
     */
    faListUl = faListUl;

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

    /**
     * Public method: toggleSheetNav.
     *
     * It emits the given boolean to the {@link toggleSheetNavRequest}
     * to toggle the sheet navigation.
     *
     * @returns {void} Emits the boolean.
     */
    toggleSheetNav(): void {
        this.toggleSheetNavRequest.emit(!this.isMinimized);
    }
}
