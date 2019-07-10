import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgSheet } from '@awg-views/edition-view/models';

/**
 * The EditionSvgSheetNav component.
 *
 * It contains the svg sheet navigation section
 * of the edition view of the app
 * and lets the user select an svg sheet.
 */
@Component({
    selector: 'awg-edition-svg-sheet-nav',
    templateUrl: './edition-svg-sheet-nav.component.html',
    styleUrls: ['./edition-svg-sheet-nav.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionSvgSheetNavComponent implements OnInit {
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
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}

    /**
     * Public method: isSelectedSvgSheet.
     *
     * It compares a given id with the id
     * of the latest selected svg sheet.
     *
     * @param {string} id The given sheet id.
     * @returns {boolean} The boolean value of the comparison result.
     */
    isSelectedSvgSheet(id: string): boolean {
        return id === this.selectedSvgSheet.id;
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
}
