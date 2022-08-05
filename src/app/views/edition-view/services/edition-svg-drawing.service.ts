import { ElementRef, Injectable } from '@angular/core';

import { D3Selection, ViewBox } from '@awg-views/edition-view/models';

import * as d3_selection from 'd3-selection';
import * as d3_fetch from 'd3-fetch';

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
     * Public variable: deselectionFillColor.
     *
     * It keeps the fill color for deselected overlays.
     */
    deselectionFillColor = 'orange';

    /**
     * Public variable: selectionFillColor.
     *
     * It keeps the fill color for selected overlays.
     */
    selectionFillColor = 'green';

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
        if (!svgFilePath) {
            throw new Error('svgFilePath is not defined');
        }
        if (!svgEl) {
            throw new Error('svgEl is not defined');
        }
        if (!svgRootGroupEl) {
            throw new Error('svgRootGroupEl is not defined');
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
     * Public method: createSVGOverlayGroup.
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
    createSVGOverlayGroup(svgRootGroup: D3Selection | undefined, id: string, dim: DOMRect, type: string): D3Selection {
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
            .attr('fill', this.deselectionFillColor)
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
        if (!svgEl) {
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
        if (!svgRootGroup) {
            return undefined;
        }
        return svgRootGroup.select('#' + id);
    }

    /**
     * Public method: getLinkBoxes.
     *
     * It creates and selects all elements with the "link-box" class, if available, from the given svgRootGroup.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     *
     * @returns {void} Creates and selects the elements.
     */
    getLinkBoxes(svgRootGroup: D3Selection): void {
        const linkBoxGroups = svgRootGroup.selectAll('g.link-box');

        const _self = this;

        linkBoxGroups.each(function () {
            const linkBoxGroup: d3_selection.BaseType = this;
            const linkBoxGroupSelection: D3Selection = d3_selection.select(linkBoxGroup);

            linkBoxGroupSelection.append('g').attr('class', 'link-box-overlay-group');
            const linkBoxOverlayGroupSelection: D3Selection = linkBoxGroupSelection.select('g.link-box-overlay-group');

            // Create overlay box for tka-overlay-group
            const linkBoxGroupBbox: DOMRect = (linkBoxGroup as SVGGElement).getBBox();

            linkBoxOverlayGroupSelection
                .append('rect')
                .attr('width', linkBoxGroupBbox.width)
                .attr('height', linkBoxGroupBbox.height)
                .attr('x', linkBoxGroupBbox.x)
                .attr('y', linkBoxGroupBbox.y)
                .attr('fill', _self.selectionFillColor)
                .attr('opacity', '0')
                .attr('class', 'link-box-overlay-group-box');

            const linkBoxOverlayGroupRectSelection: D3Selection = linkBoxGroupSelection.select(
                'rect.link-box-overlay-group-box'
            );

            linkBoxOverlayGroupSelection
                .on('mouseover', () => {
                    linkBoxOverlayGroupRectSelection.attr('opacity', '0.3');
                })
                .on('mouseout', () => {
                    linkBoxOverlayGroupRectSelection.attr('opacity', '0');
                })
                .on('click', () => {
                    console.info('clicked on link box', linkBoxGroupSelection.attr('id'));
                });
        });
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
        if (!svgRootGroup || !id) {
            return undefined;
        }
        // Get D3 selection of target group
        const targetGroupSelection: D3Selection = this.getD3SelectionById(svgRootGroup, id);
        // Get D3 selection of overlay group box
        return targetGroupSelection.select(`rect.${type}-overlay-group-box`);
    }

    /**
     * Public method: getTkkGroups.
     *
     * It selects all group elements with the "tkk" class, if available, from the given svgRootGroup.
     *
     * @param {D3Selection} svgRootGroup The given D3 selection of the SVG root group.
     *
     * @returns {D3Selection} The D3 selection of the found element.
     */
    getTkkGroups(svgRootGroup: D3Selection): D3Selection {
        if (!svgRootGroup) {
            return undefined;
        }
        return svgRootGroup.selectAll('g.tkk');
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
