import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UtilityService } from '@awg-app/core/services';
import { EditionSvgSheet } from '@awg-app/views/edition-view/models';

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
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

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
