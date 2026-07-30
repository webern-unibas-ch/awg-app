import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { isSignal, signal, Signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Data } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EMPTY, lastValueFrom, Observable, of as observableOf } from 'rxjs';

import { createMockResponseData } from '@testing/edition-data-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { mockConsole } from '@testing/mock-helper';

import { EDITION_ASSETS_DATA } from '@awg-views/edition-view/data';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import {
    EditionComplex,
    EditionOutlineSection,
    EditionOutlineSeries,
    GraphList,
    IntroList,
    PrefaceList,
    RowtablesList,
} from '@awg-views/edition-view/models';
import {
    EditionComplexDataAssetsKeys,
    EditionDataAssetsKeys,
    EditionStaticDataAssetsKeys,
} from '@awg-views/edition-view/models/edition-data.model';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionDataService } from './edition-data.service';

// Helpter type
type UnpackSignal<T> = T extends Signal<infer U> ? U : never;

describe('EditionDataService (DONE)', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let service: EditionDataService;
    let editionComplexesService: EditionComplexesService;
    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let consoleSpy: Spy;
    let clearErrorForSpy: Spy;
    let fetchJsonDataSpy: Spy;
    let getAssetPathSpy: Spy;
    let getEditionDataByComplexSpy: Spy;

    let expectedPrefaceData: PrefaceList;
    let expectedRowtablesData: RowtablesList;
    let expectedEditionIntroComplexData: IntroList;
    let expectedEditionIntroSectionData: IntroList;
    let expectedEditionIntroSectionFilteredData: IntroList;

    let expectedEditionSeries: EditionOutlineSeries;
    let expectedEditionSection: EditionOutlineSection;
    let expectedEditionComplex: EditionComplex;

    const baseRoute = EDITION_ASSETS_DATA.BASE_ROUTE;
    const editionRoute = EDITION_ROUTE_CONSTANTS.EDITION.route;
    const config = EDITION_ASSETS_DATA.CONFIG;
    const expectedPrefaceFilePath = `${baseRoute}${editionRoute}/${config['preface'].file}`;
    const expectedRowtablesFilePath = `${baseRoute}${editionRoute}/${config['rowtables'].file}`;

    // Helper function to expect and flush an HTTP request
    function expectAndFlush(url: string, mockData: unknown, options = { status: 200, statusText: 'OK' }): void {
        const req = httpTestingController.expectOne(url);
        expectToBe(req.request.method, 'GET');
        req.flush(mockData, options);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionDataService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        // Inject services
        service = TestBed.inject(EditionDataService);
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        // Init edition data
        editionComplexesService.initializeEditionComplexesList();
        editionOutlineService.initializeEditionOutline();

        // Spies
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(mockConsole.log);
        clearErrorForSpy = vi.spyOn(service as any, '_clearErrorFor');
        fetchJsonDataSpy = vi.spyOn(service as any, '_fetchJsonData');
        getAssetPathSpy = vi.spyOn(service as any, '_getAssetPathForEditionComplex');
        getEditionDataByComplexSpy = vi.spyOn(service as any, '_getEditionDataByComplex');

        // Test data
        expectedPrefaceData = structuredClone(mockEditionData.mockPrefaceData);
        expectedRowtablesData = structuredClone(mockEditionData.mockRowtablesData);
        expectedEditionIntroSectionData = structuredClone(mockEditionData.mockIntroSectionData);
        expectedEditionIntroSectionFilteredData = structuredClone(mockEditionData.mockIntroSectionFilteredData);
        expectedEditionIntroComplexData = structuredClone(mockEditionData.mockIntroComplexData);

        expectedEditionComplex = editionComplexesService.getEditionComplexById('op12');
        const seriesId = expectedEditionComplex.pubStatement.series.route;
        const sectionId = expectedEditionComplex.pubStatement.section.route;
        expectedEditionSeries = editionOutlineService.getEditionSeriesById(seriesId);
        expectedEditionSection = editionOutlineService.getEditionSectionById(seriesId, sectionId);
    });

    afterEach(() => {
        // Clear mock stores after each test
        mockConsole.clear();
        vi.restoreAllMocks();

        // After every test, assert that there are no more pending requests
        const openRequests = httpTestingController.match(() => true);
        openRequests.forEach(req => {
            const matchingConfig = Object.values(config).find(configValues =>
                req.request.url.endsWith(configValues.file)
            );
            const fallback = matchingConfig ? matchingConfig.fallback : {};
            req.flush(fallback);
        });
        httpTestingController.verify();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    describe('httpTestingController', () => {
        it('... should issue a mocked http get request', () => {
            const testData: Data = { name: 'TestData' };

            httpClient.get<Data>('/foo/bar').subscribe({
                next: data => {
                    expectToEqual(data, testData);
                },
            });

            expectAndFlush('/foo/bar', testData);
        });
    });

    describe('... static data signals', () => {
        const testCases: Array<{
            signalName: keyof EditionDataService;
            assetKey: EditionDataAssetsKeys;
            getExpectedData: () => unknown;
        }> = [
            { signalName: 'prefaceData', assetKey: 'preface', getExpectedData: () => expectedPrefaceData },
            { signalName: 'rowtablesData', assetKey: 'rowtables', getExpectedData: () => expectedRowtablesData },
        ];

        testCases.forEach(({ signalName, assetKey, getExpectedData }) => {
            it(`... should have signal \`${signalName}\` to hold the default fallback`, async () => {
                type DataType = UnpackSignal<EditionDataService[typeof signalName]>;
                const signalFn = service[signalName] as unknown as Signal<DataType>;
                const expectedFallback = config[assetKey].fallback as DataType;

                expectToBe(isSignal(signalFn), true);

                if (isSignal(signalFn)) {
                    await Promise.resolve();

                    expectToEqual(signalFn(), expectedFallback);
                }
            });

            it(`... should update \`${signalName}\` on service initialization`, async () => {
                type DataType = UnpackSignal<EditionDataService[typeof signalName]>;
                const signalFn = service[signalName] as unknown as Signal<DataType>;
                const expectedData = getExpectedData() as DataType;

                const basePath = `${baseRoute}${editionRoute}`;
                const file = config[assetKey].file;
                const expectedUrl = `${basePath}/${file}`;

                await new Promise(resolve => setTimeout(resolve, 0));

                expectAndFlush(expectedUrl, expectedData);

                await new Promise(resolve => setTimeout(resolve, 0));

                expectToEqual(signalFn(), expectedData);
            });
        });
    });

    describe('... complex data signals', () => {
        const testCases: Array<{
            signalName: keyof EditionDataService;
            assetKey: EditionDataAssetsKeys;
        }> = [
            { signalName: 'introData', assetKey: 'intro' },
            { signalName: 'folioConvoluteData', assetKey: 'folioConvolute' },
            { signalName: 'graphData', assetKey: 'graph' },
            { signalName: 'sourceListData', assetKey: 'sourceList' },
            { signalName: 'sourceDescriptionData', assetKey: 'sourceDescription' },
            { signalName: 'sourceEvaluationData', assetKey: 'sourceEvaluation' },
            { signalName: 'svgSheetsData', assetKey: 'svgSheets' },
            { signalName: 'textcriticsData', assetKey: 'textcritics' },
        ];

        testCases.forEach(({ signalName, assetKey }) => {
            it(`... should have signal \`${signalName}\` to hold the default fallback`, async () => {
                type DataType = UnpackSignal<EditionDataService[typeof signalName]>;
                const signalFn = service[signalName] as unknown as Signal<DataType>;
                const expectedFallback = config[assetKey].fallback as DataType;

                expectToBe(isSignal(signalFn), true);

                if (isSignal(signalFn)) {
                    await Promise.resolve();

                    expectToEqual(signalFn(), expectedFallback);
                }
            });
        });

        describe('... with selected complex', () => {
            beforeEach(() => {
                // Set selected series and section for intro data signal
                editionStateService.updateSelectedEditionSeries(expectedEditionSeries);
                editionStateService.updateSelectedEditionSection(expectedEditionSection);

                // Set selected complex for all complex data signals
                editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
            });

            testCases.forEach(({ signalName, assetKey }) => {
                it(`... should update signal \`${signalName}\` when complex changes`, async () => {
                    type DataType = UnpackSignal<EditionDataService[typeof signalName]>;
                    const signalFn = service[signalName] as unknown as Signal<DataType>;

                    const fallback = config[assetKey].fallback;
                    let mockResponseData = createMockResponseData(assetKey, fallback) as DataType;

                    await new Promise(resolve => setTimeout(resolve, 0));

                    const complexPath = (service as any)._getAssetPathForEditionComplex(expectedEditionComplex);
                    const file = config[assetKey].file;
                    const expectedComplexUrl = `${complexPath}/${file}`;

                    if (assetKey === 'intro') {
                        const sectionRoute = expectedEditionComplex.pubStatement.labeledSectionRoute?.route.join('/');
                        const expectedSectionUrl = `${baseRoute}${sectionRoute}/${file}`;

                        expectAndFlush(expectedSectionUrl, expectedEditionIntroSectionData);
                        expectAndFlush(expectedComplexUrl, expectedEditionIntroComplexData);

                        mockResponseData = expectedEditionIntroSectionFilteredData as DataType;
                    } else {
                        expectAndFlush(expectedComplexUrl, mockResponseData);
                    }

                    await new Promise(resolve => setTimeout(resolve, 0));

                    expectToEqual(signalFn(), mockResponseData);
                });
            });
        });
    });

    it('... should have signal `_dataError` to hold null', () => {
        expectToBe(isSignal((service as any)._dataError), true);

        expectToBe((service as any)._dataError(), null);
    });

    describe('METHODS', () => {
        describe('#getErrorForDataAssets()', () => {
            const testKeys: EditionDataAssetsKeys[] = ['graph', 'textcritics'];
            let mockError: HttpErrorResponse;

            beforeEach(() => {
                mockError = new HttpErrorResponse({ error: 'Test HTTP Error' });
            });

            it('... should have a method `getErrorForDataAssets`', () => {
                expect(service.getErrorForDataAssets).toBeDefined();
            });

            it('... should return a signal that holds the error if the active error key is included in the given keys array', () => {
                (service as any)._dataError.set({ key: 'graph', error: mockError });

                const errorSignal = service.getErrorForDataAssets(testKeys);

                expectToEqual(errorSignal(), mockError);
            });

            describe('... should return a signal that holds null if', () => {
                it('... there is currently no active error', () => {
                    (service as any)._dataError.set(null);

                    const errorSignal = service.getErrorForDataAssets(testKeys);

                    expectToBe(errorSignal(), null);
                });

                it('... the active error key is not included in the given keys', () => {
                    (service as any)._dataError.set({ key: 'intro', error: mockError });

                    const errorSignal = service.getErrorForDataAssets(testKeys);

                    expectToBe(errorSignal(), null);
                });
            });

            it('... should reactively update its value when the _dataError signal changes', () => {
                (service as any)._dataError.set(null);
                const errorSignal = service.getErrorForDataAssets(testKeys);
                expectToBe(errorSignal(), null);

                (service as any)._dataError.set({ key: 'textcritics', error: mockError });

                expectToEqual(errorSignal(), mockError);

                (service as any)._dataError.set(null);

                expectToBe(errorSignal(), null);
            });
        });

        describe('#_getAssetPathForEditionComplex()', () => {
            it('... should have a method `_getAssetPathForEditionComplex`', () => {
                expect((service as any)._getAssetPathForEditionComplex).toBeDefined();
            });

            it('... should return the generated assetPath', () => {
                const sectionPath = expectedEditionComplex.pubStatement.labeledSectionRoute.route.join('/');
                const complexIdRoute = expectedEditionComplex.complexId.route;

                const expectedPath = `${baseRoute}${sectionPath}${complexIdRoute}`;

                const result = (service as any)._getAssetPathForEditionComplex(expectedEditionComplex);

                expectToBe(result, expectedPath);
            });
        });

        describe('#_getStaticEditionDataByKey()', () => {
            it('... should have a method `_getStaticEditionDataByKey`', () => {
                expect((service as any)._getStaticEditionDataByKey).toBeDefined();
            });

            it('... should return a signal holding the fetched data from correct static path', async () => {
                const assetsKey: EditionStaticDataAssetsKeys = 'preface';

                let staticDataSignal: Signal<any>;
                TestBed.runInInjectionContext(() => {
                    staticDataSignal = (service as any)._getStaticEditionDataByKey(assetsKey);
                });

                // Initial value should be the fallback value
                expectToEqual(staticDataSignal(), config[assetsKey].fallback);

                const expectedUrl = expectedPrefaceFilePath;
                const matchingRequests = httpTestingController.match(expectedUrl);

                // Use latest matching request to ignore requests from initialization
                const latestReq = matchingRequests[matchingRequests.length - 1];
                expectToBe(latestReq.request.method, 'GET');
                latestReq.flush(expectedPrefaceData);

                await new Promise(resolve => setTimeout(resolve, 0));

                expectToEqual(staticDataSignal(), expectedPrefaceData);
            });

            it('... should return a signal holding the fallback value on HTTP failure', () => {
                const assetsKey: EditionStaticDataAssetsKeys = 'rowtables';
                const expectedFallback = config[assetsKey].fallback;

                let staticDataSignal: Signal<any>;
                TestBed.runInInjectionContext(() => {
                    staticDataSignal = (service as any)._getStaticEditionDataByKey(assetsKey);
                });

                // Initial value should be the fallback value
                expectToEqual(staticDataSignal(), expectedFallback);

                const expectedUrl = expectedRowtablesFilePath;
                const matchingRequests = httpTestingController.match(expectedUrl);

                // Use latest matching request to ignore requests from initialization
                const latestReq = matchingRequests[matchingRequests.length - 1];
                expectToBe(latestReq.request.method, 'GET');
                latestReq.flush('404 error', { status: 404, statusText: 'Not Found' });

                // After the HTTP request fails, the Signal should emit the fallback value
                expectToEqual(staticDataSignal(), expectedFallback);
            });
        });

        describe('#_getComplexEditionDataByKey()', () => {
            beforeEach(() => {
                getEditionDataByComplexSpy.mockReturnValue(signal({}));
            });

            it('... should have a method `_getComplexEditionDataByKey`', () => {
                expect((service as any)._getComplexEditionDataByKey).toBeDefined();
            });

            const complexKeys: EditionComplexDataAssetsKeys[] = [
                'folioConvolute',
                'graph',
                'sourceList',
                'sourceDescription',
                'sourceEvaluation',
                'svgSheets',
                'textcritics',
            ];

            it.each(complexKeys)(
                '... should trigger `_getEditionDataByComplex` with correct arguments for key: %s',
                assetsKey => {
                    const expectedFile = config[assetsKey].file;
                    const expectedFallback = config[assetsKey].fallback;

                    const resultSignal = (service as any)._getComplexEditionDataByKey(assetsKey);

                    expectSpyCall(getEditionDataByComplexSpy, 1, [expectedFile, expectedFallback, assetsKey]);

                    expectToEqual(resultSignal(), {});
                }
            );
        });

        describe('#_getEditionDataByComplex()', () => {
            beforeEach(() => {
                clearErrorForSpy.mockImplementation(() => {});
                getAssetPathSpy.mockReturnValue('mocked-asset-path');

                clearErrorForSpy.mockClear();
                getAssetPathSpy.mockClear();
                fetchJsonDataSpy.mockClear();
            });

            it('... should have a method `_getEditionDataByComplex`', () => {
                expect((service as any)._getEditionDataByComplex).toBeDefined();
            });

            describe('... when selectedEditionComplex changes', () => {
                const expectedFile = 'test.json';
                const expectedFallback = { data: [] };
                const expectedResponse = { data: [{ id: 'test_1' }] };

                const complexKeys: EditionComplexDataAssetsKeys[] = [
                    'folioConvolute',
                    'graph',
                    'sourceList',
                    'sourceDescription',
                    'sourceEvaluation',
                    'svgSheets',
                    'textcritics',
                ];

                const getClearErrorCountByKey = (key: EditionDataAssetsKeys) =>
                    clearErrorForSpy.mock.calls.filter((callArgs: any[]) => callArgs[0] === key).length;

                it.each(complexKeys)(
                    '... should start with fallback and return fallback if no complex is selected for key: `%s`',
                    async assetsKey => {
                        editionStateService.updateSelectedEditionComplex(null);
                        clearErrorForSpy.mockClear();

                        let resultSignal: Signal<any>;
                        TestBed.runInInjectionContext(() => {
                            resultSignal = (service as any)._getEditionDataByComplex(
                                expectedFile,
                                expectedFallback,
                                assetsKey
                            );
                        });
                        expectToEqual(resultSignal(), expectedFallback);
                        await new Promise(resolve => setTimeout(resolve, 0));

                        expect(getClearErrorCountByKey(assetsKey)).toBe(2);

                        // No fetch request should be triggered since no complex is selected
                        expectSpyCall(fetchJsonDataSpy, 0);

                        expectToEqual(resultSignal(), expectedFallback);
                    }
                );

                it.each(complexKeys)(
                    '... should return expected data when a complex is selected for key: `%s`',
                    async assetsKey => {
                        fetchJsonDataSpy.mockReturnValue(observableOf(expectedResponse));
                        clearErrorForSpy.mockClear();

                        editionStateService.updateSelectedEditionComplex(expectedEditionComplex);

                        let resultSignal: Signal<any>;
                        TestBed.runInInjectionContext(() => {
                            resultSignal = (service as any)._getEditionDataByComplex(
                                expectedFile,
                                expectedFallback,
                                assetsKey
                            );
                        });
                        expectToEqual(resultSignal(), expectedFallback);

                        await new Promise(resolve => setTimeout(resolve, 0));

                        expect(getClearErrorCountByKey(assetsKey)).toBe(2);

                        // The fetch request should be triggered
                        expect(getAssetPathSpy).toHaveBeenCalledWith(expectedEditionComplex);
                        expect(fetchJsonDataSpy).toHaveBeenCalled();

                        expectToEqual(resultSignal(), expectedResponse);
                    }
                );

                it.each(complexKeys)(
                    '... should clear errors for key `%s` every time the complex changes',
                    async assetsKey => {
                        fetchJsonDataSpy.mockReturnValue(observableOf(expectedResponse));

                        editionStateService.updateSelectedEditionComplex(null);

                        TestBed.runInInjectionContext(() => {
                            (service as any)._getEditionDataByComplex(expectedFile, expectedFallback, assetsKey);
                        });
                        await new Promise(resolve => setTimeout(resolve, 0));

                        expect(clearErrorForSpy).toHaveBeenCalledWith(assetsKey);

                        editionStateService.updateSelectedEditionComplex(expectedEditionComplex);
                        await new Promise(resolve => setTimeout(resolve, 0));

                        expect(clearErrorForSpy).toHaveBeenCalledWith(assetsKey);
                    }
                );
            });
        });

        describe('#_getIntroData()', () => {
            let mockSeriesSignal: WritableSignal<any>;
            let mockSectionSignal: WritableSignal<any>;
            let mockComplexSignal: WritableSignal<any>;
            let streamSpy: Spy;

            beforeEach(() => {
                mockSeriesSignal = signal(null);
                mockSectionSignal = signal(null);
                mockComplexSignal = signal(null);

                vi.spyOn(editionStateService, 'selectedEditionSeries').mockImplementation(() => mockSeriesSignal());
                vi.spyOn(editionStateService, 'selectedEditionSection').mockImplementation(() => mockSectionSignal());
                vi.spyOn(editionStateService, 'selectedEditionComplex').mockImplementation(() => mockComplexSignal());

                streamSpy = vi
                    .spyOn(service as any, '_getIntroDataStream')
                    .mockReturnValue(observableOf(new IntroList()));
            });

            it('... should return a signal initialized with an empty IntroList fallback', () => {
                let resultSignal: Signal<IntroList>;
                TestBed.runInInjectionContext(() => {
                    resultSignal = (service as any)._getIntroData();
                });
                expectToBe(isSignal(resultSignal), true);

                expectToEqual(resultSignal(), new IntroList());
            });

            it('... should react to state changes', async () => {
                let resultSignal: Signal<IntroList>;
                TestBed.runInInjectionContext(() => {
                    resultSignal = (service as any)._getIntroData();
                });
                expectToBe(isSignal(resultSignal), true);

                const mockState = {
                    series: { route: '2' },
                    section: { route: '2a' },
                    complex: { id: 'm34' },
                };
                mockSeriesSignal.set(mockState.series);
                mockSectionSignal.set(mockState.section);
                mockComplexSignal.set(mockState.complex);

                await new Promise(resolve => setTimeout(resolve, 0));

                expect(streamSpy).toHaveBeenCalledWith(mockState);
            });
        });

        describe('#_getIntroDataStream()', () => {
            const mockSeries: EditionOutlineSeries = {
                series: { route: '1' },
            } as any;

            const mockSection: EditionOutlineSection = {
                section: { route: '5' },
                labeledRoute: { route: ['/edition', 'series', '1', 'section', '5'] },
            } as any;

            it('... should have a method `_getIntroDataStream`', () => {
                expect((service as any)._getIntroDataStream).toBeDefined();
            });

            it('... should clear errors for the intro asset key every time it is called', async () => {
                clearErrorForSpy.mockImplementation(() => {});
                clearErrorForSpy.mockClear();

                const assetsKey: EditionComplexDataAssetsKeys = 'intro';
                const mockState = { series: null, section: null, complex: null };

                const result$ = (service as any)._getIntroDataStream(mockState);
                await lastValueFrom(result$);

                expectSpyCall(clearErrorForSpy, 1, assetsKey);

                clearErrorForSpy.mockRestore();
            });

            describe('... when state is incomplete', () => {
                describe('... should return fallback value if', () => {
                    const incompleteStates = [
                        ['state is null or undefined', null as any],
                        ['series is missing', { series: null, section: mockSection, complex: expectedEditionComplex }],
                        ['section is missing', { series: mockSeries, section: null, complex: expectedEditionComplex }],
                        ['series and section are missing', { series: null, section: null, complex: null }],
                    ];

                    it.each(incompleteStates)('... %s', async (_, mockState) => {
                        const result$ = (service as any)._getIntroDataStream(mockState);
                        const res = await lastValueFrom(result$);

                        expectToEqual(res, new IntroList());
                    });
                });

                it('... should not trigger any HTTP request if series or section is missing', async () => {
                    const mockState = { series: null, section: null, complex: null };

                    const result$ = (service as any)._getIntroDataStream(mockState);
                    await lastValueFrom(result$);

                    expectSpyCall(fetchJsonDataSpy, 0);
                });
            });

            describe('... when state is valid but complex is invalid or missing', () => {
                const expectedSectionPath = 'assets/data/edition/series/1/section/5';
                const expectedFile = config['intro'].file;
                const expectedFallback = new IntroList();

                let nonMatchingComplex: EditionComplex;
                let expectedSectionIntroData: IntroList;

                beforeEach(() => {
                    nonMatchingComplex = editionComplexesService.getEditionComplexById('m34');
                    expectedSectionIntroData = { intro: [{ id: 'section_block', content: [] }] } as IntroList;
                });

                it('... should trigger `_fetchJsonData` with the correct arguments', async () => {
                    const mockState = { series: mockSeries, section: mockSection, complex: nonMatchingComplex };
                    fetchJsonDataSpy.mockReturnValue(observableOf(expectedSectionIntroData));

                    const result$ = (service as any)._getIntroDataStream(mockState);
                    await lastValueFrom(result$);

                    expectSpyCall(fetchJsonDataSpy, 1, [expectedSectionPath, expectedFile, expectedFallback, 'intro']);
                });

                it('... should return the section intro data', async () => {
                    const mockState = { series: mockSeries, section: mockSection, complex: null };
                    fetchJsonDataSpy.mockReturnValue(observableOf(expectedSectionIntroData));

                    const result$ = (service as any)._getIntroDataStream(mockState);
                    const res = await lastValueFrom(result$);

                    expectToEqual(res, expectedSectionIntroData);
                });
            });

            describe('... when state is valid and complex matches the series and section', () => {
                const expectedSectionPath = 'assets/data/edition/series/1/section/5';
                const expectedFile = config['intro'].file;
                const expectedFallback = new IntroList();

                let matchingComplex: EditionComplex;
                let filterIntroDataSpy: Spy;

                beforeEach(() => {
                    matchingComplex = expectedEditionComplex;

                    filterIntroDataSpy = vi.spyOn(service as any, '_filterSectionIntroDataByBlockId');
                });

                it('... should fetch both the section and the complex intro data from their respective paths', async () => {
                    fetchJsonDataSpy
                        .mockReturnValueOnce(observableOf(expectedEditionIntroSectionData))
                        .mockReturnValueOnce(observableOf(expectedEditionIntroComplexData));

                    const mockState = { series: mockSeries, section: mockSection, complex: matchingComplex };
                    const result$ = (service as any)._getIntroDataStream(mockState);
                    await lastValueFrom(result$);

                    expect(fetchJsonDataSpy).toHaveBeenCalledTimes(2);
                    expect(fetchJsonDataSpy).toHaveBeenNthCalledWith(
                        1,
                        expectedSectionPath,
                        expectedFile,
                        expectedFallback,
                        'intro'
                    );

                    const expectedComplexPath = (service as any)._getAssetPathForEditionComplex(matchingComplex);
                    expect(fetchJsonDataSpy).toHaveBeenNthCalledWith(
                        2,
                        expectedComplexPath,
                        expectedFile,
                        expectedFallback,
                        'intro'
                    );
                });

                it('... should filter section data by complex blockId if complex data contains intro blocks', async () => {
                    fetchJsonDataSpy
                        .mockReturnValueOnce(observableOf(expectedEditionIntroSectionData))
                        .mockReturnValueOnce(observableOf(expectedEditionIntroComplexData));

                    const mockState = { series: mockSeries, section: mockSection, complex: matchingComplex };
                    const result$ = (service as any)._getIntroDataStream(mockState);
                    const res = await lastValueFrom(result$);

                    expectSpyCall(filterIntroDataSpy, 1, [expectedEditionIntroSectionData, 'test_block_id_2']);
                    expectToEqual(res, expectedEditionIntroSectionFilteredData);
                });

                it('... should return the plain section data without filtering if complex data contains no intro blocks', async () => {
                    const emptyComplexIntroData = { intro: [] } as IntroList;

                    fetchJsonDataSpy
                        .mockReturnValueOnce(observableOf(expectedEditionIntroSectionData))
                        .mockReturnValueOnce(observableOf(emptyComplexIntroData));

                    const mockState = { series: mockSeries, section: mockSection, complex: matchingComplex };
                    const result$ = (service as any)._getIntroDataStream(mockState);
                    const res = await lastValueFrom(result$);

                    expect(filterIntroDataSpy).not.toHaveBeenCalled();
                    expectToEqual(res, expectedEditionIntroSectionData);
                });
            });
        });

        describe('#_filterSectionIntroDataByBlockId()', () => {
            it('... should have a method `_filterSectionIntroDataByBlockId`', () => {
                expect((service as any)._filterSectionIntroDataByBlockId).toBeDefined();
            });

            it('... should return the correct section intro data for a given block id', () => {
                const blockId = 'test_block_id_2';
                const expectedBlock = expectedEditionIntroSectionData.intro[0].content.find(
                    block => block.blockId === blockId
                );

                const result = (service as any)._filterSectionIntroDataByBlockId(
                    expectedEditionIntroSectionData,
                    blockId
                );

                expect(result).toBeDefined();
                expect(result.intro[0]).toBeDefined();
                expectToBe(result.intro[0].id, expectedEditionIntroSectionData.intro[0].id);
                expectToEqual(result.intro[0].content, [expectedBlock]);
            });

            describe('... should return an empty content array or original data if', () => {
                it('... no block id is given', () => {
                    const result = (service as any)._filterSectionIntroDataByBlockId(
                        expectedEditionIntroSectionData,
                        undefined
                    );

                    expect(result).toBeDefined();
                    expect(result.intro[0]).toBeDefined();
                    expectToBe(result.intro[0].id, expectedEditionIntroSectionData.intro[0].id);
                    expectToEqual(result.intro[0].content, []);
                });

                it('... no intro data section is found for given block id', () => {
                    const blockId = 'notExistingId';
                    const result = (service as any)._filterSectionIntroDataByBlockId(
                        expectedEditionIntroSectionData,
                        blockId
                    );

                    expect(result).toBeDefined();
                    expect(result.intro[0]).toBeDefined();
                    expectToBe(result.intro[0].id, expectedEditionIntroSectionData.intro[0].id);
                    expectToEqual(result.intro[0].content, []);
                });
            });

            it('... intro data is missing or undefined', () => {
                const blockId = 'test_block_id';
                const incompleteData = { intro: undefined } as any;

                const result = (service as any)._filterSectionIntroDataByBlockId(incompleteData, blockId);

                expectToEqual(result, incompleteData);
            });

            it('... content inside an intro section is missing', () => {
                const blockId = 'test_block_id';
                const incompleteData: IntroList = {
                    intro: [{ id: 'intro_1', content: undefined as any }],
                };
                const result = (service as any)._filterSectionIntroDataByBlockId(incompleteData, blockId);

                expect(result).toBeDefined();
                expect(result.intro[0]).toBeDefined();
                expectToEqual(result.intro[0].content, []);
            });
        });

        describe('#_fetchJsonData()', () => {
            it('... should have a method `_fetchJsonData`', () => {
                expect((service as any)._fetchJsonData).toBeDefined();
            });

            it('... should return an Observable<any>', () => {
                const expectedPath = 'assets/data';
                const expectedFile = 'graph.json';
                const expectedFallback = { graph: new GraphList() };
                const expectedKey: EditionDataAssetsKeys = 'graph';
                const expectedData = { graph: [{ id: 'op3' }] };

                const expectedUrl = `${expectedPath}/${expectedFile}`;

                const result = (service as any)._fetchJsonData(
                    expectedPath,
                    expectedFile,
                    expectedFallback,
                    expectedKey
                );

                result.subscribe({
                    next: (res: any) => {
                        expectToEqual(res, expectedData);
                    },
                    error: () => {
                        throw new Error('should not call error');
                    },
                });

                // Respond with mock data
                expectAndFlush(expectedUrl, expectedData);
            });

            it('... should return fallback value and trigger `handleError` with correct arguments on HTTP failure', () => {
                const expectedPath = 'assets/data';
                const expectedFile = 'graph.json';
                const expectedFallback = { graph: new GraphList() };
                const expectedKey: EditionDataAssetsKeys = 'graph';
                const expectedUrl = `${expectedPath}/${expectedFile}`;

                const handleErrorSpy = vi.spyOn(service as any, '_handleError');

                const result = (service as any)._fetchJsonData(
                    expectedPath,
                    expectedFile,
                    expectedFallback,
                    expectedKey
                );

                result.subscribe({
                    next: (res: any) => {
                        expectToEqual(res, expectedFallback);
                    },
                });

                // Respond with an error
                expectAndFlush(expectedUrl, '404 error', { status: 404, statusText: 'Not Found' });
                expectSpyCall(handleErrorSpy, 1, [expectedKey, expectedFallback]);
            });

            it('... should return fallback value when the HTTP response is empty', async () => {
                const expectedPath = 'assets/data';
                const expectedFile = 'graph.json';
                const expectedFallback = { graph: new GraphList() };
                const expectedKey: EditionDataAssetsKeys = 'graph';

                // Respond with no data
                // (empty response cannot be flushed with httpTestingController,
                // So we mock the http get method to return EMPTY)
                vi.spyOn((service as any)._http, 'get').mockReturnValue(EMPTY);

                const result$ = (service as any)._fetchJsonData(
                    expectedPath,
                    expectedFile,
                    expectedFallback,
                    expectedKey
                );
                const res = await lastValueFrom(result$, { defaultValue: expectedFallback });

                expectToEqual(res, expectedFallback);
            });
        });

        describe('#_handleError()', () => {
            let mockError: HttpErrorResponse;

            beforeEach(() => {
                mockError = new HttpErrorResponse({
                    error: 'Format Error',
                    status: 404,
                    statusText: 'Not Found',
                    url: 'assets/data/test.json',
                });
            });

            it('... should have a method `_handleError`', () => {
                expect((service as any)._handleError).toBeDefined();
            });

            describe('... when called', () => {
                const expectedKey: EditionDataAssetsKeys = 'graph';
                const expectedFallback = { graph: new GraphList() };
                let errorHandlerFn: (error: HttpErrorResponse) => Observable<any>;

                beforeEach(() => {
                    errorHandlerFn = (service as any)._handleError(expectedKey, expectedFallback);
                });

                it('... should return an Observable that emits the fallback value', async () => {
                    const result$ = errorHandlerFn(mockError);
                    const res = await lastValueFrom(result$);

                    expectToEqual(res, expectedFallback);
                });

                it('... should log the error message with the correct format', async () => {
                    const logErrorSpy = vi.spyOn(service as any, '_logError').mockImplementation(() => {});

                    const result$ = errorHandlerFn(mockError);
                    await lastValueFrom(result$); // Resolve the observable to trigger the error handling

                    const expectedLogMessage = `${expectedKey} failed: Http failure response for assets/data/test.json: 404 Not Found`;
                    expectSpyCall(logErrorSpy, 1, expectedLogMessage);

                    logErrorSpy.mockRestore();
                });

                it('... should have signal `_dataError` to hold an error object for the expected key', async () => {
                    const result$ = errorHandlerFn(mockError);
                    await lastValueFrom(result$); // Resolve the observable to trigger the error handling

                    expectToEqual((service as any)._dataError(), {
                        key: expectedKey,
                        error: mockError,
                    });
                });
            });

            it('... should allow result to be undefined and return it as fallback', async () => {
                const expectedKey: EditionDataAssetsKeys = 'intro';

                const errorHandlerFn = (service as any)._handleError(expectedKey, undefined);
                const result$ = errorHandlerFn(mockError);
                const res = await lastValueFrom(result$);

                expect(res).toBeUndefined();
                expectToEqual((service as any)._dataError(), {
                    key: expectedKey,
                    error: mockError,
                });
            });
        });

        describe('#_logError()', () => {
            it('... should have a method `_logError`', () => {
                expect((service as any)._logError).toBeDefined();
            });

            it('... should log the given error message', () => {
                const expectedMessage = 'Test error message';

                (service as any)._logError(expectedMessage);

                expectSpyCall(consoleSpy, 1, expectedMessage);
            });
        });

        describe('#_clearErrorFor()', () => {
            const testKey: EditionDataAssetsKeys = 'graph';
            const otherKey: EditionDataAssetsKeys = 'intro';
            let mockError: HttpErrorResponse;

            beforeEach(() => {
                mockError = new HttpErrorResponse({ error: 'Test Error' });
            });

            it('... should have a method `_clearErrorFor`', () => {
                expect((service as any)._clearErrorFor).toBeDefined();
            });

            it('... should clear an error if the given key matches the current error key', () => {
                (service as any)._dataError.set({ key: testKey, error: mockError });

                // Call with the same key
                (service as any)._clearErrorFor(testKey);

                expectToBe((service as any)._dataError(), null);
            });

            it('... should not clear an error if the given key does not match the current error key', () => {
                const expectedErrorState = { key: testKey, error: mockError };
                (service as any)._dataError.set(expectedErrorState);

                // Call with a different key
                (service as any)._clearErrorFor(otherKey);

                expectToEqual((service as any)._dataError(), expectedErrorState);
            });

            it('... should handle sequentially occurring errors and only clear the active one', () => {
                const firstError = new HttpErrorResponse({ error: 'First Error' });
                const secondError = new HttpErrorResponse({ error: 'Second Error' });

                // Set multiple errors for different keys
                (service as any)._dataError.set({ key: 'graph', error: firstError });
                (service as any)._dataError.set({ key: 'intro', error: secondError });

                // Try to clear the first error (which is not the current one)
                (service as any)._clearErrorFor('graph');

                // The actual error should still be present
                expectToEqual((service as any)._dataError(), {
                    key: 'intro',
                    error: secondError,
                });

                // Clear the current error
                (service as any)._clearErrorFor('intro');

                expectToBe((service as any)._dataError(), null);
            });

            it('... should do nothing if there is currently no data error', () => {
                (service as any)._dataError.set(null);

                (service as any)._clearErrorFor(testKey);

                expectToBe((service as any)._dataError(), null);
            });
        });
    });
});
