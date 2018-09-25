import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';

import {
    Folio,
    FolioFormatOptions,
    FolioSvgOutput,
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
export class FolioComponent implements OnInit, AfterViewChecked {
    @Input() folioData: Folio[];

    // init
    folioSvgOutput: FolioSvgOutput[] = [];
    folio: Folio;
    vb: ViewBox[] = [];

    // colors
    bgColor: string = '#a3a3a3';
    fgColor: string = 'red';

    // options
    private _folioFormatOptions: FolioFormatOptions = {
        factor: 1,
        formatX: 175,
        formatY: 270,
        initialOffsetX: 50,
        initialOffsetY: 35,
        numberOfSheets: 0
    };

    constructor(private folioService: FolioService) { }


    ngOnInit() {
        this.prepareFolioSvgOutput();
    }


    ngAfterViewChecked() {
        this.renderSnapSvg();
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
            this.folioService.renderSvg(snapCanvas, svgFolio, this.bgColor, this.fgColor);
        });
    }


    get folioFormatOptions() {
        // prepare folio width & height
        this._folioFormatOptions.numberOfSheets = +this.folioData.length;
        this._folioFormatOptions.formatX = +this.folio.format.width;
        this._folioFormatOptions.formatY = +this.folio.format.height;

        return this._folioFormatOptions;
    }

}

