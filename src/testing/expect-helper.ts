import { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import Spy = jasmine.Spy;

// Test helper functions for expectation statements

/**
 * Test helper function: getAndExpectDebugElementByCss.
 *
 * It checks for existence and number of elements
 * defined by a CSS selector in a `DebugElement`.
 *
 * Exposed to be called from tests.
 *
 * @param {DebugElement} inDe The input DebugElement to be checked.
 * @param {string} selector The CSS selector to look for.
 * @param {number} expected The expected number of elements in the result array.
 * @param {number} expectedInFailMsg The expected number of elements in the result array in the fail message.
 * @param {string} [suffixMsg] An optional message to add at the end of the expectation statement.
 *
 * @returns {DebugElement[]} An array of the found DebugElements.
 */
export function getAndExpectDebugElementByCss(
    inDe: DebugElement,
    selector: string,
    expected: number,
    expectedInFailMsg: number,
    suffixMsg?: string
): DebugElement[] {
    const outDe = inDe.queryAll(By.css(selector));

    // empty string if no suffix message provided
    if (!suffixMsg) {
        suffixMsg = '';
    }

    expectDebugElement(outDe, selector, expected, expectedInFailMsg, suffixMsg);

    return outDe;
}

/**
 * Test helper function: getAndExpectDebugElementByDirective.
 *
 * It checks for existence and number of elements
 * defined by Directive in a `DebugElement`.
 *
 * Exposed to be called from tests.
 *
 * @param {DebugElement} inDe The input DebugElement to be checked.
 * @param {Type<any>} selectorType The selector type (directive) to look for.
 * @param {number | undefined} expected The expected number of elements in the result array.
 * @param {number | undefined} expectedInFailMsg The expected number of elements in the result array in the fail message.
 * @param {string} [suffixMsg] An optional message to add at the end of the expectation statement.
 *
 * @returns {DebugElement[]} An array of the found DebugElements.
 */
export function getAndExpectDebugElementByDirective(
    inDe: DebugElement,
    selectorType: Type<any>,
    expected: number | undefined,
    expectedInFailMsg: number | undefined,
    suffixMsg?: string
): DebugElement[] {
    const outDe = inDe.queryAll(By.directive(selectorType));

    // empty string if no suffix message provided
    if (!suffixMsg) {
        suffixMsg = '';
    }

    expectDebugElement(outDe, selectorType, expected, expectedInFailMsg, suffixMsg);

    return outDe;
}

/**
 * Test helper function: expectDebugElement (internal).
 *
 * It checks for existence of elements defined by
 * CSS selector or Directive in a `DebugElement` array
 * and throws the expectation statements.
 *
 * Not exposed, only called internally from {@link getAndExpectDebugElementByCss}
 * and {@link getAndExpectDebugElementByDirective}.
 *
 * @param {DebugElement[]} de The input DebugElement array to be checked.
 * @param {string | Type<any>} selector The selector (CSS or directive) to look for.
 * @param {number | undefined} expected The expected number of elements in the input array.
 * @param {number | undefined} expectedInFailMsg The expected number of elements in the input array in the fail message.
 * @param {string} suffixMsg A message to add at the end of the expectation statement.
 *
 * @returns {void} Throws the expectation statements.
 */
function expectDebugElement(
    de: DebugElement[],
    selector: string | Type<any>,
    expected: number | undefined,
    expectedInFailMsg: number | undefined,
    suffixMsg: string
): void {
    let failMsg: string;

    if (selector instanceof Type) {
        selector = selector.name;
    }
    if (expected === undefined) {
        failMsg = suffixMsg ? `should be ${expectedInFailMsg} ${suffixMsg}` : `should be ${expectedInFailMsg}`;

        expect(de).toBeUndefined(failMsg);
    } else {
        failMsg = suffixMsg
            ? `should have ${expectedInFailMsg} ${selector} ${suffixMsg}`
            : `should have ${expectedInFailMsg} ${selector}`;

        expect(de).toBeDefined();
        expect(de.length).toBe(expected, failMsg);
    }
}

/**
 * Test helper function: expectSpyCall.
 *
 * It checks if, how often and with which arguments a spy has been called.
 *
 * Exposed to be called from tests.
 *
 * @param {Spy} spy The input spy instance.
 * @param {number} expectedTimes The expected number of spy calls.
 * @param {any} [expectedMostRecentValue] An optional expected value for the most recent spy call.
 *
 * @returns {void} Throws the expectation statements.
 */
export function expectSpyCall(spy: Spy, expectedTimes: number, expectedMostRecentValue?: any): void {
    // spy has been called or not
    expectedTimes > 0 ? expect(spy).toHaveBeenCalled() : expect(spy).not.toHaveBeenCalled();

    // spy has been called expected times
    expect(spy).toHaveBeenCalledTimes(expectedTimes);

    // spy has been called with value x
    if (expectedMostRecentValue && Array.isArray(expectedMostRecentValue)) {
        expectedMostRecentValue.forEach((value, index) => {
            expectRecentSpyCall(spy, value, index);
        });
    } else if (expectedMostRecentValue) {
        expectRecentSpyCall(spy, expectedMostRecentValue, 0);
    }
}

/**
 * Test helper function: expectRecentSpyCall (internal).
 *
 * It checks the most recent spy call.
 *
 * Not exposed, only called internally from {@link expectSpyCall}.
 *
 * @param {Spy} spy The input spy instance.
 * @param {any} expectedMostRecentValue The expected value for the most recent spy call.
 * @param {number} index The index value of the most recent arguments array of a spy call.
 *
 * @returns {void} Throws the expectation statements.
 */
function expectRecentSpyCall(spy: Spy, expectedMostRecentValue: any, index: number): void {
    if (expectedMostRecentValue && expectedMostRecentValue instanceof Object) {
        expect(spy.calls.mostRecent().args[index]).toEqual(expectedMostRecentValue);
    } else if (expectedMostRecentValue) {
        expect(spy.calls.mostRecent().args[index]).toBe(expectedMostRecentValue);
    }
}
