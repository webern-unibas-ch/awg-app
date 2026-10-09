import { vi } from 'vitest';

import * as D3_SELECTION from 'd3-selection';

import { D3Selection } from '@awg-views/edition-view/models/d3-selection.model';
import { EditionSvgLinkBox } from '@awg-views/edition-view/models/edition-svg-link-box.model';
import { EditionSvgOverlayTkk, EditionSvgOverlayTypes } from '@awg-views/edition-view/models/edition-svg-overlay.model';

/**
 * Test helper function: patchSvgSizeForD3Zoom.
 *
 * It patches the SVGSVGElement prototype to provide `width.baseVal` and `height.baseVal`
 * (missing in jsdom), which d3-zoom reads for the extent of the zoom behaviour
 * (e.g., on `scaleTo`). Existing properties are not overwritten.
 *
 * @returns {void} Patches the SVGSVGElement prototype.
 */
export function patchSvgSizeForD3Zoom(): void {
    if (typeof SVGSVGElement === 'undefined') {
        return;
    }
    for (const key of ['width', 'height']) {
        if (!(key in SVGSVGElement.prototype)) {
            Object.defineProperty(SVGSVGElement.prototype, key, {
                configurable: true,
                get() {
                    return { baseVal: { value: 100 } };
                },
            });
        }
    }
}

/**
 * Test helper class: MockResizeObserver.
 *
 * It replaces the ResizeObserver (missing in jsdom)
 * and keeps its callback and observed elements.
 */
export class MockResizeObserver {
    /**
     * The mocked `observe` method: it keeps the observed element.
     */
    readonly observe = vi.fn((element: Element) => {
        this.observedElements.push(element);
    });

    /**
     * The mocked `unobserve` method.
     */
    readonly unobserve = vi.fn();

    /**
     * The mocked `disconnect` method.
     */
    readonly disconnect = vi.fn();

    /**
     * The observed elements.
     */
    readonly observedElements: Element[] = [];

    /**
     * Constructor of the MockResizeObserver.
     *
     * @param {ResizeObserverCallback} callback The given callback of the observer.
     */
    constructor(readonly callback: ResizeObserverCallback) {}

    /**
     * Public method: trigger.
     *
     * It calls the callback of the observer (as on a resize of an observed element).
     *
     * @returns {void} Calls the callback.
     */
    trigger(): void {
        this.callback([], this as unknown as ResizeObserver);
    }
}

/**
 * Test helper function: stubResizeObserver.
 *
 * It stubs the global ResizeObserver (missing in jsdom) with the {@link MockResizeObserver}
 * and keeps all created observers. Restore it with `vi.unstubAllGlobals()`.
 *
 * @returns {MockResizeObserver[]} The created mock observers.
 */
export function stubResizeObserver(): MockResizeObserver[] {
    const mockResizeObservers: MockResizeObserver[] = [];

    vi.stubGlobal(
        'ResizeObserver',
        class extends MockResizeObserver {
            constructor(callback: ResizeObserverCallback) {
                super(callback);
                mockResizeObservers.push(this);
            }
        }
    );

    return mockResizeObservers;
}

/**
 * Test helper function: createD3TestSvg.
 *
 * It creates a svg element with D3 library.
 *
 * @param {Document} doc The document to create the svg in.
 *
 * @returns {D3Selection} The D3 selection of the created svg element.
 */
export function createD3TestSvg(doc: Document): D3Selection {
    const container: HTMLElement = doc.createElement('div');

    return D3_SELECTION.select(container).append('svg').attr('id', 'test-svg');
}

/**
 * Test helper function: createD3TestRootGroup.
 *
 * It creates a svg root group element with D3 library.
 *
 * @param {D3Selection} svg The D3 selection of the svg element to append the root group to.
 *
 * @returns {D3Selection} The D3 selection of the created root group element.
 */
export function createD3TestRootGroup(svg: D3Selection): D3Selection {
    svg.append('g').attr('class', 'svg-root');

    return svg.select('.svg-root');
}

/**
 * Test helper function: createTestTkkOverlay.
 *
 * It creates a tkk overlay with the given id and data id.
 *
 * @param {string} id The id of the tkk group.
 * @param {string} [dataId] The data id of the tkk overlay (default: the id).
 *
 * @returns {EditionSvgOverlayTkk} The tkk overlay.
 */
export function createTestTkkOverlay(id: string, dataId: string = id): EditionSvgOverlayTkk {
    return { type: EditionSvgOverlayTypes.tkk, id, dataId };
}

/**
 * Test helper function: createD3TestTkkGroups.
 *
 * It creates a svg group element for each given overlay with D3 library.
 *
 * @param {D3Selection} svgRootGroup The D3 selection of the root group element to append the overlay groups to.
 * @param {EditionSvgOverlayTkk[]} overlays The array of overlays to create groups for.
 *
 * @returns {D3Selection} The D3 selection of the root group element with the appended overlay groups.
 */
export function createD3TestTkkGroups(svgRootGroup: D3Selection, overlays: EditionSvgOverlayTkk[]): D3Selection {
    overlays.forEach(overlay => {
        svgRootGroup.append('g').attr('class', 'tkk').attr('id', overlay.id);
    });

    return svgRootGroup;
}

/**
 * Test helper function: createD3TestLinkBoxGroups.
 *
 * It creates a svg group element for each given link box with D3 library.
 *
 * @param {D3Selection} svgRootGroup The D3 selection of the root group element to append the link box groups to.
 * @param {EditionSvgLinkBox[]} linkBoxes The array of link boxes to create groups for.
 *
 * @returns {D3Selection} The D3 selection of the root group element with the appended link box groups.
 */
export function createD3TestLinkBoxGroups(svgRootGroup: D3Selection, linkBoxes: EditionSvgLinkBox[]): D3Selection {
    linkBoxes.forEach(linkBox => {
        svgRootGroup.append('g').attr('class', 'link-box').attr('id', linkBox.svgGroupId);
    });

    return svgRootGroup;
}

/**
 * Test helper function: createD3TestSuppliedClassesGroups.
 *
 * It creates a svg group element for each given class name with D3 library.
 *
 * @param {D3Selection} svgRootGroup The D3 selection of the root group element to append the supplied class groups to.
 * @param {string[]} suppliedClassNames The array of class names to create groups for.
 *
 * @returns {D3Selection} The D3 selection of the root group element with the appended supplied class groups.
 */
export function createD3TestSuppliedClassesGroups(
    svgRootGroup: D3Selection,
    suppliedClassNames: string[]
): D3Selection {
    suppliedClassNames.forEach(suppliedClassName => {
        svgRootGroup.append('g').attr('class', suppliedClassName);
    });

    return svgRootGroup;
}
