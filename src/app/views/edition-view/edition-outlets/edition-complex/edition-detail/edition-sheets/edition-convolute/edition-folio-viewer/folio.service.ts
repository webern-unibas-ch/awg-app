import { Injectable } from '@angular/core';

import {
    D3Selection,
    Folio,
    FolioCalculation,
    FolioCalculationLine,
    FolioCalculationPoint,
    FolioSettings,
    FolioSvgContentSegment,
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
     * Private variable: _bgColor.
     *
     * It keeps the background color for the folio.
     */
    private _bgColor = '#a3a3a3';

    /**
     * Private variable: _disabledColor.
     *
     * It keeps the disabled color for the folios.
     */
    private _disabledColor = 'grey';

    /**
     * Private variable: _fgColor.
     *
     * It keeps the foreground color for the folios.
     */
    private _fgColor = 'orange';

    /**
     * Private variable: _itemFillColor.
     *
     * It keeps the fill color for the items.
     */
    private _itemFillColor = '#eeeeee';

    /**
     * Private variable: _itemFontStyle.
     *
     * It keeps the font style for the items.
     */
    private _itemFontStyle = '11px Source Sans Pro, source-sans-pro, sans-serif';

    /**
     * Private variable: _itemOffsetCorrection.
     *
     * It corrects the offset (in px) to avoid
     * border collision between rendered SVG items.
     */
    private _itemOffsetCorrection = 4;

    /**
     * Private variable: _itemRotationAngle.
     *
     * It keeps the rotation angle for the reversed items.
     */
    private _itemReversedRotationAngle = 180;

    /**
     * Private variable: _itemStrokeWidth.
     *
     * It keeps the stroke width for the items.
     */
    private _itemStrokeWidth = 2;

    /**
     * Private variable: _sheetFillColor.
     *
     * It keeps the fill color for the sheets.
     */
    private _sheetFillColor = 'white';

    /**
     * Private variable: _sheetStrokeWidth.
     *
     * It keeps the stroke width for the sheets.
     */
    private _sheetStrokeWidth = 1;

    /**
     * Private variable: _systemsLineStrokeWidth.
     *
     * It keeps the stroke width for the systems.
     */
    private _systemsLineStrokeWidth = 0.7;

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
        const calculation = new FolioCalculation(folioSettings, folio, this._itemOffsetCorrection);

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
     * @param {FolioSvgData} folioSvgData The given calculated folio SVG data.
     * @param {*} ref The given reference to the calling component.
     * @returns {void} Adds the folio to the SVG canvas selection.
     */
    addFolioToSvgCanvas(svgCanvas: D3Selection, folioSvgData: FolioSvgData, ref: any): void {
        // Self-referring variable needed for CompileHtml library.
        this.ref = ref;

        // Create the SVG canvas sheet group selection.
        const svgSheetGroup = this._appendCanvasSheetGroup(svgCanvas, folioSvgData);

        // Draw sheet.
        this._addFolioSheetToSvgCanvas(svgSheetGroup, folioSvgData);

        // Draw systems.
        this._addFolioSystemsToSvgCanvas(svgSheetGroup, folioSvgData);

        // Draw items.
        this._addFolioContentSegmentsToSvgCanvas(svgSheetGroup, folioSvgData);
    }

    /**
     * Private method: _addFolioSheetToSvgCanvas.
     *
     * It adds the folio's sheet from the calculated
     * folio SVG data to the SVG sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio SVG data.
     * @returns {void} Adds the sheet to the SVG canvas selection.
     */
    private _addFolioSheetToSvgCanvas(svgSheetGroup: D3Selection, folioSvgData: FolioSvgData): void {
        const { sheet } = folioSvgData;
        const { upperLeftCorner, lowerRightCorner, folioId } = sheet;

        this._appendSheetGroupTitle(svgSheetGroup, folioId);
        this._appendSheetGroupRectangle(svgSheetGroup, upperLeftCorner, lowerRightCorner);
    }

    /**
     * Private method: _addFolioSystemsToSvgCanvas.
     *
     * It adds the folio's systems from the calculated
     * folio SVG data to the SVG sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio SVG data.
     * @returns {void} Adds the systems to the SVG canvas selection.
     */
    private _addFolioSystemsToSvgCanvas(svgSheetGroup: D3Selection, folioSvgData: FolioSvgData): void {
        folioSvgData.systems.systemsArrays.forEach((systemArray: FolioCalculationLine[], systemIndex: number) => {
            const svgSystemsGroup = this._appendSvgElementWithAttrs(svgSheetGroup, 'g', {
                systemsGroupId: systemIndex + 1,
                class: 'systems-group',
            });
            const svgSystemLineGroup = this._appendSvgElementWithAttrs(svgSystemsGroup, 'g', {
                systemLineGroupId: systemIndex + 1,
                class: 'system-line-group',
            });

            this._appendSystemsGroupLabel(svgSystemsGroup, folioSvgData, systemIndex);
            this._appendSystemsGroupLines(svgSystemLineGroup, systemArray);
        });
    }

    /**
     * Private method: _addFolioContentSegmentsToSvgCanvas.
     *
     * It adds the folio's items from the calculated
     * folio SVG data to the folio SVG canvas.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio SVG data.
     * @returns {void} Adds the items to the SVG canvas selection.
     */
    private _addFolioContentSegmentsToSvgCanvas(svgSheetGroup: D3Selection, folioSvgData: FolioSvgData): void {
        folioSvgData?.contentSegments?.forEach((contentSegment: FolioSvgContentSegment) => {
            if (!contentSegment) {
                return;
            }

            // Draw item group.
            const svgContentSegmentGroup = this._appendContentSegmentGroup(svgSheetGroup, contentSegment);

            // Draw item link.
            const svgContentSegmentLink = this._appendContentSegmentLink(svgContentSegmentGroup);

            // Draw item polygon.
            this._appendContentSegmentLinkPolygon(svgContentSegmentLink, contentSegment.polygonCornerPoints);

            // Draw item link label.
            this._appendContentSegmentLinkLabel(svgContentSegmentLink, contentSegment);
        });
    }

    /**
     * Private method: _appendCanvasSheetGroup.
     *
     * It appends a sheet group to the SVG canvas.
     *
     * @param {D3Selection} svgCanvas The given SVG canvas selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio SVG data.
     * @returns {D3Selection} Appends a sheet group to the SVG canvas selection.
     */
    private _appendCanvasSheetGroup(svgCanvas: D3Selection, folioSvgData: FolioSvgData): D3Selection {
        return this._appendSvgElementWithAttrs(svgCanvas, 'g', {
            sheetGroupId: folioSvgData.sheet.folioId,
            class: 'sheet-group',
        });
    }

    /**
     * Private method: _appendContentSegmentGroup.
     *
     * It appends an item group to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {D3Selection} Appends an item group to the sheet group selection.
     */
    private _appendContentSegmentGroup(
        svgSheetGroup: D3Selection,
        contentSegment: FolioSvgContentSegment
    ): D3Selection {
        // Draw item group element.
        const itemGroup = this._appendContentSegmentGroupElement(svgSheetGroup, contentSegment);

        // Apply title when hovering item
        this._appendContentSegmentGroupTitle(itemGroup, contentSegment);

        // Add click event handler
        itemGroup.on('click', () =>
            contentSegment.selectable
                ? this.ref.selectSvgSheet(contentSegment.complexId, contentSegment.sheetId)
                : this.ref.openModal(contentSegment.linkTo)
        );

        return itemGroup;
    }

    /**
     * Private method: _appendContentSegmentGroupElement.
     *
     * It appends an item group element to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {D3Selection} Appends an item group element to the sheet group selection.
     */
    private _appendContentSegmentGroupElement(
        svgSheetGroup: D3Selection,
        contentSegment: FolioSvgContentSegment
    ): D3Selection {
        return this._appendSvgElementWithAttrs(svgSheetGroup, 'g', {
            itemGroupId: contentSegment.segmentLabel,
            itemId: contentSegment.sheetId,
            class: 'item-group',
            stroke: contentSegment.selectable ? this._fgColor : this._disabledColor,
            fill: contentSegment.selectable ? this._fgColor : this._disabledColor,
        });
    }

    /**
     * Private method: _appendContentSegmentGroupTitle.
     *
     * It appends a title to the item group.
     *
     * @param {D3Selection} itemGroup The given SVG item group selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {D3Selection} Appends a title to the item group selection.
     */
    private _appendContentSegmentGroupTitle(
        itemGroup: D3Selection,
        contentSegment: FolioSvgContentSegment
    ): D3Selection {
        return this._appendSvgElementWithAttrs(itemGroup, 'title', {}).text(contentSegment.segmentLabel);
    }

    /**
     * Private method: _appendContentSegmentLink.
     *
     * It appends a link to the item group.
     *
     * @param {D3Selection} svgContentSegmentGroup The given SVG item group selection.
     * @returns {D3Selection} Appends a link to the item group selection.
     */
    private _appendContentSegmentLink(svgContentSegmentGroup: D3Selection): D3Selection {
        return this._appendSvgElementWithAttrs(svgContentSegmentGroup, 'a', { class: 'item-link' });
    }

    /**
     * Private method: _appendContentSegmentLinkLabel.
     *
     * It appends a label to the item link.
     *
     * @param {D3Selection} svgContentSegmentLink The given SVG item link selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {D3Selection} Appends a label to the item link selection.
     */
    private _appendContentSegmentLinkLabel(
        svgContentSegmentLink: any,
        contentSegment: FolioSvgContentSegment
    ): D3Selection {
        const label = this._appendContentSegmentLinkLabelTextElement(
            svgContentSegmentLink,
            contentSegment.centeredXPosition,
            contentSegment.centeredYPosition
        );

        this._appendContentSegmentLinkLabelTspanElements(label, contentSegment);

        // Rotate the label 180 degrees around its center when reversed
        if (contentSegment.reversed) {
            label.attr(
                'transform',
                `rotate(${this._itemReversedRotationAngle}, ${contentSegment.centeredXPosition}, ${contentSegment.centeredYPosition})`
            );
        }

        return label;
    }

    /**
     * Private method: _appendContentSegmentLinkLabelTextElement.
     *
     * It appends a text element to the item link label.
     *
     * @param {D3Selection} svgContentSegmentLink The given SVG item link selection.
     * @param {number} centeredXPosition The given centered x position.
     * @param {number} centeredYPosition The given centered y position.
     * @returns {D3Selection} Appends a text element to the item link selection.
     */
    private _appendContentSegmentLinkLabelTextElement(
        svgContentSegmentLink: D3Selection,
        centeredXPosition: number,
        centeredYPosition: number
    ): D3Selection {
        const attributes = {
            class: 'item-label',
            x: centeredXPosition,
            y: centeredYPosition,
            style: this._itemFontStyle,
        };
        attributes['dominant-baseline'] = 'middle';
        attributes['text-anchor'] = 'middle';

        return this._appendSvgElementWithAttrs(svgContentSegmentLink, 'text', attributes);
    }

    /**
     * Private method: _appendContentSegmentLinkLabelTspanElements.
     *
     * It appends tspan elements to the item link label.
     *
     * @param {D3Selection} labelSelection The given label selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {void} Appends tspan elements to the label selection.
     */
    private _appendContentSegmentLinkLabelTspanElements(
        labelSelection: D3Selection,
        contentSegment: FolioSvgContentSegment
    ): void {
        contentSegment.segmentLabelArray.forEach((label, index) => {
            if (label !== '') {
                const attributes: any = {};
                if (index > 0) {
                    attributes.x = contentSegment.centeredXPosition;
                    attributes.y = contentSegment.centeredYPosition;
                    attributes.dy = '1.2em';
                    attributes['text-anchor'] = 'middle';
                }

                this._appendSvgElementWithAttrs(labelSelection, 'tspan', attributes).text(label);
            }
        });
    }

    /**
     * Private method: _appendContentSegmentLinkPolygon.
     *
     * It appends a polygon shape to the item link.
     *
     * @param {D3Selection} svgContentSegmentLink The given SVG item link selection.
     * @param {string} polygonCornerPoints The given polygon corner points.
     * @returns {D3Selection} Appends a polygon shape to the item link selection.
     */
    private _appendContentSegmentLinkPolygon(
        svgContentSegmentLink: D3Selection,
        polygonCornerPoints: string
    ): D3Selection {
        const attributes = {
            class: 'item-shape',
            points: polygonCornerPoints,
            fill: this._itemFillColor,
        };
        attributes['stroke-width'] = this._itemStrokeWidth;

        return this._appendSvgElementWithAttrs(svgContentSegmentLink, 'polygon', attributes);
    }

    /**
     * Private method: _appendSheetGroupRectangle.
     *
     * It appends a rectangle to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioCalculationPoint} upperLeftCorner The given upper left corner point.
     * @param {FolioCalculationPoint} lowerRightCorner The given lower right corner point.
     * @param {string} bgColor The given background color.
     * @returns {D3Selection} Appends a rectangle to the sheet group selection.
     */
    private _appendSheetGroupRectangle(
        svgSheetGroup: D3Selection,
        upperLeftCorner: FolioCalculationPoint,
        lowerRightCorner: FolioCalculationPoint
    ): D3Selection {
        const { x: x1, y: y1 } = upperLeftCorner;
        const { x: x2, y: y2 } = lowerRightCorner;
        const attributes = {
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            fill: this._sheetFillColor,
            stroke: this._bgColor,
        };
        attributes['stroke-width'] = this._sheetStrokeWidth;

        return this._appendSvgElementWithAttrs(svgSheetGroup, 'rect', attributes);
    }

    /**
     * Private method: _appendSheetGroupTitle.
     *
     * It appends a title to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {string} folioId The given folio id.
     * @returns {void} Appends a title to the sheet group selection.
     */
    private _appendSheetGroupTitle(svgSheetGroup: D3Selection, folioId: string): void {
        this._appendSvgElementWithAttrs(svgSheetGroup, 'title', {}).text(`Bl. ${folioId}`);
    }

    /**
     * Private method: _appendSystemsGroupLabel.
     *
     * It appends a label to the systems group.
     *
     * @param {D3Selection} svgSystemsGroup The given SVG systems group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio SVG data.
     * @param {number} systemIndex The given system index.
     * @param {string} bgColor The given background color.
     * @returns {void} Appends a label to the systems group selection.
     */
    private _appendSystemsGroupLabel(
        svgSystemsGroup: D3Selection,
        folioSvgData: FolioSvgData,
        systemIndex: number
    ): void {
        const { x, y } = folioSvgData.systems.systemsLabelArray[systemIndex];
        const systemLabel = systemIndex + 1;
        const attributes = {
            class: 'system-label',
            x: x,
            y: y,
            fill: this._bgColor,
        };
        attributes['dominant-baseline'] = 'hanging';

        this._appendSvgElementWithAttrs(svgSystemsGroup, 'text', attributes).text(systemLabel);
    }

    /**
     * Private method: _appendSystemsGroupLines.
     *
     * It appends system lines to the systems group.
     *
     * @param {D3Selection} svgSystemsGroup The given SVG systems group selection.
     * @param {FolioCalculationLine[]} systemArray The given line array.
     * @returns {void} Appends system lines to the systems group selection.
     */
    private _appendSystemsGroupLines(svgSystemsGroup: D3Selection, systemArray: FolioCalculationLine[]): void {
        systemArray.forEach(line => {
            const { x: x1, y: y1 } = line.startPoint;
            const { x: x2, y: y2 } = line.endPoint;
            const attributes = {
                class: 'system-line',
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                stroke: this._bgColor,
            };
            attributes['stroke-width'] = this._systemsLineStrokeWidth;

            this._appendSvgElementWithAttrs(svgSystemsGroup, 'line', attributes);
        });
    }

    /**
     * Private method: _appendSvgElementWithAttrs.
     *
     * It appends an SVG element with attributes to a parent element.
     *
     * @param {D3Selection} parent The given parent selection.
     * @param {string} type The given type of SVG element.
     * @param {Record<string, any>} attributes The given attributes.
     * @returns {D3Selection} The appended SVG element with attributes.
     */
    private _appendSvgElementWithAttrs = (
        parent: D3Selection,
        type: string,
        attributes: Record<string, any>
    ): D3Selection => {
        const selection = parent.append(type);
        Object.keys(attributes).forEach(key => {
            selection.attr(key, attributes[key]);
        });
        return selection;
    };
}
