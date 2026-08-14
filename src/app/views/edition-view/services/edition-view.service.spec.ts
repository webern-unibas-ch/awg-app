import { isSignal, signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { LoadingService } from '@awg-shared/loading/loading.service';
import { EDITION_ASSETS_DATA } from '@awg-views/edition-view/data/edition-assets.data';
import {
    EditionDataAssetsKeys,
    EditionViewData,
    EditionViewDataTypeMapping,
    EditionViewKey,
} from '@awg-views/edition-view/models/edition-data.model';

import { EditionDataService } from './edition-data.service';

import { EditionSvgSheetsList, TextcriticsList } from '../models';
import { EditionViewService } from './edition-view.service';

describe('EditionViewService', () => {
    let service: EditionViewService;

    let mockEditionDataService: Partial<EditionDataService>;

    let currentViewNameSpy: Spy;
    let buildViewDataSpy: Spy;
    let getErrorSpy: Spy;
    let getFallbackForInactiveViewSpy: Spy;
    let getUniqueAssetKeysSpy: Spy;
    let isViewDataEmptySpy: Spy;

    let mockIsLoadingSignal: WritableSignal<boolean>;

    beforeEach(() => {
        mockEditionDataService = {
            prefaceData: signal<any>(null),
            rowtablesData: signal<any>(null),
            introData: signal<any>(null),
            graphData: signal<any>(null),
            folioConvoluteData: signal<any>(null),
            sourceListData: signal<any>(null),
            sourceDescriptionData: signal<any>(null),
            sourceEvaluationData: signal<any>(null),
            svgSheetsData: signal<any>(null),
            textcriticsData: signal<any>(null),
            getErrorForDataAssets: vi.fn().mockImplementation(() => signal(null)),
        };

        mockIsLoadingSignal = signal<boolean>(false);

        TestBed.configureTestingModule({
            providers: [
                EditionViewService,
                { provide: EditionDataService, useValue: mockEditionDataService },
                { provide: LoadingService, useValue: { isLoading: mockIsLoadingSignal.asReadonly() } },
                provideRouter([]),
            ],
        });

        // Inject services
        service = TestBed.inject(EditionViewService);

        // Spies
        currentViewNameSpy = vi.spyOn(service as any, '_currentViewName');
        buildViewDataSpy = vi.spyOn(service as any, '_buildViewData');
        getFallbackForInactiveViewSpy = vi.spyOn(service as any, '_getFallbackForInactiveView');
        getUniqueAssetKeysSpy = vi.spyOn(service as any, '_getUniqueAssetKeys');
        isViewDataEmptySpy = vi.spyOn(service as any, '_isViewDataEmpty');
        getErrorSpy = vi.spyOn(mockEditionDataService, 'getErrorForDataAssets');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('#_currentViewName()', () => {
        let harness: RouterTestingHarness;

        const createFreshServiceWithUrl = async (url: string): Promise<EditionViewService> => {
            // Reset the testing module to ensure a fresh instance of the service for the router
            TestBed.resetTestingModule();

            TestBed.configureTestingModule({
                providers: [
                    provideRouter([
                        { path: '**', children: [] },
                        { path: '**', outlet: 'sidebar', children: [] },
                    ]),
                    EditionViewService,
                    { provide: EditionDataService, useValue: mockEditionDataService },
                    { provide: LoadingService, useValue: { isLoading: mockIsLoadingSignal.asReadonly() } },
                ],
            });

            // Set up the RouterTestingHarness to navigate to the desired URL
            harness = await RouterTestingHarness.create();
            await harness.navigateByUrl(url);

            // Freshly inject the service after configuring the route
            return TestBed.inject(EditionViewService);
        };

        it('... should have a signal `_currentViewName`', () => {
            expect((service as any)._currentViewName).toBeDefined();

            expectToBe(isSignal((service as any)._currentViewName), true);
        });

        it('... should start with holding the parsed view name based on the current router URL', async () => {
            const freshService = await createFreshServiceWithUrl('/edition/preface');

            const result = (freshService as any)._currentViewName();

            expectToBe(result, 'preface');
        });

        it('... should hold the parsed active view when a NavigationEnd event occurs', async () => {
            const freshService = await createFreshServiceWithUrl('/edition/preface');

            expectToBe((freshService as any)._currentViewName(), 'preface');

            await harness.navigateByUrl('/edition/complex/op12/sheets');

            expectToBe((freshService as any)._currentViewName(), 'sheets');
        });

        it('... should return an empty string if the navigation destination has no primary segments', async () => {
            const freshService = await createFreshServiceWithUrl('/edition/preface');

            await harness.navigateByUrl('/(sidebar:help)');

            expectToBe((freshService as any)._currentViewName(), '');
        });
    });

    describe('#viewContext()', () => {
        it('... should have a signal `viewContext`', () => {
            expect(service.viewContext).toBeDefined();

            expectToBe(isSignal(service.viewContext), true);
        });

        it('... should return correct context for `intro`', () => {
            currentViewNameSpy.mockImplementation(() => 'intro');

            const context = service.viewContext();

            expectToBe(context.name, 'intro');
            expectToBe(context.isIntro, true);
            expectToBe(context.isPreface, false);
            expectToBe(context.isRowtables, false);
        });

        it('... should return correct context for `preface`', () => {
            currentViewNameSpy.mockImplementation(() => 'preface');

            const context = service.viewContext();

            expectToBe(context.name, 'preface');
            expectToBe(context.isIntro, false);
            expectToBe(context.isPreface, true);
            expectToBe(context.isRowtables, false);
        });

        it('... should return correct context for `rowtables`', () => {
            currentViewNameSpy.mockImplementation(() => 'rowtables');

            const context = service.viewContext();

            expectToBe(context.name, 'rowtables');
            expectToBe(context.isIntro, false);
            expectToBe(context.isPreface, false);
            expectToBe(context.isRowtables, true);
        });

        it('... should handle other view names gracefully', () => {
            currentViewNameSpy.mockImplementation(() => 'other-view');

            const context = service.viewContext();

            expectToBe(context.name, 'other-view');
            expectToBe(context.isIntro, false);
            expectToBe(context.isPreface, false);
            expectToBe(context.isRowtables, false);
        });
    });

    describe('... single-data view signals', () => {
        describe.each([
            {
                signalName: 'prefaceViewData' as keyof EditionViewService,
                dataKey: 'prefaceData',
                viewName: 'preface' as EditionViewKey,
                mockData: { preface: [{ id: 'pref-1' }] },
            },
            {
                signalName: 'rowtablesViewData' as keyof EditionViewService,
                dataKey: 'rowtablesData',
                viewName: 'rowtables' as EditionViewKey,
                mockData: { rowtables: [{ id: 'rt-1' }] },
            },
            {
                signalName: 'introViewData' as keyof EditionViewService,
                dataKey: 'introData',
                viewName: 'intro' as EditionViewKey,
                mockData: { intro: [{ id: 'intro-1' }] },
            },
            {
                signalName: 'graphViewData' as keyof EditionViewService,
                dataKey: 'graphData',
                viewName: 'graph' as EditionViewKey,
                mockData: { graph: [{ id: 'graph-1' }] },
            },
        ])('#$signalName()', ({ signalName, dataKey, viewName, mockData }) => {
            it(`... should have a signal ${signalName}`, () => {
                expect(service[signalName]).toBeDefined();

                expectToBe(isSignal(service[signalName]), true);
            });

            it('... should trigger `_buildViewData` with correct arguments', () => {
                buildViewDataSpy.mockReturnValue({
                    data: {},
                    isLoading: false,
                    error: null,
                });

                service[signalName]();

                expect(buildViewDataSpy).toHaveBeenCalledWith(
                    viewName,
                    expect.arrayContaining([[dataKey, expect.any(Function)]])
                );
            });

            it(`... should return loading fallback for ${signalName} if view is inactive`, () => {
                currentViewNameSpy.mockReturnValue('any-other-view');

                const result = (service[signalName] as () => EditionViewData<typeof viewName>)();

                expectToEqual(result.data, { [dataKey]: null });
                expectToBe(result.isLoading, true);
                expectToBe(result.error, null);
            });

            it(`... should reactively update ${signalName} if ${dataKey} emits`, () => {
                currentViewNameSpy.mockReturnValue(viewName);
                (service as any)._previousViewName.set(viewName);
                mockIsLoadingSignal.set(false);

                (mockEditionDataService as any)[dataKey].set(mockData);

                const result = (service[signalName] as () => EditionViewData<typeof viewName>)();
                const key = dataKey as keyof typeof result.data;

                expectToEqual(result.data[key], mockData);
                expectToBe(result.isLoading, false);
                expectToBe(result.error, null);
            });

            it(`... should set \`isLoading=true\` on ${signalName} if loading is active`, () => {
                currentViewNameSpy.mockReturnValue(viewName);
                (service as any)._previousViewName.set(viewName);

                (mockEditionDataService as any)[dataKey].set(mockData);
                mockIsLoadingSignal.set(true);

                const result = (service[signalName] as () => EditionViewData<typeof viewName>)();

                expectToBe(result.isLoading, true);
            });

            it(`... should propagate errors to ${signalName} from the EditionDataService`, () => {
                currentViewNameSpy.mockReturnValue(viewName);
                (service as any)._previousViewName.set(viewName);
                mockIsLoadingSignal.set(false);

                (mockEditionDataService as any)[dataKey].set(mockData);

                const mockError = {
                    key: viewName as EditionDataAssetsKeys,
                    error: `Failed to fetch ${viewName} assets`,
                };
                getErrorSpy.mockReturnValue(signal(mockError));

                const result = (service[signalName] as () => EditionViewData<typeof viewName>)();

                expectToEqual(result.error, mockError);
            });
        });
    });

    describe('... multi-data view signals', () => {
        describe.each([
            {
                signalName: 'sheetsViewData' as keyof EditionViewService,
                viewName: 'sheets' as EditionViewKey,
                signalsSetup: [
                    { dataKey: 'folioConvoluteData', mockValue: { convolutes: [{ id: 'fol-1' }] } },
                    {
                        dataKey: 'svgSheetsData',
                        mockValue: { sheets: { workEditions: [{ id: 'work-1' }] } },
                    },
                    { dataKey: 'textcriticsData', mockValue: { textcritics: [{ id: 'tc-1' }] } },
                ],
            },
            {
                signalName: 'reportViewData' as keyof EditionViewService,
                viewName: 'report' as EditionViewKey,
                signalsSetup: [
                    { dataKey: 'sourceListData', mockValue: { sources: [{ id: 'src-1' }] } },
                    { dataKey: 'sourceDescriptionData', mockValue: { sources: [{ id: 'desc-1' }] } },
                    { dataKey: 'sourceEvaluationData', mockValue: { sources: [{ id: 'eval-1' }] } },
                    { dataKey: 'textcriticsData', mockValue: { textcritics: [{ id: 'tc-2' }] } },
                ],
            },
        ])('#$signalName()', ({ signalName, viewName, signalsSetup }) => {
            it(`... should have a signal ${signalName}`, () => {
                expect(service[signalName]).toBeDefined();

                expectToBe(isSignal(service[signalName]), true);
            });

            it('... should trigger `_buildViewData` with correct arguments', () => {
                buildViewDataSpy.mockReturnValue({
                    data: {},
                    isLoading: false,
                    error: null,
                });

                service[signalName]();

                expect(buildViewDataSpy).toHaveBeenCalled();

                const [calledViewKey, calledSignalMap, calledCallback] = buildViewDataSpy.mock.calls[0];

                expectToBe(calledViewKey, viewName);

                const extractedKeys = calledSignalMap.map(([key]: [string]) => key);
                const expectedKeys = signalsSetup.map(({ dataKey }) => dataKey);
                expectToEqual(extractedKeys, expectedKeys);

                if (viewName === 'sheets') {
                    expect(calledCallback).toBeTypeOf('function');
                } else {
                    expect(calledCallback).toBeUndefined();
                }
            });

            it(`... should return loading fallback for ${signalName} if view is inactive`, () => {
                currentViewNameSpy.mockReturnValue('any-other-view');

                const result = (service[signalName] as () => EditionViewData<typeof viewName>)();

                signalsSetup.forEach(({ dataKey }) => {
                    const key = dataKey as keyof typeof result.data;
                    expectToBe(result.data[key], null);
                });
                expectToBe(result.isLoading, true);
                expectToBe(result.error, null);
            });

            it(`... should reactively update ${signalName} if all source signals emit`, () => {
                currentViewNameSpy.mockReturnValue(viewName);
                (service as any)._previousViewName.set(viewName);
                mockIsLoadingSignal.set(false);

                signalsSetup.forEach(({ dataKey, mockValue }) => {
                    (mockEditionDataService as any)[dataKey].set(mockValue);
                });

                const result = (service[signalName] as () => EditionViewData<typeof viewName>)();

                signalsSetup.forEach(({ dataKey, mockValue }) => {
                    const key = dataKey as keyof typeof result.data;
                    expectToEqual(result.data[key], mockValue);
                });
                expectToBe(result.isLoading, false);
                expectToBe(result.error, null);
            });

            it(`... should set \`isLoading=true\` on ${signalName} if loading is active`, () => {
                currentViewNameSpy.mockReturnValue(viewName);
                (service as any)._previousViewName.set(viewName);

                signalsSetup.forEach(({ dataKey, mockValue }) => {
                    (mockEditionDataService as any)[dataKey].set(mockValue);
                });
                mockIsLoadingSignal.set(true);

                const result = (service[signalName] as () => EditionViewData<typeof viewName>)();

                expectToBe(result.isLoading, true);
            });

            it(`... should propagate errors to ${signalName} from the EditionDataService`, () => {
                currentViewNameSpy.mockReturnValue(viewName);
                (service as any)._previousViewName.set(viewName);
                mockIsLoadingSignal.set(false);

                signalsSetup.forEach(({ dataKey, mockValue }) => {
                    (mockEditionDataService as any)[dataKey].set(mockValue);
                });

                const mockError = { message: `Failed to fetch multi-data ${viewName} assets` };
                getErrorSpy.mockReturnValue(signal(mockError));

                const result = (service as any)[signalName]();

                expectToEqual(result.error, mockError);
            });

            if (signalName === 'sheetsViewData') {
                describe('... `extraContentCheck` specific to sheetsViewData', () => {
                    it('... should keep `isLoading=true` if all edition arrays (work, text, sketch) are empty', () => {
                        currentViewNameSpy.mockReturnValue(viewName);
                        (service as any)._previousViewName.set(viewName);
                        mockIsLoadingSignal.set(false);

                        (mockEditionDataService as any)['folioConvoluteData'].set({ convolutes: [{ id: 'fol-1' }] });
                        (mockEditionDataService as any)['textcriticsData'].set({ textcritics: [{ id: 'tc-1' }] });
                        (mockEditionDataService as any)['svgSheetsData'].set({
                            sheets: { workEditions: [], textEditions: [], sketchEditions: [] },
                        });

                        const result = service.sheetsViewData();

                        expectToBe(result.isLoading, true);
                    });

                    it('... should set `isLoading=false` if at least one edition array (e.g., sketchEditions) contains data', () => {
                        currentViewNameSpy.mockReturnValue(viewName);
                        (service as any)._previousViewName.set(viewName);
                        mockIsLoadingSignal.set(false);

                        (mockEditionDataService as any)['folioConvoluteData'].set({ convolutes: [{ id: 'fol-1' }] });
                        (mockEditionDataService as any)['textcriticsData'].set({ textcritics: [{ id: 'tc-1' }] });

                        (mockEditionDataService as any)['svgSheetsData'].set({
                            sheets: { workEditions: [], textEditions: [], sketchEditions: [{ id: 'sketch-1' }] },
                        });

                        const result = service.sheetsViewData();

                        expectToBe(result.isLoading, false);
                    });
                });
            }
        });
    });

    describe('METHODS', () => {
        describe('#_buildViewData()', () => {
            it('... should have a method `_buildViewData`', () => {
                expect((service as any)._buildViewData).toBeDefined();
            });

            it('... should return fallback if view is inactive', () => {
                const viewKey = 'preface';
                const signalMap: any[] = [['prefaceData', signal({ content: [] })]];
                const dataFallback = EDITION_ASSETS_DATA.CONFIG[viewKey].fallback;
                const mockFallback: EditionViewData<typeof viewKey> = {
                    data: { prefaceData: dataFallback },
                    isLoading: true,
                    error: null,
                };

                getFallbackForInactiveViewSpy.mockReturnValue(mockFallback);

                const result = (service as any)._buildViewData(viewKey, signalMap);

                expectToEqual(result, mockFallback);
            });

            describe('... should return unpacked data signal if view is active', () => {
                it('... for a single-data view (e.g., preface)', () => {
                    const viewKey = 'preface';
                    const mockData = { content: ['item1'] };
                    const signalMap: any[] = [['prefaceData', signal(mockData)]];

                    getFallbackForInactiveViewSpy.mockReturnValue(null);
                    isViewDataEmptySpy.mockReturnValue(false);
                    mockIsLoadingSignal.set(false);

                    const result = (service as any)._buildViewData(viewKey, signalMap);

                    expectToEqual(result.data, { prefaceData: mockData });
                });

                it('... for a multi-data view (e.g., sheets)', () => {
                    const viewKey = 'sheets';
                    const mockFolio = { id: 'convolute-1' };
                    const mockSvgSheets: EditionSvgSheetsList = {
                        sheets: { workEditions: [], textEditions: [], sketchEditions: [] },
                    };
                    const mockTextcritics: TextcriticsList = { textcritics: [] };

                    const signalMap: any[] = [
                        ['folioConvoluteData', signal(mockFolio)],
                        ['svgSheetsData', signal(mockSvgSheets)],
                        ['textcriticsData', signal(mockTextcritics)],
                    ];

                    getFallbackForInactiveViewSpy.mockReturnValue(null);
                    isViewDataEmptySpy.mockReturnValue(false);
                    mockIsLoadingSignal.set(false);

                    const result = (service as any)._buildViewData(viewKey, signalMap);

                    expectToEqual(result.data, {
                        folioConvoluteData: mockFolio,
                        svgSheetsData: mockSvgSheets,
                        textcriticsData: mockTextcritics,
                    });
                });
            });

            describe('... should correctly evaluate `isLoading`', () => {
                it.each([
                    {
                        desc: 'loadingService is true, data is not empty',
                        isLoading: true,
                        dataEmpty: false,
                        expected: true,
                    },
                    {
                        desc: 'loadingService is false, data is empty',
                        isLoading: false,
                        dataEmpty: true,
                        expected: true,
                    },
                    {
                        desc: 'both loadingService and data empty are true',
                        isLoading: true,
                        dataEmpty: true,
                        expected: true,
                    },
                    {
                        desc: 'both loadingService and data empty are false',
                        isLoading: false,
                        dataEmpty: false,
                        expected: false,
                    },
                ])('... should return isLoading=$expected when $desc', ({ isLoading, dataEmpty, expected }) => {
                    const viewKey = 'preface';
                    const signalMap: any[] = [['prefaceData', signal({ content: [] })]];

                    getFallbackForInactiveViewSpy.mockReturnValue(null);
                    isViewDataEmptySpy.mockReturnValue(dataEmpty);
                    mockIsLoadingSignal.set(isLoading);

                    const result = (service as any)._buildViewData(viewKey, signalMap);

                    expectToBe(result.isLoading, expected);
                });
            });

            it('... should fetch and return errors from the EditionDataService using unique asset keys', () => {
                const viewKey = 'sheets';
                const signalMap: any[] = [['folioConvoluteData', signal({ id: '1' })]];
                const mockError = { message: 'Failed to load assets' };
                const mockAssetKeys = ['folioConvolute'];

                getFallbackForInactiveViewSpy.mockReturnValue(null);
                getUniqueAssetKeysSpy.mockReturnValue(mockAssetKeys);
                getErrorSpy.mockReturnValue(() => mockError);

                const result = (service as any)._buildViewData(viewKey, signalMap);

                expectSpyCall(getErrorSpy, 1, [mockAssetKeys]);
                expectToEqual(result.error, mockError);
            });

            it('... should pass the `extraContentCheck` callback down to `_isViewDataEmpty`', () => {
                const viewKey = 'preface';
                const signalMap: any[] = [['prefaceData', signal({ content: [] })]];
                const extraContentCheck = () => true;

                getFallbackForInactiveViewSpy.mockReturnValue(null);
                isViewDataEmptySpy.mockReturnValue(false);

                (service as any)._buildViewData(viewKey, signalMap, extraContentCheck);

                expectSpyCall(isViewDataEmptySpy, 1, [
                    { prefaceData: { content: [] } },
                    ['prefaceData'],
                    extraContentCheck,
                ]);
            });
        });

        describe('#_isViewDataEmpty()', () => {
            it('... should have a method `_isViewDataEmpty`', () => {
                expect((service as any)._isViewDataEmpty).toBeDefined();
            });

            describe('... should return true if a nested array in any of the specified dataKeys is empty', () => {
                it.each([
                    {
                        desc: 'a single empty array inside an object (e.g., sheets -> svgSheetsData)',
                        typedData: {
                            svgSheetsData: { sheets: [] },
                        },
                        dataKeys: ['svgSheetsData'],
                    },
                    {
                        desc: 'one empty array among multiple populated ones (e.g., report data keys)',
                        typedData: {
                            sourceListData: { sources: [{ id: 'source-1' }] },
                            textcriticsData: { textcritics: [] },
                        },
                        dataKeys: ['sourceListData', 'textcriticsData'],
                    },
                ])('... when processing $desc', ({ typedData, dataKeys }) => {
                    const result = (service as any)._isViewDataEmpty(typedData, dataKeys);

                    expectToBe(result, true);
                });
            });

            describe('... should return false if the nested arrays contain items or if no nested array exists', () => {
                it.each([
                    {
                        desc: 'the nested array has elements (e.g., prefaceData -> preface)',
                        typedData: {
                            prefaceData: { preface: [{ id: 'preface-1' }] },
                        },
                        dataKeys: ['prefaceData'],
                    },
                    {
                        desc: 'the rawData is not an object (primitive string / fallback bypass)',
                        typedData: {
                            prefaceData: 'Not an object structure',
                        },
                        dataKeys: ['prefaceData'],
                    },
                    {
                        desc: 'the rawData is null (e.g., during uninitialized states)',
                        typedData: {
                            folioConvoluteData: null,
                        },
                        dataKeys: ['folioConvoluteData'],
                    },
                    {
                        desc: 'the object exists but has no array property (e.g., plain meta object without lists)',
                        typedData: {
                            rowtablesData: { id: 'rt-123', type: 'editorial' },
                        },
                        dataKeys: ['rowtablesData'],
                    },
                ])('... when $desc', ({ typedData, dataKeys }) => {
                    const result = (service as any)._isViewDataEmpty(typedData, dataKeys);

                    expectToBe(result, false);
                });
            });

            describe('... should evaluate the optional `extraContentCheck` callback', () => {
                it('... should return true if `extraContentCheck` returns true, even if data arrays are not empty', () => {
                    const typedData = {
                        introData: { intros: [{ id: 'intro-1' }] },
                    };
                    const dataKeys = ['introData'];
                    const extraContentCheck = () => true;

                    const result = (service as any)._isViewDataEmpty(typedData, dataKeys, extraContentCheck);

                    expectToBe(result, true);
                });

                it('... should return false if `extraContentCheck` returns false and data arrays are not empty', () => {
                    const typedData = {
                        introData: { intros: [{ id: 'intro-1' }] },
                    };
                    const dataKeys = ['introData'];
                    const extraContentCheck = () => false;

                    const result = (service as any)._isViewDataEmpty(typedData, dataKeys, extraContentCheck);

                    expectToBe(result, false);
                });

                it('... should call the `extraContentCheck` callback with the complete typedData object', () => {
                    const typedData = {
                        graphData: { graphs: [{ id: 'graph-1' }] },
                    };
                    const dataKeys = ['graphData'];
                    let passedData: any = null;
                    const extraContentCheck = (data: any) => {
                        passedData = data;
                        return false;
                    };

                    (service as any)._isViewDataEmpty(typedData, dataKeys, extraContentCheck);

                    expectToEqual(passedData, typedData);
                });
            });
        });

        describe('#_getUniqueAssetKeys()', () => {
            it('... should have a method `_getUniqueAssetKeys`', () => {
                expect((service as any)._getUniqueAssetKeys).toBeDefined();
            });

            it('... should return an empty array if `signalMap` is empty', () => {
                const signalMap: any[] = [];

                const result = (service as any)._getUniqueAssetKeys('preface', signalMap);

                expectToEqual(result, []);
            });

            describe('... should return the `viewKey` itself for single-data views like ', () => {
                it.each([
                    { viewKey: 'preface', signalMap: [['prefaceData', signal(null)]] },
                    { viewKey: 'rowtables', signalMap: [['rowtablesData', signal(null)]] },
                    { viewKey: 'intro', signalMap: [['introData', signal(null)]] },
                    { viewKey: 'graph', signalMap: [['graphData', signal(null)]] },
                ])('... for $viewKey', ({ viewKey, signalMap }) => {
                    const result = (service as any)._getUniqueAssetKeys(viewKey, signalMap);

                    expectToEqual(result, [viewKey]);
                });
            });

            describe('... should strip `Data` suffix from `dataKeys` for multi-data views like', () => {
                it.each([
                    {
                        viewKey: 'sheets',
                        signalMap: [
                            ['folioConvoluteData', signal(null)],
                            ['svgSheetsData', signal(null)],
                            ['textcriticsData', signal(null)],
                        ],
                    },
                    {
                        viewKey: 'report',
                        signalMap: [
                            ['sourceListData', signal(null)],
                            ['sourceDescriptionData', signal(null)],
                            ['sourceEvaluationData', signal(null)],
                            ['textcriticsData', signal(null)],
                        ],
                    },
                ])('... $viewKey', ({ viewKey, signalMap }) => {
                    const result = (service as any)._getUniqueAssetKeys(viewKey, signalMap);

                    const expectedKeys = Array.from(
                        new Set(signalMap.map(([dataKey]) => (dataKey as string).replace('Data', '')))
                    );

                    expectToEqual(result, expectedKeys);
                });
            });

            it('... should return the full dataKey name if it does not contain the "Data" suffix and length > 1', () => {
                const viewKey = 'summaryView';
                const signalMap = [
                    ['statistics', signal(null)],
                    ['historyData', signal(null)],
                ];

                const result = (service as any)._getUniqueAssetKeys(viewKey, signalMap);

                expectToEqual(result, ['statistics', 'history']);
            });

            describe('... should remove duplicate keys from the final result', () => {
                it.each([
                    {
                        desc: 'identical data keys with "Data" suffix',
                        signalMap: [
                            ['prefaceData', signal(1)],
                            ['prefaceData', signal(2)],
                        ],
                        expected: ['preface'],
                    },
                    {
                        desc: 'keys that become identical after stripping "Data"',
                        signalMap: [
                            ['prefaceData', signal(1)],
                            ['preface', signal(2)],
                        ],
                        expected: ['preface'],
                    },
                ])('... when processing $desc', ({ signalMap, expected }) => {
                    const result = (service as any)._getUniqueAssetKeys('preface', signalMap);

                    expectToEqual(result, expected);
                });
            });
        });

        describe('#_getFallbackForInactiveView()', () => {
            const viewKey: EditionViewKey = 'sheets';
            const dataKeys: Array<keyof EditionViewDataTypeMapping[typeof viewKey]> = ['folioConvoluteData'];

            it('... should have a method `_getFallbackForInactiveView`', () => {
                expect((service as any)._getFallbackForInactiveView).toBeDefined();
            });

            it('... should return a fallback if the viewKey is not included in the activeView', () => {
                const mockFallback: EditionViewData<typeof viewKey> = {
                    data: { folioConvoluteData: null, svgSheetsData: null, textcriticsData: null },
                    isLoading: true,
                    error: null,
                };

                currentViewNameSpy.mockReturnValue('preface');
                const createFallbackSpy = vi.spyOn(service as any, '_createFallback').mockReturnValue(mockFallback);

                const result = (service as any)._getFallbackForInactiveView(viewKey, dataKeys);

                expectToEqual(result, mockFallback);
                expectSpyCall(createFallbackSpy, 1, [dataKeys]);
            });

            it('... should return a fallback and update `_previousViewName` asynchronously if the view is active but changed', () => {
                vi.useFakeTimers();

                const mockFallback: EditionViewData<typeof viewKey> = {
                    data: { folioConvoluteData: null, svgSheetsData: null, textcriticsData: null },
                    isLoading: true,
                    error: null,
                };

                currentViewNameSpy.mockReturnValue('sheets');
                (service as any)._previousViewName.set('preface');

                vi.spyOn(service as any, '_createFallback').mockReturnValue(mockFallback);

                const result = (service as any)._getFallbackForInactiveView(viewKey, dataKeys);

                expectToEqual(result, mockFallback);
                expectToBe((service as any)._previousViewName(), 'preface');

                vi.advanceTimersByTime(0);

                expectToBe((service as any)._previousViewName(), 'sheets');

                vi.useRealTimers();
            });

            it('... should return null if the view is active and matches the `_previousViewName` (steady state)', () => {
                currentViewNameSpy.mockReturnValue('sheets');
                (service as any)._previousViewName.set('sheets');

                const result = (service as any)._getFallbackForInactiveView(viewKey, dataKeys);

                expectToBe(result, null);
            });
        });

        describe('#_createFallback()', () => {
            it('... should have a method `_createFallback`', () => {
                expect((service as any)._createFallback).toBeDefined();
            });

            it('... should return a fallback object with isLoading set to true and error set to null', () => {
                const dataKeys = ['prefaceData'];

                const result = (service as any)._createFallback(dataKeys);

                expect(result).toBeDefined();
                expectToBe(result.isLoading, true);
                expectToBe(result.error, null);
            });

            describe('... should initialize all provided data keys with a null value', () => {
                it('... for single-data view signals', () => {
                    const dataKeys = ['prefaceData'];

                    const result = (service as any)._createFallback(dataKeys);

                    expectToEqual(result.data, {
                        prefaceData: null,
                    });
                });

                it('... for multi-data view signals', () => {
                    const dataKeys = ['folioCOnvoluteData', 'svgSheetsData', 'textcriticsData'];

                    const result = (service as any)._createFallback(dataKeys);

                    expectToEqual(result.data, {
                        folioCOnvoluteData: null,
                        svgSheetsData: null,
                        textcriticsData: null,
                    });
                });
            });

            it('... should handle an empty array of data keys gracefully', () => {
                const dataKeys: any[] = [];

                const result = (service as any)._createFallback(dataKeys);

                expectToEqual(result.data, {});
                expectToBe(result.isLoading, true);
                expectToBe(result.error, null);
            });

            it('... should return a new object instance on every invocation to prevent shared references', () => {
                const dataKeys = ['prefaceData'];

                const firstResult = (service as any)._createFallback(dataKeys);
                const secondResult = (service as any)._createFallback(dataKeys);

                expect(firstResult).not.toBe(secondResult);
                expect(firstResult.data).not.toBe(secondResult.data);
            });

            it('... should create valid fallbacks for all configured keys', () => {
                const configKeys = Object.keys(EDITION_ASSETS_DATA.CONFIG) as EditionDataAssetsKeys[];

                const result = (service as any)._createFallback(configKeys);

                configKeys.forEach(key => {
                    expect(result.data).toHaveProperty(key);
                    expectToBe(result.data[key], null);
                });
            });
        });

        describe('#_parseViewFromUrl()', () => {
            it('... should have a method `_parseViewFromUrl`', () => {
                expect((service as any)._parseViewFromUrl).toBeDefined();
            });

            describe('... should return the last segment path for general edition views', () => {
                it.each([{ view: 'preface' }, { view: 'rowtables' }])('... $view', ({ view }) => {
                    const url = `/edition/${view}`;

                    const result = (service as any)._parseViewFromUrl(url);

                    expectToBe(result, view);
                });
            });

            describe('... should return the last segment path for edition complex views', () => {
                it.each([{ view: 'intro' }, { view: 'sheets' }, { view: 'report' }, { view: 'graph' }])(
                    '... $view',
                    ({ view }) => {
                        const url = `/edition/complex/op12/${view}`;

                        const result = (service as any)._parseViewFromUrl(url);

                        expectToBe(result, view);
                    }
                );
            });

            it('... should return the last segment path and ignore query parameters or matrix parameters', () => {
                const url = '/edition/complex/op12/sheets?id=M212_TF1a#folio-1';

                const result = (service as any)._parseViewFromUrl(url);

                expect(result).toBe('sheets');
            });

            it('... should return the single segment path if the URL has only one segment', () => {
                const url = '/edition';

                const result = (service as any)._parseViewFromUrl(url);

                expectToBe(result, 'edition');
            });

            describe('... should return an empty string if', () => {
                it.each([
                    { desc: 'the URL has no segments (root URL)', url: '/' },
                    { desc: 'the URL is completely empty', url: '' },
                    { desc: 'there is a secondary outlet without primary', url: '/(sidebar:help)' },
                ])('... $desc', ({ url }) => {
                    const result = (service as any)._parseViewFromUrl(url);

                    expectToBe(result, '');
                });
            });
        });
    });
});
