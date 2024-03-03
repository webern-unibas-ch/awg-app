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
    canvasArray: D3Selection[] = [];

    /**
     * Public variable: folioSvgDataArray.
     *
     * It keeps the array with the SVG data
     * needed to draw the SVG canvas of the folios.
     */
    folioSvgDataArray: FolioSvgData[] = [];

    /**
     * Public variable: viewBoxArray.
     *
     * It keeps the array with the
     * viewbox data for the folios.
     */
    viewBoxArray: ViewBox[] = [];

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

        // Check if data arrays have the same length
        if (this.viewBoxArray.length !== this.folioSvgDataArray.length) {
            return;
        }

        // Apply data to render the SVG image with d3.js
        this.folioSvgDataArray.forEach((folioSvgData: FolioSvgData, folioIndex: number) => {
            // Init canvas
            const svgId = `#folio-${this.selectedSvgSheet.id}-${folioSvgData.sheet.folioId}`;

            const svgCanvas: D3Selection = this._d3Select(svgId);

            if (svgCanvas.empty()) {
                return;
            }

            // Clear the SVG elements before redrawing
            svgCanvas.selectAll('*').remove();

            // SVG viewBox
            this.folioService.addViewBoxToSvgCanvas(svgCanvas, this.viewBoxArray[folioIndex]);

            // SVG content
            this.folioService.addFolioToSvgCanvas(svgCanvas, folioSvgData, this.ref);

            this.canvasArray.push(svgCanvas);
        });

        // Toggle active class
        this.toggleActiveClass();
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
        const partial = this.selectedSvgSheet?.content[0]?.partial || '';
        return id === `${this.selectedSvgSheet?.id}${partial}`;
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
        if (!id) {
            return;
        }
        this.openModalRequest.emit(id);
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
        // Reset folioSvgDataArray and viewBoxArray
        this.folioSvgDataArray = [];
        this.viewBoxArray = [];

        // If selectedConvolute or folios are undefined, return early
        if (!this.selectedConvolute?.folios) {
            return;
        }

        // Loop over folios of selected convolute
        this.folioSvgDataArray = this.selectedConvolute.folios.map((folio: Folio) => {
            // Create folio settings for each folio
            const folioSettings = {
                ...this._folioSettings,
                formatX: +folio.format.width,
                formatY: +folio.format.height,
                numberOfFolios: this.selectedConvolute.folios.length,
            };

            // Prepare viewbox settings by calculating the width and height for the viewBox string
            const viewBoxWidth = this._calculateViewBoxDimension(folioSettings, 'X');
            const viewBoxHeight = this._calculateViewBoxDimension(folioSettings, 'Y');

            this.viewBoxArray.push(new ViewBox(viewBoxWidth, viewBoxHeight));

            // Populate folioSvgData with calculated SVG data
            return this.folioService.getFolioSvgData(folioSettings, folio);
        });
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

    /**
     * Public method: toggleActiveClass.
     *
     * It toggles css class 'active' on a selected sheet
     * (canvas content-segment-group).
     *
     * @returns {void} Toggles the css class.
     */
    toggleActiveClass(): void {
        if (!this.canvasArray) {
            return;
        }

        this.canvasArray.forEach(canvas => {
            canvas.selectAll('.content-segment-group').classed('active', (d, i, nodes) => {
                const contentSegmentId = D3_SELECTION.select(nodes[i]).attr('contentSegmentId');
                return this.isSelectedSvgSheet(contentSegmentId);
            });
        });
    }

    /**
     * Private method: _calculateViewBoxDimension.
     *
     * It calculates the width and height for the viewBox string
     * based on the given folio settings.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {string} dimension The given dimension.
     *
     * @returns {number} The calculated dimension.
     */
    private _calculateViewBoxDimension(folioSettings: FolioSettings, dimension: string): number {
        const format = `format${dimension}`;
        const offset = `initialOffset${dimension}`;
        return (folioSettings[format] + 2 * folioSettings[offset]) * folioSettings.factor;
    }

    /**
     * Private method: _d3Select.
     *
     * It returns the D3 selection of a given selector.
     *
     * @param {string} selector The given selector.
     *
     * @returns {D3Selection} The D3 selection of the selector.
     */
    private _d3Select(selector: string) {
        return D3_SELECTION.select(selector);
    }
}
