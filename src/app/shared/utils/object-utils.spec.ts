import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { isEmptyObject, OBJECT_UTILS } from './object-utils';

describe('ObjectUtils (DONE)', () => {
    describe('OBJECT_UTILS', () => {
        it('... should reference all object utils methods', () => {
            expectToEqual(OBJECT_UTILS, { isEmptyObject });
        });
    });

    describe('METHODS', () => {
        describe('#isEmptyObject()', () => {
            it('... should have a method `isEmptyObject`', () => {
                expect(isEmptyObject).toBeDefined();
            });

            describe('... should return true if the object', () => {
                it.each([
                    { desc: 'is undefined', value: undefined },
                    { desc: 'is null', value: null },
                    { desc: 'is empty', value: {} },
                    { desc: 'is a string', value: 'string' },
                    { desc: 'is a number', value: 42 },
                    { desc: 'is a boolean', value: true },
                    { desc: 'is an empty array (treated as empty/invalid)', value: [] },
                    { desc: 'is a filled array (treated as empty/invalid)', value: ['test'] },
                ])('... $desc', ({ value }) => {
                    const isEmpty = isEmptyObject(value);

                    expectToBe(isEmpty, true);
                });
            });

            describe('... should return false if the object', () => {
                it.each([
                    { desc: 'contains properties', value: { id: 1 } },
                    { desc: 'contains properties with empty string values', value: { name: '' } },
                    { desc: 'contains a nested empty object', value: { nested: {} } },
                ])('... $desc', ({ value }) => {
                    const isEmpty = isEmptyObject(value);

                    expectToBe(isEmpty, false);
                });
            });
        });
    });
});
