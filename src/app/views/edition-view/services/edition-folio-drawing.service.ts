import { Injectable } from '@angular/core';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import {
    calculateFolioSvgData,
    FOLIO_DEFAULT_NUMBER_OF_SYSTEMS,
    FolioSettings,
} from '@awg-views/edition-view/models/folio-calculation.model';
import {
    FOLIO_SVG_CONTENT_SEGMENT_GROUP_CLASS,
    FolioSvgContentSegment,
    FolioSvgData,
    FolioSvgLine,
    FolioSvgRectangle,
} from '@awg-views/edition-view/models/folio-svg-data.model';
import { Folio } from '@awg-views/edition-view/models/folio.model';

/**
 * Constant: TRADEMARK_SYMBOL_PATH.
 *
 * It keeps the svg path of the trademark symbol of a folio.
 */
const TRADEMARK_SYMBOL_PATH =
    'M 10 39 Q 12 36 14 39 T 18 39 Q 20 36 22 39 T 26 39 Q 28 36 30 39 T 34 39 M 10 43 T 34 43 ' +
    'M 14 31 L 15 30 L 17 30 L 15 26 L 17 23 L 22 23 L 18 31 L 14 31 ' +
    'M 20 31 L 21 30 L 23 30 L 21 26 L 22 23 L 27 23 L 24 31 L 20 31 ' +
    'M 14 17 L 18 15 L 21 14 L 22 15 L 21 17 L 18 17 L 14 19 ' +
    'M 13 15 L 14 17 L 14 19 L 13 19 L 13 19 L 12 19 L 13 18 L 12 18 L 13 17 L 12 17 L 13 15 ' +
    'M 17 23 L 20 20 L 21 17 L 22 15 L 25 15 L 27 23 ' +
    'M 26 24 L 30 20 L 30 17 L 29 18 L 28 18 L 28 17 L 30 15 L 31 17 L 31 21 L 26 25 ' +
    'M 25 15 L 27 14 L 26 13 L 27 12 L 26 11 L 27 10 L 26 9 L 27 8 L 26 7 L 25 8 L 24 7 L 23 8 L 22 7 L 21 8 ' +
    'L 20 7 L 19 8 L 18 9 L 19 9 L 21 10 L 18 11 L 20 12 L 18 13 L 21 14 L 22 15';

