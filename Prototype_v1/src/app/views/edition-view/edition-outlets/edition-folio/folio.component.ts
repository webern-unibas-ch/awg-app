import { AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
    ConvoluteFolio,
    FolioFormatOptions,
    ConvoluteFolioSvgOutput,
    EditionSvgFile,
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
    @Input() convoluteData: ConvoluteFolio[];
    @Input() selectedSvgFile: EditionSvgFile;
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSvgFileRequest: EventEmitter<string> = new EventEmitter();

    folio: ConvoluteFolio;

    // output
    canvasArray = [];
    folioSvgOutputArray: ConvoluteFolioSvgOutput[] = [];
    vbArray: ViewBox[] = [];

    // colors
    bgColor: string = '#a3a3a3';
    fgColor: string = 'orange';

    // options
    private _folioFormatOptions: FolioFormatOptions = {
        factor: 1.5,
        formatX: 175,
        formatY: 270,
        initialOffsetX: 5,
        initialOffsetY: 5,
        numberOfFolios: 0
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
                // toggle active class if itemId corresponds to selectedSvgFileId
                const itemId = itemGroup.node.attributes.itemId.value;
                itemGroup.toggleClass('active', this.isSelectedSvgFile(itemId));
            });
        });
    }


    /**********
     * FolioSvgOutputData
     */
    prepareFolioSvgOutput(): void {
        for (let folioIndex = 0; folioIndex < this.convoluteData.length; folioIndex++) {

            // current folio
            this.folio = this.convoluteData[folioIndex];

            // prepare viewbox settings
            this.vbArray[folioIndex] = this.folioService.getViewBoxData(this.folioFormatOptions);

            // prepare output data
            this.folioSvgOutputArray[folioIndex] = this.folioService.getFolioSvgOutputData(this.folioFormatOptions, this.folio);
        }
    }


    /**********
     * rendering of SVG
     */
    renderSnapSvg() {

        // empty canvasArray
        this.canvasArray = [];

        /* apply values from folioSvgOutputArray to render the svg image with snapsvg */
        this.folioSvgOutputArray.forEach((folioSvg: ConvoluteFolioSvgOutput, folioIndex: number) => {

            // init canvas
            const snapId: string = '#folio-' + folioSvg.sheet.folioId;
            const snapCanvas: any = Snap(snapId);
            if (!snapCanvas) { return; }

            /**********
             * viewBox
             */
            this.folioService.setSvgViewBox(snapCanvas, this.vbArray[folioIndex]);

            /**********
             * svg content
             */
            this.folioService.renderSvg(snapCanvas, folioSvg, this.bgColor, this.fgColor, this.ref);

            this.canvasArray.push(snapCanvas);

        });
    }


    // getter function for format options
    get folioFormatOptions() {
        // prepare folio width & height
        this._folioFormatOptions.numberOfFolios = +this.convoluteData.length;
        this._folioFormatOptions.formatX = +this.folio.format.width;
        this._folioFormatOptions.formatY = +this.folio.format.height;

        return this._folioFormatOptions;
    }


    // helper function to compare id with that of selected sheet
    isSelectedSvgFile(id: string) {
        return id === this.selectedSvgFile.id;
    }

    // request function to emit modal id
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }


    // request function to emit selected sheet id
    selectSvgFile(id: string) {
        this.selectSvgFileRequest.emit(id);
    }





}

