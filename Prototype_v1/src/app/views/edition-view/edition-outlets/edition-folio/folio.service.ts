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

declare var Snap: any;

@Injectable()
export class FolioService {

    ref: any;
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
    renderSvg(snapCanvas: any, svgFolio: FolioSvgOutput, bgColor: string, fgColor: string, ref: any) {

        this.ref = ref;

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
        const sheetId = svgFolio.sheet.folio;
        const x1 = svgFolio.sheet.upperLeftCorner.x;
        const y1 = svgFolio.sheet.upperLeftCorner.y;
        const x2 = svgFolio.sheet.lowerRightCorner.x;
        const y2 = svgFolio.sheet.lowerRightCorner.y;

        // sheet id
        snapSheetGroup.attr({
            sheetGroupId: sheetId,
            class: 'sheet-group'
        });

        // sheet rectangle
        const snapSheetRect: any = snapCanvas.rect(x1, y1, x2, y2);
        snapSheetRect.attr({
            fill: 'white',
            stroke: bgColor,
            strokeWidth: 1
        });

        // sheet label
        const snapSheetLabel: any = snapCanvas.text(x1, y1 / 2, 'Bl. ' + sheetId);
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
                systemLineGroupId: systemIndex + 1,
                class: 'system-line-group'
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
                    class: 'system-line',
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
                class: 'system-label',
                dominantBaseline: 'hanging',
                fill: bgColor
            });

            // systems group
            const snapSystemsGroup: any = snapCanvas.group(snapSystemLineGroup, snapSystemLabel);
            snapSystemsGroup.attr({
                systemsGroupId: systemIndex + 1,
                class: 'systems-group'
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
            const itemLabelArray: string[] = [item.sigle, ' T. ' + item.measure];

            const snapItemLabel: any = snapCanvas.text(0, 0, itemLabelArray);
            snapItemLabel.attr({
                class: 'item-label',
                fontSize: '18px'
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
                class: 'item-shape',
                strokeWidth: 2,
                fill: 'white'
            });


            // item link
            const snapItemLink: any = snapCanvas.el('a');
            snapItemLink.attr({
                class: 'item-link'
            });

            // add shape and label to item link
            snapItemLink.add(snapItemShape);
            snapItemLink.add(snapItemLabel);


            // item group
            const snapItemGroup: any = snapCanvas.group(snapItemLink);
            snapItemGroup.attr({
                itemGroupId: itemLabelArray,
                itemId: item.sigle,
                class: 'item-group'
            });

            // apply title when hovering item
            const snapItemGroupTitle: string = Snap.parse('<title>' + itemLabelArray + '</title>');
            snapItemGroup.append(snapItemGroupTitle);

            // add click event handler
            // exclude and mute sketch Aa:SkI for now
            if (item.sigle === 'Aa:SkI/1a' || item.sigle === 'Aa:SkI/1b') {
                snapItemGroup.click(() => this.ref.openModal('sourceNotA'));
                snapItemGroup.attr({
                    stroke: 'grey',
                    fill: 'grey'
                });
            } else {
                snapItemGroup.click(() => this.ref.selectSheet(item.sigle));
                snapItemGroup.attr({
                    stroke: fgColor,
                    fill: fgColor
                });
            }

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
