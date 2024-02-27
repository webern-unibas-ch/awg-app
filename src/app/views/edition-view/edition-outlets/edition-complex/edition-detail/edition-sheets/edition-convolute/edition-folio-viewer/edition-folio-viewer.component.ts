import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';

import {
    D3Selection,
    EditionSvgSheet,
    Folio,
    FolioConvolute,
    FolioSettings,
    FolioSvgData,
    ViewBox,
} from '@awg-views/edition-view/models';
import { FolioService } from './folio.service';

import * as D3_SELECTION from 'd3-selection';

/**
 * The EditionFolioViewer component.
 *
 * It contains the folio section
 * of the edition view of the app
 * and displays the convolute folios.
 */
@Component({
    selector: 'awg-edition-folio-viewer',
    templateUrl: './edition-folio-viewer.component.html',
    styleUrls: ['./edition-folio-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionFolioViewerComponent implements OnChanges, AfterViewChecked {
    /**
     * Input variable: selectedConvolute.
     *
     * It keeps the selected convolute.
     */
    @Input()
    selectedConvolute: FolioConvolute;

    /**
     * Public variable: selectedSvgSheet.
     *
     * It keeps the selected SVG sheet.
     */
    @Input()
    selectedSvgSheet: EditionSvgSheet;

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
     * It keeps an event emitter for the selected ids of an edition complex and SVG sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

    /**
     * Public variable: canvasArray.
     *
     * It keeps the array with a SVG canvas per folio.
     */
    canvasArray = [];

    /**
     * Public variable: folioSvgDataArray.
     *
     * It keeps the array with the SVG data
     * needed to draw the SVG canvas of the folios.
     */
    folioSvgDataArray: FolioSvgData[] = [];

    /**
     * Public variable: vbArray.
     *
     * It keeps the array with the
     * viewbox data for the folios.
     */
    vbArray: ViewBox[] = [];

    /**
     * Public variable: bgColor.
     *
     * It keeps the background color for the folio.
     */
    bgColor = '#a3a3a3';

    /**
     * Public variable: fgColor.
     *
     * It keeps the foreground color for the folio.
     */
    fgColor = 'orange';

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: EditionFolioViewerComponent;

    /**
     * Private variable: _folioSettings.
     *
     * It keeps the format settings for the folio.
     */
    private _folioSettings: FolioSettings = {
        factor: 1.5,
        formatX: 175,
        formatY: 270,
        initialOffsetX: 5,
        initialOffsetY: 5,
        numberOfFolios: 0,
    };

    /**
     * Constructor of the FolioComponent.
     *
     * It declares a private {@link FolioService} instance
     * and initializes the self-referring ref variable
     * needed for CompileHtml library.
     *
     * @param {FolioService} folioService Instance of the FolioService.
     */
    constructor(private folioService: FolioService) {
        this.ref = this;
    }

    /**
     * Getter for folio format settings.
     */
    get folioSettings() {
        return this._folioSettings;
    }

    /**
     * Setter for folio format settings.
     */
    set folioSettings(settings: FolioSettings) {
        this._folioSettings = settings;
    }

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedConvolute']) {
            this.prepareFolioSvgOutput();
        }
    }

    /**
     * Angular life cycle hook: ngAfterViewChecked.
     *
     * It calls the containing methods
     * after the view was checked.
     */
    ngAfterViewChecked() {
        // Start to create SVG canvas only after view, inputs and calculation are available
        this.createSVGCanvas();
    }

    /**
     * Public method: isSelectedSvgSheet.
     *
     * It compares a given id with the id
     * of the latest selected SVG sheet.
     *
     * @param {string} id The given sheet id.
     * @returns {boolean} The boolean value of the comparison result.
     */
    isSelectedSvgSheet(id: string): boolean {
        let partial = '';
        if (this.selectedSvgSheet.content[0].partial) {
            partial = this.selectedSvgSheet.content[0].partial;
        }
        return id === this.selectedSvgSheet.id + partial;
    }

    /**
     * Public method: prepareFolioSvgOutput.
     *
     * It prepares the viewbox and SVG data for all folios
     * to render the folio SVG canvas.
     *
     * @returns {void} Sets the vbArray and folioSvgData.
     */
    prepareFolioSvgOutput(): void {
        // Reset folioSvgDataArray
        this.folioSvgDataArray = [];

        // Loop over folios of selected convolute
        this.selectedConvolute.folios.forEach((folio: Folio, folioIndex: number) => {
            // Update folio settings
            this.folioSettings = {
                factor: this.folioSettings.factor,
                formatX: +folio.format.width,
                formatY: +folio.format.height,
                initialOffsetX: this.folioSettings.initialOffsetX,
                initialOffsetY: this.folioSettings.initialOffsetY,
                numberOfFolios: +this.selectedConvolute.folios.length,
            };

            // Prepare viewbox settings by calculating the width and height for the viewBox string
            const vbWidth =
                (this.folioSettings.formatX + 2 * this.folioSettings.initialOffsetX) * this.folioSettings.factor;
            const vbHeight =
                (this.folioSettings.formatY + 2 * this.folioSettings.initialOffsetY) * this.folioSettings.factor;

            this.vbArray[folioIndex] = new ViewBox(vbWidth, vbHeight);

            // Populate folioSvgData with calculated SVG data
            this.folioSvgDataArray[folioIndex] = this.folioService.getFolioSvgData(this.folioSettings, folio);
        });
    }

    /**
     * Public method: createSVGCanvas.
     *
     * It provides the folio viewbox and folioSVG data
     * to the SVG canvas.
     *
     * @returns {void} Creates the SVG canvas.
     */
    createSVGCanvas(): void {
        // Empty canvasArray
        this.canvasArray = [];

        // Apply data from folioSvgData to render the SVG image with d3.js
        this.folioSvgDataArray.forEach((folioSvgData: FolioSvgData, folioIndex: number) => {
            // Init canvas
            const svgId: string = '#folio-' + this.selectedSvgSheet.id + '-' + folioSvgData.sheet.folioId;

            const svgCanvas: D3Selection = D3_SELECTION.select(svgId);
            if (svgCanvas.empty()) {
                return;
            }

            // Clear the SVG elements before redrawing
            svgCanvas.selectAll('*').remove();

            // SVG viewBox
            this.folioService.addViewBoxToSvgCanvas(svgCanvas, this.vbArray[folioIndex]);

            // SVG content
            this.folioService.addFolioToSvgCanvas(svgCanvas, folioSvgData, this.bgColor, this.fgColor, this.ref);

            this.canvasArray.push(svgCanvas);
        });

        // Toggle active classes after view was checked
        this.toggleActiveClass();
    }

    /**
     * Public method: toggleActiveClass.
     *
     * It toggles css class 'active' on a selected sheet
     * (canvas item-group).
     *
     * @returns {void} Toggles the css class.
     */
    toggleActiveClass(): void {
        // Iterate over canvas Array
        if (!this.canvasArray) {
            return;
        }
        this.canvasArray.forEach(canvas => {
            // Find all item groups
            canvas.selectAll('.item-group').each((_d, i, groups) => {
                // Toggle active class if itemId corresponds to selectedSvgSheetId
                const itemGroup = D3_SELECTION.select(groups[i]);
                const itemId = itemGroup.attr('itemId');
                itemGroup.classed('active', this.isSelectedSvgSheet(itemId));
            });
        });
    }

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Emits the id.
     */
    openModal(id: string): void {
        this.openModalRequest.emit(id);
    }

    /**
     * Public method: selectSvgSheet.
     *
     * It emits the given ids of a selected edition complex
     * and SVG sheet to the {@link selectSvgSheetRequest}.
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
