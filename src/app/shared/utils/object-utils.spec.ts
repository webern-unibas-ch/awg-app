import { describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { isEmptyArray, isEmptyObject } from './object-utils';

describe('ObjectUtils', () => {
    describe('#isEmptyArray()', () => {
        it('... should have a method `isEmptyArray`', () => {
            expect(isEmptyArray).toBeDefined();
        });

        describe('... should return true if the array', () => {
            it.each([
                { value: undefined, label: 'undefined' },
                { value: null, label: 'null' },
                { value: [], label: 'empty' },
                { value: 'string', label: 'not an array (string)' },
            ])('... is $label', ({ value }) => {
                expectToBe(isEmptyArray(value as any), true);
            });
        });

        describe('... should return false if the array', () => {
            it.each([
                { value: ['test'], label: 'strings' },
                { value: [1, 2, 3], label: 'numbers' },
                { value: [{}], label: 'an empty object as an element' },
                { value: [null], label: 'null as an element' },
            ])('... contains $label', ({ value }) => {
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
                { value: undefined, label: 'undefined' },
                { value: null, label: 'null' },
                { value: {}, label: 'empty' },
                { value: 'string', label: 'a string' },
                { value: 42, label: 'a number' },
                { value: true, label: 'a boolean' },
                { value: [], label: 'an empty array (treated as empty/invalid)' },
                { value: ['test'], label: 'a filled array (treated as empty/invalid)' },
            ])('... is $label', ({ value }) => {
                expectToBe(isEmptyObject(value), true);
            });
        });

        describe('... should return false if the object', () => {
            it.each([
                { value: { id: 1 }, label: 'properties' },
                { value: { name: '' }, label: 'properties with empty string values' },
                { value: { nested: {} }, label: 'a nested empty object' },
            ])('... contains $label', ({ value }) => {
                expectToBe(isEmptyObject(value), false);
            });
        });
    });
});
