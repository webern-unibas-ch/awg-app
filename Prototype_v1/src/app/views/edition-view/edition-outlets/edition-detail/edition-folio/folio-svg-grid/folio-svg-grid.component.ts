import { AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import {
    FolioData,
    FolioFormatOptions,
    FolioSvgOutput,
    ViewBox
} from '@awg-views/edition-view/models';
import { FolioService } from '../folio.service';

// embedded SnapSvg (snapsvg.io)
declare var Snap: any;


@Component({
    selector: 'awg-edition-grid-svg',
    templateUrl: './folio-svg-grid.component.html',
    styleUrls: ['./folio-svg-grid.component.css']
})
export class FolioSvgGridComponent implements AfterViewChecked, OnInit {
    @Input() folioData: FolioData[];
    @Input() folioFormatOptions: FolioFormatOptions;

    // init
    folioSvgOutputData: FolioSvgOutput[] = [];
    vb: ViewBox[] = [];

    // colors
    bgColor: string = '#a3a3a3';
    fgColor: string = 'red';

    constructor(private folioService: FolioService) { }


    ngOnInit() {
        this.prepareFolioSvgOutputData();
    }


    ngAfterViewChecked() {
        this.renderSnapSvg();
    }


    /**********
     * FolioSvgOutputData
     */
    prepareFolioSvgOutputData(): void {
        for (let sheetIndex = 0; sheetIndex < this.folioFormatOptions.numberOfSheets; sheetIndex++) {

            // prepare number of systems
            const numberOfSystems = parseInt(this.folioData[sheetIndex].systems, 10);
            if (isNaN(numberOfSystems)) { return; }

            // prepare folio width & height
            this.folioFormatOptions.formatX = +this.folioData[sheetIndex].format.width;
            this.folioFormatOptions.formatY = +this.folioData[sheetIndex].format.height;

            // prepare viewbox settings
            this.vb[sheetIndex] = this.folioService.getViewBoxData(this.folioFormatOptions);

            // prepare output data
            this.folioSvgOutputData[sheetIndex] = this.folioService.getFolioSvgOutputData(this.folioFormatOptions, this.folioData[sheetIndex], numberOfSystems);
        }
    }


    /**********
     * rendering of SVG
     */
    renderSnapSvg() {

        /* apply values from folioSvgOutputData to render the svg image with snapsvg */
        this.folioSvgOutputData.forEach((svgFolio: FolioSvgOutput, folioIndex: number) => {

            // init canvas and apply viewBox attributes
            const snapId: string = '#folio-' + svgFolio.sheet.folio;
            let snapCanvas: any = Snap(snapId);
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


}
