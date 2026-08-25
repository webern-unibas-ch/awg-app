import { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';

import { expect } from 'vitest';

interface Spy {
    mock: {
        calls: any[][];
    };
}

// Test helper functions for expectation statements

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
 * @param {DebugElement[]} des The input DebugElement array to be checked.
 * @param {string | Type<*>} selector The selector (CSS or directive) to look for.
 * @param {number } expected The expected number of elements in the input array.
 * @param {number | undefined} expectedFailMsg The expected number of elements in the input array in the fail message.
 * @param {string} suffixMsg A message to add at the end of the expectation statement.
 *
 * @returns {void} Throws the expectation statements.
 */
function expectDebugElement(
    des: DebugElement[],
    selector: string | Type<any>,
    expected: number,
    expectedFailMsg: number | undefined,
    suffixMsg: string
): void {
    if (selector instanceof Type) {
        selector = selector.name;
    }

    const failMsg = suffixMsg
        ? `should have ${expectedFailMsg} ${selector} ${suffixMsg}`
        : `should have ${expectedFailMsg} ${selector}`;

    expect(des).toBeDefined();
    expect(des.length, failMsg).toBe(expected);
}

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
 * @param {number} expectedFailMsg The expected number of elements in the result array in the fail message.
 * @param {string} [suffixMsg] An optional message to add at the end of the expectation statement.
 *
 * @returns {DebugElement[]} An array of the found DebugElements.
 */
export function getAndExpectDebugElementByCss(
    inDe: DebugElement,
    selector: string,
    expected: number,
    expectedFailMsg: number,
    suffixMsg?: string
): DebugElement[] {
    const outDes = inDe.queryAll(By.css(selector));

    // Empty string if no suffix message provided
    if (!suffixMsg) {
        suffixMsg = '';
    }

    expectDebugElement(outDes, selector, expected, expectedFailMsg, suffixMsg);

    return outDes;
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
 * @param {Type<*>} selectorType The selector type (directive) to look for.
 * @param {number } expected The expected number of elements in the result array.
 * @param {number | undefined} expectedFailMsg The expected number of elements in the result array in the fail message.
 * @param {string} [suffixMsg] An optional message to add at the end of the expectation statement.
 *
 * @returns {DebugElement[]} An array of the found DebugElements.
 */
export function getAndExpectDebugElementByDirective(
    inDe: DebugElement,
    selectorType: Type<any>,
    expected: number,
    expectedFailMsg: number | undefined,
    suffixMsg?: string
): DebugElement[] {
    const outDes = inDe.queryAll(By.directive(selectorType));

    // Empty string if no suffix message provided
    if (!suffixMsg) {
        suffixMsg = '';
    }

    expectDebugElement(outDes, selectorType, expected, expectedFailMsg, suffixMsg);

    return outDes;
}

/**
 * Test helper function: expectToBe.
 *
 * It checks if a given actual value is defined and if it is the same as the expected value ('toBe').
 *
 * Exposed to be called from tests.
 *
 * @param {T} actual The actual input value to be checked.
 * @param {T} expected The expected value.
 *
 * @returns {void} Throws the expectation statements.
 */
export function expectToBe<T>(actual: T, expected: T): void {
    expect(actual).toBeDefined();
    expect(actual, `should be ${expected}`).toBe(expected);
}

/**
 * Test helper function: expectToContain.
 *
 * It checks if a given actual value is defined and if it contains the expected value ('toContain').
 *
 * Exposed to be called from tests.
 *
 * @param {T} actual The input value to be checked (Array, String, etc. - cannot be a function).
 * @param {any} expected The expected value that should be contained.
 *
 * @returns {void} Throws the expectation statements.
 */
export function expectToContain<T>(actual: T extends Function ? never : T, expected: any): void {
    expect(actual).toBeDefined();
    expect(actual, `should contain ${expected}`).toContain(expected);
}

/**
 * Test helper function: expectToNotContain.
 *
 * It checks if a given actual value is defined and if it does not contain the expected value ('not.toContain').
 *
 * Exposed to be called from tests.
 *
 * @param {T} actual The input value to be checked (Array, String, etc. - cannot be a function).
 * @param {any} expected The expected value that should not be contained.
 *
 * @returns {void} Throws the expectation statements.
 */
export function expectToNotContain<T>(actual: T extends Function ? never : T, expected: any): void {
    expect(actual).toBeDefined();
    expect(actual, `should not contain ${expected}`).not.toContain(expected);
}

/**
 * Test helper function: expectToEqual.
 *
 * It checks if a given actual value is defined and if it equals the expected value ('toEqual').
 *
 * Exposed to be called from tests.
 *
 * @param {T} actual The actual input value to be checked.
 * @param {T} expected The expected value
 *
 * @returns {void} Throws the expectation statements.
 */
export function expectToEqual<T>(actual: T, expected: T): void {
    expect(actual).toBeDefined();
    expect(actual, `should equal ${expected}`).toEqual(expected);
}

/**
 * Test helper function: expectRecentSpyCall (internal).
 *
 * It checks the most recent spy call.
 *
 * Not exposed, only called internally from {@link expectSpyCall}.
 *
 * @param {Spy} spy The input spy instance.
 * @param {*} expectedMostRecentValue The expected value for the most recent spy call.
 * @param {number} index The index value of the most recent arguments array of a spy call.
 *
 * @returns {void} Throws the expectation statements.
 */
function expectRecentSpyCall(spy: Spy, expectedMostRecentValue: any, index: number): void {
    const recentCall = spy.mock.calls.at(-1);

    // Use a realm-safe object check so DOM objects from different globals
    // (e.g. jsdom document elements) are compared by value, not identity.
    if (expectedMostRecentValue !== null && typeof expectedMostRecentValue === 'object') {
        expect(recentCall?.[index]).toEqual(expectedMostRecentValue);
    } else {
        expect(recentCall?.[index]).toBe(expectedMostRecentValue);
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
 * @param {*} [expectedMostRecentValue] An optional expected value for the most recent spy call.
 *
 * @returns {void} Throws the expectation statements.
 */
export function expectSpyCall(spy: Spy, expectedTimes: number, expectedMostRecentValue?: any): void {
    // Spy was called or not
    if (expectedTimes > 0) {
        expect(spy).toHaveBeenCalled();
    } else {
        expect(spy).not.toHaveBeenCalled();
    }

    // Spy was called expected times
    expect(spy).toHaveBeenCalledTimes(expectedTimes);

    // If spy was called, check if it was called with value x
    if (spy.mock.calls.length) {
        if (expectedMostRecentValue !== undefined && Array.isArray(expectedMostRecentValue)) {
            expectedMostRecentValue.forEach((value, index) => {
                expectRecentSpyCall(spy, value, index);
            });
        } else if (expectedMostRecentValue !== undefined) {
            expectRecentSpyCall(spy, expectedMostRecentValue, 0);
        }
    }
}
