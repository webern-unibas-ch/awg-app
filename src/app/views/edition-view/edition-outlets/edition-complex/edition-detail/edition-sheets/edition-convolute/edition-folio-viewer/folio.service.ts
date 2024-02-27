import { Injectable } from '@angular/core';

import {
    D3Selection,
    Folio,
    FolioCalculation,
    FolioCalculationLine,
    FolioSettings,
    FolioSvgData,
    ViewBox,
} from '@awg-views/edition-view/models';

/**
 * The Folio service.
 *
 * It handles the calculations needed for edition folio SVG's
 * and prepares the SVG canvas.
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
     * border collision between rendered SVG items.
     */
    private _itemsOffsetCorrection = 4;

    /**
     * Public method: getFolioSvgData.
     *
     * It calculates and provides the folio SVG data
     * to render the folio SVG.
     *
     * @param {FolioSettings} folioSettings The given folio format settings.
     * @param {Folio} folio The given folio.
     * @returns {FolioSvgData} The calculated folio SVG data.
     */
    getFolioSvgData(folioSettings: FolioSettings, folio: Folio): FolioSvgData {
        // Calculate values for SVG
        const calculation = new FolioCalculation(folioSettings, folio, this._itemsOffsetCorrection);

        // Get SVG data from calculation
        return new FolioSvgData(calculation);
    }

    /**
     * Public method: addViewBoxToSvgCanvas.
     *
     * It adds the SVG viewbox attributes to the SVG canvas.
     *
     * @param {D3Selection} svgCanvas The given SVG canvas selection.
     * @param {ViewBox} vb The given ViewBox object.
     * @returns {void} Adds the SVG viewbox attributes to the SVG canvas selection.
     */
    addViewBoxToSvgCanvas(svgCanvas: D3Selection, vb: ViewBox): void {
        svgCanvas
            .attr('viewBox', vb.viewBox)
            .attr('width', vb.svgWidth)
            .attr('height', vb.svgHeight)
            .attr('version', '1.1')
            .attr('xmlns', 'https://www.w3.org/2000/svg')
            .attr('xlink', 'https://www.w3.org/1999/xlink')
            .attr('preserveAspectRatio', 'xMinYMin meet');
    }

    /**
     * Public method: addFolioToSvgCanvas.
     *
     * It coordinates the drawing of the calculated folio SVG data
     * for a folio's sheet, systems and items to the folio SVG canvas.
     *
     * @param {D3Selection} svgCanvas The given SVG canvas selection.
     * @param {FolioSvgData} folioSvg The given calculated folio data.
     * @param {string} bgColor The given background color.
     * @param {string} fgColor The given foreground color.
     * @param {*} ref The given reference to the calling component.
     * @returns {void} Adds the folio to the SVG canvas selection.
     */
    addFolioToSvgCanvas(
        svgCanvas: D3Selection,
        folioSvgData: FolioSvgData,
        bgColor: string,
        fgColor: string,
        ref: any
    ): void {
        /**
         * Self-referring variable needed for CompileHtml library.
         */
        this.ref = ref;

        /**
         * The SVG canvas sheet group selection.
         */
        const svgSheetGroup = svgCanvas.append('g');

        /**
         * Draw sheet.
         */
        this._addFolioSheetToSvgCanvas(svgCanvas, svgSheetGroup, folioSvgData, bgColor);

        /**
         * Draw systems.
         */
        this._addFolioSystemsToSvgCanvas(svgCanvas, svgSheetGroup, folioSvgData, bgColor);

        /**
         * Draw items.
         */
        this._addFolioItemsToSvgCanvas(svgCanvas, svgSheetGroup, folioSvgData, fgColor);
    }

    /**
     * Private method: _addFolioSheetToSvgCanvas.
     *
     * It adds the folio's sheet from the calculated
     * folio SVG data to the folio SVG canvas.
     *
     * @param {D3Selection} svgCanvas The given SVG canvas selection.
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio SVG data.
     * @param {string} bgColor The given background color.
     * @returns {void} Adds the sheet to the SVG canvas selection.
     */
    private _addFolioSheetToSvgCanvas(
        svgCanvas: D3Selection,
        svgSheetGroup: D3Selection,
        folioSvgData: FolioSvgData,
        bgColor: string
    ): void {
        // Init
        const folioId = folioSvgData.sheet.folioId;
        const x1 = folioSvgData.sheet.upperLeftCorner.x;
        const y1 = folioSvgData.sheet.upperLeftCorner.y;
        const x2 = folioSvgData.sheet.lowerRightCorner.x;
        const y2 = folioSvgData.sheet.lowerRightCorner.y;

        // SVG sheet id
        svgSheetGroup.attr('sheetGroupId', folioId).attr('class', 'sheet-group');

        // SVG sheet rectangle
        const svgSheetRect = svgCanvas
            .append('rect')
            .attr('x', x1)
            .attr('y', y1)
            .attr('width', x2 - x1)
            .attr('height', y2 - y1)
            .attr('fill', 'white')
            .attr('stroke', bgColor)
            .attr('stroke-width', 1);

        // SVG sheet title
        svgSheetGroup.append('title').text('Bl. ' + folioId);

        // Add the SVG sheet rectangle to the SVG sheet group
        svgSheetGroup.node().appendChild(svgSheetRect.node());
    }

    /**
     * Private method: _addFolioSystemsToSvgCanvas.
     *
     * It adds the folio's systems from the calculated
     * folio SVG data to the folio SVG canvas.
     *
     * @param {D3Selection} svgCanvas The given SVG canvas selection.
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio SVG data.
     * @param {string} bgColor The given background color.
     * @returns {void} Adds the systems to the SVG canvas selection.
     */
    private _addFolioSystemsToSvgCanvas(
        svgCanvas: D3Selection,
        svgSheetGroup: D3Selection,
        folioSvgData: FolioSvgData,
        bgColor: string
    ): void {
        folioSvgData.systems.lineArrays.forEach((lineArray: FolioCalculationLine[], systemIndex: number) => {
            // Notational system
            const svgSystemLineGroup = svgCanvas
                .append('g')
                .attr('systemLineGroupId', systemIndex + 1)
                .attr('class', 'system-line-group');

            // SVG system lines
            lineArray.forEach(line => {
                // Init
                const x1 = line.startPoint.x;
                const y1 = line.startPoint.y;
                const x2 = line.endPoint.x;
                const y2 = line.endPoint.y;

                const systemLine = svgCanvas
                    .append('line')
                    .attr('x1', x1)
                    .attr('y1', y1)
                    .attr('x2', x2)
                    .attr('y2', y2)
                    .attr('class', 'system-line')
                    .attr('stroke', bgColor)
                    .attr('stroke-width', 0.7);

                svgSystemLineGroup.node().appendChild(systemLine.node());
            });

            // SVG system label
            const x = folioSvgData.systems.lineLabelArray[systemIndex].x;
            const y = folioSvgData.systems.lineLabelArray[systemIndex].y;
            const systemLabel = systemIndex + 1;

            const svgSystemLabel = svgCanvas
                .append('text')
                .attr('x', x)
                .attr('y', y)
                .text(systemLabel)
                .attr('class', 'system-label')
                .attr('dominant-baseline', 'hanging')
                .attr('fill', bgColor);

            // SVG systems group
            const svgSystemsGroup = svgCanvas.append('g');
            svgSystemsGroup.node().appendChild(svgSystemLineGroup.node());
            svgSystemsGroup.node().appendChild(svgSystemLabel.node());
            svgSystemsGroup.attr('systemsGroupId', systemIndex + 1).attr('class', 'systems-group');

            // Add the SVG systems group to the SVG sheet group
            svgSheetGroup.node().appendChild(svgSystemsGroup.node());
        });
    }

    /**
     * Private method: _addFolioItemsToSvgCanvas.
     *
     * It adds the folio's items from the calculated
     * folio SVG data to the folio SVG canvas.
     *
     * @param {D3Selection} svgCanvas The given SVG canvas selection.
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio data.
     * @param {string} fgColor The given foreground color.
     * @returns {void} Adds the items to the SVG canvas selection.
     */
    private _addFolioItemsToSvgCanvas(
        svgCanvas: D3Selection,
        svgSheetGroup: D3Selection,
        folioSvgData: FolioSvgData,
        fgColor: string
    ): void {
        folioSvgData.contentItemsArray.forEach(contentItem => {
            if (!contentItem) {
                return;
            }

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

            const polygoneCornerPointArray = [
                contentItem.cornerPoints.upperLeftCorner.x,
                contentItem.cornerPoints.upperLeftCorner.y,
                contentItem.cornerPoints.upperRightCorner.x,
                contentItem.cornerPoints.upperRightCorner.y,
                contentItem.cornerPoints.lowerRightCorner.x,
                contentItem.cornerPoints.lowerRightCorner.y,
                contentItem.cornerPoints.lowerLeftCorner.x,
                contentItem.cornerPoints.lowerLeftCorner.y,
                contentItem.cornerPoints.upperLeftCorner.x,
                contentItem.cornerPoints.upperLeftCorner.y,
            ];

            // SVG item group
            const svgItemGroup = svgCanvas
                .append('g')
                .attr('itemGroupId', itemLabelArray.join(' '))
                .attr('itemId', contentItem.sheetId)
                .attr('class', 'item-group');

            // SVG item link
            const svgItemLink = svgItemGroup.append('a').attr('class', 'item-link');

            // SVG item shape
            const svgItemShape = svgItemLink
                .append('polygon')
                .attr('points', polygoneCornerPointArray.join(' '))
                .attr('class', 'item-shape')
                .attr('stroke-width', 2)
                .attr('fill', '#eeeeee');

            // Item label
            const svgItemLabel = svgItemLink
                .append('text')
                .attr('x', centeredXPosition)
                .attr('y', centeredYPosition)
                .attr('class', 'item-label')
                .attr('style', 'font: 12px Source Sans Pro, source-sans-pro, sans-serif')
                .attr('dominant-baseline', 'middle')
                .attr('text-anchor', 'middle')
                .text(itemLabelArray.join(' '));

            // Rotate the text 180 degrees around its center
            if (contentItem.reversed) {
                svgItemLabel.attr('transform', `rotate(180, ${centeredXPosition}, ${centeredYPosition})`);
            }

            // Apply title when hovering item
            svgItemGroup.append('title').text(itemLabelArray.join(' '));

            // Add click event handler
            if (contentItem.selectable === false) {
                svgItemGroup.attr('stroke', 'grey').attr('fill', 'grey');
                svgItemGroup.on('click', () => this.ref.openModal(contentItem.linkTo));
            } else {
                svgItemGroup.attr('stroke', fgColor).attr('fill', fgColor);
                svgItemGroup.on('click', () => this.ref.selectSvgSheet(contentItem.complexId, contentItem.sheetId));
            }

            // Add the SVG item group to the SVG sheet group
            svgSheetGroup.node().appendChild(svgItemGroup.node());
        });
    }
}
