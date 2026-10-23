import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { isEmptyObject, isKeyOf, OBJECT_UTILS } from './object-utils';

describe('ObjectUtils (DONE)', () => {
    describe('OBJECT_UTILS', () => {
        it('... should reference all object utils methods', () => {
            expectToEqual(OBJECT_UTILS, { isEmptyObject, isKeyOf });
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

        describe('#isKeyOf()', () => {
            const object = { id: 1, name: '' };

            it('... should have a method `isKeyOf`', () => {
                expect(isKeyOf).toBeDefined();
            });

            describe('... should return true if the key', () => {
                it.each([
                    { desc: 'is an own key', key: 'id' },
                    { desc: 'is an own key with an empty value', key: 'name' },
                ])('... $desc', ({ key }) => {
                    const isKey = isKeyOf(object, key);

                    expectToBe(isKey, true);
                });
            });

            describe('... should return false if the key', () => {
                it.each([
                    { desc: 'is unknown', key: 'unknown' },
                    { desc: 'is a prototype key', key: 'toString' },
                    { desc: 'is empty', key: '' },
                ])('... $desc', ({ key }) => {
                    const isKey = isKeyOf(object, key);

                    expectToBe(isKey, false);
                });
            });
        });
    });
});
