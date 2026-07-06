import { describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { isEmptyArray, isEmptyObject } from './object-utils';

describe('ObjectUtils (DONE)', () => {
    describe('#isEmptyArray()', () => {
        it('... should have a method `isEmptyArray`', () => {
            expect(isEmptyArray).toBeDefined();
        });

        describe('... should return true if the array', () => {
            it.each([
                { desc: 'is undefined', value: undefined },
                { desc: 'is null', value: null },
                { desc: 'is empty', value: [] },
                { desc: 'is not an array (string)', value: 'string' },
            ])('... $desc', ({ value }) => {
                expectToBe(isEmptyArray(value as any), true);
            });
        });

        describe('... should return false if the array', () => {
            it.each([
                { desc: 'contains strings', value: ['test'] },
                { desc: 'contains numbers', value: [1, 2, 3] },
                { desc: 'contains an empty object as an element', value: [{}] },
                { desc: 'contains null as an element', value: [null] },
            ])('... $desc', ({ value }) => {
                expectToBe(isEmptyArray(value), false);
            });
        });
    });

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
                expectToBe(isEmptyObject(value), true);
            });
        });

        describe('... should return false if the object', () => {
            it.each([
                { desc: 'contains properties', value: { id: 1 } },
                { desc: 'contains properties with empty string values', value: { name: '' } },
                { desc: 'contains a nested empty object', value: { nested: {} } },
            ])('... $desc', ({ value }) => {
                expectToBe(isEmptyObject(value), false);
            });
        });
    });
});
