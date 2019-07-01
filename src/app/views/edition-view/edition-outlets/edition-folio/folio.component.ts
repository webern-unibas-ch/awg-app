import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
    styleUrls: ['./folio.component.css']
})
export class FolioComponent implements OnInit, AfterViewInit, AfterViewChecked {
    @Input()
    convoluteData: Folio[];
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    folio: Folio;

    // output
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

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: FolioComponent;

    constructor(private folioService: FolioService) {
        this.ref = this;
    }

    ngOnInit() {
        this.prepareFolioSvgOutput();
    }

    ngAfterViewInit() {
        // start to render svg only after view, inputs and calculation are available
        this.renderSnapSvg();
    }

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
        for (let folioIndex = 0; folioIndex < this.convoluteData.length; folioIndex++) {
            // current folio
            this.folio = this.convoluteData[folioIndex];

            // prepare viewbox settings
            this.vbArray[folioIndex] = new ViewBox(this.folioSettings);

            // calculate svg data
            this.folioSvgDataArray[folioIndex] = this.folioService.getFolioSvgData(this.folioSettings, this.folio);
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

    // getter function for format options
    get folioSettings() {
        // prepare folio width & height
        this._folioSettings.numberOfFolios = +this.convoluteData.length;
        this._folioSettings.formatX = +this.folio.format.width;
        this._folioSettings.formatY = +this.folio.format.height;

        return this._folioSettings;
    }

    // helper function to compare id with that of selected sheet
    isSelectedSvgSheet(id: string) {
        return id === this.selectedSvgSheet.id;
    }

    // request function to emit modal id
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }

    // request function to emit selected sheet id
    selectSvgSheet(id: string) {
        this.selectSvgSheetRequest.emit(id);
    }
}
