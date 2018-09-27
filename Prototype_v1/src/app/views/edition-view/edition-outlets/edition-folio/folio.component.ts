import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
    Folio,
    FolioFormatOptions,
    FolioSvgOutput,
    Sheet,
    ViewBox
} from '@awg-views/edition-view/models';
import { FolioService } from './folio.service';

// embedded SnapSvg (snapsvg.io)
declare var Snap: any;


@Component({
    selector: 'awg-edition-folio',
    templateUrl: './folio.component.html',
    styleUrls: ['./folio.component.css']
})
export class FolioComponent implements OnInit, AfterViewInit, AfterViewChecked {
    @Input() folioData: Folio[];
    @Input() selectedSheet: Sheet;
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();

    // output
    folioSvgOutput: FolioSvgOutput[] = [];
    folio: Folio;
    vb: ViewBox[] = [];
    canvasArray = [];

    // colors
    bgColor: string = '#a3a3a3';
    fgColor: string = 'orange';

    // options
    private _folioFormatOptions: FolioFormatOptions = {
        factor: 2,
        formatX: 175,
        formatY: 270,
        initialOffsetX: 5,
        initialOffsetY: 5,
        numberOfSheets: 0
    };

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
        if (!this.canvasArray) { return; }
        this.canvasArray.forEach(canvas => {
            // find all item groups
            canvas.selectAll('.item-group').forEach(itemGroup => {
                // toggle active class if itemId corresponds to selectedSheetId
                const itemId = itemGroup.node.attributes.itemId.value;
                itemGroup.toggleClass('active', this.isSelectedSheet(itemId));
            });
        });
    }


    /**********
     * FolioSvgOutputData
     */
    prepareFolioSvgOutput(): void {
        for (let folioIndex = 0; folioIndex < this.folioData.length; folioIndex++) {

            // current folio
            this.folio = this.folioData[folioIndex];

            // prepare viewbox settings
            this.vb[folioIndex] = this.folioService.getViewBoxData(this.folioFormatOptions);

            // prepare output data
            this.folioSvgOutput[folioIndex] = this.folioService.getFolioSvgOutputData(this.folioFormatOptions, this.folio);
        }
    }


    /**********
     * rendering of SVG
     */
    renderSnapSvg() {

        // empty canvasArray
        this.canvasArray = [];

        /* apply values from folioSvgOutput to render the svg image with snapsvg */
        this.folioSvgOutput.forEach((svgFolio: FolioSvgOutput, folioIndex: number) => {

            // init canvas
            const snapId: string = '#folio-' + svgFolio.sheet.folio;
            const snapCanvas: any = Snap(snapId);
            if (!snapCanvas) { return; }


            /**********
             * viewBox
             */
            this.folioService.setSvgViewBox(snapCanvas, this.vb[folioIndex]);


            /**********
             * svg content
             */
            this.folioService.renderSvg(snapCanvas, svgFolio, this.bgColor, this.fgColor, this.ref);

            this.canvasArray.push(snapCanvas);
        });
    }


    // getter function for format options
    get folioFormatOptions() {
        // prepare folio width & height
        this._folioFormatOptions.numberOfSheets = +this.folioData.length;
        this._folioFormatOptions.formatX = +this.folio.format.width;
        this._folioFormatOptions.formatY = +this.folio.format.height;

        return this._folioFormatOptions;
    }


    // helper function to compare id with that of selected sheet
    isSelectedSheet(id: string) {
        return id === this.selectedSheet.id;
    }

    // request function to emit modal id
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }


    // request function to emit selected sheet id
    selectSheet(id: string) {
        this.selectSheetRequest.emit(id);
    }





}

