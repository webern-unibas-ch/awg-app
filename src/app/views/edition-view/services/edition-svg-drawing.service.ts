import { ElementRef, Injectable } from '@angular/core';

import { D3Selection, EditionSvgOverlay, ViewBox } from '@awg-views/edition-view/models';

import * as d3_fetch from 'd3-fetch';
import * as d3_selection from 'd3-selection';

/**
 * The EditionSvgDrawing service.
 *
 * It handles the creation and handling with SVGs via the D3 library.
 *
 * Provided in: `root`.
 */
@Injectable({ providedIn: 'root' })
export class EditionSvgDrawingService {
    /**
     * Public variable: overlayFillColor.
     *
     * It keeps the fill color for overlays.
     */
    overlayFillColor = 'orange';

    /**
     * Public variable: overlayHoverFillColor.
     *
     * It keeps the fill color for hovered overlays.
     */
    overlayHoverFillColor = 'tomato';

    /**
     * Public variable: overlaySelectionFillColor.
     *
     * It keeps the fill color for selected overlays.
     */
    overlaySelectionFillColor = 'green';

    /**
     * Public variable: linkBoxFillColor.
     *
     * It keeps the fill color for link boxes.
     */
    linkBoxFillColor = '#dddddd';

    /**
     * Public variable: linkBoxHoverFillColor.
     *
     * It keeps the fill color for hovered link boxes.
     */
    linkBoxHoverFillColor = '#eeeeee';

    /**
     * Private variable: _overlayBoxesOpacity.
     *
     * It keeps the default opacity for an overlay box.
     */
    private _overlayBoxesOpacity = 0.3;

    /**
     * Private variable: _overlayBoxesOpacity.
     *
     * It keeps a magic number for (optional) additional space of an overlay box.
     */
    private _overlayBoxAdditionalSpace = 5.5;

    /**
     * Private variable: _overlayBoxesOpacity.
     *
     * It keeps a magic number for (optional) corner radius of an overlay box.
     */
    private _overlayBoxCornerRadius = 2;

    /**
     * Public async method: createSvg.
     *
     * It creates an D3 selection representation of an svg file (given by its path)
     * and returns a promise of the selection.
     *
     * @param {string} svgFilePath The given path to the svg file.
     * @param {SVGSVGElement} svgEl The given SVGSVGElement.
     * @param {SVGGElement} svgRootGroupEl The given SVGGElement.
     *
     * @returns {Promise<D3Selection>} A promise that resolves to the D3 selection.
     */
    async createSvg(svgFilePath: string, svgEl: SVGSVGElement, svgRootGroupEl: SVGGElement): Promise<D3Selection> {
        if (!svgFilePath || !svgEl || !svgRootGroupEl) {
            return undefined;
        }

        // Fetch the SVG file
        const fetchedSvgFile: Document = await this._fetchSvgFile(svgFilePath);

        // Get the SVG XML DOM tree and its content (svg-root)
        const fetchedSvgXML: SVGSVGElement = fetchedSvgFile.getElementsByTagName('svg')[0];

        const vb = this._getViewBox(fetchedSvgXML);

        // Get the reference to the svg root element in the HTML template and append the childNodes of the SVG XML DOM tree to it
        while (fetchedSvgXML.firstChild) {
            svgRootGroupEl.appendChild(fetchedSvgXML.firstChild);
        }

        // Get the reference to the svg element in the HTML template and append the svg root element to it
        svgEl.appendChild(svgRootGroupEl);

        const svg = d3_selection
            .select(svgEl)
            .attr('width', vb.svgWidth)
            .attr('height', vb.svgHeight)
            .attr('viewBox', vb.viewBox) // Append viewbox
            .attr('preserveAspectRatio', 'xMidYMid meet') // Preserve aspect ratio
            .attr('version', '1.1') // Set the version of the SVG to 1.1
            .attr('xmlns', 'https://www.w3.org/2000/svg') // Set the SVG namespace
            .attr('xlink', 'https://www.w3.org/1999/xlink');

        return svg;
    }

    /**
     * Public method: createOverlayGroup.
     *
     * It creates a D3 selection representation of an overlay group (rect)
     * with a given type for an element identified by the given id in the svgRootGroup
     * and returns that selection.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     * @param {string} id The given id.
     * @param {DOMRect} dim The given dimensions of the SVG element.
     * @param {string} type The given type.
     *
     * @returns {D3Selection} The selection of the overlay group.
     */
    createOverlayGroup(svgRootGroup: D3Selection | undefined, id: string, dim: DOMRect, type: string): D3Selection {
        if (!svgRootGroup || !id) {
            return undefined;
        }

        // Get D3 selection of target group
        const targetGroupSelection: D3Selection = this.getD3SelectionById(svgRootGroup, id);

        // Append overlay group to target group
        targetGroupSelection.append('g').attr('class', `${type}-overlay-group`);

        // Get D3 selection of target overlay group
        const targetOverlayGroupSelection: D3Selection = targetGroupSelection.select(`g.${type}-overlay-group`);

        // Create overlay box for tka-overlay-group
        return targetOverlayGroupSelection
            .append('rect')
            .attr('width', dim.width + this._overlayBoxAdditionalSpace * 2)
            .attr('height', dim.height + this._overlayBoxAdditionalSpace * 2)
            .attr('x', dim.x - this._overlayBoxAdditionalSpace)
            .attr('y', dim.y - this._overlayBoxAdditionalSpace)
            .attr('rx', this._overlayBoxCornerRadius)
            .attr('fill', this.overlayFillColor)
            .attr('opacity', this._overlayBoxesOpacity)
            .attr('class', `${type}-overlay-group-box`);
    }

