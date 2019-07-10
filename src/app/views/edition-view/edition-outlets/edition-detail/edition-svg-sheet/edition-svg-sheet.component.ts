import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgSheet, EditionSvgOverlay } from '@awg-views/edition-view/models';

/**
 * The SvgSheetLabels enumeration.
 *
 * It stores the possible sheet labels.
 */
export enum SvgSheetLabels {
    sheet2 = 'Aa:SkI/2',
    sheet3 = 'Aa:SkI/3',
    sheet4 = 'Aa:SkI/4',
    sheet5 = 'Aa:SkI/5'
}

/**
 * The EditionSvgSheet component.
 *
 * It contains the svg sheet section
 * of the edition view of the app
 * and displays a selected svg sheet.
 */
@Component({
    selector: 'awg-edition-svg-sheet',
    templateUrl: './edition-svg-sheet.component.html',
    styleUrls: ['./edition-svg-sheet.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionSvgSheetComponent implements OnInit {
    /**
     * Input variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input()
    selectedSvgSheet: EditionSvgSheet;

    /**
     * Input variable: selectedOverlay.
     *
     * It keeps the selected svg overlay.
     */
    @Input()
    selectedOverlay: EditionSvgOverlay;

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: selectOverlayRequest.
     *
     * It keeps an event emitter for the selected textcritics.
     */
    @Output()
    selectOverlayRequest: EventEmitter<EditionSvgOverlay> = new EventEmitter();

    /**
     * Public variable: svgSheetLabels.
     *
     * It keeps the labels of the svg sheets.
     */
    svgSheetLabels = {
        sheet2: SvgSheetLabels.sheet2,
        sheet3: SvgSheetLabels.sheet3,
        sheet4: SvgSheetLabels.sheet4,
        sheet5: SvgSheetLabels.sheet5
    };

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
     * Public method: isSelectedOverlay.
     *
     * It compares a given svg overlay with
     * the latest selected svg overlay.
     *
     * @param {string} type The given type of the svg overlay.
     * @param {string} id The given id of the svg overlay.
     * @returns {boolean} The boolean value of the comparison result.
     */
    isSelectedOverlay(type: any, id: string): boolean {
        const overlay = new EditionSvgOverlay(type, id);
        return JSON.stringify(overlay) === JSON.stringify(this.selectedOverlay);
    }

    /**
     * Public method: selectOverlay.
     *
     * It emits a given svg overlay
     * to the {@link selectOverlayRequest}.
     *
     * @param {string} type The given type of the svg overlay.
     * @param {string} id The given id of the svg overlay.
     * @returns {void} Emits the svg overlay.
     */
    selectOverlay(type: any, id: string): void {
        const overlay = new EditionSvgOverlay(type, id);
        this.selectOverlayRequest.emit(overlay);
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
