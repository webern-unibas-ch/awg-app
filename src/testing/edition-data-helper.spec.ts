import { describe, expect, it } from 'vitest';

import { EditionDataAssetsError, EditionDataAssetsKeys } from '@awg-views/edition-view/models/edition-data.model';

import { GraphList } from '@awg-app/views/edition-view/models';
import { createMockResponseData, createMockViewData } from './edition-data-helper';
import { expectToBe, expectToEqual } from './expect-helper';

describe('EditionDataHelper (DONE)', () => {
    describe('#createMockViewData()', () => {
        interface TestData {
            foo: string;
            bar: string;
        }

        const defaultData: TestData = { foo: 'original-foo', bar: 'original-bar' };

        it('... should have a method `createMockViewData`', () => {
            expect(createMockViewData).toBeDefined();
            expectToBe(typeof createMockViewData, 'function');
        });

        it('... should create mock data with default content and default loading/error states', () => {
            const result = createMockViewData(defaultData);

            expectToEqual(result, {
                data: defaultData,
                isLoading: false,
                error: null,
            });
        });

        it('... should allow to override specific fields within the data object', () => {
            const result = createMockViewData(defaultData, {
                data: { foo: 'changed-foo' },
            });

            expectToEqual(result, {
                data: { foo: 'changed-foo', bar: 'original-bar' },
                isLoading: false,
                error: null,
            });
        });

        it('... should allow to override fields to undefined within the data object', () => {
            const result = createMockViewData(defaultData, {
                data: { foo: undefined },
            });

            expectToEqual(result, {
                data: { foo: undefined, bar: 'original-bar' },
                isLoading: false,
                error: null,
            });
        });

        it('... should create mock data with a custom isLoading state independently', () => {
            const result = createMockViewData(defaultData, {
                isLoading: true,
            });

            expectToEqual(result, {
                data: defaultData,
                isLoading: true,
                error: null,
            });
        });

        it('... should create mock data with a custom error state independently', () => {
            const mockError: EditionDataAssetsError = {
                key: 'preface',
                error: new Error('HTTP 404 Not Found'),
            };

            const result = createMockViewData(defaultData, {
                error: mockError,
            });

            expectToEqual(result, {
                data: defaultData,
                isLoading: false,
                error: mockError,
            });
        });

        it('... should create mock data with custom isLoading and error states simultaneously', () => {
            const mockError: EditionDataAssetsError = {
                key: 'preface',
                error: new Error('HTTP 404 Not Found'),
            };

            const result = createMockViewData(defaultData, {
                isLoading: true,
                error: mockError,
            });

            expectToEqual(result, {
                data: defaultData,
                isLoading: true,
                error: mockError,
            });
        });
    });

    describe('#createMockResponseData()', () => {
        it('... should have a method `createMockResponseData`', () => {
            expect(createMockResponseData).toBeDefined();
            expectToBe(typeof createMockResponseData, 'function');
        });

        it('... should return a new object and not mutate the original fallback object', () => {
            const fallback = new GraphList();

            const result = createMockResponseData('graph', fallback);

            expect(result).not.toBe(fallback);
        });

        describe('... when `assetKey = svgSheets`', () => {
            it('... should populate the sheets property with workEditions, textEditions, and sketchEditions', () => {
                const fallback = {};

                const result = createMockResponseData('svgSheets', fallback);

                expectToEqual(result, {
                    sheets: {
                        workEditions: [{ id: 'sheet-1' }],
                        textEditions: [],
                        sketchEditions: [],
                    },
                });
            });
        });

        describe('... when `assetKey = folioConvolute`', () => {
            it('... should populate the convolutes property with a test entry', () => {
                const fallback = {};

                const result = createMockResponseData('folioConvolute', fallback);

                expectToEqual(result, {
                    convolutes: [{ id: 'test-entry-1' }],
                });
            });
        });

        describe('... when assetKey starts with `source`', () => {
            it.each([
                { assetKey: 'sourceList' as EditionDataAssetsKeys },
                { assetKey: 'sourceDescription' as EditionDataAssetsKeys },
                { assetKey: 'sourceEvaluation' as EditionDataAssetsKeys },
            ])('... should populate the sources property for $assetKey with a test entry', ({ assetKey }) => {
                const fallback = {};

                const result = createMockResponseData(assetKey, fallback);

                expectToEqual(result, {
                    sources: [{ id: 'test-entry-1' }],
                });
            });
        });

        describe('... when assetKey is any other standard key', () => {
            it.each([
                { assetKey: 'graph' as EditionDataAssetsKeys, expectedKey: 'graph' },
                { assetKey: 'intro' as EditionDataAssetsKeys, expectedKey: 'intro' },
                { assetKey: 'preface' as EditionDataAssetsKeys, expectedKey: 'preface' },
                { assetKey: 'rowtables' as EditionDataAssetsKeys, expectedKey: 'rowtables' },
                { assetKey: 'textcritics' as EditionDataAssetsKeys, expectedKey: 'textcritics' },
            ])('... should use the assetKey $assetKey as the property name directly', ({ assetKey, expectedKey }) => {
                const fallback = {};

                const result = createMockResponseData(assetKey, fallback);

                expectToEqual(result, {
                    [expectedKey]: [{ id: 'test-entry-1' }],
                });
            });
        });
    });
});