    /**
     * Public method: fillD3SelectionWithColor.
     *
     * It fills the given D3 selection with the given color.
     *
     * @param {D3Selection} svgEl The given D3 selection.
     * @param {string} color The given color.
     *
     * @returns {void} Fills the selection.
     */
    fillD3SelectionWithColor(svgEl: D3Selection | undefined, color: string): void {
        if (!svgEl || !color) {
            return;
        }
        svgEl.attr('fill', color);
    }

    /**
     * Public method: getContainerDimensions.
     *
     * It returns the dimensions (width and height) of a given container element.
     *
     * @param {ElementRef} containerEl The given container element.
     *
     * @returns {{ width: number; height: number }} The dimensions (width and height) of the container element.
     */
    getContainerDimensions(containerEl: ElementRef): { width: number; height: number } {
        if (!containerEl) {
            return { width: undefined, height: undefined };
        }

        const w = containerEl.nativeElement.clientWidth;
        const h = containerEl.nativeElement.clientHeight;

        return {
            width: w,
            height: h,
        };
    }

    /**
     * Public method: getD3SelectionById.
     *
     * It selects an element with the given id, if available, from the given svgRootGroup.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     * @param {string} id The given id.
     *
     * @returns {D3Selection} The D3 selection of the found element.
     */
    getD3SelectionById(svgRootGroup: D3Selection, id: string): D3Selection {
        if (!svgRootGroup || !id) {
            return undefined;
        }
        return svgRootGroup.select('#' + id);
    }

    /**
     * Public method: getGroupsBySelector.
     *
     * It selects all groups with the "given selector class, if available, from the given svgRootGroup.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     * @param {string} selector The given selector class.
     *
     * @returns {D3Selection} The D3 selection of all found groups.
     */
    getGroupsBySelector(svgRootGroup: D3Selection, selector: string): D3Selection {
        if (!svgRootGroup) {
            return undefined;
        }
        return svgRootGroup.selectAll('g.' + selector);
    }

    /**
     * Public method: getOverlayGroupRectSelection.
     *
     * It selects an overlay group box (rect) with a given type from an element identified by the given id in the given svgRootGroup.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     * @param {string} id The given id.
     * @param {string} type The given type.
     *
     * @returns {D3Selection} The D3 selection of the found element.
     */
    getOverlayGroupRectSelection(svgRootGroup: D3Selection, id: string, type: string): D3Selection {
        if (!svgRootGroup || !id || !type) {
            return undefined;
        }
        // Get D3 selection of target group
        const targetGroupSelection: D3Selection = this.getD3SelectionById(svgRootGroup, id);
        // Get D3 selection of overlay group box
        return targetGroupSelection.select(`rect.${type}-overlay-group-box`);
    }

    /**
     * Public method: updateTkkOverlayColor.
     *
     * It updates the color of the given tkk overlay.
     *
     * @param {EditionSvgOverlay} overlay The given overlay.
     * @param {D3Selection} overlayGroupRectSelection The given overlay group rect selection.
     * @param {string} overlayActionType The type of the overlay action (`fill` or `hover`).
     *
     * @returns {void} Updates the color of the given tkk overlay.
     */
    updateTkkOverlayColor(
        overlay: EditionSvgOverlay,
        overlayGroupRectSelection: D3Selection,
        overlayActionType: 'fill' | 'hover'
    ): void {
        const color = this._getTkkOverlayColor(overlay, overlayActionType);
        this.fillD3SelectionWithColor(overlayGroupRectSelection, color);
    }

    /**
     * Private method; _fetchSvgFile.
     *
     * It fetches an SVG file from the given path via fetch method from D3 library.
     *
     * @param {string} path The path to the SVG file.
     *
     * @returns {Promise<Document>} A promise that resolves to the SVG file as Document.
     */
    private _fetchSvgFile(path: string): Promise<Document> {
        return d3_fetch.svg(path);
    }

    /**
     * Private method: _getTkkOverlayColor.
     *
     * It returns the color of the given tkk overlay.
     *
     * @param {EditionSvgOverlay} overlay The given overlay.
     * @param {string} overlayActionType The type of the overlay action (`fill` or `hover`).
     *
     * @returns {string} The color of the given tkk overlay.
     */
    private _getTkkOverlayColor(overlay: EditionSvgOverlay, overlayActionType: 'fill' | 'hover'): string {
        let color = this.overlayFillColor;
        if (overlay) {
            if (overlay.isSelected) {
                color = this.overlaySelectionFillColor;
            } else if (overlayActionType === 'hover') {
                color = this.overlayHoverFillColor;
            }
        }
        return color;
    }

    /**
     * Private method: _getViewBox.
     *
     * It reads out the viewBox attribute of a given SVGSVGElement and creates a ViewBox object.
     *
     * @param {SVGSVGElement} svgXML The SVGSVGElement.
     *
     * @returns {ViewBox} The ViewBox object.
     */
    private _getViewBox(svgXML: SVGSVGElement): ViewBox {
        // Get the viewBox attributes from the SVG XML DOM tree
        const svgXMLViewBox: string = d3_selection.select(svgXML).attr('viewBox');

        const viewBoxParts = svgXMLViewBox.split(' ');

        const width = +viewBoxParts[2];
        const height = +viewBoxParts[3];

        return new ViewBox(width, height);
    }
}
