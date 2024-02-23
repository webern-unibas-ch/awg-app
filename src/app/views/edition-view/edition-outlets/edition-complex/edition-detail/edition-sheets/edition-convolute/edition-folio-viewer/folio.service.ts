import { Injectable } from '@angular/core';

import {
    Folio,
    FolioCalculation,
    FolioCalculationLine,
    FolioSettings,
    FolioSvgData,
    ViewBox,
} from '@awg-views/edition-view/models';

/**
 * Declared variable: Snap.
 *
 * It provides access to the embedded SnapSvg library (see {@link snapsvg.io}).
 */
declare let Snap: any;

/**
 * The Folio service.
 *
 * It handles the calculations needed for edition folio svg's
 * and prepares the Snap svg canvas object.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class FolioService {
    /**
     * Self-referring variable needed for CompileHtml library.
     *
     * It refers to the Component from which it is called.
     */
    ref: any;

    /**
     * Private variable: _itemsOffsetCorrection.
     *
     * It corrects the offset (in px) to avoid
     * border collision between rendered svg items.
     */
    private _itemsOffsetCorrection = 4;

    /**
     * Public method: getFolioSvgData.
     *
     * It calculates and provides the folio svg data
     * to render the folio svg object (SnapCanvas).
     *
     * @param {FolioSettings} folioSettings The given folio format settings.
     * @param {Folio} folio The given folio.
     * @returns {FolioSvgData} The calculated folio data.
     */
    getFolioSvgData(folioSettings: FolioSettings, folio: Folio): FolioSvgData {
        // Calculate values for svg
        const calculation = new FolioCalculation(folioSettings, folio, this._itemsOffsetCorrection);

        // Get svg data from calculation
        return new FolioSvgData(calculation);
    }

    /**
     * Public method: addViewBoxToSnapSvgCanvas.
     *
     * It adds the svg viewbox attributes to a Snap canvas svg object.
     *
     * @param {*} snapCanvas The given Snap canvas svg object.
     * @param {ViewBox} vb The given ViewBox object.
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
            preserveAspectRatio: 'xMinYMin meet',
        });
    }

    /**
     * Public method: addFolioToSnapSvgCanvas.
     *
     * It coordinates the drawing of the calculated folio svg data
     * for a folio's sheet, systems and items to the folio svg object
     * (SnapCanvas).
     *
     * @param {*} snapCanvas The given Snap canvas svg object.
     * @param {FolioSvgData} folioSvg The given calculated folio data.
     * @param {string} bgColor The given background color.
     * @param {string} fgColor The given foreground color.
     * @param {*} ref The given reference to the calling component.
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
        this._addFolioSheetToSnapSvgCanvas(snapCanvas, snapSheetGroup, folioSvg, bgColor);

        /**
         * Draw systems.
         */
        this._addFolioSystemsToSnapSvgCanvas(snapCanvas, snapSheetGroup, folioSvg, bgColor);

        /**
         * Draw items.
         */
        this._addFolioItemsToSnapSvgCanvas(snapCanvas, snapSheetGroup, folioSvg, fgColor);
    }

    /**
     * Private method: _addFolioSheetToSnapSvgCanvas.
     *
     * It adds the folio's sheet from the calculated
     * folio svg data to the folio svg object (SnapCanvas).
     *
     * @param {*} snapCanvas The given Snap canvas svg object.
     * @param {*} snapSheetGroup The given Snap canvas sheet group object.
     * @param {FolioSvgData} folioSvg The given calculated folio data.
     * @param {string} bgColor The given background color.
     * @returns {void} Adds the sheet to the Snap canvas svg object.
     */
    private _addFolioSheetToSnapSvgCanvas(
        snapCanvas: any,
        snapSheetGroup: any,
        folioSvg: FolioSvgData,
        bgColor: string
    ): void {
        // Init
        const folioId = folioSvg.sheet.folioId;
        const x1 = folioSvg.sheet.upperLeftCorner.x;
        const y1 = folioSvg.sheet.upperLeftCorner.y;
        const x2 = folioSvg.sheet.lowerRightCorner.x;
        const y2 = folioSvg.sheet.lowerRightCorner.y;

        // Sheet id
        snapSheetGroup.attr({
            sheetGroupId: folioId,
            class: 'sheet-group',
        });

        // Sheet rectangle
        const snapSheetRect: any = snapCanvas.rect(x1, y1, x2, y2);
        snapSheetRect.attr({
            fill: 'white',
            stroke: bgColor,
            strokeWidth: 1,
        });

        // Sheet title
        const snapSheetGroupTitle: string = Snap.parse('<title>Bl. ' + folioId + '</title>');

        // Add the sheet group title to the sheet group
        snapSheetGroup.append(snapSheetGroupTitle);

        // Add the sheet rectangle to the sheet group
        snapSheetGroup.add(snapSheetRect);
    }

    /**
     * Private method: _addFolioSystemsToSnapSvgCanvas.
     *
     * It adds the folio's systems from the calculated
     * folio svg data to the folio svg object (SnapCanvas).
     *
     * @param {*} snapCanvas The given Snap canvas svg object.
     * @param {*} snapSheetGroup The given Snap canvas sheet group object.
     * @param {FolioSvgData} folioSvg The given calculated folio data.
     * @param {string} bgColor The given background color.
     * @returns {void} Adds the systems to the Snap canvas svg object.
     */
    private _addFolioSystemsToSnapSvgCanvas(
        snapCanvas: any,
        snapSheetGroup: any,
        folioSvg: FolioSvgData,
        bgColor: string
    ): void {
        folioSvg.systems.lineArrays.forEach((lineArray: FolioCalculationLine[], systemIndex: number) => {
            // Notational system
            const snapSystemLineGroup: any = snapCanvas.group();
            snapSystemLineGroup.attr({
                systemLineGroupId: systemIndex + 1,
                class: 'system-line-group',
            });

            // System lines
            lineArray.forEach(line => {
                // Init
                const x1 = line.startPoint.x;
                const y1 = line.startPoint.y;
                const x2 = line.endPoint.x;
                const y2 = line.endPoint.y;

                const systemLine: any = snapCanvas.line(x1, y1, x2, y2);
                systemLine.attr({
                    class: 'system-line',
                    stroke: bgColor,
                    strokeWidth: 0.7,
                });
                snapSystemLineGroup.add(systemLine);
            });

            // System label
            // Init
            const x = folioSvg.systems.lineLabelArray[systemIndex].x;
            const y = folioSvg.systems.lineLabelArray[systemIndex].y;
            const systemLabel = systemIndex + 1;

            const snapSystemLabel: any = snapCanvas.text(x, y, systemLabel);
            snapSystemLabel.attr({
                class: 'system-label',
                dominantBaseline: 'hanging',
                fill: bgColor,
            });

            // Systems group
            const snapSystemsGroup: any = snapCanvas.group(snapSystemLineGroup, snapSystemLabel);
            snapSystemsGroup.attr({
                systemsGroupId: systemIndex + 1,
                class: 'systems-group',
            });

            // Add the systems group to the sheet group
            snapSheetGroup.add(snapSystemsGroup);
        });
    }

    /**
     * Private method: _addFolioItemsToSnapSvgCanvas.
     *
     * It adds the folio's items from the calculated
     * folio svg data to the folio svg object (SnapCanvas).
     *
     * @param {*} snapCanvas The given Snap canvas svg object.
     * @param {*} snapSheetGroup The given Snap canvas sheet group object.
     * @param {FolioSvgData} folioSvg The given calculated folio data.
     * @param {string} fgColor The given foreground color.
     * @returns {void} Adds the items to the Snap canvas svg object.
     */
    private _addFolioItemsToSnapSvgCanvas(
        snapCanvas: any,
        snapSheetGroup: any,
        folioSvg: FolioSvgData,
        fgColor: string
    ): void {
        folioSvg.contentItemsArray.forEach(contentItem => {
            if (!contentItem) {
                return;
            }

            // Item label
            // Init
            const halfWidth = contentItem.width / 2;
            const halfHeight = contentItem.height / 2;
            const yOffset = 5;

            let centeredXPosition = contentItem.upperLeftCorner.x + halfWidth;
            let centeredYPosition = contentItem.upperLeftCorner.y + halfHeight - yOffset;

            if (contentItem.reversed) {
                centeredXPosition = contentItem.cornerPoints.lowerRightCorner.x - halfWidth;
                centeredYPosition = contentItem.cornerPoints.lowerRightCorner.y - halfHeight + yOffset;
            }

            const itemLabelArray: string[] = [
                contentItem.sigle,
                contentItem.sigleAddendum ? ` ${contentItem.sigleAddendum}` : '',
            ];

            const snapItemLabel: any = snapCanvas.text(centeredXPosition, centeredYPosition, itemLabelArray);
            snapItemLabel.attr({
                class: 'item-label',
                style: 'font: 12px Source Sans Pro, source-sans-pro, sans-serif',
                dominantBaseline: 'middle',
                textAnchor: 'middle',
            });

            // Rotate the text 180 degrees around its center
            if (contentItem.reversed) {
                snapItemLabel.transform(`r180,${centeredXPosition},${centeredYPosition}`);
            }

            // Attributes for tspan elements of itemLabel array
            snapItemLabel.select('tspan:first-of-type').attr({
                x: centeredXPosition,
                y: centeredYPosition,
                textAnchor: 'middle',
            });
            if (itemLabelArray.length > 1) {
                snapItemLabel.select('tspan:last-of-type').attr({
                    x: centeredXPosition,
                    y: centeredYPosition,
                    textAnchor: 'middle',
                    dy: '1.2em',
                });
            }

            // Item shape
            const snapItemShape = snapCanvas.group();

            const polygoneCornerPointArray = [];
            polygoneCornerPointArray.push(
                contentItem.cornerPoints.upperLeftCorner.x,
                contentItem.cornerPoints.upperLeftCorner.y
            );
            polygoneCornerPointArray.push(
                contentItem.cornerPoints.upperRightCorner.x,
                contentItem.cornerPoints.upperRightCorner.y
            );
            polygoneCornerPointArray.push(
                contentItem.cornerPoints.lowerRightCorner.x,
                contentItem.cornerPoints.lowerRightCorner.y
            );
            polygoneCornerPointArray.push(
                contentItem.cornerPoints.lowerLeftCorner.x,
                contentItem.cornerPoints.lowerLeftCorner.y
            );
            polygoneCornerPointArray.push(
                contentItem.cornerPoints.upperLeftCorner.x,
                contentItem.cornerPoints.upperLeftCorner.y
            );
            const polygone = snapCanvas.polyline(polygoneCornerPointArray);

            snapItemShape.add(polygone);
            snapItemShape.attr({
                class: 'item-shape',
                strokeWidth: 2,
                fill: '#eeeeee',
            });

            // Item link
            const snapItemLink: any = snapCanvas.el('a');
            snapItemLink.attr({
                class: 'item-link',
            });

            // Add shape and label to item link
            snapItemLink.add(snapItemShape);
            snapItemLink.add(snapItemLabel);

            // Item group
            const snapItemGroup: any = snapCanvas.group(snapItemLink);
            snapItemGroup.attr({
                itemGroupId: itemLabelArray,
                itemId: contentItem.sheetId,
                class: 'item-group',
            });

            // Apply title when hovering item
            const snapItemGroupTitle: string = Snap.parse('<title>' + itemLabelArray + '</title>');
            snapItemGroup.append(snapItemGroupTitle);

            // Add click event handler
            // Exclude and mute non-selectable sketches for now
            if (contentItem.selectable === false) {
                snapItemGroup.click(() => this.ref.openModal(contentItem.linkTo));
                snapItemGroup.attr({
                    stroke: 'grey',
                    fill: 'grey',
                });
            } else {
                snapItemGroup.click(() => this.ref.selectSvgSheet(contentItem.complexId, contentItem.sheetId));
                snapItemGroup.attr({
                    stroke: fgColor,
                    fill: fgColor,
                });
            }

            // Add the item group to the sheet group
            snapSheetGroup.add(snapItemGroup);
        });
    }
}