/**
 * The EditionFolioDrawing service.
 *
 * It prepares the svg data of the edition folios
 * and draws them into a given svg root group.
 * The interaction with the drawn content segments is handled
 * by the {@link EditionFolioSegmentService}.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionFolioDrawingService {
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
     * Private readonly variable: _folioSettings.
     *
     * It keeps the default format settings for the folios.
     */
    private readonly _folioSettings: FolioSettings = {
        factor: 1.5,
        formatX: 175,
        formatY: 270,
        initialOffsetX: 5,
        initialOffsetY: 5,
    };

    /**
     * Private readonly variable: _reversedRotationAngle.
     *
     * It keeps the rotation angle for a reversed item.
     */
    private readonly _reversedRotationAngle = 180;

    /**
     * Public method: getFolioSvgData.
     *
     * It calculates the svg data (sheet, systems, content segments and viewbox)
     * to render the svg of a given folio, based on its dimensions.
     *
     * @param {Folio} folio The given folio.
     * @returns {FolioSvgData} The calculated folio svg data.
     */
    getFolioSvgData(folio: Folio): FolioSvgData {
        const folioSettings: FolioSettings = {
            ...this._folioSettings,
            formatX: +folio.dimensions.width,
            formatY: +folio.dimensions.height,
        };

        return calculateFolioSvgData(folioSettings, folio, this._contentSegmentOffsetCorrection);
    }

    /**
     * Public method: renderFolio.
     *
     * It renders the given folio svg data into a given svg root group selection:
     * it clears the content of the root group and draws the sheet,
     * the systems and the content segments of the folio.
     *
     * @param {D3Selection} svgRootGroupSelection The given svg root group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio svg data.
     * @returns {void} Renders the folio into the svg root group selection.
     */
    renderFolio(svgRootGroupSelection: D3Selection, folioSvgData: FolioSvgData): void {
        // Clear the content of the root group before redrawing
        svgRootGroupSelection.selectAll('*').remove();

        const sheetGroup = this._appendSvgElementWithAttrs(svgRootGroupSelection, 'g', { class: 'sheet-group' });

        this._drawSheet(sheetGroup, folioSvgData);
        this._drawSystems(sheetGroup, folioSvgData);
        this._drawContentSegments(sheetGroup, folioSvgData);
    }

    /**
     * Private method: _appendRect.
     *
     * It appends a rect element for a given calculated rectangle to a given parent selection.
     *
     * @param {D3Selection} parent The given parent selection.
     * @param {FolioSvgRectangle} rectangle The given calculated rectangle.
     * @param {string} cssClass The css class of the rect.
     * @returns {D3Selection} The appended rect selection.
     */
    private _appendRect(parent: D3Selection, rectangle: FolioSvgRectangle, cssClass: string): D3Selection {
        const { x: x1, y: y1 } = rectangle.upperLeft;
        const { x: x2, y: y2 } = rectangle.lowerRight;

        return this._appendSvgElementWithAttrs(parent, 'rect', {
            class: cssClass,
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
        });
    }

    /**
     * Private method: _appendSvgElementWithAttrs.
     *
     * It appends an svg element of a given type with the given attributes to a given parent selection.
     *
     * @param {D3Selection} parent The given parent selection.
     * @param {string} type The given element type.
     * @param {Record<string, string | number>} attributes The given attributes.
     * @returns {D3Selection} The appended element selection.
     */
    private _appendSvgElementWithAttrs(
        parent: D3Selection,
        type: string,
        attributes: Record<string, string | number>
    ): D3Selection {
        const selection = parent.append(type);
        Object.entries(attributes).forEach(([key, value]) => {
            selection.attr(key, value);
        });
        return selection;
    }

    /**
     * Private method: _drawContentSegments.
     *
     * It draws the content segments of the given folio svg data into a given sheet group:
     * per content segment a group (with the content segment bound as datum and a title)
     * containing a link with the segment polygon and the segment label.
     *
     * @param {D3Selection} sheetGroup The given sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio svg data.
     * @returns {void} Draws the content segments.
     */
    private _drawContentSegments(sheetGroup: D3Selection, folioSvgData: FolioSvgData): void {
        const numberOfSystems = folioSvgData.systems.lines.length || FOLIO_DEFAULT_NUMBER_OF_SYSTEMS;
        // Dynamically adjust the stroke width based on the number of systems (reference: 18 systems)
        const strokeWidth = this._contentSegmentStrokeWidth * (FOLIO_DEFAULT_NUMBER_OF_SYSTEMS / numberOfSystems);

        folioSvgData.contentSegments.forEach((contentSegment: FolioSvgContentSegment) => {
            // Group with the content segment bound as datum (resolved by getContentSegment for delegated clicks)
            const segmentGroup = this._appendSvgElementWithAttrs(sheetGroup, 'g', {
                class: FOLIO_SVG_CONTENT_SEGMENT_GROUP_CLASS,
            })
                .classed('selectable', contentSegment.selectable)
                .datum(contentSegment);
            this._appendSvgElementWithAttrs(segmentGroup, 'title', {}).text(contentSegment.label);

            const segmentLink = this._appendSvgElementWithAttrs(segmentGroup, 'a', { class: 'content-segment-link' });
            this._appendSvgElementWithAttrs(segmentLink, 'polygon', {
                class: 'content-segment-shape',
                points: contentSegment.vertices,
                'stroke-width': strokeWidth,
            });

            this._drawContentSegmentLabel(segmentLink, contentSegment);
        });
    }

    /**
     * Private method: _drawContentSegmentLabel.
     *
     * It draws the (one- or two-line) label of a given content segment into a given link selection,
     * rotated by 180 degrees around its center if the segment is reversed.
     *
     * @param {D3Selection} segmentLink The given content segment link selection.
     * @param {FolioSvgContentSegment} contentSegment The given content segment.
     * @returns {void} Draws the content segment label.
     */
    private _drawContentSegmentLabel(segmentLink: D3Selection, contentSegment: FolioSvgContentSegment): void {
        const { x, y } = contentSegment.center;

        const label = this._appendSvgElementWithAttrs(segmentLink, 'text', {
            class: 'content-segment-label',
            x,
            y,
            'dominant-baseline': 'middle',
            'text-anchor': 'middle',
        });

        contentSegment.labelLines.forEach((labelLine, index) => {
            if (labelLine === '') {
                return;
            }
            // Further lines start again at the center, shifted down by one line
            const lineAttributes: Record<string, string | number> =
                index > 0 ? { x, y, dy: '1.2em', 'text-anchor': 'middle' } : {};
            this._appendSvgElementWithAttrs(label, 'tspan', lineAttributes).text(labelLine);
        });

        if (contentSegment.reversed) {
            label.attr('transform', `rotate(${this._reversedRotationAngle}, ${x}, ${y})`);
        }
    }

    /**
     * Private method: _drawSheet.
     *
     * It draws the sheet of the given folio svg data into a given sheet group:
     * the title, the sheet rectangle and (if given) the trademark.
     *
     * @param {D3Selection} sheetGroup The given sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio svg data.
     * @returns {void} Draws the sheet.
     */
    private _drawSheet(sheetGroup: D3Selection, folioSvgData: FolioSvgData): void {
        const { folioId, rectangle, trademarkRectangle } = folioSvgData.sheet;

        this._appendSvgElementWithAttrs(sheetGroup, 'title', { class: 'sheet-group-title' }).text(`Bl. ${folioId}`);
        this._appendRect(sheetGroup, rectangle, 'sheet-rectangle');

        if (trademarkRectangle) {
            this._drawTrademark(sheetGroup, trademarkRectangle, folioSvgData.systems.reversed);
        }
    }

    /**
     * Private method: _drawSystems.
     *
     * It draws the systems of the given folio svg data into a given sheet group:
     * per system a group with its label (numbered in reverse if the systems are reversed)
     * and a group with its lines.
     *
     * @param {D3Selection} sheetGroup The given sheet group selection.
     * @param {FolioSvgData} folioSvgData The given calculated folio svg data.
     * @returns {void} Draws the systems.
     */
    private _drawSystems(sheetGroup: D3Selection, folioSvgData: FolioSvgData): void {
        const { lines, labelFontSize, labelPositions, reversed } = folioSvgData.systems;

        lines.forEach((systemLines: FolioSvgLine[], systemIndex: number) => {
            const labelIndex = reversed ? lines.length - systemIndex : systemIndex + 1;
            const labelPosition = labelPositions[systemIndex];

            const systemsGroup = this._appendSvgElementWithAttrs(sheetGroup, 'g', { class: 'systems-group' });
            const systemLineGroup = this._appendSvgElementWithAttrs(systemsGroup, 'g', { class: 'system-line-group' });

            this._appendSvgElementWithAttrs(systemsGroup, 'text', {
                class: 'system-label',
                x: labelPosition.x,
                y: labelPosition.y,
                'font-size': labelFontSize,
                'text-anchor': 'end',
            }).text(labelIndex);

            systemLines.forEach(line => {
                this._appendSvgElementWithAttrs(systemLineGroup, 'line', {
                    class: 'system-line',
                    x1: line.start.x,
                    y1: line.start.y,
                    x2: line.end.x,
                    y2: line.end.y,
                });
            });
        });
    }

    /**
     * Private method: _drawTrademark.
     *
     * It draws the trademark into a given sheet group:
     * a group with the trademark rectangle, the trademark symbol
     * (rotated by 180 degrees if the systems are reversed) and a title.
     *
     * @param {D3Selection} sheetGroup The given sheet group selection.
     * @param {FolioSvgRectangle} trademarkRectangle The given calculated trademark rectangle.
     * @param {boolean} systemsReversed The given flag if the systems are reversed.
     * @returns {void} Draws the trademark.
     */
    private _drawTrademark(
        sheetGroup: D3Selection,
        trademarkRectangle: FolioSvgRectangle,
        systemsReversed: boolean
    ): void {
        const trademarkGroup = this._appendSvgElementWithAttrs(sheetGroup, 'g', { class: 'trademark-group' });

        this._appendRect(trademarkGroup, trademarkRectangle, 'trademark-rectangle');

        const { x: x1, y: y1 } = trademarkRectangle.upperLeft;
        const { x: x2, y: y2 } = trademarkRectangle.lowerRight;
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;

        let transform = `translate(${centerX - 10}, ${centerY - 10}) scale(0.5)`;
        if (systemsReversed) {
            transform += ` rotate(${this._reversedRotationAngle}, 20, 20)`;
        }

        this._appendSvgElementWithAttrs(trademarkGroup, 'path', {
            class: 'trademark-symbol',
            d: TRADEMARK_SYMBOL_PATH,
            transform,
        });

        this._appendSvgElementWithAttrs(trademarkGroup, 'title', { class: 'trademark-title' }).text('Firmenzeichen');
    }
}
