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
     * Private variable: _contentSegmentFillColor.
     *
     * It keeps the fill color for the content segments.
     */
    private _contentSegmentFillColor = '#eeeeee';

    /**
     * Private variable: _contentSegmentFontStyle.
     *
     * It keeps the font style for the content segments.
     */
    private _contentSegmentFontStyle = '11px Source Sans Pro, source-sans-pro, sans-serif';

    /**
     * Private variable: _contentSegmentOffsetCorrection.
     *
     * It corrects the offset (in px) to avoid
     * border collision between rendered SVG content segments.
     */
    private _contentSegmentOffsetCorrection = 4;

    /**
     * Private variable: _contentSegmentRotationAngle.
     *
     * It keeps the rotation angle for the reversed content segments.
     */
    private _contentSegmentReversedRotationAngle = 180;

    /**
     * Private variable: _contentSegmentStrokeWidth.
     *
     * It keeps the stroke width for the content segments.
     */
    private _contentSegmentStrokeWidth = 2;

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
        const svgSheetGroup = this._appendCanvasSheetGroup(svgCanvas, folioSvgData);

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
            this._appendContentSegmentLinkPolygon(svgContentSegmentLink, contentSegment.polygonCornerPoints);

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
                ? this.ref.selectSvgSheet(contentSegment.complexId, contentSegment.sheetId)
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
        if (contentSegment.reversed) {
            label.attr(
                'transform',
                `rotate(${this._contentSegmentReversedRotationAngle}, ${contentSegment.centeredXPosition}, ${contentSegment.centeredYPosition})`
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
            style: this._contentSegmentFontStyle,
        };
        attributes['dominant-baseline'] = 'middle';
        attributes['text-anchor'] = 'middle';

        return this._appendSvgElementWithAttrs(svgContentSegmentLink, 'text', attributes);
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
     * @param {string} polygonCornerPoints The given polygon corner points.
     * @returns {D3Selection} Appends a polygon shape to the content segment link selection.
     */
    private _appendContentSegmentLinkPolygon(
        svgContentSegmentLink: D3Selection,
        polygonCornerPoints: string
    ): D3Selection {
        const attributes = {
            class: 'content-segment-shape',
            points: polygonCornerPoints,
            fill: this._contentSegmentFillColor,
        };
        attributes['stroke-width'] = this._contentSegmentStrokeWidth;

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
