import { D3Selection, EditionSvgLinkBox, EditionSvgOverlay } from '@awg-app/views/edition-view/models';

import * as D3_SELECTION from 'd3-selection';

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
 * Test helper function: createD3TestTkkGroups.
 *
 * It creates a svg group element for each given overlay with D3 library.
 *
 * @param {D3Selection} svgRootGroup The D3 selection of the root group element to append the overlay groups to.
 * @param {EditionSvgOverlay[]} overlays The array of overlays to create groups for.
 *
 * @returns {D3Selection} The D3 selection of the root group element with the appended overlay groups.
 */
export function createD3TestTkkGroups(svgRootGroup: D3Selection, overlays: EditionSvgOverlay[]): D3Selection {
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
