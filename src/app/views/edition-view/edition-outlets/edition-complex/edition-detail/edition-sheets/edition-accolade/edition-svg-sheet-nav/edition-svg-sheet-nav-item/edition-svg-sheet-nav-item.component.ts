import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilityService } from '@awg-app/core/services';
import { EditionSvgSheet } from '@awg-app/views/edition-view/models';

/**
 * The EditionSvgSheetNavItem component.
 *
 * It contains an item of the svg sheet navigation section
 * of the edition view of the app
 * and lets the user select an SVG sheet of a specific edition type.
 */
@Component({
    selector: 'awg-edition-svg-sheet-nav-item',
    templateUrl: './edition-svg-sheet-nav-item.component.html',
    styleUrls: ['./edition-svg-sheet-nav-item.component.scss'],
})
export class EditionSvgSheetNavItemComponent {
    /**
     * Input variable: navItemLabel.
     *
     * It keeps the label of the nav item.
     */
    @Input()
    navItemLabel: string;

    /**
     * Input variable: svgSheets.
     *
     * It keeps the svg sheets.
     */
    @Input()
    svgSheets: EditionSvgSheet[];

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
     * Constructor of the EditionSvgSheetNavItemComponent.
     *
     * It declares a public instance of the UtilityService.
     *
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(public utils: UtilityService) {}

    /**
     * Public method: isSelectedSvgSheet.
     *
     * It compares a given id (optionally with a partial) with the id
     * of the latest selected svg sheet.
     *
     * @param {string} id The given sheet id.
     * @param {string} [partial] The optional given partial id.
     *
     * @returns {boolean} The boolean value of the comparison result.
     */
    isSelectedSvgSheet(id: string, partial?: string): boolean {
        let givenId = id;
        let selectedId = this.selectedSvgSheet.id;

        // Compare partial id if needed
        if (partial && this.selectedSvgSheet.content?.[0]?.partial) {
            givenId += partial;
            selectedId += this.selectedSvgSheet.content[0].partial;
        }

        return givenId === selectedId;
    }

    /**
     * Public method: selectSvgSheet.
     *
     * It emits the given ids of a selected edition complex
     * and svg sheet to the {@link selectSvgSheetRequest}.
     *
     * @param {string} complexId The given complex id.
     * @param {string} sheetId The given sheet id.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(complexId: string, sheetId: string): void {
        if (!sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit({ complexId: complexId, sheetId: sheetId });
    }
}
