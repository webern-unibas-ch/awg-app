import { AfterViewChecked, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import {
    FolioData,
    FolioFormatOptions,
    FolioSvgLine,
    FolioSvgOutput,
    FolioSvgOutputItem,
    ViewBox
} from '@awg-views/edition-view/models';
import { FolioService } from '../folio.service';

// embed SnapSvg (snapsvg.io)
declare var Snap: any;


@Component({
    selector: 'awg-edition-grid-svg',
    templateUrl: './folio-svg-grid.component.html',
    styleUrls: ['./folio-svg-grid.component.css']
})
export class FolioSvgGridComponent implements AfterViewChecked, OnChanges {
    @Input() folioFormatOptions: FolioFormatOptions;
    @Input() folioData: FolioData[];

    // init
    folioSvgOutputData: FolioSvgOutput[] = [];
    vb: ViewBox[] = [];

    // colors
    bgColor: string = '#a3a3a3';
    fgColor: string = 'red';

    constructor(private folioService: FolioService) { }

    ngOnChanges(changes: SimpleChanges) {
        this.prepareViewBoxData();
        this.prepareFolioSvgOutputData();
    }

    ngAfterViewChecked() {
        this.renderSnapSvg();
    }


    /**********
     * FolioSvgOutputData
     */
    prepareFolioSvgOutputData(): void {
        console.info('--- prepareFolioSvgOutputData ---');
        for (let sheetIndex = 0; sheetIndex < this.folioFormatOptions.numberOfSheets; sheetIndex++) {
            const numberOfSystems = parseInt(this.folioData[sheetIndex].systems, 10);
            if (isNaN(numberOfSystems)) { return; }

            this.folioFormatOptions.formatX = this.folioData[sheetIndex].format.width;
            this.folioFormatOptions.formatY = this.folioData[sheetIndex].format.height;

            this.vb[sheetIndex] = this.folioService.getViewBoxData(this.folioFormatOptions);

            this.folioSvgOutputData[sheetIndex] = this.folioService.getFolioSvgOutputData(this.folioFormatOptions, this.folioData[sheetIndex], numberOfSystems);
        }
        console.info('#folioSvgOutputData: ', this.folioSvgOutputData);
        console.log('--- /prepareFolioSvgOutputData ---');
    }


    /**********
     * viewBox
     */
    prepareViewBoxData(): void {
        console.info('--- prepareViewBoxData ---');
        // this.vb = this.folioService.getViewBoxData(this.folioFormatOptions);
        console.log('#viewBox: ', this.vb);
        console.log('--- /prepareViewBoxData ---');
    }


    /**********
     * rendering of SVG
     */
    renderSnapSvg() {
        console.info('--- renderSnapSvg ---');

        /* apply values from folioSvgOutputData to render the svg graphic with snapsvg */
        this.folioSvgOutputData.forEach((svgFolio: FolioSvgOutput, index: number) => {

            // init canvas and apply viewBox attributes
            const snapId: string = '#folio-' + svgFolio.sheet.folio;
            let snapCanvas: any = Snap(snapId);
            console.log(snapCanvas);
            if (!snapCanvas) { return; }


            /**********
             * viewBox
             */
            snapCanvas.attr({
                viewBox: this.vb[index].viewBox,
                width: this.vb[index].viewBoxWidth,
                height: this.vb[index].viewBoxHeight,
                version: '1.1',
                xmlns: 'http://www.w3.org/2000/svg',
                xlink: 'http://www.w3.org/1999/xlink',
                preserveAspectRatio: 'xMinYMin meet'
            });


            /**********
             * sheet
             */
            const snapSheetGroup: any = snapCanvas.group();
            this.folioService.renderSheet(snapCanvas, snapSheetGroup, svgFolio, this.bgColor);


            /**********
             * systems
             */
            this.folioService.renderSystems(snapCanvas, snapSheetGroup, svgFolio, this.bgColor);


            /**********
             * items
             */
            this.folioService.renderItems(snapCanvas, snapSheetGroup, svgFolio, this.fgColor);

        });

        console.info('--- /renderSnapSvg ---');
    }








}
