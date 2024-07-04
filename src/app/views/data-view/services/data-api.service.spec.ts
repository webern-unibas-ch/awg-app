/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient, HttpParams, HttpRequest, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Data } from '@angular/router';

import { JsonConvert } from 'json2typescript';
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import {
    mockPropertyTypesInResourceClassResponseJson,
    mockResourceContextResponseJson,
    mockResourceDetail,
    mockResourceFullResponseJson,
    mockResourceTypesInVocabularyResponseJson,
    mockSearchResponseConverted,
    mockSearchResponseJson,
} from '@testing/mock-data';

import { AppConfig } from '@awg-app/app.config';
import { ConversionService } from '@awg-core/services';
import { ApiServiceError } from '@awg-core/services/api-service/api-service-error.model';
import {
    HlistJson,
    PropertyTypesInResourceClassResponseJson,
    ResourceContextResponseJson,
    ResourceFullResponseJson,
    ResourceTypesInVocabularyResponseJson,
    SearchResponseJson,
} from '@awg-shared/api-objects';
import { ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';
import { ExtendedSearchParams, ResourceData, ResourceDetail, SearchParams } from '@awg-views/data-view/models';

import { DataApiService } from './data-api.service';

// Helper function
function expectParams(call: TestRequest, param: string, expectedValue: string[], length?: number) {
    expectToBe(call.request.params.getAll(param).length, length);
    expectToEqual(call.request.params.getAll(param), expectedValue);
}

describe('DataApiService (DONE)', () => {
    let dataApiService: DataApiService;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let mockConversionService: Partial<ConversionService>;

    let getApiResponseSpy: Spy;

    // Json object
    let jsonConvert: JsonConvert;
    let expectedResourceFullResponseJson: ResourceFullResponseJson;
    let expectedResourceContextResponseJson: ResourceContextResponseJson;
    let expectedSearchResponseJson: SearchResponseJson;
    let expectedResourceTypesInVocabularyResponseJson: ResourceTypesInVocabularyResponseJson;
    let expectedPropertyTypesInResourceClassResponseJson: PropertyTypesInResourceClassResponseJson;
    let expectedSearchResponseConverted: any;
    let expectedResourceDetail: ResourceDetail;
    let expectedResourceData: ResourceData;

    const expectedProjectId = '6';
    const expectedVocabularyId = '4';
    const expectedDefaultLanguage = 'de';
    const expectedResourceSuffix = '_-_local';
    const expectedRoutes = {
        propertylists: 'propertylists/',
        resources: 'resources/',
        resourcetypes: 'resourcetypes/',
        search: 'search/',
    };
    const apiUrl = AppConfig.API_ENDPOINT;

    beforeEach(() => {
        // Stub service for test purposes
        mockConversionService = {
            convertFullTextSearchResults: () => expectedSearchResponseConverted,
            convertResourceData: () => expectedResourceDetail,
        };

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                DataApiService,
                { provide: ConversionService, useValue: mockConversionService },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        // Inject services and http client handler
        dataApiService = TestBed.inject(DataApiService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        // Convert json objects
        jsonConvert = new JsonConvert();
        expectedResourceFullResponseJson = jsonConvert.deserializeObject(
            mockResourceFullResponseJson,
            ResourceFullResponseJson
        );
        expectedResourceContextResponseJson = jsonConvert.deserializeObject(
            mockResourceContextResponseJson,
            ResourceContextResponseJson
        );
        expectedSearchResponseJson = jsonConvert.deserializeObject(mockSearchResponseJson, SearchResponseJson);
        expectedResourceTypesInVocabularyResponseJson = jsonConvert.deserializeObject(
            mockResourceTypesInVocabularyResponseJson,
            ResourceTypesInVocabularyResponseJson
        );
        expectedPropertyTypesInResourceClassResponseJson = jsonConvert.deserializeObject(
            mockPropertyTypesInResourceClassResponseJson,
            PropertyTypesInResourceClassResponseJson
        );

        // Test data
        expectedSearchResponseConverted = mockSearchResponseConverted;
        expectedResourceDetail = mockResourceDetail;
        expectedResourceData = new ResourceData(expectedResourceFullResponseJson, expectedResourceDetail);

        // Spies on service functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getApiResponseSpy = spyOn(dataApiService, 'getApiResponse').and.callThrough();
    });

    // After every test, assert that there are no more pending requests
    afterEach(() => {
        httpTestingController.verify();
    });

    it('... should create', () => {
        expect(dataApiService).toBeTruthy();
    });

    it('... injected service should use provided mockValue', () => {
        const conversionService = TestBed.inject(ConversionService);
        expectToBe(mockConversionService === conversionService, true);
    });

    describe('default values', () => {
        it('... should have serviceName', () => {
            const expectedServiceName = 'DataApiService';

            expectToBe(dataApiService.serviceName, expectedServiceName);
        });

        it('... should have projectId', () => {
            expectToBe(dataApiService.projectId, expectedProjectId);
        });

        it('... should have vocabularyId', () => {
            expectToBe(dataApiService.vocabularyId, expectedVocabularyId);
        });

        it('... should have defaultLanguage', () => {
            expectToBe(dataApiService.defaultLanguage, expectedDefaultLanguage);
        });

        it('... should have resourceSuffix', () => {
            expectToBe(dataApiService.resourceSuffix, expectedResourceSuffix);
        });

        it('... should have routes', () => {
            expectToEqual(dataApiService.routes, expectedRoutes);
        });

        it("... should have empty 'httpGetUrl' (inherited from ApiService)", () => {
            expectToBe(dataApiService.httpGetUrl, '');
        });
    });

    describe('httpTestingController', () => {
        it('... should issue a mocked http get request', waitForAsync(() => {
            const testData: Data = { name: 'TestData' };

            httpClient.get<Data>('/foo/bar').subscribe({
                next: data => {
                    expectToEqual(data, testData);
                },
            });

            // Match the request url
            const call: TestRequest = httpTestingController.expectOne({
                url: '/foo/bar',
            });

            // Check for GET request
            expectToBe(call.request.method, 'GET');

            // Respond with mocked data
            call.flush(testData);
        }));
    });

    describe('#getSearchData()', () => {
        it('... should have a method `getSearchData`', () => {
            expect(dataApiService.getSearchData).toBeDefined();
        });

        describe('request', () => {
            describe('... should not do anything if', () => {
                it('... undefined is provided', waitForAsync(() => {
                    // Undefined
                    const undefinedValue = undefined;
                    const expectedUrl = apiUrl + expectedRoutes.search + undefinedValue;

                    // Call service function
                    dataApiService.getSearchData(undefinedValue);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));

                it('... null is provided', waitForAsync(() => {
                    // Null
                    const nullValue = null;
                    const expectedUrl = apiUrl + expectedRoutes.search + nullValue;

                    // Call service function
                    dataApiService.getSearchData(nullValue);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));

                it('... searchParams.query is undefined', waitForAsync(() => {
                    // Empty string
                    const expectedSearchParams: SearchParams = new SearchParams(
                        undefined,
                        '25',
                        '0',
                        ViewHandleTypes.TABLE
                    );
                    const expectedUrl = apiUrl + expectedRoutes.search + expectedSearchParams.query;

                    // Call service function
                    dataApiService.getSearchData(expectedSearchParams);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));

                it('... searchParams.query is null', waitForAsync(() => {
                    // Empty string
                    const expectedSearchParams: SearchParams = new SearchParams(null, '25', '0', ViewHandleTypes.TABLE);
                    const expectedUrl = apiUrl + expectedRoutes.search + expectedSearchParams.query;

                    // Call service function
                    dataApiService.getSearchData(expectedSearchParams);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));

                it('... searchParams.query is empty string', waitForAsync(() => {
                    // Empty string
                    const expectedSearchParams: SearchParams = new SearchParams('', '25', '0', ViewHandleTypes.TABLE);
                    const expectedUrl = apiUrl + expectedRoutes.search + expectedSearchParams.query;

                    // Call service function
                    dataApiService.getSearchData(expectedSearchParams);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));

                describe('... searchParams.query is an ExtendedSearchParams object that has', () => {
                    it('... `filterByRestype` value of undefined', waitForAsync(() => {
                        // Undefined
                        const query = new ExtendedSearchParams();
                        const expectedSearchParams: SearchParams = new SearchParams(
                            query,
                            '25',
                            '0',
                            ViewHandleTypes.TABLE
                        );
                        if (expectedSearchParams.query instanceof ExtendedSearchParams) {
                            expectedSearchParams.query.filterByRestype = undefined;
                        }
                        const expectedUrl = apiUrl + expectedRoutes.search + expectedSearchParams.query;

                        // Call service function
                        dataApiService.getSearchData(expectedSearchParams);

                        // Expect no request to getApiResponse
                        expectSpyCall(getApiResponseSpy, 0);

                        // Expect no request to url with given settings
                        httpTestingController.expectNone(
                            (req: HttpRequest<any>) =>
                                req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                            `GET to ${expectedUrl}`
                        );
                    }));

                    it('... `filterByRestype` value of null', waitForAsync(() => {
                        // Null
                        const query = new ExtendedSearchParams();
                        const expectedSearchParams: SearchParams = new SearchParams(
                            query,
                            '25',
                            '0',
                            ViewHandleTypes.TABLE
                        );
                        if (expectedSearchParams.query instanceof ExtendedSearchParams) {
                            expectedSearchParams.query.filterByRestype = null;
                        }
                        const expectedUrl = apiUrl + expectedRoutes.search + expectedSearchParams.query;

                        // Call service function
                        dataApiService.getSearchData(expectedSearchParams);

                        // Expect no request to getApiResponse
                        expectSpyCall(getApiResponseSpy, 0);

                        // Expect no request to url with given settings
                        httpTestingController.expectNone(
                            (req: HttpRequest<any>) =>
                                req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                            `GET to ${expectedUrl}`
                        );
                    }));

                    it('... `filterByRestype` value of empty string', waitForAsync(() => {
                        // Empty string
                        const query = new ExtendedSearchParams();
                        const expectedSearchParams: SearchParams = new SearchParams(
                            query,
                            '25',
                            '0',
                            ViewHandleTypes.TABLE
                        );
                        if (expectedSearchParams.query instanceof ExtendedSearchParams) {
                            expectedSearchParams.query.filterByRestype = '';
                        }
                        const expectedUrl = apiUrl + expectedRoutes.search + expectedSearchParams.query;

                        // Call service function
                        dataApiService.getSearchData(expectedSearchParams);

                        // Expect no request to getApiResponse
                        expectSpyCall(getApiResponseSpy, 0);

                        // Expect no request to url with given settings
                        httpTestingController.expectNone(
                            (req: HttpRequest<any>) =>
                                req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                            `GET to ${expectedUrl}`
                        );
                    }));
                });
            });

            describe('... should perform an HTTP GET request to the API (via ApiService)', () => {
                it('... for Fulltext search with provided searchString (url includes query)', waitForAsync(() => {
                    const query = 'Test';
                    const expectedSearchParams: SearchParams = new SearchParams(
                        query,
                        '25',
                        '0',
                        ViewHandleTypes.TABLE
                    );
                    const expectedUrl = apiUrl + expectedRoutes.search + expectedSearchParams.query;

                    // Call service function
                    dataApiService.getSearchData(expectedSearchParams).subscribe();

                    // Expect one request to url with given settings
                    const call: TestRequest = httpTestingController.expectOne(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );

                    expectToBe(call.request.method, 'GET');
                    expectToBe(call.request.responseType, 'json');
                    expectToBe(call.request.url, expectedUrl);
                }));

                it('... for Extended search with provided object (url does not include query)', waitForAsync(() => {
                    const expectedRestype = '43'; // Opus
                    const query = new ExtendedSearchParams();
                    query.filterByRestype = expectedRestype;
                    const expectedSearchParams: SearchParams = new SearchParams(
                        query,
                        '25',
                        '0',
                        ViewHandleTypes.TABLE
                    );
                    const expectedUrl = apiUrl + expectedRoutes.search;

                    // Call service function
                    dataApiService.getSearchData(expectedSearchParams).subscribe();

                    // Expect one request to url with given settings
                    const call: TestRequest = httpTestingController.expectOne(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );

                    expectToBe(call.request.method, 'GET');
                    expectToBe(call.request.responseType, 'json');
                    expectToBe(call.request.url, expectedUrl);
                }));
            });

            describe('... should set default query params for GET request if none is provided', () => {
                it('... for Fulltext search query (string) => 5', waitForAsync(() => {
                    const query = 'Test';
                    const expectedSearchParams: SearchParams = new SearchParams(query, '', '', undefined);
                    const expectedUrl = apiUrl + expectedRoutes.search + expectedSearchParams.query;
                    const expectedNRows = '-1';
                    const expectedStartAt = '0';

                    // Call service function
                    dataApiService.getSearchData(expectedSearchParams).subscribe();

                    // Expect one request to url with given settings
                    const call: TestRequest = httpTestingController.expectOne(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );

                    expect(call.request.params).toBeDefined();
                    expectToBe(call.request.params.keys().length, 5);

                    expectParams(call, 'searchtype', ['fulltext'], 1);
                    expectParams(call, 'filter_by_project', [expectedProjectId], 1);
                    expectParams(call, 'show_nrows', [expectedNRows], 1);
                    expectParams(call, 'start_at', [expectedStartAt], 1);
                    expectParams(call, 'lang', [expectedDefaultLanguage], 1);
                }));

                it('... for Extended search query (object) without properties => 6', waitForAsync(() => {
                    const expectedRestype = '43'; // Opus
                    const query = new ExtendedSearchParams();
                    query.filterByRestype = expectedRestype;
                    const expectedSearchParams: SearchParams = new SearchParams(query, '', '', undefined);
                    const expectedUrl = apiUrl + expectedRoutes.search;
                    const expectedNRows = '-1';
                    const expectedStartAt = '0';

                    // Call service function
                    dataApiService.getSearchData(expectedSearchParams).subscribe();

                    // Expect one request to url with given settings
                    const call: TestRequest = httpTestingController.expectOne(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );

                    expect(call.request.params).toBeDefined();
                    expectToBe(call.request.params.keys().length, 6);

                    expectParams(call, 'searchtype', ['extended'], 1);
                    expectParams(call, 'filter_by_project', [expectedProjectId], 1);
                    expectParams(call, 'filter_by_restype', [expectedRestype], 1);
                    expectParams(call, 'show_nrows', [expectedNRows], 1);
                    expectParams(call, 'start_at', [expectedStartAt], 1);
                    expectParams(call, 'lang', [expectedDefaultLanguage], 1);
                }));
            });

            describe('... should apply provided params for GET request', () => {
                it('... for Fulltext search query (string)', waitForAsync(() => {
                    const query = 'Test';
                    const expectedSearchParams: SearchParams = new SearchParams(
                        query,
                        '5',
                        '20',
                        ViewHandleTypes.TABLE
                    );
                    const expectedUrl = apiUrl + expectedRoutes.search + expectedSearchParams.query;

                    // Call service function
                    dataApiService.getSearchData(expectedSearchParams).subscribe();

                    // Expect one request to url with given settings
                    const call: TestRequest = httpTestingController.expectOne(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );

                    expect(call.request.params).toBeDefined();
                    expectToBe(call.request.params.keys().length, 5);

                    expectParams(call, 'searchtype', ['fulltext'], 1);
                    expectParams(call, 'filter_by_project', [expectedProjectId], 1);
                    expectParams(call, 'show_nrows', [expectedSearchParams.nRows], 1);
                    expectParams(call, 'start_at', [expectedSearchParams.startAt], 1);
                    expectParams(call, 'lang', [expectedDefaultLanguage], 1);
                }));

                describe('... for Extended search query (object)', () => {
                    it('... with one propertyId and compop EXISTS (no searchval) => 8', waitForAsync(() => {
                        const expectedRestype = '43'; // Opus
                        const expectedFirstProperty = '389'; // Opus number
                        const expectedFirstCompop = 'EXISTS';

                        const query = new ExtendedSearchParams();
                        query.filterByRestype = expectedRestype;
                        query.propertyId = [expectedFirstProperty];
                        query.compop = [expectedFirstCompop];
                        const expectedSearchParams: SearchParams = new SearchParams(
                            query,
                            '5',
                            '20',
                            ViewHandleTypes.TABLE
                        );
                        const expectedUrl = apiUrl + expectedRoutes.search;

                        // Call service function
                        dataApiService.getSearchData(expectedSearchParams).subscribe();

                        // Expect one request to url with given settings
                        const call: TestRequest = httpTestingController.expectOne(
                            (req: HttpRequest<any>) =>
                                req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                            `GET to ${expectedUrl}`
                        );

                        expect(call.request.params).toBeDefined();
                        expectToBe(call.request.params.keys().length, 8);

                        expectParams(call, 'searchtype', ['extended'], 1);
                        expectParams(call, 'filter_by_project', [expectedProjectId], 1);
                        expectParams(call, 'filter_by_restype', [expectedRestype], 1);
                        expectParams(call, 'show_nrows', [expectedSearchParams.nRows], 1);
                        expectParams(call, 'start_at', [expectedSearchParams.startAt], 1);
                        expectParams(call, 'lang', [expectedDefaultLanguage], 1);
                        expectParams(call, 'property_id', [expectedFirstProperty], 1);
                        expectParams(call, 'compop', [expectedFirstCompop], 1);
                    }));

                    it('... with two propertyIds and compop EXISTS (no searchval) => 8 (+2)', waitForAsync(() => {
                        const expectedRestype = '43'; // Opus
                        const expectedFirstProperty = '389'; // Opus number
                        const expectedSecondProperty = '1'; // Title
                        const expectedFirstCompop = 'EXISTS';
                        const expectedSecondCompop = 'EXISTS';

                        const query = new ExtendedSearchParams();
                        query.filterByRestype = expectedRestype;
                        query.propertyId = [expectedFirstProperty, expectedSecondProperty];
                        query.compop = [expectedFirstCompop, expectedSecondCompop];
                        const expectedSearchParams: SearchParams = new SearchParams(
                            query,
                            '5',
                            '20',
                            ViewHandleTypes.TABLE
                        );
                        const expectedUrl = apiUrl + expectedRoutes.search;

                        // Call service function
                        dataApiService.getSearchData(expectedSearchParams).subscribe();

                        // Expect one request to url with given settings
                        const call: TestRequest = httpTestingController.expectOne(
                            (req: HttpRequest<any>) =>
                                req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                            `GET to ${expectedUrl}`
                        );

                        expect(call.request.params).toBeDefined();
                        expectToBe(call.request.params.keys().length, 8);

                        expectParams(call, 'searchtype', ['extended'], 1);
                        expectParams(call, 'filter_by_project', [expectedProjectId], 1);
                        expectParams(call, 'filter_by_restype', [expectedRestype], 1);
                        expectParams(call, 'show_nrows', [expectedSearchParams.nRows], 1);
                        expectParams(call, 'start_at', [expectedSearchParams.startAt], 1);
                        expectParams(call, 'lang', [expectedDefaultLanguage], 1);
                        expectParams(call, 'property_id', [expectedFirstProperty, expectedSecondProperty], 2);
                        expectParams(call, 'compop', [expectedFirstCompop, expectedSecondCompop], 2);
                    }));

                    it('... with one propertyId, compop, and searchval => 9', waitForAsync(() => {
                        const expectedRestype = '43'; // Opus
                        const expectedFirstProperty = '389'; // Opus number
                        const expectedFirstCompop = 'EQ';
                        const expectedFirstSearchval = '1';

                        const query = new ExtendedSearchParams();
                        query.filterByRestype = expectedRestype;
                        query.propertyId = [expectedFirstProperty];
                        query.compop = [expectedFirstCompop];
                        query.searchval = [expectedFirstSearchval];
                        const expectedSearchParams: SearchParams = new SearchParams(
                            query,
                            '5',
                            '20',
                            ViewHandleTypes.TABLE
                        );

                        const expectedUrl = apiUrl + expectedRoutes.search;

                        // Call service function
                        dataApiService.getSearchData(expectedSearchParams).subscribe();

                        // Expect one request to url with given settings
                        const call: TestRequest = httpTestingController.expectOne(
                            (req: HttpRequest<any>) =>
                                req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                            `GET to ${expectedUrl}`
                        );

                        expect(call.request.params).toBeDefined();
                        expectToBe(call.request.params.keys().length, 9);

                        expectParams(call, 'searchtype', ['extended'], 1);
                        expectParams(call, 'filter_by_project', [expectedProjectId], 1);
                        expectParams(call, 'filter_by_restype', [expectedRestype], 1);
                        expectParams(call, 'show_nrows', [expectedSearchParams.nRows], 1);
                        expectParams(call, 'start_at', [expectedSearchParams.startAt], 1);
                        expectParams(call, 'lang', [expectedDefaultLanguage], 1);
                        expectParams(call, 'property_id', [expectedFirstProperty], 1);
                        expectParams(call, 'compop', [expectedFirstCompop], 1);
                        expectParams(call, 'searchval', [expectedFirstSearchval], 1);
                    }));

                    it('... with two propertyIds, compops, and searchvals => 9 (+3)', waitForAsync(() => {
                        const expectedRestype = '43'; // Opus
                        const expectedFirstProperty = '389'; // Opus number
                        const expectedSecondProperty = '1'; // Title
                        const expectedFirstCompop = 'EQ';
                        const expectedSecondCompop = 'EQ';
                        const expectedFirstSearchval = '1';
                        const expectedSecondSearchval = 'Passacaglia';

                        const query = new ExtendedSearchParams();
                        query.filterByRestype = expectedRestype;
                        query.propertyId = [expectedFirstProperty, expectedSecondProperty];
                        query.compop = [expectedFirstCompop, expectedSecondCompop];
                        query.searchval = [expectedFirstSearchval, expectedSecondSearchval];
                        const expectedSearchParams: SearchParams = new SearchParams(
                            query,
                            '5',
                            '20',
                            ViewHandleTypes.TABLE
                        );

                        const expectedUrl = apiUrl + expectedRoutes.search;

                        // Call service function
                        dataApiService.getSearchData(expectedSearchParams).subscribe();

                        // Expect one request to url with given settings
                        const call: TestRequest = httpTestingController.expectOne(
                            (req: HttpRequest<any>) =>
                                req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                            `GET to ${expectedUrl}`
                        );

                        expect(call.request.params).toBeDefined();
                        expectToBe(call.request.params.keys().length, 9);

                        expectParams(call, 'searchtype', ['extended'], 1);
                        expectParams(call, 'filter_by_project', [expectedProjectId], 1);
                        expectParams(call, 'filter_by_restype', [expectedRestype], 1);
                        expectParams(call, 'show_nrows', [expectedSearchParams.nRows], 1);
                        expectParams(call, 'start_at', [expectedSearchParams.startAt], 1);
                        expectParams(call, 'lang', [expectedDefaultLanguage], 1);
                        expectParams(call, 'property_id', [expectedFirstProperty, expectedSecondProperty], 2);
                        expectParams(call, 'compop', [expectedFirstCompop, expectedSecondCompop], 2);
                        expectParams(call, 'searchval', [expectedFirstSearchval, expectedSecondSearchval], 2);
                    }));
                });
            });

            describe('... should call getApiResponse (via ApiService) ', () => {
                it('... with Fulltext search string', waitForAsync(() => {
                    const query = 'Test';
                    const expectedSearchParams: SearchParams = new SearchParams(query, '', '', ViewHandleTypes.TABLE);

                    const expectedQueryPath = expectedRoutes.search + expectedSearchParams.query;
                    let expectedQueryHttpParams = new HttpParams()
                        .set('filter_by_project', expectedProjectId)
                        .set('lang', expectedDefaultLanguage)
                        .set('show_nrows', '-1')
                        .set('start_at', '0');
                    expectedQueryHttpParams = expectedQueryHttpParams.append('searchtype', 'fulltext');

                    getApiResponseSpy.and.returnValue(observableOf(expectedSearchResponseJson));

                    dataApiService.getSearchData(expectedSearchParams).subscribe({
                        next: () => {
                            expectSpyCall(getApiResponseSpy, 1, [
                                SearchResponseJson,
                                expectedQueryPath,
                                expectedQueryHttpParams,
                            ]);
                        },
                    });
                }));

                it('... with ExtendedSearchParams object', waitForAsync(() => {
                    const expectedRestype = '43'; // Opus
                    const expectedFirstProperty = '389'; // Opus number
                    const expectedSecondProperty = '1'; // Title
                    const expectedFirstCompop = 'EQ';
                    const expectedSecondCompop = 'EQ';
                    const expectedFirstSearchval = '1';
                    const expectedSecondSearchval = 'Passacaglia';

                    const query = new ExtendedSearchParams();
                    query.filterByRestype = expectedRestype;
                    query.propertyId = [expectedFirstProperty, expectedSecondProperty];
                    query.compop = [expectedFirstCompop, expectedSecondCompop];
                    query.searchval = [expectedFirstSearchval, expectedSecondSearchval];
                    const expectedSearchParams: SearchParams = new SearchParams(query, '', '', undefined);

                    const expectedQueryPath = expectedRoutes.search;
                    let expectedQueryHttpParams = new HttpParams()
                        .set('filter_by_project', expectedProjectId)
                        .set('lang', expectedDefaultLanguage)
                        .set('show_nrows', '-1')
                        .set('start_at', '0');
                    expectedQueryHttpParams = expectedQueryHttpParams.append('searchtype', 'extended');
                    expectedQueryHttpParams = expectedQueryHttpParams.append('filter_by_restype', expectedRestype);
                    expectedQueryHttpParams = expectedQueryHttpParams.append('property_id', expectedFirstProperty);
                    expectedQueryHttpParams = expectedQueryHttpParams.append('property_id', expectedSecondProperty);

                    expectedQueryHttpParams = expectedQueryHttpParams.append('compop', expectedFirstCompop);
                    expectedQueryHttpParams = expectedQueryHttpParams.append('compop', expectedSecondCompop);

                    expectedQueryHttpParams = expectedQueryHttpParams.append('searchval', expectedFirstSearchval);
                    expectedQueryHttpParams = expectedQueryHttpParams.append('searchval', expectedSecondSearchval);

                    getApiResponseSpy.and.returnValue(observableOf(expectedSearchResponseJson));

                    dataApiService.getSearchData(expectedSearchParams).subscribe({
                        next: () => {
                            expectSpyCall(getApiResponseSpy, 1, [
                                SearchResponseJson,
                                expectedQueryPath,
                                expectedQueryHttpParams,
                            ]);
                        },
                    });
                }));
            });
        });

        describe('response', () => {
            describe('success', () => {
                it('... should return a SearchResponseJson observable (converted)', waitForAsync(() => {
                    const query = 'Test';
                    const expectedSearchParams: SearchParams = new SearchParams(
                        query,
                        '5',
                        '20',
                        ViewHandleTypes.TABLE
                    );

                    getApiResponseSpy.and.returnValue(observableOf(expectedSearchResponseConverted));

                    dataApiService.getSearchData(expectedSearchParams).subscribe({
                        next: (response: SearchResponseJson) => {
                            expectToEqual(response, expectedSearchResponseConverted);
                        },
                    });
                }));
            });

            describe('fail', () => {
                it('... should return an ApiServiceError observable', waitForAsync(() => {
                    const query = 'Test';
                    const expectedSearchParams: SearchParams = new SearchParams(query, '', '', undefined);

                    const expectedQueryPath = expectedRoutes.search + expectedSearchParams.query;
                    let expectedQueryHttpParams = new HttpParams()
                        .set('filter_by_project', '6')
                        .set('lang', expectedDefaultLanguage)
                        .set('show_nrows', '-1')
                        .set('start_at', '0');
                    expectedQueryHttpParams = expectedQueryHttpParams.append('searchtype', 'fulltext');

                    const expectedErrorMsg = 'failed HTTP response with 401 error';

                    const expectedApiServiceError = new ApiServiceError();
                    expectedApiServiceError.status = 401;
                    expectedApiServiceError.url = expectedQueryPath;

                    getApiResponseSpy.and.returnValue(observableThrowError(() => expectedApiServiceError));

                    dataApiService.getSearchData(expectedSearchParams).subscribe({
                        next: () => fail(expectedErrorMsg),
                        error: (err: ApiServiceError) => {
                            expectSpyCall(getApiResponseSpy, 1, [
                                SearchResponseJson,
                                expectedQueryPath,
                                expectedQueryHttpParams,
                            ]);
                            expectToEqual(err, expectedApiServiceError);
                        },
                    });
                }));
            });
        });
    });

    describe('#getResourceData()', () => {
        it('... should have a method `getResourceData`', () => {
            expect(dataApiService.getResourceData).toBeDefined();
        });

        describe('request', () => {
            describe('... should not do anything if ', () => {
                it('... undefined is provided', waitForAsync(() => {
                    // Undefined
                    const expectedResourceId = undefined;
                    const expectedUrl = apiUrl + expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;

                    // Call service function
                    dataApiService.getResourceData(expectedResourceId);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));

                it('... null is provided', waitForAsync(() => {
                    // Null
                    const expectedResourceId = null;
                    const expectedUrl = apiUrl + expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;

                    // Call service function
                    dataApiService.getResourceData(expectedResourceId);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));

                it('... empty resource id string is provided', waitForAsync(() => {
                    // Empty string
                    const expectedResourceId = '';
                    const expectedUrl = apiUrl + expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;

                    // Call service function
                    dataApiService.getResourceData(expectedResourceId);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));
            });

            describe('... should perform HTTP GET requests to the API (via ApiService)', () => {
                it('... with two requests', waitForAsync(() => {
                    const expectedResourceId = '11398';
                    const expectedUrl = apiUrl + expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;

                    // Call service function
                    dataApiService.getResourceData(expectedResourceId).subscribe();

                    // Expect two requests to url with given settings
                    const re = new RegExp(expectedUrl, 'g');
                    const calls = httpTestingController.match(
                        req => req.url.match(re) && req.method === 'GET' && req.responseType === 'json'
                    );

                    expectToBe(calls.length, 2);
                }));

                it('... the first request being a ResourceFullResponse request', waitForAsync(() => {
                    const expectedResourceId = '11398';
                    const expectedUrl = apiUrl + expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;

                    // Call service function
                    dataApiService.getResourceData(expectedResourceId).subscribe();

                    // Expect two requests to url with given settings
                    const re = new RegExp(expectedUrl, 'g');
                    const calls = httpTestingController.match(
                        req => req.url.match(re) && req.method === 'GET' && req.responseType === 'json'
                    );

                    expectToBe(calls.length, 2);

                    // Call to GET https://www.salsah.org/api/resources/11398_-_local (ResourceFullResponseJson)
                    expectToBe(calls[0].request.method, 'GET');
                    expectToBe(calls[0].request.responseType, 'json');
                    expectToBe(calls[0].request.url, expectedUrl);

                    expect(calls[0].request.params).toBeDefined();
                    expectToBe(calls[0].request.params.keys().length, 0);
                }));

                it('... the second request being a ResourceContextResponse request', waitForAsync(() => {
                    const expectedResourceId = '11398';
                    const expectedUrl = apiUrl + expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;

                    // Call service function
                    dataApiService.getResourceData(expectedResourceId).subscribe();

                    // Expect two requests to url with given settings
                    const re = new RegExp(expectedUrl, 'g');
                    const calls = httpTestingController.match(
                        req => req.url.match(re) && req.method === 'GET' && req.responseType === 'json'
                    );

                    expectToBe(calls.length, 2);

                    // Call to GET https://www.salsah.org/api/resources/11398_-_local?reqtype=context (ResourceContextResponseJson)
                    expectToBe(calls[0].request.method, 'GET');
                    expectToBe(calls[0].request.responseType, 'json');
                    expectToBe(calls[0].request.url, expectedUrl);

                    expect(calls[1].request.params).toBeDefined();
                    expectToBe(calls[1].request.params.keys().length, 1);

                    expectParams(calls[1], 'reqtype', ['context'], 1);
                }));
            });

            describe('... should call getApiResponse (via ApiService) with resource id', () => {
                it('... two times', waitForAsync(() => {
                    const expectedResourceId = '11398';
                    const expectedQueryPath = expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;
                    const expectedUrl = apiUrl + expectedQueryPath;

                    dataApiService.getResourceData(expectedResourceId).subscribe((response: ResourceData) => {
                        // Two calls
                        expectToBe(getApiResponseSpy.calls.all().length, 2);
                    });

                    // Expect two requests to url with given settings
                    const re = new RegExp(expectedUrl, 'g');
                    const calls = httpTestingController.match(
                        req => req.url.match(re) && req.method === 'GET' && req.responseType === 'json'
                    );

                    calls[0].flush(expectedResourceFullResponseJson);
                    calls[1].flush(expectedResourceContextResponseJson);
                }));

                it('... the first call being a ResourceFullResponse request', waitForAsync(() => {
                    const expectedResourceId = '11398';
                    const expectedQueryPath = expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;
                    const expectedQueryHttpParams = new HttpParams();
                    const expectedUrl = apiUrl + expectedQueryPath;

                    dataApiService.getResourceData(expectedResourceId).subscribe({
                        next: () => {
                            // Two calls
                            expectToBe(getApiResponseSpy.calls.all().length, 2);

                            // Shortcut
                            const firstCallArgs = getApiResponseSpy.calls.allArgs()[0];

                            // Check args of call
                            expectToBe(firstCallArgs[0].name, 'ResourceFullResponseJson');
                            expectToBe(firstCallArgs[1], expectedQueryPath);
                            expectToEqual(firstCallArgs[2], expectedQueryHttpParams);
                        },
                    });

                    // Expect two requests to url with given settings
                    const re = new RegExp(expectedUrl, 'g');
                    const calls = httpTestingController.match(
                        req => req.url.match(re) && req.method === 'GET' && req.responseType === 'json'
                    );

                    calls[0].flush(expectedResourceFullResponseJson);
                    calls[1].flush(expectedResourceContextResponseJson);
                }));

                it('... the second call being a ResourceContextResponse request', waitForAsync(() => {
                    const expectedResourceId = '11398';
                    const expectedQueryPath = expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;
                    const expectedQueryHttpParams = new HttpParams().set('reqtype', 'context');
                    const expectedUrl = apiUrl + expectedQueryPath;

                    dataApiService.getResourceData(expectedResourceId).subscribe({
                        next: () => {
                            // Two calls
                            expectToBe(getApiResponseSpy.calls.all().length, 2);

                            // Shortcut
                            const secondCallArgs = getApiResponseSpy.calls.allArgs()[1];

                            // Check args of call
                            expectToBe(secondCallArgs[0].name, 'ResourceContextResponseJson');
                            expectToBe(secondCallArgs[1], expectedQueryPath);
                            expectToEqual(secondCallArgs[2], expectedQueryHttpParams);
                        },
                    });

                    // Expect two requests to url with given settings
                    const re = new RegExp(expectedUrl, 'g');
                    const calls = httpTestingController.match(
                        req => req.url.match(re) && req.method === 'GET' && req.responseType === 'json'
                    );

                    calls[0].flush(expectedResourceFullResponseJson);
                    calls[1].flush(expectedResourceContextResponseJson);
                }));
            });
        });

        describe('response', () => {
            describe('success', () => {
                describe('... should return a ResourceData observable', () => {
                    it('... with resource data when both API responses succeed', waitForAsync(() => {
                        const expectedResourceId = '11398';

                        // Return fork joined observables from API
                        getApiResponseSpy.and.returnValues(
                            observableOf(expectedResourceFullResponseJson),
                            observableOf(expectedResourceContextResponseJson)
                        );

                        dataApiService.getResourceData(expectedResourceId).subscribe({
                            next: (resourceData: ResourceData) => {
                                expectToBe(getApiResponseSpy.calls.all().length, 2);
                                expectToEqual(resourceData, expectedResourceData);
                            },
                        });
                    }));
                });
            });

            describe('fail', () => {
                describe('... should return an ApiServiceError observable', () => {
                    const expectedResourceId = '11398';
                    const expectedQueryPath = expectedRoutes.resources + expectedResourceId + expectedResourceSuffix;
                    const expectedErrorMsg = 'should fail HTTP response with 401 error';
                    let expectedApiServiceError;

                    beforeEach(() => {
                        expectedApiServiceError = new ApiServiceError();
                        expectedApiServiceError.status = 401;
                        expectedApiServiceError.url = expectedQueryPath;
                    });

                    it('... when both API responses fail', waitForAsync(() => {
                        // Return fork joined observables from API
                        getApiResponseSpy.and.returnValues(
                            observableThrowError(() => expectedApiServiceError),
                            observableThrowError(() => expectedApiServiceError)
                        );

                        dataApiService.getResourceData(expectedResourceId).subscribe({
                            next: () => fail(expectedErrorMsg),
                            error: (err: ApiServiceError) => {
                                // Two calls
                                expectToBe(getApiResponseSpy.calls.all().length, 2);
                                expectToEqual(err, expectedApiServiceError);
                            },
                        });
                    }));

                    it('... when first API response fails', waitForAsync(() => {
                        // Return fork joined observables from API
                        getApiResponseSpy.and.returnValues(
                            observableThrowError(() => expectedApiServiceError),
                            observableOf(expectedResourceContextResponseJson)
                        );

                        dataApiService.getResourceData(expectedResourceId).subscribe({
                            next: () => fail(expectedErrorMsg),
                            error: (err: ApiServiceError) => {
                                // Two calls
                                expectToBe(getApiResponseSpy.calls.all().length, 2);
                                expectToEqual(err, expectedApiServiceError);
                            },
                        });
                    }));

                    it('... when second API response fails', waitForAsync(() => {
                        // Return fork joined observables from API
                        getApiResponseSpy.and.returnValues(
                            observableOf(expectedResourceFullResponseJson),
                            observableThrowError(() => expectedApiServiceError)
                        );

                        dataApiService.getResourceData(expectedResourceId).subscribe({
                            next: () => fail(expectedErrorMsg),
                            error: (err: ApiServiceError) => {
                                // Two calls
                                expectToBe(getApiResponseSpy.calls.all().length, 2);
                                expectToEqual(err, expectedApiServiceError);
                            },
                        });
                    }));
                });
            });
        });
    });

    describe('#getResourceTypes()', () => {
        it('... should have a method `getResourceTypes`', () => {
            expect(dataApiService.getResourceTypes).toBeDefined();
        });

        describe('request', () => {
            it('... should perform an HTTP GET request to the API (via ApiService)', waitForAsync(() => {
                const expectedUrl = apiUrl + expectedRoutes.resourcetypes;

                // Call service function
                dataApiService.getResourceTypes().subscribe();

                // Expect one request to url with given settings
                const call: TestRequest = httpTestingController.expectOne(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                    `GET to ${expectedUrl}`
                );

                expectToBe(call.request.method, 'GET');
                expectToBe(call.request.responseType, 'json');
                expectToBe(call.request.url, expectedUrl);
            }));

            it('... should set default query params for GET request', waitForAsync(() => {
                const expectedUrl = apiUrl + expectedRoutes.resourcetypes;

                // Call service function
                dataApiService.getResourceTypes().subscribe();

                // Expect one request to url with given settings
                const call: TestRequest = httpTestingController.expectOne(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                    `GET to ${expectedUrl}`
                );

                expect(call.request.params).toBeDefined();
                expectToBe(call.request.params.keys().length, 2);

                expectParams(call, 'vocabulary', [expectedVocabularyId], 1);
                expectParams(call, 'lang', [expectedDefaultLanguage], 1);
            }));

            it('... should call getApiResponse (via ApiService) ', waitForAsync(() => {
                const expectedQueryPath = expectedRoutes.resourcetypes;
                const expectedQueryHttpParams = new HttpParams()
                    .set('vocabulary', expectedVocabularyId)
                    .set('lang', expectedDefaultLanguage);

                getApiResponseSpy.and.returnValue(observableOf(expectedPropertyTypesInResourceClassResponseJson));

                dataApiService.getResourceTypes().subscribe({
                    next: (restypes: ResourceTypesInVocabularyResponseJson) => {
                        expect(restypes).toBeTruthy();
                        expectSpyCall(getApiResponseSpy, 1, [
                            ResourceTypesInVocabularyResponseJson,
                            expectedQueryPath,
                            expectedQueryHttpParams,
                        ]);
                    },
                });
            }));
        });
        describe('response', () => {
            describe('success', () => {
                it('... should return a ResourceTypesInVocabularyResponseJson observable', waitForAsync(() => {
                    getApiResponseSpy.and.returnValue(observableOf(expectedResourceTypesInVocabularyResponseJson));

                    dataApiService.getResourceTypes().subscribe({
                        next: (restypes: ResourceTypesInVocabularyResponseJson) => {
                            expect(restypes).toBeTruthy();
                            expectToEqual(restypes, expectedResourceTypesInVocabularyResponseJson);
                        },
                    });
                }));
            });

            describe('fail', () => {
                it('... should return an ApiServiceError observable', waitForAsync(() => {
                    const expectedQueryPath = expectedRoutes.resourcetypes;
                    const expectedQueryHttpParams = new HttpParams()
                        .set('vocabulary', expectedVocabularyId)
                        .set('lang', expectedDefaultLanguage);

                    const expectedErrorMsg = 'failed HTTP response with 401 error';

                    const expectedApiServiceError = new ApiServiceError();
                    expectedApiServiceError.status = 401;
                    expectedApiServiceError.url = expectedQueryPath;

                    getApiResponseSpy.and.returnValue(observableThrowError(() => expectedApiServiceError));

                    dataApiService.getResourceTypes().subscribe({
                        next: () => fail(expectedErrorMsg),
                        error: (err: ApiServiceError) => {
                            expectSpyCall(getApiResponseSpy, 1, [
                                ResourceTypesInVocabularyResponseJson,
                                expectedQueryPath,
                                expectedQueryHttpParams,
                            ]);
                            expectToEqual(err, expectedApiServiceError);
                        },
                    });
                }));
            });
        });
    });

    describe('#getPropertyListsByResourceType()', () => {
        it('... should have a method `getPropertyListsByResourceType`', () => {
            expect(dataApiService.getPropertyListsByResourceType).toBeDefined();
        });

        describe('request', () => {
            describe('... should not do anything if ', () => {
                it('undefined is provided', waitForAsync(() => {
                    // Undefined
                    const expectedRestype = undefined;
                    const expectedUrl = apiUrl + expectedRoutes.propertylists;

                    // Call service function
                    dataApiService.getPropertyListsByResourceType(expectedRestype);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));

                it('... null is provided', waitForAsync(() => {
                    // Null
                    const expectedRestype = null;
                    const expectedUrl = apiUrl + expectedRoutes.propertylists;

                    // Call service function
                    dataApiService.getPropertyListsByResourceType(expectedRestype);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));

                it('... empty resource id string is provided', waitForAsync(() => {
                    // Empty string
                    const expectedRestype = '';
                    const expectedUrl = apiUrl + expectedRoutes.propertylists;

                    // Call service function
                    dataApiService.getPropertyListsByResourceType(expectedRestype);

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 0);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                        `GET to ${expectedUrl}`
                    );
                }));
            });

            it('... should perform an HTTP GET request to the API (via ApiService)', waitForAsync(() => {
                const expectedRestype = '43'; // Opus
                const expectedUrl = apiUrl + expectedRoutes.propertylists;

                // Call service function
                dataApiService.getPropertyListsByResourceType(expectedRestype).subscribe();

                // Expect one request to url with given settings
                const call: TestRequest = httpTestingController.expectOne(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                    `GET to ${expectedUrl}`
                );

                expectToBe(call.request.method, 'GET');
                expectToBe(call.request.responseType, 'json');
                expectToBe(call.request.url, expectedUrl);
            }));

            it('... should set default query params for GET request', waitForAsync(() => {
                const expectedRestype = '43'; // Opus
                const expectedUrl = apiUrl + expectedRoutes.propertylists;

                // Call service function
                dataApiService.getPropertyListsByResourceType(expectedRestype).subscribe();

                // Expect one request to url with given settings
                const call: TestRequest = httpTestingController.expectOne(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                    `GET to ${expectedUrl}`
                );

                expect(call.request.params).toBeDefined();
                expectToBe(call.request.params.keys().length, 1);

                expectParams(call, 'restype', [expectedRestype], 1);
            }));

            it('... should call getApiResponse (via ApiService) ', waitForAsync(() => {
                const expectedRestype = '43'; // Opus
                const expectedQueryPath = expectedRoutes.propertylists;
                const expectedQueryHttpParams = new HttpParams().set('restype', expectedRestype);

                getApiResponseSpy.and.returnValue(observableOf(expectedPropertyTypesInResourceClassResponseJson));

                dataApiService.getPropertyListsByResourceType(expectedRestype).subscribe({
                    next: (propertyList: PropertyTypesInResourceClassResponseJson) => {
                        expect(propertyList).toBeTruthy();
                        expectSpyCall(getApiResponseSpy, 1, [
                            PropertyTypesInResourceClassResponseJson,
                            expectedQueryPath,
                            expectedQueryHttpParams,
                        ]);
                    },
                });
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it('... should return a PropertyTypesInResourceClassResponseJson observable', waitForAsync(() => {
                    const expectedRestype = '43'; // Opus

                    getApiResponseSpy.and.returnValue(observableOf(expectedPropertyTypesInResourceClassResponseJson));

                    dataApiService.getPropertyListsByResourceType(expectedRestype).subscribe({
                        next: (propertyList: PropertyTypesInResourceClassResponseJson) => {
                            expect(propertyList).toBeTruthy();
                            expectToEqual(propertyList, expectedPropertyTypesInResourceClassResponseJson);
                        },
                    });
                }));
            });

            describe('fail', () => {
                it('... should return an ApiServiceError observable', waitForAsync(() => {
                    const expectedRestype = '43'; // Opus
                    const expectedQueryPath = expectedRoutes.propertylists;
                    const expectedQueryHttpParams = new HttpParams().set('restype', expectedRestype);

                    const expectedErrorMsg = 'failed HTTP response with 401 error';

                    const expectedApiServiceError = new ApiServiceError();
                    expectedApiServiceError.status = 401;
                    expectedApiServiceError.url = expectedQueryPath;

                    getApiResponseSpy.and.returnValue(observableThrowError(() => expectedApiServiceError));

                    dataApiService.getPropertyListsByResourceType(expectedRestype).subscribe({
                        next: () => fail(expectedErrorMsg),
                        error: (err: ApiServiceError) => {
                            expectSpyCall(getApiResponseSpy, 1, [
                                PropertyTypesInResourceClassResponseJson,
                                expectedQueryPath,
                                expectedQueryHttpParams,
                            ]);
                            expectToEqual(err, expectedApiServiceError);
                        },
                    });
                }));
            });
        });
    });

    describe('#_getResourceDataResponseFromApi()', () => {
        it('... should have a method `_getResourceDataResponseFromApi`', () => {
            expect((dataApiService as any)._getResourceDataResponseFromApi).toBeDefined();
        });

        describe('request', () => {
            describe('... should not get anything if ', () => {
                it('response type is undefined', waitForAsync(() => {
                    // Call service function
                    (dataApiService as any)._getResourceDataResponseFromApi(undefined, 'undefined');

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 1, undefined);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === 'undefined',
                        `GET to ${'undefined'}`
                    );
                }));

                it('response type is null', waitForAsync(() => {
                    // Call service function
                    (dataApiService as any)._getResourceDataResponseFromApi(null, 'null');

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 1, null);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === 'null',
                        `GET to ${'null'}`
                    );
                }));

                it('response type is not a known switch case', waitForAsync(() => {
                    // Call service function
                    (dataApiService as any)._getResourceDataResponseFromApi(HlistJson, 'hlist');

                    // Expect no request to getApiResponse
                    expectSpyCall(getApiResponseSpy, 1, HlistJson);

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) =>
                            req.method === 'GET' && req.responseType === 'json' && req.url === 'hlist',
                        `GET to ${'hlist'}`
                    );
                }));
            });
        });
    });
});
