import { DebugElement } from '@angular/core';

/**
 * Test helper function: expectAccordionItem.
 *
 * It checks if a given ngbAccordion item is collapsed or open.
 *
 * @param {DebugElement} headerDe The accordion header DebugElement.
 * @param {string} msg The msg to be displayed in Expectation.
 * @param {boolean} collapsed The boolean value if the accordion item is collapsed.
 *
 * @returns {void} Evaluates the expectation.
 */
function expectAccordionItem(headerDe: DebugElement, msg: string, collapsed?: boolean): void {
    const headerEl = headerDe.nativeElement;
    const isCollapsed = headerEl.classList.contains('collapsed');

    expect(isCollapsed)
        .withContext(`Header should be ${collapsed ? 'collapsed' : 'not collapsed'}`)
        .toBe(collapsed);
}

/**
 * Test helper function: expectCollapsedAccordionItem.
 *
 * It checks if a given ngbAccordion item is collapsed.
 *
 * @param {DebugElement} headerDe The accordion header DebugElement.
 * @param {string} msg The msg to be displayed in Expectation.
 *
 * @returns {void} Sends the given values to expectAccordionItem helper.
 */
export function expectCollapsedAccordionItem(headerDe: DebugElement, msg: string): void {
    expectAccordionItem(headerDe, msg, true);
}

/**
 * Test helper function: expectOpenAccordionItem.
 *
 * It checks if a given ngbAccordion item is open.
 *
 * @param {DebugElement} headerDe The accordion header DebugElement.
 * @param {string} msg The msg to be displayed in Expectation.
 *
 * @returns {void} Sends the given values to expectAccordionItem helper.
 */
export function expectOpenAccordionItem(headerDe: DebugElement, msg: string): void {
    expectAccordionItem(headerDe, msg, false);
}
