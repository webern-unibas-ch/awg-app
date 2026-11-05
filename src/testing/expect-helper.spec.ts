import { DebugElement, Directive } from '@angular/core';

import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import {
    expectToBe,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
    getItemAt,
} from './expect-helper';

/**
 * Test directive: ExpectHelperTestDirective.
 *
 * It serves as selector type for {@link getAndExpectDebugElementByDirective}.
 */
@Directive({ selector: '[awgTest]' })
class ExpectHelperTestDirective {}

/**
 * Helper function: createDebugElement.
 *
 * It creates a debug element whose queries find the given debug elements.
 */
const createDebugElement = (foundDes: DebugElement[]): DebugElement =>
    ({ queryAll: vi.fn().mockReturnValue(foundDes) }) as unknown as DebugElement;

describe('expect-helper', () => {
    const firstDe = { name: 'first' } as DebugElement;
    const secondDe = { name: 'second' } as DebugElement;

    describe('#getAndExpectDebugElementByCss()', () => {
        it('... should have a method `getAndExpectDebugElementByCss`', () => {
            expect(getAndExpectDebugElementByCss).toBeDefined();
        });

        it('... should return the found debug elements if their number is as expected', () => {
            const foundDes = getAndExpectDebugElementByCss(createDebugElement([firstDe, secondDe]), 'p', 2, 2);

            expectToBe(foundDes.length, 2);
            expectToBe(foundDes[0], firstDe);
            expectToBe(foundDes[1], secondDe);
        });

        it('... should fail if the number of found debug elements is not as expected', () => {
            expect(() => getAndExpectDebugElementByCss(createDebugElement([firstDe]), 'p', 2, 2)).toThrow(
                'should have 2 p'
            );
        });

        it('... should type the result as tuple for a literal expected number', () => {
            const inDe = createDebugElement([firstDe]);

            expectTypeOf(getAndExpectDebugElementByCss(inDe, 'p', 1, 1)).toEqualTypeOf<[DebugElement]>();
            expectTypeOf(getAndExpectDebugElementByCss(createDebugElement([]), 'p', 0, 0)).toEqualTypeOf<[]>();
        });

        it('... should type the result as array for an expected number that is not a single literal', () => {
            const inDe = createDebugElement([firstDe]);
            const expectedNumber = [firstDe].length;
            const isFound = expectedNumber > 0;

            expectTypeOf(getAndExpectDebugElementByCss(inDe, 'p', expectedNumber, expectedNumber)).toEqualTypeOf<
                DebugElement[]
            >();
            expectTypeOf(getAndExpectDebugElementByCss(inDe, 'p', isFound ? 1 : 0, isFound ? 1 : 0)).toEqualTypeOf<
                DebugElement[]
            >();
        });
    });

    describe('#getAndExpectDebugElementByDirective()', () => {
        it('... should have a method `getAndExpectDebugElementByDirective`', () => {
            expect(getAndExpectDebugElementByDirective).toBeDefined();
        });

        it('... should return the found debug elements if their number is as expected', () => {
            const foundDes = getAndExpectDebugElementByDirective(
                createDebugElement([firstDe]),
                ExpectHelperTestDirective,
                1,
                1
            );

            expectToBe(foundDes[0], firstDe);
        });

        it('... should fail with the name of the directive if the number of found debug elements is not as expected', () => {
            expect(() =>
                getAndExpectDebugElementByDirective(createDebugElement([]), ExpectHelperTestDirective, 1, 1)
            ).toThrow(`should have 1 ${ExpectHelperTestDirective.name}`);
        });

        it('... should type the result as tuple for a literal expected number', () => {
            const inDe = createDebugElement([firstDe, secondDe]);

            expectTypeOf(getAndExpectDebugElementByDirective(inDe, ExpectHelperTestDirective, 2, 2)).toEqualTypeOf<
                [DebugElement, DebugElement]
            >();
        });
    });

    describe('#getItemAt()', () => {
        it('... should have a method `getItemAt`', () => {
            expect(getItemAt).toBeDefined();
        });

        it('... should return the item at the given index', () => {
            const items = ['a', 'b', 'c'];

            expectToBe(getItemAt(items, 0), 'a');
            expectToBe(getItemAt(items, 2), 'c');
        });

        it('... should return falsy items other than undefined', () => {
            const items = [0, null, ''];

            expectToBe(getItemAt(items, 0), 0);
            expectToBe(getItemAt(items, 1), null);
            expectToBe(getItemAt(items, 2), '');
        });

        it('... should throw an error with the index and the number of items if there is no item at the index', () => {
            const items = ['a'];

            expect(() => getItemAt(items, 1)).toThrow('Expected item at index 1 to exist, but there are 1 items.');
            expect(() => getItemAt(items, -1)).toThrow('Expected item at index -1 to exist, but there are 1 items.');
            expect(() => getItemAt([], 0)).toThrow('Expected item at index 0 to exist, but there are 0 items.');
        });

        it('... should type the item without undefined', () => {
            const items: string[] = ['a'];

            expectTypeOf(getItemAt(items, 0)).toEqualTypeOf<string>();
        });
    });
});
