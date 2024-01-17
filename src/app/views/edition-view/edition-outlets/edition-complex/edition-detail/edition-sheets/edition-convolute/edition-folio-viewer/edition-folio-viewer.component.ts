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
    EditionSvgSheet,
    Folio,
    FolioConvolute,
    FolioSettings,
    FolioSvgData,
    ViewBox,
} from '@awg-views/edition-view/models';
import { FolioService } from './folio.service';

/**
 * Declared variable: Snap.
 *
 * It provides access to the embedded SnapSvg library (see snapsvg.io).
 */
declare let Snap: any;

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
     * It keeps the selected svg sheet.
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
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

    /**
     * Public variable: canvasArray.
     *
     * It keeps the array with a Snap canvas per folio.
     */
    canvasArray = [];

    /**
     * Public variable: folioSvgData.
     *
     * It keeps the array with the svg data
     * needed to draw the Snap canvas of the folios.
     */
    folioSvgData: FolioSvgData[] = [];

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
        // Start to create svg canvas only after view, inputs and calculation are available
        this.createSVGCanvas();
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
        let partial = '';
        if (this.selectedSvgSheet.content[0].partial) {
            partial = this.selectedSvgSheet.content[0].partial;
        }
        return id === this.selectedSvgSheet.id + partial;
    }

    /**
     * Public method: prepareFolioSvgOutput.
     *
     * It prepares the viewbox and svg data for all folios
     * to render the folio svg object (SnapCanvas).
     *
     * @returns {void} Sets the vbArray and folioSvgData.
     */
    prepareFolioSvgOutput(): void {
        // Reset folioSvgData
        this.folioSvgData = [];

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

            // Populate folioSvgData with calculated svg data
            this.folioSvgData[folioIndex] = this.folioService.getFolioSvgData(this.folioSettings, folio);
        });
    }

    /**
     * Public method: createSVGCanvas.
     *
     * It provides the folio viewbox and svg data
     * to the SnapCanvas.
     *
     * @returns {void} Creates the SVG canvas.
     */
    createSVGCanvas(): void {
        // Empty canvasArray
        this.canvasArray = [];

        /* Apply data from folioSvgData to render the svg image with snapsvg */
        this.folioSvgData.forEach((folioSvg: FolioSvgData, folioIndex: number) => {
            // Init canvas
            const snapId: string = '#folio-' + this.selectedSvgSheet.id + '-' + folioSvg.sheet.folioId;
            const snapCanvas: any = Snap(snapId);
            if (!snapCanvas) {
                return;
            }

            // Svg viewBox
            this.folioService.addViewBoxToSnapSvgCanvas(snapCanvas, this.vbArray[folioIndex]);

            // Svg content
            this.folioService.addFolioToSnapSvgCanvas(snapCanvas, folioSvg, this.bgColor, this.fgColor, this.ref);

            this.canvasArray.push(snapCanvas);
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
            canvas.selectAll('.item-group').forEach(itemGroup => {
                // Toggle active class if itemId corresponds to selectedSvgSheetId
                const itemId = itemGroup.node.attributes.itemId.value;
                itemGroup.toggleClass('active', this.isSelectedSvgSheet(itemId));
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
