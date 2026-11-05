import { DebugElement, Directive } from '@angular/core';

import { describe, expect, expectTypeOf, it, vi } from 'vitest';

import { expectToBe, getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from './expect-helper';

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
});
