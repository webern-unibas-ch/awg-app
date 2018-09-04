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
    vb: ViewBox;

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
        this.vb = this.folioService.getViewBoxData(this.folioFormatOptions);
        console.log('#viewBox: ', this.vb);
        console.log('--- /prepareViewBoxData ---');
    }



    renderSnapSvg() {
        console.info('--- renderSnapSvg ---');

        /* apply values from folioSvgOutputData to render the svg graphic with snapsvg */
        this.folioSvgOutputData.forEach((svgFolio: FolioSvgOutput) => {

            // init canvas and apply viewBox attributes
            const snapId: string = '#folio-' + svgFolio.sheet.folio;
            let snapCanvas: any = Snap(snapId);
            console.log(snapCanvas);
            if (!snapCanvas) { return; }


            /**********
             * viewBox
             */
            snapCanvas.attr({
                viewBox: this.vb.viewBox,
                width: this.vb.viewBoxWidth,
                height: this.vb.viewBoxHeight,
                version: '1.1',
                xmlns: 'http://www.w3.org/2000/svg',
                xlink: 'http://www.w3.org/1999/xlink',
                preserveAspectRatio: 'xMinYMin meet'
            });


            /**********
             * sheet
             */
            const snapSheetGroup: any = snapCanvas.group();
            this.renderSheet(snapCanvas, snapSheetGroup, svgFolio);


            /**********
             * systems
             */
            this.renderSystems(snapCanvas, snapSheetGroup, svgFolio);


            /**********
             * items
             */
            this.renderItems(snapCanvas, snapSheetGroup, svgFolio);

        });

        console.info('--- /renderSnapSvg ---');
    }


    /**********
     * sheet
     */
    renderSheet(snapCanvas: any, snapSheetGroup: any, svgFolio: FolioSvgOutput): void {
        // init
        const sheetID = svgFolio.sheet.folio;
        const x1 = svgFolio.sheet.upperLeftCorner.x;
        const y1 = svgFolio.sheet.upperLeftCorner.y;
        const x2 = svgFolio.sheet.lowerRightCorner.x;
        const y2 = svgFolio.sheet.lowerRightCorner.y;


        // sheet id
        snapSheetGroup.attr({
            id: 'sheet ' + sheetID
        });


        // sheet rectangle
        const snapSheetRect: any = snapCanvas.rect(x1, y1, x2, y2);
        snapSheetRect.attr({
            fill: 'white',
            stroke: this.bgColor,
            strokeWidth: 1
        });

        // sheet label
        const snapSheetLabel: any = snapCanvas.text(x1, y1 / 2, 'Bl. ' + sheetID);
        snapSheetLabel.attr({
            fill: this.bgColor
        });

        snapSheetGroup.add(snapSheetRect, snapSheetLabel);
    }


    /**********
     * systems
     */
    renderSystems(snapCanvas: any, snapSheetGroup: any, svgFolio: FolioSvgOutput): void {
        svgFolio.systems.lineArrays.forEach((lineArray: FolioSvgLine[], systemIndex: number) => {
            // notational system
            const snapSystemLineGroup: any = snapCanvas.group();
            snapSystemLineGroup.attr({
                id: 'system line group ' + (systemIndex + 1)
            });

            // system lines
            lineArray.forEach(line => {
                // init
                const x1 = line.startPoint.x;
                const y1 = line.startPoint.y;
                const x2 = line.endPoint.x;
                const y2 = line.endPoint.y;

                const systemLine: any = snapCanvas.line(x1, y1, x2, y2);
                systemLine.attr({
                    stroke: this.bgColor,
                    strokeWidth: 0.7
                });
                snapSystemLineGroup.add(systemLine);
            });

            // system label
            // init
            const x = svgFolio.systems.lineLabelArray[systemIndex].x;
            const y = svgFolio.systems.lineLabelArray[systemIndex].y;
            const systemLabel = systemIndex + 1;

            const snapSystemLabel: any = snapCanvas.text(x, y, systemLabel);
            snapSystemLabel.attr({
                dominantBaseline: 'hanging',
                fill: this.bgColor
            });

            // systems group
            const snapSystemsGroup: any = snapCanvas.group(snapSystemLineGroup, snapSystemLabel);
            snapSystemsGroup.attr({
                id: 'system group ' + (systemIndex + 1)
            });

            snapSheetGroup.add(snapSystemsGroup);
        });
    }


    /**********
     * items
     */
    renderItems(snapCanvas: any, snapSheetGroup: any, svgFolio: FolioSvgOutput): void {
        svgFolio.itemsArray.forEach((item: FolioSvgOutputItem) => {
            if (!item) { return; }

            // item label
            // init
            const centeredXPosition = item.upperLeftCorner.x + (item.width / 2);
            const centeredYPosition = item.upperLeftCorner.y + (item.height / 2);
            const itemLabelArray: string[] = [item.sigle, 'T. ' + item.measure];

            const snapItemLabel: any = snapCanvas.text(0, 0, itemLabelArray);
            snapItemLabel.attr({
                fill: this.fgColor
            });
            // attributes for tspan elements of itemLabel array
            snapItemLabel.select('tspan:first-of-type').attr({
                x: centeredXPosition,
                y: centeredYPosition,
                alignmentBaseline: 'middle',
                textAnchor: 'middle'
            });
            snapItemLabel.select('tspan:last-of-type').attr({
                x: centeredXPosition,
                y: centeredYPosition,
                alignmentBaseline: 'middle',
                textAnchor: 'middle',
                dy: '1.2em'
            });

            // item shape
            const snapItemShape = snapCanvas.group();
            item.lineArray.forEach((line: FolioSvgLine) => {
                // init
                const x1 = line.startPoint.x;
                const y1 = line.startPoint.y;
                const x2 = line.endPoint.x;
                const y2 = line.endPoint.y;

                const snapItemLine = snapCanvas.line(x1, y1, x2, y2);
                snapItemShape.add(snapItemLine);
            });
            snapItemShape.attr({
                id: 'item shape ' + itemLabelArray,
                stroke: this.fgColor,
                strokeWidth: 1,
                fill: 'white'
            });

            // item link
            // see https://stackoverflow.com/questions/37592540/clickable-link-on-a-svg-circle-text-or-line
            const snapItemLink: any = snapCanvas.el('a');
            snapItemLink.node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', item.measure);
            snapItemLink.attr({
                target: '_blank'
            });
            // add shape and label to item link
            snapItemLink.add(snapItemShape);
            snapItemLink.add(snapItemLabel);

            // item group
            const snapItemGroup: any = snapCanvas.group(snapItemLink);
            snapItemGroup.attr({
                id: 'item ' + itemLabelArray
            });
            snapSheetGroup.add(snapItemGroup);
        });
    }



}
