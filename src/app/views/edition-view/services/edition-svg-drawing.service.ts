import { ElementRef, Injectable } from '@angular/core';

import { D3Selection, EditionSvgOverlayTypes, ViewBox } from '@awg-views/edition-view/models';

import * as D3_FETCH from 'd3-fetch';
import * as D3_SELECTION from 'd3-selection';

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
     * Private variable: _suppliedClasses
     *
     * It keeps a map of all supplied classes from the SVG sheet root group.
     */
    private _suppliedClasses: Map<string, boolean> = new Map();

    /**
     * Private readonly variable: _suppliedClassesLabelLookup
     *
     * It keeps a lookup table for the supplied classes.
     */
    private readonly _suppliedClassesLabelLookup: Map<string, string> = new Map([
        ['foliation', 'Blattangabe'],
        ['staffN', 'Systemangabe'],
        ['measureN', 'Taktzahlen'],
        ['clef', 'Schlüssel'],
        ['clef_key', 'Schlüssel mit Tonart'],
        ['key', 'Tonart'],
        ['accid', 'Akzidenzien'],
        ['hyphen', 'Silbentrennung'],
    ]);

    /**
     * Public async method: createSvg.
     *
     * It creates an D3 selection representation of an svg file (given by its path)
     * and returns a promise of the selection.
     *
     * @param {string} svgFilePath The given path to the svg file.
     * @param {SVGSVGElement| undefined} svgEl The given SVGSVGElement, or undefined.
     * @param {SVGGElement| undefined} svgRootGroupEl The given SVGGElement, or undefined.
     *
     * @returns {Promise<D3Selection | undefined>} A promise that resolves to the D3 selection, or undefined.
     */
    async createSvg(
        svgFilePath: string,
        svgEl: SVGSVGElement | undefined,
        svgRootGroupEl: SVGGElement | undefined
    ): Promise<D3Selection | undefined> {
        if (!svgFilePath || !svgEl || !svgRootGroupEl) {
            return undefined;
        }

        // Fetch the SVG file
        const fetchedSvgFile: Document = await this._fetchSvgFile(svgFilePath);

        // Get the SVG XML DOM tree and its content (svg-root)
        const fetchedSvgXML: SVGSVGElement | undefined = fetchedSvgFile.getElementsByTagName('svg')[0];
        if (!fetchedSvgXML) {
            console.error('[EditionSvgDrawingService]: The fetched file does not contain a valid <svg> element.');
            return undefined;
        }

        const vb = this._getViewBox(fetchedSvgXML);

        // Get the reference to the svg root element in the HTML template and append the childNodes of the SVG XML DOM tree to it
        while (fetchedSvgXML.firstChild) {
            svgRootGroupEl.appendChild(fetchedSvgXML.firstChild);
        }

        // Get the reference to the svg element in the HTML template and append the svg root element to it
        svgEl.appendChild(svgRootGroupEl);

        const svg = D3_SELECTION.select(svgEl)
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
    getContainerDimensions(containerEl: ElementRef<HTMLElement>): { width: number; height: number } {
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
     * @param {D3Selection | undefined} svgRootGroup The given D3 selection of the SVG root group, or undefined.
     * @param {string} id The given id.
     *
     * @returns {D3Selection | undefined} The D3 selection of the found element, or undefined.
     */
    getD3SelectionById(svgRootGroup: D3Selection | undefined, id: string): D3Selection | undefined {
        if (!svgRootGroup || !id) {
            return undefined;
        }

        return svgRootGroup.select('#' + id);
    }

    /**
     * Public method: getD3SelectionByDataId.
     *
     * Selects elements by a data attribute (default: data-tkk-id) or falls back to id.
     *
     * @param {D3Selection | undefined} svgRootGroup The D3 selection of the SVG root group, or undefined.
     * @param {string} dataId The data id to select.
     * @param {string} attr The data attribute name (default: 'data-tkk-id').
     *
     * @returns {D3Selection | undefined} The D3 selection of the found element(s), or undefined.
     */
    getD3SelectionByDataId(
        svgRootGroup: D3Selection | undefined,
        dataId: string,
        attr: string = EditionSvgOverlayTypes.dataTkkId
    ): D3Selection | undefined {
        if (!svgRootGroup) {
            return undefined;
        }

        const selector = `[${attr}="${dataId}"]`;
        const selection = svgRootGroup.selectAll(selector);
        return selection.empty() ? this.getD3SelectionById(svgRootGroup, dataId) : selection;
    }

    /**
     * Public method: getGroupsBySelector.
     *
     * It selects all groups with the "given selector class, if available, from the given svgRootGroup.
     *
     * @param {D3Selection | undefined} svgRootGroup The given D3 selection of the SVG root group, or undefined.
     * @param {string} selector The given selector class.
     * @returns {D3Selection | undefined} The D3 selection of all found groups, or undefined.
     */
    getGroupsBySelector(svgRootGroup: D3Selection | undefined, selector: string): D3Selection | undefined {
        if (!svgRootGroup) {
            return undefined;
        }

        return svgRootGroup.selectAll('g.' + selector);
    }

    /**
     * Public method: getSuppliedClasses.
     *
     * It gets all supplied classes from the SVG sheet root group.
     *
     * @param {D3Selection | undefined} svgRootGroup The given D3 selection of the SVG root group, or undefined.
     *
     * @returns {Map<string, boolean>} A map of all supplied classes from the SVG sheet root group.
     */
    getSuppliedClasses(svgRootGroup: D3Selection | undefined): Map<string, boolean> {
        // (Re-)Initialize the map
        this._suppliedClasses = new Map();

        if (!svgRootGroup) {
            return this._suppliedClasses;
        }

        const suppliedSelections = this.getGroupsBySelector(svgRootGroup, 'supplied');
        if (!suppliedSelections) {
            return this._suppliedClasses;
        }

        suppliedSelections.each((_d, i, nodes) => {
            const element = D3_SELECTION.select(nodes[i]);
            const classNames = element.attr('class').split(' ');
            const nextToSupplied = classNames[classNames.indexOf('supplied') + 1];
            if (nextToSupplied) {
                // Look up the class label in the mapping object
                const classLabel = this._suppliedClassesLabelLookup.get(nextToSupplied) || nextToSupplied;

                // Initialize the visibility state of the class
                if (!this._suppliedClasses.has(classLabel)) {
                    this._suppliedClasses.set(classLabel, true);
                }
            }
        });

        return this._suppliedClasses;
    }

    /**
     * Public method: toggleSuppliedClassOpacity.
     *
     * It toggles the opacity of the supplied class with the given className.
     *
     * @param {D3Selection | undefined} svgRootGroup The given D3 selection of the SVG root group, or undefined.
     * @param {string} labelOrClassName The given class label or class name if label is not provided (or empty string for all classes).
     * @param {boolean} isCurrentlyVisible The given current visibility state of the class.
     *
     * @returns {void} Toggles the opacity of the supplied class with the given className.
     */
    toggleSuppliedClassOpacity(
        svgRootGroup: D3Selection | undefined,
        labelOrClassName: string,
        isCurrentlyVisible: boolean
    ): void {
        if (!svgRootGroup) {
            return;
        }

        // Reverse lookup to get the class name from the lookup table
        const className =
            Array.from(this._suppliedClassesLabelLookup.entries()).find(
                ([, value]) => value === labelOrClassName
            )?.[0] || labelOrClassName;

        // Get D3 selection of supplied elements
        const selector = className ? `supplied.${className}` : 'supplied';
        const suppliedSelections = this.getGroupsBySelector(svgRootGroup, selector);
        if (!suppliedSelections) {
            return;
        }

        const opacity = isCurrentlyVisible ? 0 : 1;
        suppliedSelections.style('opacity', opacity);
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
        return D3_FETCH.svg(path);
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
        const svgXMLViewBox: string = D3_SELECTION.select(svgXML).attr('viewBox');

        const viewBoxParts = svgXMLViewBox.split(' ');

        const width = +viewBoxParts[2];
        const height = +viewBoxParts[3];

        return new ViewBox(width, height);
    }
}
