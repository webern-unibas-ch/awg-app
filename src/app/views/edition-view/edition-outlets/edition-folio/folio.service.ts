import { Injectable } from '@angular/core';

import {
    Folio,
    FolioSvgData,
    FolioCalculation,
    FolioCalculationLine,
    FolioSettings,
    ViewBox
} from '@awg-views/edition-view/models';

/**
 * Declared variable: Snap.
 *
 * It provides access to the embedded SnapSvg library (see {@link snapsvg.io}).
 */
declare var Snap: any;

/**
 * The Folio service.
 *
 * It handles the calculations needed for edition folio svg's
 * and prepares the Snap svg canvas object.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class FolioService {
    /**
     * Self-referring variable needed for CompileHtml library.
     *
     * It refers to the Component from which it is called.
     */
    ref: any;

    /**
     * Private variable: itemsOffsetCorrection.
     *
     * It corrects the offset (in px) to avoid
     * border collision between rendered svg items.
     */
    private itemsOffsetCorrection = 4;

    /**
     * Public method: getFolioSvgData.
     *
     * It calculates and provides the folio svg data
     * to render the folio svg object (SnapCanvas).
     *
     * @param {FolioSettings} folioSettings The folio format options input.
     * @param {Folio} folio The folio input.
     * @returns {FolioSvgData} The calculated folio data.
     */
    getFolioSvgData(folioSettings: FolioSettings, folio: Folio): FolioSvgData {
        // calculate values for svg
        const calculation = new FolioCalculation(folioSettings, folio, this.itemsOffsetCorrection);

        // get svg data from calculation
        return new FolioSvgData(calculation);
    }

    /**
     * Public method: addViewBoxToSnapSvgCanvas.
     *
     * It adds the svg viewbox attributes to a Snap canvas svg object.
     *
     * @param {*} snapCanvas The Snap canvas svg object.
     * @param {ViewBox} vb The ViewBox object.
     * @returns {void} Adds the svg viewbox attributes to the Snap canvas svg object.
     */
    addViewBoxToSnapSvgCanvas(snapCanvas: any, vb: ViewBox): void {
        snapCanvas.attr({
            viewBox: vb.viewBox,
            width: vb.svgWidth,
            height: vb.svgHeight,
            version: '1.1',
            xmlns: 'https://www.w3.org/2000/svg',
            xlink: 'https://www.w3.org/1999/xlink',
            preserveAspectRatio: 'xMinYMin meet'
        });
    }

    /**
     * Public method: addFolioToSnapSvgCanvas.
     *
     * It coordinates the drawing of the calculated folio svg data
     * for a folio's sheet, systems and items to the folio svg object
     * (SnapCanvas).
     *
     * @param {*} snapCanvas The Snap canvas svg object.
     * @param {FolioSvgData} folioSvg The calculated folio data.
     * @param {string} bgColor The background color.
     * @param {string} fgColor The foreground color.
     * @param {*} ref The reference to the calling component.
     * @returns {void} Adds the folio to the Snap canvas svg object.
     */
    addFolioToSnapSvgCanvas(snapCanvas: any, folioSvg: FolioSvgData, bgColor: string, fgColor: string, ref: any): void {
        /**
         * Self-referring variable needed for CompileHtml library.
         */
        this.ref = ref;

        /**
         * The Snap canvas sheet group object.
         */
        const snapSheetGroup: any = snapCanvas.group();

        /**
         * Draw sheet.
         */
        this.addFolioSheetToSnapSvgCanvas(snapCanvas, snapSheetGroup, folioSvg, bgColor);

        /**
         * Draw systems.
         */
        this.addFolioSystemsToSnapSvgCanvas(snapCanvas, snapSheetGroup, folioSvg, bgColor);

        /**
         * Draw items.
         */
        this.addFolioItemsToSnapSvgCanvas(snapCanvas, snapSheetGroup, folioSvg, fgColor);
    }

    /**
     * Private method: addFolioSheetToSnapSvgCanvas.
     *
     * It adds the folio's sheet from the calculated
     * folio svg data to the folio svg object (SnapCanvas).
     *
     * @param {*} snapCanvas The Snap canvas svg object.
     * @param {*} snapSheetGroup The Snap canvas sheet group object.
     * @param {FolioSvgData} folioSvg The calculated folio data.
     * @param {string} bgColor The background color.
     * @returns {void} Adds the sheet to the Snap canvas svg object.
     */
    private addFolioSheetToSnapSvgCanvas(
        snapCanvas: any,
        snapSheetGroup: any,
        folioSvg: FolioSvgData,
        bgColor: string
    ): void {
        // init
        const folioId = folioSvg.sheet.folioId;
        const x1 = folioSvg.sheet.upperLeftCorner.x;
        const y1 = folioSvg.sheet.upperLeftCorner.y;
        const x2 = folioSvg.sheet.lowerRightCorner.x;
        const y2 = folioSvg.sheet.lowerRightCorner.y;

        // sheet id
        snapSheetGroup.attr({
            sheetGroupId: folioId,
            class: 'sheet-group'
        });

        // sheet rectangle
        const snapSheetRect: any = snapCanvas.rect(x1, y1, x2, y2);
        snapSheetRect.attr({
            fill: 'white',
            stroke: bgColor,
            strokeWidth: 1
        });

        // sheet title
        const snapSheetGroupTitle: string = Snap.parse('<title>Bl. ' + folioId + '</title>');

        // add the sheet group title to the sheet group
        snapSheetGroup.append(snapSheetGroupTitle);

        // add the sheet rectangle to the sheet group
        snapSheetGroup.add(snapSheetRect);
    }

    /**
     * Private method: addFolioSystemsToSnapSvgCanvas.
     *
     * It adds the folio's systems from the calculated
     * folio svg data to the folio svg object (SnapCanvas).
     *
     * @param {*} snapCanvas The Snap canvas svg object.
     * @param {*} snapSheetGroup The Snap canvas sheet group object.
     * @param {FolioSvgData} folioSvg The calculated folio data.
     * @param {string} bgColor The background color.
     * @returns {void} Adds the systems to the Snap canvas svg object.
     */
    private addFolioSystemsToSnapSvgCanvas(
        snapCanvas: any,
        snapSheetGroup: any,
        folioSvg: FolioSvgData,
        bgColor: string
    ): void {
        folioSvg.systems.lineArrays.forEach((lineArray: FolioCalculationLine[], systemIndex: number) => {
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
            const x = folioSvg.systems.lineLabelArray[systemIndex].x;
            const y = folioSvg.systems.lineLabelArray[systemIndex].y;
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

            // add the systems group to the sheet group
            snapSheetGroup.add(snapSystemsGroup);
        });
    }

    /**
     * Private method: addFolioItemsToSnapSvgCanvas.
     *
     * It adds the folio's items from the calculated
     * folio svg data to the folio svg object (SnapCanvas).
     *
     * @param {*} snapCanvas The Snap canvas svg object.
     * @param {*} snapSheetGroup The Snap canvas sheet group object.
     * @param {FolioSvgData} folioSvg The calculated folio data.
     * @param {string} fgColor The foreground color.
     * @returns {void} Adds the items to the Snap canvas svg object.
     */
    private addFolioItemsToSnapSvgCanvas(
        snapCanvas: any,
        snapSheetGroup: any,
        folioSvg: FolioSvgData,
        fgColor: string
    ): void {
        folioSvg.contentItemsArray.forEach(contentItem => {
            if (!contentItem) {
                return;
            }

            // item label
            // init
            const centeredXPosition = contentItem.upperLeftCorner.x + contentItem.width / 2;
            const centeredYPosition = contentItem.upperLeftCorner.y + contentItem.height / 2;
            const itemLabelArray: string[] = [contentItem.sigle, ' T. ' + contentItem.measure];

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
            contentItem.lineArray.forEach((line: FolioCalculationLine) => {
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
                itemId: contentItem.sigle,
                class: 'item-group'
            });

            // apply title when hovering item
            const snapItemGroupTitle: string = Snap.parse('<title>' + itemLabelArray + '</title>');
            snapItemGroup.append(snapItemGroupTitle);

            // add click event handler
            // exclude and mute sketch Aa:SkI for now
            if (contentItem.sigle === 'Aa:SkI/1a' || contentItem.sigle === 'Aa:SkI/1b') {
                snapItemGroup.click(() => this.ref.openModal('sourceNotA'));
                snapItemGroup.attr({
                    stroke: 'grey',
                    fill: 'grey'
                });
            } else {
                snapItemGroup.click(() => this.ref.selectSvgFile(contentItem.sigle));
                snapItemGroup.attr({
                    stroke: fgColor,
                    fill: fgColor
                });
            }

            // add the item group to the sheet group
            snapSheetGroup.add(snapItemGroup);
        });
    }
}
