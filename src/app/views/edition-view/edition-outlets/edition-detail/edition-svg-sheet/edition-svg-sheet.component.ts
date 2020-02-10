import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// import { NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { EditionSvgSheet, EditionSvgOverlay, EditionSvgSheetList } from '@awg-views/edition-view/models';

/**
 * The SvgSheetLabelsOp12 enumeration.
 *
 * It stores the possible sheet labels for op12.
 * TODO: Refactor temporary solution. Will be removed and created dynamically from data.
 */
export enum SvgSheetLabelsOp12 {
    sheet1 = 'Aa:SkI/1',
    sheet2 = 'Aa:SkI/2',
    sheet3 = 'Aa:SkI/3',
    sheet4 = 'Aa:SkI/4',
    sheet5 = 'Aa:SkI/5'
}

/**
 * The SvgSheetLabelsOp25 enumeration.
 *
 * It stores the possible sheet labels for op25.
 * TODO: Refactor temporary solution. Will be removed and created dynamically from data.
 */
export enum SvgSheetLabelsOp25 {
    sheet1 = 'A:SkI/1',
    sheet2 = 'A:SkI/2',
    sheet2_1 = 'A:SkI/2.1',
    sheet2_1_1 = 'A:SkI/2.1.1',
    sheet2_1_2 = 'A:SkI/2.1.2',
    sheet2_1_2_1 = 'A:SkI/2.1.2.1',
    sheet2_1_3 = 'A:SkI/2.1.3',
    sheet3 = 'A:SkI/3',
    sheet3_1 = 'A:SkI/3.1',
    sheet3_1_1 = 'A:SkI/3.1.1',
    sheet3_1_2 = 'A:SkI/3.1.2',
    sheet3_1_3 = 'A:SkI/3.1.3',
    sheet3_1_3_1 = 'A:SkI/3.1.3.1',
    sheet4a = 'A:SkI/4a',
    sheet4b = 'A:SkI/4b',
    sheet4c = 'A:SkI/4c',
    sheet4d = 'A:SkI/4d',
    sheet4_1 = 'A:SkI/4.1',
    sheet4_2 = 'A:SkI/4.2',
    sheet4_3 = 'A:SkI/4.3'
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
            sheet1: SvgSheetLabelsOp12.sheet1,
            sheet2: SvgSheetLabelsOp12.sheet2,
            sheet3: SvgSheetLabelsOp12.sheet3,
            sheet4: SvgSheetLabelsOp12.sheet4,
            sheet5: SvgSheetLabelsOp12.sheet5
        },
        op25: {
            sheet1: SvgSheetLabelsOp25.sheet1,
            sheet2: SvgSheetLabelsOp25.sheet2,
            sheet2_1: SvgSheetLabelsOp25.sheet2_1,
            sheet2_1_1: SvgSheetLabelsOp25.sheet2_1_1,
            sheet2_1_2: SvgSheetLabelsOp25.sheet2_1_2,
            sheet2_1_2_1: SvgSheetLabelsOp25.sheet2_1_2_1,
            sheet2_1_3: SvgSheetLabelsOp25.sheet2_1_3,
            sheet3: SvgSheetLabelsOp25.sheet3,
            sheet3_1: SvgSheetLabelsOp25.sheet3_1,
            sheet3_1_1: SvgSheetLabelsOp25.sheet3_1_1,
            sheet3_1_2: SvgSheetLabelsOp25.sheet3_1_2,
            sheet3_1_3: SvgSheetLabelsOp25.sheet3_1_3,
            sheet3_1_3_1: SvgSheetLabelsOp25.sheet3_1_3_1,
            sheet4a: SvgSheetLabelsOp25.sheet4a,
            sheet4b: SvgSheetLabelsOp25.sheet4b,
            sheet4c: SvgSheetLabelsOp25.sheet4c,
            sheet4d: SvgSheetLabelsOp25.sheet4d,
            sheet4_1: SvgSheetLabelsOp25.sheet4_1,
            sheet4_2: SvgSheetLabelsOp25.sheet4_2,
            sheet4_3: SvgSheetLabelsOp25.sheet4_3
        }
    };

    /**
     * Public variable: sheetsArray.
     *
     * It keeps the array of of the svg sheets' labels.
     * TODO: Refactor temporary solution. Will be removed and created dynamically from data.
     */
    sheetsArray: string[];

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

        /*
        TODO: mute for now since not working yet
        this.galleryOptions = [
            {
                width: '100%',
                height: '600px',
                imageSize: 'contain',
                thumbnailsColumns: 4,
                previewCloseOnClick: true,
                previewCloseOnEsc: true,
                previewZoom: true,
                previewRotate: true,
                linkTarget: '_blank'
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];

        this.galleryImages = [2, 3, 4, 5].map(fileNumber => {
            const fileName = `assets/img/edition/series1/section5/op12/SkI_${fileNumber}n_small_cut_opt.svg`;
            return {
                small: fileName,
                medium: fileName,
                big: fileName,
                url: fileName
            };
        });
        */
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
