import { Injectable } from '@angular/core';

import {
    D3Selection,
    Folio,
    FolioCalculation,
    FolioCalculationLine,
    FolioCalculationPoint,
    FolioCalculationRectangle,
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
     * Private readonly variable: _bgColor.
     *
     * It keeps the background color for the folio.
     */
    private readonly _bgColor = '#a3a3a3';

    /**
     * Private readonly variable: _disabledColor.
     *
     * It keeps the disabled color for the folios.
     */
    private readonly _disabledColor = 'grey';

    /**
     * Private readonly variable: _fgColor.
     *
     * It keeps the foreground color for the folios.
     */
    private readonly _fgColor = 'orange';

    /**
     * Private readonly variable: _contentSegmentFillColor.
     *
     * It keeps the fill color for the content segments.
     */
    private readonly _contentSegmentFillColor = '#eeeeee';

    /**
     * Private readonly variable: _contentSegmentFontFamily.
     *
     * It keeps the font family for the content segments.
     */
    private readonly _contentSegmentFontFamily = 'Source Sans Pro, source-sans-pro, sans-serif';

    /**
     * Private readonly variable: _contentSegmentFontSize.
     *
     * It keeps the font size for the content segments.
     */
    private readonly _contentSegmentFontSize = '11px';

    /**
     * Private readonly variable: _contentSegmentOffsetCorrection.
     *
     * It corrects the offset (in px) to avoid
     * border collision between rendered SVG content segments.
     */
    private readonly _contentSegmentOffsetCorrection = 4;

    /**
     * Private readonly variable: _contentSegmentStrokeWidth.
     *
     * It keeps the stroke width for the content segments.
     */
    private readonly _contentSegmentStrokeWidth = 2;

    /**
     * Private readonly variable: _reversedRotationAngle.
     *
     * It keeps the rotation angle for a reversed item.
     */
    private readonly _reversedRotationAngle = 180;

    /**
     * Private readonly variable: _sheetFillColor.
     *
     * It keeps the fill color for the sheets.
     */
    private readonly _sheetFillColor = 'white';

    /**
     * Private readonly variable: _sheetStrokeWidth.
     *
     * It keeps the stroke width for the sheets.
     */
    private readonly _sheetStrokeWidth = 1;

    /**
     * Private readonly variable: _systemsLineStrokeWidth.
     *
     * It keeps the stroke width for the systems.
     */
    private readonly _systemsLineStrokeWidth = 0.7;

    /**
     * Public method: getFolioSvgData.
     *
     * It calculates and provides the folio SVG data
     * to render the folio SVG.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {Folio} folio The given folio.
     * @returns {FolioSvgData} The calculated folio SVG data.
     */
    getFolioSvgData(folioSettings: FolioSettings, folio: Folio): FolioSvgData {
        // Calculate values for SVG
        const calculation = new FolioCalculation(folioSettings, folio, this._contentSegmentOffsetCorrection);

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
     * for a folio's sheet, systems and content segments to the folio SVG canvas.
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
        const svgSheetGroup = this._appendCanvasSheetGroup(svgCanvas, folioSvgData.sheet.folioId);

        // Draw sheet.
        this._addFolioSheetToSvgCanvas(svgSheetGroup, folioSvgData);

        // Draw systems.
        this._addFolioSystemsToSvgCanvas(svgSheetGroup, folioSvgData);

        // Draw content segments.
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
        const { folioId, sheetRectangle, trademarkRectangle } = sheet;

        this._appendSheetGroupSheetTitle(svgSheetGroup, folioId);
        this._appendSheetGroupSheetRectangle(svgSheetGroup, sheetRectangle);

        if (trademarkRectangle) {
            this._appendSheetGroupTrademark(
                svgSheetGroup,
                trademarkRectangle,
                folioId,
                folioSvgData.systems.systemsReversed
            );
        }
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
        folioSvgData.systems.systemsLines.forEach((systemArray: FolioCalculationLine[], systemIndex: number) => {
            const labelIndex = folioSvgData.systems.systemsReversed
                ? folioSvgData.systems.systemsLines.length - systemIndex
                : systemIndex + 1;
            const labelPosition: FolioCalculationPoint = folioSvgData.systems.systemsLabelPositions[systemIndex];

            const svgSystemsGroup = this._appendSvgElementWithAttrs(svgSheetGroup, 'g', {
                systemsGroupId: labelIndex,
                class: 'systems-group',
            });
            const svgSystemLineGroup = this._appendSvgElementWithAttrs(svgSystemsGroup, 'g', {
                systemLineGroupId: labelIndex,
                class: 'system-line-group',
            });

            this._appendSystemsGroupLabel(svgSystemsGroup, labelPosition, labelIndex);
            this._appendSystemsGroupLines(svgSystemLineGroup, systemArray);
        });
    }

    /**
     * Private method: _addFolioContentSegmentsToSvgCanvas.
     *
     * It adds the folio's content segments from the calculated
     * folio SVG data to the folio SVG canvas.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio SVG data.
     * @returns {void} Adds the content segments to the SVG canvas selection.
     */
    private _addFolioContentSegmentsToSvgCanvas(svgSheetGroup: D3Selection, folioSvgData: FolioSvgData): void {
        folioSvgData?.contentSegments?.forEach((contentSegment: FolioSvgContentSegment) => {
            if (!contentSegment) {
                return;
            }

            // Draw content segment group.
            const svgContentSegmentGroup = this._appendContentSegmentGroup(svgSheetGroup, contentSegment);

            // Draw content segment link.
            const svgContentSegmentLink = this._appendContentSegmentLink(svgContentSegmentGroup);

            // Draw content segment polygon.
            this._appendContentSegmentLinkPolygon(svgContentSegmentLink, contentSegment.segmentVertices);

            // Draw content segment link label.
            this._appendContentSegmentLinkLabel(svgContentSegmentLink, contentSegment);
        });
    }

    /**
     * Private method: _appendCanvasSheetGroup.
     *
     * It appends a sheet group to the SVG canvas.
     *
     * @param {D3Selection} svgCanvas The given SVG canvas selection.
     * @param {string} folioId The given folio id.
     * @returns {D3Selection} Appends a sheet group to the SVG canvas selection.
     */
    private _appendCanvasSheetGroup(svgCanvas: D3Selection, folioId: string): D3Selection {
        return this._appendSvgElementWithAttrs(svgCanvas, 'g', {
            sheetGroupId: folioId,
            class: 'sheet-group',
        });
    }

    /**
     * Private method: _appendContentSegmentGroup.
     *
     * It appends an content segment group to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {D3Selection} Appends an content segment group to the sheet group selection.
     */
    private _appendContentSegmentGroup(
        svgSheetGroup: D3Selection,
        contentSegment: FolioSvgContentSegment
    ): D3Selection {
        // Draw content segment group element.
        const contentSegmentGroup = this._appendContentSegmentGroupElement(svgSheetGroup, contentSegment);

        // Apply title when hovering content segment.
        this._appendContentSegmentGroupTitle(contentSegmentGroup, contentSegment);

        // Add click event handler
        contentSegmentGroup.on('click', () =>
            contentSegment.selectable
                ? this.ref.selectSvgSheet({ complexId: contentSegment.complexId, sheetId: contentSegment.sheetId })
                : this.ref.openModal(contentSegment.linkTo)
        );

        return contentSegmentGroup;
    }

    /**
     * Private method: _appendContentSegmentGroupElement.
     *
     * It appends an content segment group element to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {D3Selection} Appends an content segment group element to the sheet group selection.
     */
    private _appendContentSegmentGroupElement(
        svgSheetGroup: D3Selection,
        contentSegment: FolioSvgContentSegment
    ): D3Selection {
        return this._appendSvgElementWithAttrs(svgSheetGroup, 'g', {
            contentSegmentGroupId: contentSegment.segmentLabel,
            contentSegmentId: contentSegment.sheetId,
            class: 'content-segment-group',
            stroke: contentSegment.selectable ? this._fgColor : this._disabledColor,
            fill: contentSegment.selectable ? this._fgColor : this._disabledColor,
        });
    }

    /**
     * Private method: _appendContentSegmentGroupTitle.
     *
     * It appends a title to the content segment group.
     *
     * @param {D3Selection} contentSegmentGroup The given SVG content segment group selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {D3Selection} Appends a title to the content segment group selection.
     */
    private _appendContentSegmentGroupTitle(
        contentSegmentGroup: D3Selection,
        contentSegment: FolioSvgContentSegment
    ): D3Selection {
        return this._appendSvgElementWithAttrs(contentSegmentGroup, 'title', {}).text(contentSegment.segmentLabel);
    }

    /**
     * Private method: _appendContentSegmentLink.
     *
     * It appends a link to the content segment group.
     *
     * @param {D3Selection} svgContentSegmentGroup The given SVG content segment group selection.
     * @returns {D3Selection} Appends a link to the content segment group selection.
     */
    private _appendContentSegmentLink(svgContentSegmentGroup: D3Selection): D3Selection {
        return this._appendSvgElementWithAttrs(svgContentSegmentGroup, 'a', { class: 'content-segment-link' });
    }

    /**
     * Private method: _appendContentSegmentLinkLabel.
     *
     * It appends a label to the content segment link.
     *
     * @param {D3Selection} svgContentSegmentLink The given SVG content segment link selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {D3Selection} Appends a label to the content segment link selection.
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
        if (contentSegment.segmentReversed) {
            label.attr(
                'transform',
                `rotate(${this._reversedRotationAngle}, ${contentSegment.centeredXPosition}, ${contentSegment.centeredYPosition})`
            );
        }

        return label;
    }

    /**
     * Private method: _appendContentSegmentLinkLabelTextElement.
     *
     * It appends a text element to the content segment link label.
     *
     * @param {D3Selection} svgContentSegmentLink The given SVG content segment link selection.
     * @param {number} centeredXPosition The given centered x position.
     * @param {number} centeredYPosition The given centered y position.
     * @returns {D3Selection} Appends a text element to the content segment link selection.
     */
    private _appendContentSegmentLinkLabelTextElement(
        svgContentSegmentLink: D3Selection,
        centeredXPosition: number,
        centeredYPosition: number
    ): D3Selection {
        const attributes = {
            class: 'content-segment-label',
            x: centeredXPosition,
            y: centeredYPosition,
        };
        attributes['font-family'] = this._contentSegmentFontFamily;
        attributes['dominant-baseline'] = 'middle';
        attributes['text-anchor'] = 'middle';

        return this._appendSvgElementWithAttrs(svgContentSegmentLink, 'text', attributes).style(
            'font-size',
            this._contentSegmentFontSize
        );
    }

    /**
     * Private method: _appendContentSegmentLinkLabelTspanElements.
     *
     * It appends tspan elements to the content segment link label.
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
     * It appends a polygon shape to the content segment link.
     *
     * @param {D3Selection} svgContentSegmentLink The given SVG content segment link selection.
     * @param {string} segmentVertices The given segment vertices.
     * @returns {D3Selection} Appends a polygon shape to the content segment link selection.
     */
    private _appendContentSegmentLinkPolygon(svgContentSegmentLink: D3Selection, segmentVertices: string): D3Selection {
        const attributes = {
            class: 'content-segment-shape',
            points: segmentVertices,
            fill: this._contentSegmentFillColor,
        };
        attributes['stroke-width'] = this._contentSegmentStrokeWidth;

        return this._appendSvgElementWithAttrs(svgContentSegmentLink, 'polygon', attributes);
    }

    /**
     * Private method: _appendSheetGroupSheetRectangle.
     *
     * It appends a sheet rectangle to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioCalculationRectangle} sheetRectangle The given sheet rectangle.
     * @returns {D3Selection} Appends a sheet rectangle to the sheet group selection.
     */
    private _appendSheetGroupSheetRectangle(
        svgSheetGroup: D3Selection,
        sheetRectangle: FolioCalculationRectangle
    ): D3Selection {
        const { x: x1, y: y1 } = sheetRectangle.UPPER_LEFT_CORNER;
        const { x: x2, y: y2 } = sheetRectangle.LOWER_RIGHT_CORNER;
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
     * Private method: _appendSheetGroupSheetTitle.
     *
     * It appends a title to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {string} folioId The given folio id.
     * @returns {void} Appends a title to the sheet group selection.
     */
    private _appendSheetGroupSheetTitle(svgSheetGroup: D3Selection, folioId: string): void {
        this._appendSvgElementWithAttrs(svgSheetGroup, 'title', { class: 'sheet-group-title' }).text(`Bl. ${folioId}`);
    }

    /**
     * Private method: _appendSheetGroupTrademark.
     *
     * It appends a trademark to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {FolioCalculationRectangle} trademarkRectangle The given trademark rectangle.
     * @param {string} folioId The given folio id.
     * @param {boolean} systemsReversed The given systems reversed flag.
     * @returns {void} Appends a trademark to the sheet group selection.
     */
    private _appendSheetGroupTrademark(
        svgSheetGroup: D3Selection,
        trademarkRectangle: FolioCalculationRectangle,
        folioId: string,
        systemsReversed: boolean
    ): void {
        const svgTrademarkGroup = this._appendSheetGroupTrademarkGroup(svgSheetGroup, folioId);

        this._appendSheetGroupTrademarkRectangle(svgTrademarkGroup, trademarkRectangle);
        this._appendSheetGroupTrademarkSymbol(svgTrademarkGroup, trademarkRectangle, systemsReversed);
        this._appendSheetGroupTrademarkTitle(svgTrademarkGroup);
    }

    /**
     * Private method: _appendSheetGroupTrademarkGroup.
     *
     * It appends a trademark group to the sheet group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG sheet group selection.
     * @param {string} folioId The given folio id.
     * @returns {D3Selection} Appends a trademark group to the sheet group selection.
     */
    private _appendSheetGroupTrademarkGroup(svgSheetGroup: D3Selection, folioId: string): D3Selection {
        return this._appendSvgElementWithAttrs(svgSheetGroup, 'g', {
            trademarkGroupId: folioId,
            class: 'trademark-group',
        });
    }

    /**
     * Private method: _appendSheetGroupTrademarkRectangle.
     *
     * It appends a trademark rectangle to the trademark group.
     *
     * @param {D3Selection} svgSheetGroup The given SVG trademark group selection.
     * @param {FolioCalculationRectangle} trademarkRectangle The given trademark rectangle.
     * @returns {D3Selection} Appends a trademark rectangle to the trademark group selection.
     */
    private _appendSheetGroupTrademarkRectangle(
        svgTrademarkGroup: D3Selection,
        trademarkRectangle: FolioCalculationRectangle
    ): D3Selection {
        const { x: x1, y: y1 } = trademarkRectangle.UPPER_LEFT_CORNER;
        const { x: x2, y: y2 } = trademarkRectangle.LOWER_RIGHT_CORNER;

        const attributes = {
            class: 'trademark-rectangle',
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            fill: this._sheetFillColor,
            stroke: this._bgColor,
        };
        attributes['stroke-width'] = this._sheetStrokeWidth;

        return this._appendSvgElementWithAttrs(svgTrademarkGroup, 'rect', attributes);
    }

    /**
     * Private method: _appendSheetGroupTrademarkSymbol.
     *
     * It appends a trademark symbol to the trademark group.
     *
     * @param {D3Selection} svgTrademarkGroup The given SVG trademark group selection.
     * @param {FolioCalculationRectangle} trademarkRectangle The given trademark rectangle.
     * @param {boolean} systemsReversed The given systems reversed flag.
     * @returns {D3Selection} Appends a trademark symbol to the trademark group selection.
     */
    private _appendSheetGroupTrademarkSymbol(
        svgTrademarkGroup: D3Selection,
        trademarkRectangle: FolioCalculationRectangle,
        systemsReversed: boolean
    ): D3Selection {
        const { x: x1, y: y1 } = trademarkRectangle.UPPER_LEFT_CORNER;
        const { x: x2, y: y2 } = trademarkRectangle.LOWER_RIGHT_CORNER;
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;

        const symbolPath = `M 10 39 Q 12 36 14 39 T 18 39 Q 20 36 22 39 T 26 39 Q 28 36 30 39 T 34 39 M 10 43 T 34 43 M 14 31 L 15 30 L 17 30 L 15 26 L 17 23 L 22 23 L 18 31 L 14 31 M 20 31 L 21 30 L 23 30 L 21 26 L 22 23 L 27 23 L 24 31 L 20 31 M 14 17 L 18 15 L 21 14 L 22 15 L 21 17 L 18 17 L 14 19 M 13 15 L 14 17 L 14 19 L 13 19 L 13 19 L 12 19 L 13 18 L 12 18 L 13 17 L 12 17 L 13 15 M 17 23 L 20 20 L 21 17 L 22 15 L 25 15 L 27 23 M 26 24 L 30 20 L 30 17 L 29 18 L 28 18 L 28 17 L 30 15 L 31 17 L 31 21 L 26 25 M 25 15 L 27 14 L 26 13 L 27 12 L 26 11 L 27 10 L 26 9 L 27 8 L 26 7 L 25 8 L 24 7 L 23 8 L 22 7 L 21 8 L 20 7 L 19 8 L 18 9 L 19 9 L 21 10 L 18 11 L 20 12 L 18 13 L 21 14 L 22 15`;

        const symbolAttributes = {
            class: 'trademark-symbol',
            d: symbolPath,
            fill: this._disabledColor,
            stroke: this._disabledColor,
            transform: `translate(${centerX - 10}, ${centerY - 10}) scale(0.5)${systemsReversed ? ` rotate(${this._reversedRotationAngle}, 20, 20)` : ''}`,
        };
        symbolAttributes['stroke-width'] = this._contentSegmentStrokeWidth;

        return this._appendSvgElementWithAttrs(svgTrademarkGroup, 'path', symbolAttributes);
    }

    /**
     * Private method: _appendSheetGroupTrademarkTitle.
     *
     * It appends a title to the trademark group.
     *
     * @param {D3Selection} svgTrademarkGroup The given SVG trademark group selection.
     * @returns {D3Selection} Appends a title to the trademark group selection.
     */
    private _appendSheetGroupTrademarkTitle(svgTrademarkGroup: D3Selection): void {
        this._appendSvgElementWithAttrs(svgTrademarkGroup, 'title', { class: 'trademark-title' }).text('Firmenzeichen');
    }

    /**
     * Private method: _appendSystemsGroupLabel.
     *
     * It appends a label to the systems group.
     *
     * @param {D3Selection} svgSystemsGroup The given SVG systems group selection.
     * @param {FolioCalculationPoint} labelPosition The given calculated label position.
     * @param {number} labelIndex The given label index.
     * @returns {void} Appends a label to the systems group selection.
     */
    private _appendSystemsGroupLabel(
        svgSystemsGroup: D3Selection,
        labelPosition: FolioCalculationPoint,
        labelIndex: number
    ): void {
        const attributes = {
            class: 'system-label',
            x: labelPosition.x,
            y: labelPosition.y,
            fill: this._bgColor,
        };
        attributes['dominant-baseline'] = 'hanging';

        this._appendSvgElementWithAttrs(svgSystemsGroup, 'text', attributes).text(labelIndex);
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
            const { x: x1, y: y1 } = line.START_POINT;
            const { x: x2, y: y2 } = line.END_POINT;
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
    private _appendSvgElementWithAttrs(
        parent: D3Selection,
        type: string,
        attributes: Record<string, any>
    ): D3Selection {
        const selection = parent.append(type);
        Object.keys(attributes).forEach(key => {
            selection.attr(key, attributes[key]);
        });
        return selection;
    }
}
