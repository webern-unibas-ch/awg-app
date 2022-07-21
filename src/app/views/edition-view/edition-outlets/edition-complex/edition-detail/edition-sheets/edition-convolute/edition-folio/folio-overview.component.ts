import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core';

import {
    Folio,
    FolioSettings,
    FolioSvgData,
    EditionSvgSheet,
    ViewBox,
    FolioConvolute,
} from '@awg-views/edition-view/models';
import { FolioService } from './folio.service';

/**
 * Declared variable: Snap.
 *
 * It provides access to the embedded SnapSvg library (see snapsvg.io).
 */
declare let Snap: any;

/**
 * The Folio component.
 *
 * It contains the folio section
 * of the edition view of the app
 * and displays the convolute folios.
 */
@Component({
    selector: 'awg-edition-folio',
    templateUrl: './folio-overview.component.html',
    styleUrls: ['./folio-overview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolioOverviewComponent implements OnChanges, AfterViewChecked {
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
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public variable: canvasArray.
     *
     * It keeps the array with a Snap canvas per folio.
     */
    canvasArray = [];

    /**
     * Public variable: folioSvgDataArray.
     *
     * It keeps the array with the svg data
     * needed to draw the Snap canvas of the folios.
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
    ref: FolioOverviewComponent;

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
    ngOnChanges() {
        this.prepareFolioSvgOutput();
    }

    /**
     * Angular life cycle hook: ngAfterViewChecked.
     *
     * It calls the containing methods
     * after the view was built and checked.
     */
    ngAfterViewChecked() {
        // Start to render svg only after view, inputs and calculation are available
        this.renderSnapSvg();
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
     * Public method: prepareFolioSvgOutput.
     *
     * It prepares the viewbox and svg data for all folios
     * to render the folio svg object (SnapCanvas).
     *
     * @returns {void} Sets the vbArray and folioSvgDataArray variable.
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

            // Prepare viewbox settings
            this.vbArray[folioIndex] = new ViewBox(this.folioSettings);

            // Populate folioSvgDataArray with calculated svg data
            this.folioSvgDataArray[folioIndex] = this.folioService.getFolioSvgData(this.folioSettings, folio);
        });
    }

    /**
     * Public method: renderSnapSvg.
     *
     * It provides the folio viewbox and svg data
     * to the SnapCanvas to render the folios.
     *
     * @returns {void} Sets the canvasArray variable.
     */
    renderSnapSvg(): void {
        // Empty canvasArray
        this.canvasArray = [];

        /* Apply data from folioSvgDataArray to render the svg image with snapsvg */
        this.folioSvgDataArray.forEach((folioSvg: FolioSvgData, folioIndex: number) => {
            // Init canvas
            const snapId: string = '#folio-' + folioSvg.sheet.folioId;
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
