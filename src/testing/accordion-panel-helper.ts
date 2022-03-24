import { DebugElement } from '@angular/core';

import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

/**
 * Test helper function: expectClosedPanelBody.
 *
 * It checks if a given ngb-accordion panel is closed.
 *
 * @param {DebugElement} de The DebugElement.
 * @param {string} id The id of the panel.
 * @param {string} msg The msg to be displayed in Expectation.
 *
 * @returns {void} Sends the given values to getAndExpect helper.
 */
export function expectClosedPanelBody(de: DebugElement, id: string, msg: string) {
    getAndExpectDebugElementByCss(de, `div.accordion-item > div#${id} > div.accordion-body`, 0, 0, msg);
}

/**
 * Test helper function: expectClosedPanelBody.
 *
 * It checks if a given ngb-accordion panel is open.
 *
 * @param {DebugElement} de The DebugElement.
 * @param {string} id The id of the panel.
 * @param {string} msg The msg to be displayed in Expectation.
 *
 * @returns {void} Sends the given values to getAndExpect helper.
 */
export function expectOpenPanelBody(de: DebugElement, id: string, msg: string) {
    getAndExpectDebugElementByCss(de, `div.accordion-item > div#${id} > div.accordion-body`, 1, 1, msg);
}
