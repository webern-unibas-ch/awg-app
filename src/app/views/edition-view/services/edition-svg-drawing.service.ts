import { ElementRef, Injectable } from '@angular/core';

import { D3Selection, ViewBox } from '@awg-views/edition-view/models';

import * as d3_selection from 'd3-selection';
import * as d3_fetch from 'd3-fetch';

@Injectable({ providedIn: 'root' })
export class EditionSvgDrawingService {
    deselectionFillColor = 'orange';
    selectionFillColor = 'green';

    // Magic numbers for overlay boxes
    private _overlayBoxesOpacity = 0.3;
    private _overlayBoxAdditionalSpace = 5.5;
    private _overlayBoxCornerRadius = 2;

    async createSvg(svgFilePath: string, svgEl: SVGSVGElement, svgRootEl: SVGGElement): Promise<D3Selection> {
        if (!svgFilePath) {
            throw new Error('svgFilePath is not defined');
        }
        if (!svgEl) {
            throw new Error('svgEl is not defined');
        }
        if (!svgRootEl) {
            throw new Error('svgRootEl is not defined');
        }

        // Fetch the SVG file
        const fetchedSvgFile: Document = await this._fetchSvgFile(svgFilePath);

        // Get the SVG XML DOM tree and its content (svg-root)
        const fetchedSvgXML: SVGSVGElement = fetchedSvgFile.getElementsByTagName('svg')[0];

        const vb = this._getViewBox(fetchedSvgXML);

        // Get the reference to the svg root element in the HTML template and append the childNodes of the SVG XML DOM tree to it
        while (fetchedSvgXML.firstChild) {
            svgRootEl.appendChild(fetchedSvgXML.firstChild);
        }

        // Get the reference to the svg element in the HTML template and append the svg root element to it
        svgEl.appendChild(svgRootEl);

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

    createSVGOverlayGroup(svgRoot: D3Selection | undefined, id: string, dim: DOMRect, type: string): D3Selection {
        if (!svgRoot || !id) {
            return undefined;
        }

        // Get D3 selection of target group
        const targetGroupSelection: D3Selection = this.getD3SelectionById(svgRoot, id);

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

    fillD3SelectionWithColor(svgSel: D3Selection | undefined, color: string): void {
        if (!svgSel) {
            return;
        }
        svgSel.attr('fill', color);
    }

    getContainerDimensions(container: ElementRef, width: number, height: number): { width: number; height: number } {
        if (!container) {
            return { width: undefined, height: undefined };
        }

        const w = width ? width : this._getElementDimensions(container).width;
        const h = height ? height : this._getElementDimensions(container).height;

        return {
            width: w,
            height: h,
        };
    }

    getD3SelectionById(svgRoot: D3Selection, id: string): D3Selection {
        if (!svgRoot) {
            return undefined;
        }
        return svgRoot.select('#' + id);
    }

    getLinkBoxes(svgRoot: D3Selection): void {
        const linkBoxGroups = svgRoot.selectAll('g.link-box');

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

    getOverlayGroupRectSelection(svgRoot: D3Selection, id: string, type: string): D3Selection {
        if (!svgRoot || !id) {
            return undefined;
        }
        // Get D3 selection of target group
        const targetGroupSelection: D3Selection = this.getD3SelectionById(svgRoot, id);
        // Get D3 selection of overlay group box
        return targetGroupSelection.select(`rect.${type}-overlay-group-box`);
    }

    getTkkGroups(svgRoot: D3Selection): D3Selection {
        if (!svgRoot) {
            return undefined;
        }
        return svgRoot.selectAll('g.tkk');
    }

    private _fetchSvgFile(path: string): Promise<Document> {
        return d3_fetch.svg(path);
    }

    /**
     * Private method: _getElementDimensions.
     *
     * It returns the dimensions (clientWidth & clientHeight) of a given element.
     *
     * @param {ElementRef} el The given element.
     *
     * @returns { width: number; height: number } The element dimensions.
     */
    private _getElementDimensions(el: ElementRef): { width: number; height: number } {
        if (!el || !el.nativeElement) {
            return null;
        }
        return { width: el.nativeElement.clientWidth, height: el.nativeElement.clientHeight };
    }

    private _getViewBox(svgXML: SVGSVGElement): ViewBox {
        // Get the viewBox attributes from the SVG XML DOM tree
        const svgXMLViewBox: string = d3_selection.select(svgXML).attr('viewBox');

        const viewBoxParts = svgXMLViewBox.split(' ');

        const width = +viewBoxParts[2];
        const height = +viewBoxParts[3];

        return new ViewBox(width, height);
    }
}
