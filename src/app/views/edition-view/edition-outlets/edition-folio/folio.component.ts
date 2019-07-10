import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';

import { Folio, FolioSettings, FolioSvgData, EditionSvgSheet, ViewBox } from '@awg-views/edition-view/models';
import { FolioService } from './folio.service';

/**
 * Declared variable: Snap.
 *
 * It provides access to the embedded SnapSvg library (see {@link snapsvg.io}).
 */
declare var Snap: any;

@Component({
    selector: 'awg-edition-folio',
    templateUrl: './folio.component.html',
    styleUrls: ['./folio.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolioComponent implements OnInit, AfterViewInit, AfterViewChecked {
    /**
     * Input variable: folios.
     *
     * It keeps the folio data.
     */
    @Input()
    folios: Folio[];

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

    canvasArray = [];
    folioSvgDataArray: FolioSvgData[] = [];
    vbArray: ViewBox[] = [];

    // colors
    bgColor = '#a3a3a3';
    fgColor = 'orange';

    // options
    private _folioSettings: FolioSettings = {
        factor: 1.5,
        formatX: 175,
        formatY: 270,
        initialOffsetX: 5,
        initialOffsetY: 5,
        numberOfFolios: 0
    };

    // getter function for format options
    get folioSettings() {
        return this._folioSettings;
    }

    set folioSettings(settings: FolioSettings) {
        this._folioSettings = settings;
    }

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: FolioComponent;

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
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.prepareFolioSvgOutput();
    }

    /**
     * Angular life cycle hook: ngAfterViewInit.
     *
     * It calls the containing methods
     * after the view was initialized.
     */
    ngAfterViewInit() {
        // start to render svg only after view, inputs and calculation are available
        this.renderSnapSvg();
    }

    /**
     * Angular life cycle hook: ngAfterViewChecked.
     *
     * It calls the containing methods
     * after the view was built and checked.
     */
    ngAfterViewChecked() {
        // apply active classes after view was checked
        this.applyActiveClass();
    }

    // helper function to toggle active class on selected sheet
    applyActiveClass() {
        // iterate over canvas Array
        if (!this.canvasArray) {
            return;
        }
        this.canvasArray.forEach(canvas => {
            // find all item groups
            canvas.selectAll('.item-group').forEach(itemGroup => {
                // toggle active class if itemId corresponds to selectedSvgSheetId
                const itemId = itemGroup.node.attributes.itemId.value;
                itemGroup.toggleClass('active', this.isSelectedSvgSheet(itemId));
            });
        });
    }

    /**
     * FolioSvgOutput
     */
    prepareFolioSvgOutput(): void {
        for (let folioIndex = 0; folioIndex < this.folios.length; folioIndex++) {
            // current folio
            const folio = this.folios[folioIndex];

            // update folio settings
            this.folioSettings = {
                factor: this.folioSettings.factor,
                formatX: +folio.format.width,
                formatY: +folio.format.height,
                initialOffsetX: this.folioSettings.initialOffsetX,
                initialOffsetY: this.folioSettings.initialOffsetY,
                numberOfFolios: +this.folios.length
            };

            // prepare viewbox settings
            this.vbArray[folioIndex] = new ViewBox(this.folioSettings);

            // calculate svg data
            this.folioSvgDataArray[folioIndex] = this.folioService.getFolioSvgData(this.folioSettings, folio);
        }
    }

    /**
     * rendering of SVG
     */
    renderSnapSvg() {
        // empty canvasArray
        this.canvasArray = [];

        /* apply data from folioSvgDataArray to render the svg image with snapsvg */
        this.folioSvgDataArray.forEach((folioSvg: FolioSvgData, folioIndex: number) => {
            // init canvas
            const snapId: string = '#folio-' + folioSvg.sheet.folioId;
            const snapCanvas: any = Snap(snapId);
            if (!snapCanvas) {
                return;
            }

            /**
             * svg viewBox
             */
            this.folioService.addViewBoxToSnapSvgCanvas(snapCanvas, this.vbArray[folioIndex]);

            /**
             * svg content
             */
            this.folioService.addFolioToSnapSvgCanvas(snapCanvas, folioSvg, this.bgColor, this.fgColor, this.ref);

            this.canvasArray.push(snapCanvas);
        });
    }

    // helper function to compare id with that of selected sheet
    isSelectedSvgSheet(id: string) {
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
    openModal(id: string) {
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
    selectSvgSheet(id: string) {
        this.selectSvgSheetRequest.emit(id);
    }
}
