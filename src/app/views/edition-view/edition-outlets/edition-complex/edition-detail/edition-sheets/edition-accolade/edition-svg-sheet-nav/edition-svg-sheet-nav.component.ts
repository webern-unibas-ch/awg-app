import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

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
})
export class EditionSvgSheetNavComponent {
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
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

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
