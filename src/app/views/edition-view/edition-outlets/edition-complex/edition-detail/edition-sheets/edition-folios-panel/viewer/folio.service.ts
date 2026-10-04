import { Injectable } from '@angular/core';

import * as D3_SELECTION from 'd3-selection';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import {
    FolioCalculation,
    FolioCalculationLine,
    FolioCalculationRectangle,
} from '@awg-views/edition-view/models/folio-calculation.model';
import { FolioSettings } from '@awg-views/edition-view/models/folio-settings.model';
import {
    FolioSvgContentSegment,
    FolioSvgData,
    FolioSvgItem,
} from '@awg-views/edition-view/models/folio-svg-data.model';
import { Folio } from '@awg-views/edition-view/models/folio.model';
import { ViewBox } from '@awg-views/edition-view/models/view-box.model';

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
 * The Folio service.
 *
 * It prepares the svg data of the edition folios,
 * renders them into a given svg root group
 * and handles the content segments of the rendered folios.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class FolioService {
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
     * Private readonly variable: _contentSegmentGroupClass.
     *
     * It keeps the css class of the content segment groups.
     */
    private readonly _contentSegmentGroupClass = 'content-segment-group';

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
     * Private readonly variable: _defaultNumberOfSystems.
     *
     * It keeps the default number of systems
     * (reference for the stroke width of the content segments).
     */
    private readonly _defaultNumberOfSystems = 18;

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
     * Public method: getFolioSvgItem.
     *
     * It calculates and provides the folio svg data and the viewbox
     * to render the svg of a given folio (based on its dimensions).
     *
     * @param {Folio} folio The given folio.
     * @returns {FolioSvgItem} The calculated folio svg data and viewbox.
     */
    getFolioSvgItem(folio: Folio): FolioSvgItem {
        const folioSettings: FolioSettings = {
            ...this._folioSettings,
            formatX: +folio.dimensions.width,
            formatY: +folio.dimensions.height,
        };

        const viewBoxWidth = this._calculateViewBoxDimension(folioSettings, 'X');
        const viewBoxHeight = this._calculateViewBoxDimension(folioSettings, 'Y');

        return {
            svgData: this._getFolioSvgData(folioSettings, folio),
            viewBox: new ViewBox(viewBoxWidth, viewBoxHeight),
        };
    }

    /**
     * Public method: getContentSegment.
     *
     * It resolves the content segment hit by a given event target
     * (bound to its content segment group).
     *
     * @param {EventTarget | null} target The given event target.
     *
     * @returns {FolioSvgContentSegment | undefined} The hit content segment, or undefined.
     */
    getContentSegment(target: EventTarget | null): FolioSvgContentSegment | undefined {
        if (!(target instanceof Element)) {
            return undefined;
        }

        const contentSegmentGroup = target.closest(`g.${this._contentSegmentGroupClass}`);
        if (!contentSegmentGroup) {
            return undefined;
        }

        return D3_SELECTION.select(contentSegmentGroup).datum() as FolioSvgContentSegment | undefined;
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
     * Public method: updateActiveContentSegment.
     *
     * It toggles the css class `active` on the content segment groups of a given svg selection
     * according to a given content segment id (sheet id including the partial, if any).
     *
     * @param {D3Selection} svgSelection The given svg selection.
     * @param {string} segmentId The given content segment id.
     * @returns {void} Toggles the css class on the content segment groups.
     */
    updateActiveContentSegment(svgSelection: D3Selection, segmentId: string): void {
        svgSelection
            .selectAll<SVGGElement, FolioSvgContentSegment>(`g.${this._contentSegmentGroupClass}`)
            .classed('active', contentSegment => contentSegment?.sheetId === segmentId);
    }

    /**
     * Private method: _appendRect.
     *
     * It appends a rect element for a given calculated rectangle to a given parent selection.
     *
     * @param {D3Selection} parent The given parent selection.
     * @param {FolioCalculationRectangle} rectangle The given calculated rectangle.
     * @param {string} [cssClass] The optional css class of the rect.
     * @returns {D3Selection} The appended rect selection.
     */
    private _appendRect(parent: D3Selection, rectangle: FolioCalculationRectangle, cssClass?: string): D3Selection {
        const { x: x1, y: y1 } = rectangle.UPPER_LEFT_CORNER;
        const { x: x2, y: y2 } = rectangle.LOWER_RIGHT_CORNER;

        return this._appendSvgElementWithAttrs(parent, 'rect', {
            ...(cssClass ? { class: cssClass } : {}),
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
            fill: this._sheetFillColor,
            stroke: this._bgColor,
            'stroke-width': this._sheetStrokeWidth,
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
     * Private method: _calculateViewBoxDimension.
     *
     * It calculates the width and height for the viewBox string
     * based on the given folio settings.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {string} dimension The given dimension.
     *
     * @returns {number} The calculated dimension.
     */
    private _calculateViewBoxDimension(folioSettings: FolioSettings, dimension: 'X' | 'Y'): number {
        const format = dimension === 'X' ? folioSettings.formatX : folioSettings.formatY;
        const offset = dimension === 'X' ? folioSettings.initialOffsetX : folioSettings.initialOffsetY;

        return (format + 2 * offset) * folioSettings.factor;
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
        const numberOfSystems = folioSvgData.systems.systemsLines.length || this._defaultNumberOfSystems;
        // Dynamically adjust the stroke width based on the number of systems (reference: 18 systems)
        const strokeWidth = this._contentSegmentStrokeWidth * (this._defaultNumberOfSystems / numberOfSystems);

        folioSvgData.contentSegments?.forEach((contentSegment: FolioSvgContentSegment) => {
            const color = contentSegment.selectable ? this._fgColor : this._disabledColor;

            // Group with the content segment bound as datum (resolved by getContentSegment for delegated clicks)
            const segmentGroup = this._appendSvgElementWithAttrs(sheetGroup, 'g', {
                class: this._contentSegmentGroupClass,
                stroke: color,
                fill: color,
            }).datum(contentSegment);
            this._appendSvgElementWithAttrs(segmentGroup, 'title', {}).text(contentSegment.segmentLabel);

            const segmentLink = this._appendSvgElementWithAttrs(segmentGroup, 'a', { class: 'content-segment-link' });
            this._appendSvgElementWithAttrs(segmentLink, 'polygon', {
                class: 'content-segment-shape',
                points: contentSegment.segmentVertices,
                fill: this._contentSegmentFillColor,
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
        const { centeredXPosition: x, centeredYPosition: y } = contentSegment;

        const label = this._appendSvgElementWithAttrs(segmentLink, 'text', {
            class: 'content-segment-label',
            x,
            y,
            'font-family': this._contentSegmentFontFamily,
            'dominant-baseline': 'middle',
            'text-anchor': 'middle',
        }).style('font-size', this._contentSegmentFontSize);

        contentSegment.segmentLabelArray.forEach((labelLine, index) => {
            if (labelLine === '') {
                return;
            }
            // Further lines start again at the center, shifted down by one line
            const lineAttributes: Record<string, string | number> =
                index > 0 ? { x, y, dy: '1.2em', 'text-anchor': 'middle' } : {};
            this._appendSvgElementWithAttrs(label, 'tspan', lineAttributes).text(labelLine);
        });

        if (contentSegment.segmentReversed) {
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
        const { folioId, sheetRectangle, trademarkRectangle } = folioSvgData.sheet;

        this._appendSvgElementWithAttrs(sheetGroup, 'title', { class: 'sheet-group-title' }).text(`Bl. ${folioId}`);
        this._appendRect(sheetGroup, sheetRectangle);

        if (trademarkRectangle) {
            this._drawTrademark(sheetGroup, trademarkRectangle, folioSvgData.systems.systemsReversed);
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
        const { systemsLines, systemsLabelPositions, systemsReversed } = folioSvgData.systems;

        systemsLines.forEach((systemLines: FolioCalculationLine[], systemIndex: number) => {
            const labelIndex = systemsReversed ? systemsLines.length - systemIndex : systemIndex + 1;
            const labelPosition = systemsLabelPositions[systemIndex];

            const systemsGroup = this._appendSvgElementWithAttrs(sheetGroup, 'g', { class: 'systems-group' });
            const systemLineGroup = this._appendSvgElementWithAttrs(systemsGroup, 'g', { class: 'system-line-group' });

            this._appendSvgElementWithAttrs(systemsGroup, 'text', {
                class: 'system-label',
                x: labelPosition.x,
                y: labelPosition.y,
                fill: this._bgColor,
                'dominant-baseline': 'hanging',
            }).text(labelIndex);

            systemLines.forEach(line => {
                this._appendSvgElementWithAttrs(systemLineGroup, 'line', {
                    class: 'system-line',
                    x1: line.START_POINT.x,
                    y1: line.START_POINT.y,
                    x2: line.END_POINT.x,
                    y2: line.END_POINT.y,
                    stroke: this._bgColor,
                    'stroke-width': this._systemsLineStrokeWidth,
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
     * @param {FolioCalculationRectangle} trademarkRectangle The given calculated trademark rectangle.
     * @param {boolean} systemsReversed The given flag if the systems are reversed.
     * @returns {void} Draws the trademark.
     */
    private _drawTrademark(
        sheetGroup: D3Selection,
        trademarkRectangle: FolioCalculationRectangle,
        systemsReversed: boolean
    ): void {
        const trademarkGroup = this._appendSvgElementWithAttrs(sheetGroup, 'g', { class: 'trademark-group' });

        this._appendRect(trademarkGroup, trademarkRectangle, 'trademark-rectangle');

        const { x: x1, y: y1 } = trademarkRectangle.UPPER_LEFT_CORNER;
        const { x: x2, y: y2 } = trademarkRectangle.LOWER_RIGHT_CORNER;
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;

        let transform = `translate(${centerX - 10}, ${centerY - 10}) scale(0.5)`;
        if (systemsReversed) {
            transform += ` rotate(${this._reversedRotationAngle}, 20, 20)`;
        }

        this._appendSvgElementWithAttrs(trademarkGroup, 'path', {
            class: 'trademark-symbol',
            d: TRADEMARK_SYMBOL_PATH,
            fill: this._disabledColor,
            stroke: this._disabledColor,
            transform,
            'stroke-width': this._contentSegmentStrokeWidth,
        });

        this._appendSvgElementWithAttrs(trademarkGroup, 'title', { class: 'trademark-title' }).text('Firmenzeichen');
    }

    /**
     * Private method: _getFolioSvgData.
     *
     * It calculates the folio svg data of a given folio with the given folio settings.
     *
     * @param {FolioSettings} folioSettings The given folio settings.
     * @param {Folio} folio The given folio.
     * @returns {FolioSvgData} The calculated folio svg data.
     */
    private _getFolioSvgData(folioSettings: FolioSettings, folio: Folio): FolioSvgData {
        const calculation = new FolioCalculation(folioSettings, folio, this._contentSegmentOffsetCorrection);

        return new FolioSvgData(calculation);
    }
}
