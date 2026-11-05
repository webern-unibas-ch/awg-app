import { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';

import { expect } from 'vitest';

interface Spy {
    mock: {
        calls: any[][];
    };
}

/**
 * Type: IsUnion.
 *
 * It is true for a union type (e.g. `0 | 1`), otherwise false.
 */
type IsUnion<T, U = T> = T extends unknown ? ([U] extends [T] ? false : true) : never;

/**
 * Type: IsLiteralCount.
 *
 * It is true for a single literal count (e.g. `1`), false for `number` or a union like `0 | 1`.
 */
type IsLiteralCount<N extends number> = [number extends N ? true : false, IsUnion<N>] extends [false, false]
    ? true
    : false;

/**
 * Type: TupleOf.
 *
 * It is a tuple of DebugElements with the given length (e.g. `[DebugElement, DebugElement]` for 2).
 */
type TupleOf<N extends number, R extends DebugElement[] = []> = R['length'] extends N
    ? R
    : TupleOf<N, [...R, DebugElement]>;

/**
 * Type: DebugElementTuple.
 *
 * It is a tuple of DebugElements for a literal count, so that the elements can be accessed
 * by index without a check, otherwise an array of DebugElements.
 */
type DebugElementTuple<N extends number> = IsLiteralCount<N> extends true ? TupleOf<N> : DebugElement[];

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
        ? `should have ${String(expectedFailMsg)} ${selector} ${suffixMsg}`
        : `should have ${String(expectedFailMsg)} ${selector}`;

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
 * @param {string} [suffixMsg=''] An optional message to add at the end of the expectation statement.
 * @returns {DebugElementTuple<N>} The found DebugElements (a tuple for a literal expected number).
 */
export function getAndExpectDebugElementByCss<N extends number>(
    inDe: DebugElement,
    selector: string,
    expected: N,
    expectedFailMsg: number,
    suffixMsg = ''
): DebugElementTuple<N> {
    const outDes = inDe.queryAll(By.css(selector));

    expectDebugElement(outDes, selector, expected, expectedFailMsg, suffixMsg);

    // The expectation has checked the number of elements
    return outDes as DebugElementTuple<N>;
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
 * @param {string} [suffixMsg=''] An optional message to add at the end of the expectation statement.
 * @returns {DebugElementTuple<N>} The found DebugElements (a tuple for a literal expected number).
 */
export function getAndExpectDebugElementByDirective<N extends number>(
    inDe: DebugElement,
    selectorType: Type<any>,
    expected: N,
    expectedFailMsg: number | undefined,
    suffixMsg = ''
): DebugElementTuple<N> {
    const outDes = inDe.queryAll(By.directive(selectorType));

    expectDebugElement(outDes, selectorType, expected, expectedFailMsg, suffixMsg);

    // The expectation has checked the number of elements
    return outDes as DebugElementTuple<N>;
}

/**
 * Test helper function: getItemAt.
 *
 * It gets the item at a given index of a given list (an array, a node list or a typed array),
 * typed without `undefined`, and throws an error that names the index and the number of items
 * if there is no item (an item `undefined` counts as missing, other falsy items are returned).
 *
 * Exposed to be called from tests.
 *
 * @param {ArrayLike<T>} items The given list of items.
 * @param {number} index The given index.
 * @returns {T} The item at the index.
 */
export function getItemAt<T>(items: ArrayLike<T>, index: number): T {
    const item = items[index];
    if (item === undefined) {
        throw new Error(`Expected item at index ${index} to exist, but there are ${items.length} items.`);
    }
    return item;
}

/**
 * Test helper function: getEntryAt.
 *
 * It gets the entry for a given key of a given record, typed without `undefined`,
 * and throws an error that names the key and the existing keys if there is no entry
 * (an entry `undefined` counts as missing, other falsy entries are returned).
 *
 * Exposed to be called from tests.
 *
 * @param {Readonly<Record<string, T>>} record The given record.
 * @param {string} key The given key.
 * @returns {T} The entry for the key.
 */
export function getEntryAt<T>(record: Readonly<Record<string, T>>, key: string): T {
    const entry = record[key];
    if (entry === undefined) {
        const keys = Object.keys(record);
        const existingKeys = keys.length ? `the keys: ${keys.join(', ')}` : 'no keys';
        throw new Error(`Expected entry '${key}' to exist, but there are ${existingKeys}.`);
    }
    return entry;
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
 * @returns {void} Throws the expectation statements.
 */
export function expectToBe<T>(actual: T, expected: T): void {
    expect(actual).toBeDefined();
    expect(actual, `should be ${String(expected)}`).toBe(expected);
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
 * @returns {void} Throws the expectation statements.
 */
export function expectToContain<T>(actual: T extends (...args: never[]) => unknown ? never : T, expected: any): void {
    expect(actual).toBeDefined();
    expect(actual, `should contain ${String(expected)}`).toContain(expected);
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
 * @returns {void} Throws the expectation statements.
 */
export function expectToNotContain<T>(
    actual: T extends (...args: never[]) => unknown ? never : T,
    expected: any
): void {
    expect(actual).toBeDefined();
    expect(actual, `should not contain ${String(expected)}`).not.toContain(expected);
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
 * @returns {void} Throws the expectation statements.
 */
export function expectToEqual<T>(actual: T, expected: T): void {
    expect(actual).toBeDefined();
    expect(actual, `should equal ${String(expected)}`).toEqual(expected);
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
