import {Injectable} from '@angular/core';

import {
    Folio,
    FolioCalculation,
    FolioFormatOptions,
    FolioSvgLine,
    FolioSvgOutput,
    FolioSvgOutputItem,
    ViewBox
} from '@awg-views/edition-view/models';


@Injectable()
export class FolioService {

    private itemsOffsetCorrection: number = 4;      // offsetCorrection to avoid collision between items

    /******************
     * get data for dynamic viewBox
     */
    getViewBoxData(folioFormatOptions: FolioFormatOptions): ViewBox {

        // return new viewBoxModel
        return new ViewBox(folioFormatOptions);
    }


    /******************
     * set viewBox of snapCanvas svg
     */
    setSvgViewBox(snapCanvas: any, vb: ViewBox) {
        snapCanvas.attr({
            viewBox: vb.viewBox,
            width: vb.viewBoxWidth,
            height: vb.viewBoxHeight,
            version: '1.1',
            xmlns: 'http://www.w3.org/2000/svg',
            xlink: 'http://www.w3.org/1999/xlink',
            preserveAspectRatio: 'xMinYMin meet'
        });
    }


    /******************
     * prepare rendering of snapCanvas svg
     */
    renderSvg(snapCanvas: any, svgFolio: FolioSvgOutput, bgColor: string, fgColor: string) {
        /**********
         * sheet
         */
        const snapSheetGroup: any = snapCanvas.group();
        this.renderSheet(snapCanvas, snapSheetGroup, svgFolio, bgColor);


        /**********
         * systems
         */
        this.renderSystems(snapCanvas, snapSheetGroup, svgFolio, bgColor);


        /**********
         * items
         */
        this.renderItems(snapCanvas, snapSheetGroup, svgFolio, fgColor);
    }


    /******************
     * prepare rendering of sheet
     */
    private renderSheet(snapCanvas: any, snapSheetGroup: any, svgFolio: FolioSvgOutput, bgColor: string): void {
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
            stroke: bgColor,
            strokeWidth: 1
        });

        // sheet label
        const snapSheetLabel: any = snapCanvas.text(x1, y1 / 2, 'Bl. ' + sheetID);
        snapSheetLabel.attr({
            fill: bgColor
        });

        snapSheetGroup.add(snapSheetRect, snapSheetLabel);
    }


    /**********
     * prepare rendering of systems
     */
    private renderSystems(snapCanvas: any, snapSheetGroup: any, svgFolio: FolioSvgOutput, bgColor: string): void {
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
                    stroke: bgColor,
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
                fill: bgColor
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
     * prepare rendering of items
     */
    private renderItems(snapCanvas: any, snapSheetGroup: any, svgFolio: FolioSvgOutput, fgColor: string): void {
        svgFolio.itemsArray.forEach((item: FolioSvgOutputItem) => {
            if (!item) { return; }

            // item label
            // init
            const centeredXPosition = item.upperLeftCorner.x + (item.width / 2);
            const centeredYPosition = item.upperLeftCorner.y + (item.height / 2);
            const itemLabelArray: string[] = [item.sigle, 'T. ' + item.measure];

            const snapItemLabel: any = snapCanvas.text(0, 0, itemLabelArray);
            snapItemLabel.attr({
                fill: fgColor
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
                stroke: fgColor,
                strokeWidth: 1,
                fill: 'white'
            });

            // item link
            // see https://stackoverflow.com/questions/37592540/clickable-link-on-a-svg-circle-text-or-line
            const snapItemLink: any = snapCanvas.el('a');

            // TODO: continue
            const encodedItemSigle = encodeURI(item.sigle);
            snapItemLink.node.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'edition/detail;id=' + encodedItemSigle);
            snapItemLink.attr({
                // target: '_blank'
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



    /******************
     * svgOutputData
     */
    // compute all values to render the svg
    getFolioSvgOutputData(folioFormatOptions: FolioFormatOptions, folioData: Folio): FolioSvgOutput {

        // calculate values for svg
        const calculation = new FolioCalculation(folioFormatOptions, folioData, this.itemsOffsetCorrection);

        // get svg output data from calculation
        const folioSvgOutput: FolioSvgOutput = new FolioSvgOutput(calculation);

        return folioSvgOutput;
    }


}
