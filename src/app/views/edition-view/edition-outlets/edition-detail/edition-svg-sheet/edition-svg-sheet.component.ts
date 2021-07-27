import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
    EditionSvgSheet,
    EditionSvgOverlay,
    EditionSvgSheetList,
    EditionSvgOverlayTypes,
} from '@awg-views/edition-view/models';

/**
 * The SvgSheetLabelsOp12 enumeration.
 *
 * It stores the possible sheet labels for op12.
 * TODO: Refactor temporary solution. Will be removed and created dynamically from data.
 */
export enum SvgSheetLabelsOp12 {
    SHEET_1 = 'Aa:SkI/1',
    SHEET_2 = 'Aa:SkI/2',
    SHEET_3 = 'Aa:SkI/3',
    SHEET_4 = 'Aa:SkI/4',
    SHEET_5 = 'Aa:SkI/5',
}

/**
 * The SvgSheetLabelsOp25 enumeration.
 *
 * It stores the possible sheet labels for op25.
 * TODO: Refactor temporary solution. Will be removed and created dynamically from data.
 */
export enum SvgSheetLabelsOp25 {
    SHEET_1 = 'A:SkI/1',
    SHEET_2 = 'A:SkI/2',
    SHEET_2_1 = 'A:SkI/2.1',
    SHEET_2_1_1 = 'A:SkI/2.1.1',
    SHEET_2_1_2 = 'A:SkI/2.1.2',
    SHEET_2_1_2_1 = 'A:SkI/2.1.2.1',
    SHEET_2_1_3 = 'A:SkI/2.1.3',
    SHEET_3 = 'A:SkI/3',
    SHEET_3_1 = 'A:SkI/3.1',
    SHEET_3_1_1 = 'A:SkI/3.1.1',
    SHEET_3_1_2 = 'A:SkI/3.1.2',
    SHEET_3_1_3 = 'A:SkI/3.1.3',
    SHEET_3_1_3_1 = 'A:SkI/3.1.3.1',
    SHEET_4_A = 'A:SkI/4a',
    SHEET_4_B = 'A:SkI/4b',
    SHEET_4_C = 'A:SkI/4c',
    SHEET_4_D = 'A:SkI/4d',
    SHEET_4_1 = 'A:SkI/4.1',
    SHEET_4_2 = 'A:SkI/4.2',
    SHEET_4_3 = 'A:SkI/4.3',
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionSvgSheetComponent implements OnInit {
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
     * TODO: Refactor temporary solution. Will be removed and created dynamically from data.
     */
    svgSheetLabels = {
        op12: {
            SHEET_1: SvgSheetLabelsOp12.SHEET_1,
            SHEET_2: SvgSheetLabelsOp12.SHEET_2,
            SHEET_3: SvgSheetLabelsOp12.SHEET_3,
            SHEET_4: SvgSheetLabelsOp12.SHEET_4,
            SHEET_5: SvgSheetLabelsOp12.SHEET_5,
        },
        op25: {
            SHEET_1: SvgSheetLabelsOp25.SHEET_1,
            SHEET_2: SvgSheetLabelsOp25.SHEET_2,
            SHEET_2_1: SvgSheetLabelsOp25.SHEET_2_1,
            SHEET_2_1_1: SvgSheetLabelsOp25.SHEET_2_1_1,
            SHEET_2_1_2: SvgSheetLabelsOp25.SHEET_2_1_2,
            SHEET_2_1_2_1: SvgSheetLabelsOp25.SHEET_2_1_2_1,
            SHEET_2_1_3: SvgSheetLabelsOp25.SHEET_2_1_3,
            SHEET_3: SvgSheetLabelsOp25.SHEET_3,
            SHEET_3_1: SvgSheetLabelsOp25.SHEET_3_1,
            SHEET_3_1_1: SvgSheetLabelsOp25.SHEET_3_1_1,
            SHEET_3_1_2: SvgSheetLabelsOp25.SHEET_3_1_2,
            SHEET_3_1_3: SvgSheetLabelsOp25.SHEET_3_1_3,
            SHEET_3_1_3_1: SvgSheetLabelsOp25.SHEET_3_1_3_1,
            SHEET_4_A: SvgSheetLabelsOp25.SHEET_4_A,
            SHEET_4_B: SvgSheetLabelsOp25.SHEET_4_B,
            SHEET_4_C: SvgSheetLabelsOp25.SHEET_4_C,
            SHEET_4_D: SvgSheetLabelsOp25.SHEET_4_D,
            SHEET_4_1: SvgSheetLabelsOp25.SHEET_4_1,
            SHEET_4_2: SvgSheetLabelsOp25.SHEET_4_2,
            SHEET_4_3: SvgSheetLabelsOp25.SHEET_4_3,
        },
    };

    /**
     * Public variable: sheetsArray.
     *
     * It keeps the array of of the svg sheets' labels.
     * TODO: Refactor temporary solution. Will be removed and created dynamically from data.
     */
    sheetsArray: string[];

    /**
     * Public variable: overlayTypes.
     *
     * It keeps the EditionSvgOverlayTypes to be accessed from template.
     */
    overlayTypes = EditionSvgOverlayTypes;

    /* TODO: mute for now since not working yet
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    */

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.sheetsArray = this.svgSheetsData.sheets.map(sheet => sheet.id);
    }

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
     * @param {EditionSvgOverlayTypes} type The given type of the svg overlay.
     * @param {string} id The given id of the svg overlay.
     * @returns {boolean} The boolean value of the comparison result.
     */
    isSelectedOverlay(type: EditionSvgOverlayTypes, id: string): boolean {
        if (!type || !id) {
            return;
        }
        const overlay = new EditionSvgOverlay(type, id);
        return JSON.stringify(overlay) === JSON.stringify(this.selectedOverlay);
    }

    /**
     * Public method: selectOverlay.
     *
     * It emits a given svg overlay
     * to the {@link selectOverlayRequest}.
     *
     * @param {EditionSvgOverlayTypes} type The given type of the svg overlay.
     * @param {string} id The given id of the svg overlay.
     * @returns {void} Emits the svg overlay.
     */
    selectOverlay(type: EditionSvgOverlayTypes, id: string): void {
        if (!type || !id) {
            return;
        }
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
        if (!id) {
            return;
        }
        this.selectSvgSheetRequest.emit(id);
    }
}
