import { isSignal, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createMockResponseData } from '@testing/edition-data-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { LoadingService } from '@awg-shared/loading/loading.service';
import { EDITION_ASSETS_DATA } from '@awg-views/edition-view/data/edition-assets.data';
import { EditionDataAssetsKeys } from '@awg-views/edition-view/models/edition-data.model';

import { EditionDataService } from './edition-data.service';

import { EditionViewService } from './edition-view.service';

describe('EditionViewService', () => {
    let service: EditionViewService;

    let mockEditionDataService: Partial<EditionDataService>;
    let mockLoadingService: Partial<LoadingService>;
    let mockIsLoadingSignal: WritableSignal<boolean>;

    beforeEach(() => {
        mockEditionDataService = {
            getErrorForDataAssets: vi.fn().mockImplementation(() => signal(null)),
        };

        mockIsLoadingSignal = signal<boolean>(false);
        mockLoadingService = {
            isLoading: mockIsLoadingSignal.asReadonly(),
        };

        TestBed.configureTestingModule({
            providers: [
                EditionViewService,
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: LoadingService, useValue: mockLoadingService },
            ],
        });
        service = TestBed.inject(EditionViewService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('... single view data signals', () => {
        describe.each([
            { viewDataSignalName: 'prefaceViewData', assetKey: 'preface' as EditionDataAssetsKeys },
            { viewDataSignalName: 'rowtablesViewData', assetKey: 'rowtables' as EditionDataAssetsKeys },
            { viewDataSignalName: 'introViewData', assetKey: 'intro' as EditionDataAssetsKeys },
            { viewDataSignalName: 'graphViewData', assetKey: 'graph' as EditionDataAssetsKeys },
        ])('#$viewDataSignalName()', ({ viewDataSignalName, assetKey }) => {
            let mockData: any;
            let mockDataSignal: WritableSignal<any>;

            const dataKey = `${assetKey}Data`;
            const privateDataSignalName = `_${dataKey}`;

            beforeEach(() => {
                mockDataSignal = signal(null);

                mockData = { ...EDITION_ASSETS_DATA.CONFIG[assetKey as EditionDataAssetsKeys].fallback };
                mockData[assetKey] = [{ id: 'test-entry-1' }];

                mockDataSignal.set(mockData);

                (service as any)[privateDataSignalName] = mockDataSignal;
            });

            it(`... should have a signal \`${viewDataSignalName}\``, () => {
                expect(service[viewDataSignalName]).toBeDefined();

                expectToBe(isSignal(service[viewDataSignalName]), true);
            });

            it('... should hold the expected data with inactive loading/error states', () => {
                mockIsLoadingSignal.set(false);

                const viewData = service[viewDataSignalName]();

                expectToEqual(viewData.data[dataKey], mockData);
                expectToBe(viewData.isLoading, false);
                expectToBe(viewData.error, null);
            });

            describe('... should activate loading state if', () => {
                it.each([
                    { desc: '`_loadingService.isLoading` is true', type: 'loadingActive' },
                    { desc: 'data is empty', type: 'empty' },
                    { desc: 'data is undefined', type: 'undefined' },
                    { desc: 'data is null', type: 'null' },
                ])('... $desc', ({ type }) => {
                    mockIsLoadingSignal.set(false);

                    switch (type) {
                        case 'loadingActive':
                            mockIsLoadingSignal.set(true);
                            break;
                        case 'empty':
                            mockData = EDITION_ASSETS_DATA.CONFIG[assetKey].fallback;
                            break;
                        case 'undefined':
                            mockData = undefined;
                            break;
                        case 'null':
                            mockData = null;
                            break;
                    }
                    mockDataSignal.set(mockData);

                    const viewData = service[viewDataSignalName]();

                    expectToBe(viewData.isLoading, true);
                });
            });

            it(`.... should activate error state if there is an active error for key \`${assetKey}\``, () => {
                const mockError = new Error(`Fake API Error for ${assetKey}`);

                const getErrorSpy = vi
                    .spyOn(mockEditionDataService, 'getErrorForDataAssets')
                    .mockImplementation((keys: string[]) => {
                        if (keys.includes(assetKey)) {
                            return signal(mockError);
                        }
                        return signal(null);
                    });

                const viewData = service[viewDataSignalName]();

                expectSpyCall(getErrorSpy, 1, [[assetKey]]);
                expectToEqual(viewData.error, mockError);
            });
        });
    });

    describe('... combined view data signals', () => {
        describe.each([
            {
                viewDataSignalName: 'sheetsViewData',
                assetKeys: ['folioConvolute', 'svgSheets', 'textcritics'],
            },
            {
                viewDataSignalName: 'reportViewData',
                assetKeys: ['sourceList', 'sourceDescription', 'sourceEvaluation', 'textcritics'],
            },
        ])('#$viewDataSignalName()', ({ viewDataSignalName, assetKeys }) => {
            let mockSignals: Map<string, WritableSignal<any>>;
            let validCombinedData: Record<string, any>;

            beforeEach(() => {
                mockSignals = new Map();
                validCombinedData = {};

                assetKeys.forEach(assetKey => {
                    const dataKey = `${assetKey}Data`;
                    const privateDataSignalName = `_${dataKey}`;

                    const fallback = EDITION_ASSETS_DATA.CONFIG[assetKey as EditionDataAssetsKeys].fallback;
                    const mockResponseData = createMockResponseData(assetKey as EditionDataAssetsKeys, fallback);

                    const mockSignal = signal(mockResponseData);
                    mockSignals.set(privateDataSignalName, mockSignal);
                    validCombinedData[dataKey] = mockResponseData;

                    (service as any)[privateDataSignalName] = mockSignal;
                });
            });

            it(`... should have a signal \`${viewDataSignalName}\``, () => {
                expect(service[viewDataSignalName]).toBeDefined();

                expectToBe(isSignal(service[viewDataSignalName]), true);
            });

            it('... should hold the expected data with inactive loading/error states', () => {
                mockIsLoadingSignal.set(false);

                const viewData = service[viewDataSignalName]();

                assetKeys.forEach(assetKey => {
                    const dataKey = `${assetKey}Data`;
                    expectToEqual(viewData.data[dataKey], validCombinedData[dataKey]);
                });

                expectToBe(viewData.isLoading, false);
                expectToBe(viewData.error, null);
            });

            describe('... should activate loading state if', () => {
                it('... `_loadingService.isLoading` is true', () => {
                    mockIsLoadingSignal.set(true);

                    expectToBe(service[viewDataSignalName]().isLoading, true);
                });

                const loadingScenarios = [
                    ...assetKeys.map(assetKey => ({
                        desc: `${assetKey} data is empty`,
                        type: 'fallback',
                        emptyAsset: assetKey,
                        privateDataSignalName: `_${assetKey}Data`,
                    })),
                ];

                if (assetKeys.includes('svgSheets')) {
                    loadingScenarios.push({
                        desc: 'svgSheets has no work/text/sketch editions',
                        type: 'missingSheets',
                        emptyAsset: 'svgSheets',
                        privateDataSignalName: '_svgSheetsData',
                    });
                }

                it.each(loadingScenarios)('... $desc', ({ type, emptyAsset, privateDataSignalName }) => {
                    mockIsLoadingSignal.set(false);

                    if (type === 'fallback') {
                        const fallback = EDITION_ASSETS_DATA.CONFIG[emptyAsset as EditionDataAssetsKeys].fallback;
                        mockSignals.get(privateDataSignalName)?.set(fallback);
                    } else if (type === 'missingSheets') {
                        const emptySheetsMock = {
                            sheets: {
                                workEditions: [],
                                textEditions: [],
                                sketchEditions: [],
                            },
                        };
                        mockSignals.get(privateDataSignalName)?.set(emptySheetsMock);
                    }

                    expectToBe(service[viewDataSignalName]().isLoading, true);
                });
            });

            it(`.... should activate error state if there is an active error for key`, () => {
                const mockError = new Error(`Fake API Error for combined assets`);

                const getErrorSpy = vi
                    .spyOn(mockEditionDataService, 'getErrorForDataAssets')
                    .mockImplementation((keys: string[]) => {
                        const hasMatchingKey = keys.some(key => assetKeys.includes(key));

                        return hasMatchingKey ? signal(mockError) : signal(null);
                    });

                const viewData = service[viewDataSignalName]();

                expectSpyCall(getErrorSpy, 1, [assetKeys]);
                expectToBe(viewData.error, mockError);
            });
        });
    });
});
