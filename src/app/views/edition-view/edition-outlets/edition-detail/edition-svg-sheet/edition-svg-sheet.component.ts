import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgSheet, EditionSvgOverlay } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-svg-sheet',
    templateUrl: './edition-svg-sheet.component.html',
    styleUrls: ['./edition-svg-sheet.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionSvgSheetComponent implements OnInit {
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Input()
    selectedOverlay: EditionSvgOverlay;
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectTextcriticRequest: EventEmitter<EditionSvgOverlay> = new EventEmitter();

    // init sheets
    // TODO: other solution possible?
    svgFile2 = 'Aa:SkI/2';
    svgFile3 = 'Aa:SkI/3';
    svgFile4 = 'Aa:SkI/4';
    svgFile5 = 'Aa:SkI/5';

    constructor() {}

    ngOnInit() {}

    isSelectedSvgSheet(id: string) {
        // compare sheet id's
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
