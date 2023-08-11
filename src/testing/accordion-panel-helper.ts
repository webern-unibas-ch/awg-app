import { DebugElement } from '@angular/core';

/**
 * Test helper function: expectPanel.
 *
 * It checks if a given ngbAccordion item (panel) is collapsed or open.
 *
 * @param {DebugElement} headerDe The accordion header DebugElement.
 * @param {string} msg The msg to be displayed in Expectation.
 * @param {boolean} collapsed The boolean value if the panel is collapsed.
 *
 * @returns {DebugElement} The debug element of the panel.
 */
function expectPanel(headerDe: DebugElement, msg: string, collapsed?: boolean): void {
    const headerEl = headerDe.nativeElement;
    const isCollapsed = headerEl.classList.contains('collapsed');

    expect(isCollapsed)
        .withContext(`Header should be ${collapsed ? 'collapsed' : 'not collapsed'}`)
        .toBe(collapsed);
}

/**
 * Test helper function: expectCollapsedPanel.
 *
 * It checks if a given ngbAccordion item (panel) is collapsed.
 *
 * @param {DebugElement} headerDe The accordion header DebugElement.
 * @param {string} msg The msg to be displayed in Expectation.
 *
 * @returns {void} Sends the given values to getAndExpect helper.
 */
export function expectCollapsedPanel(headerDe: DebugElement, msg: string) {
    expectPanel(headerDe, msg, true);
}

/**
 * Test helper function: expectOpenPanel.
 *
 * It checks if a given ngbAccordion item (panel) is open.
 *
 * @param {DebugElement} headerDe The accordion header DebugElement.
 * @param {string} msg The msg to be displayed in Expectation.
 *
 * @returns {void} Sends the given values to getAndExpect helper.
 */
export function expectOpenPanel(headerDe: DebugElement, msg: string) {
    expectPanel(headerDe, msg, false);
}
