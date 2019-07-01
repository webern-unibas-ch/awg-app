/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Data } from '@angular/router';

import Spy = jasmine.Spy;
import { of as observableOf, throwError as observableThrowError } from 'rxjs';

import { JsonConvert } from 'json2typescript';

import { expectSpyCall } from '@testing/expect-helper';
import { mockResourceFullResponseJson, mockSearchResponseConverted, mockSearchResponseJson } from '@testing/mock-data';

import { AppConfig } from '@awg-app/app.config';
import { ConversionService } from '@awg-core/services';
import { ApiServiceError } from '@awg-core/services/api-service/api-service-error.model';
import { ResourceFullResponseJson, SearchResponseJson } from '@awg-shared/api-objects';

import { DataApiService } from './data-api.service';

describe('DataApiService (DONE)', () => {
    let dataApiService: DataApiService;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let mockConversionService: Partial<ConversionService>;

    let getApiResponseSpy: Spy;

    // json object
    let jsonConvert: JsonConvert;
    let expectedResourceFullResponseJson: ResourceFullResponseJson;
    let expectedSearchResponseJson: SearchResponseJson;
    let expectedSearchResponseConverted: any;

    const expectedProjectId = '6';
    const expectedResourceSuffix = '_-_local';
    const expectedResourcesRoute = 'resources/';
    const expectedSearchRoute = 'search/';
    const apiUrl = AppConfig.API_ENDPOINT;

    beforeEach(() => {
        // stub service for test purposes
        mockConversionService = {
            convertFullTextSearchResults: () => expectedSearchResponseConverted
        };

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DataApiService, { provide: ConversionService, useValue: mockConversionService }]
        });
        // inject services and http client handler
        dataApiService = TestBed.get(DataApiService);
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);

        // convert json objects
        jsonConvert = new JsonConvert();
        expectedResourceFullResponseJson = jsonConvert.deserializeObject(
            mockResourceFullResponseJson,
            ResourceFullResponseJson
        );
        expectedSearchResponseJson = jsonConvert.deserializeObject(mockSearchResponseJson, SearchResponseJson);

        // test data
        expectedSearchResponseConverted = mockSearchResponseConverted;

        // spies on service functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getApiResponseSpy = spyOn(dataApiService, 'getApiResponse').and.callThrough();
    });

    // after every test, assert that there are no more pending requests
    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(dataApiService).toBeTruthy();
    });

    it('stub service and injected conversionService should not be the same', () => {
        const conversionService = TestBed.get(ConversionService);
        expect(mockConversionService === conversionService).toBe(false);

        // changing the stub service has no effect on the injected service
        mockConversionService.convertFullTextSearchResults = () => new SearchResponseJson();

        expect(conversionService.convertFullTextSearchResults()).toBe(expectedSearchResponseConverted);
    });

    describe('default values', () => {
        it('... should have serviceName', () => {
            const expectedServiceName = 'DataApiService';

            expect(dataApiService.serviceName).toBeDefined();
            expect(dataApiService.serviceName).toBe(expectedServiceName);
        });

        it('... should have projectId', () => {
            expect(dataApiService.projectId).toBeDefined();
            expect(dataApiService.projectId).toBe(expectedProjectId);
        });

        it('... should have resourceSuffix', () => {
            expect(dataApiService.resourceSuffix).toBeDefined();
            expect(dataApiService.resourceSuffix).toBe(expectedResourceSuffix);
        });

        it('... should have routes', () => {
            expect(dataApiService.resourcesRoute).toBeDefined();
            expect(dataApiService.resourcesRoute).toBe(expectedResourcesRoute);

            expect(dataApiService.searchRoute).toBeDefined();
            expect(dataApiService.searchRoute).toBe(expectedSearchRoute);
        });

        it(`... should have 'loading = false' (inherited from ApiService)`, () => {
            expect(dataApiService.loading).toBeDefined();
            expect(dataApiService.loading).toBeFalsy();
        });

        it(`... should have empty 'httpGetUrl' (inherited from ApiService)`, () => {
            expect(dataApiService.httpGetUrl).toBeDefined();
            expect(dataApiService.httpGetUrl).toBe('');
        });
    });

    describe('httpTestingController', () => {
        it(`... should issue a mocked http get request`, async(() => {
            const testData: Data = { name: 'TestData' };

            httpClient.get<Data>('/foo/bar').subscribe(data => {
                expect(data).toEqual(testData);
            });

            // match the request url
            const r = httpTestingController.expectOne({
                url: '/foo/bar'
            });

            // check for GET request
            expect(r.request.method).toEqual('GET');

            // respond with mocked data
            r.flush(testData);
        }));
    });

    describe('#getFulltextSearchData', () => {
        describe('request', () => {
            it(`... should not do anything if empty searchString is provided`, async(() => {
                // empty string
                const expectedSearchString = '';
                const expectedUrl = apiUrl + expectedSearchRoute + expectedSearchString;

                // call service function
                dataApiService.getFulltextSearchData(expectedSearchString);

                // expect no request to getApiResponse
                expectSpyCall(getApiResponseSpy, 0);

                // expect no request to url with given settings
                httpTestingController.expectNone((req: HttpRequest<any>) => {
                    return req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl;
                }, `GET to ${expectedUrl}`);
            }));

            it(`... should not do anything if undefined is provided`, async(() => {
                // undefined
                const expectedSearchString = undefined;
                const expectedUrl = apiUrl + expectedSearchRoute + expectedSearchString;

                // call service function
                dataApiService.getFulltextSearchData(expectedSearchString);

                // expect no request to getApiResponse
                expectSpyCall(getApiResponseSpy, 0);

                // expect no request to url with given settings
                httpTestingController.expectNone((req: HttpRequest<any>) => {
                    return req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl;
                }, `GET to ${expectedUrl}`);
            }));

            it(`... should not do anything if null is provided`, async(() => {
                // null
                const expectedSearchString = null;
                const expectedUrl = apiUrl + expectedSearchRoute + expectedSearchString;

                // call service function
                dataApiService.getFulltextSearchData(expectedSearchString);

                // expect no request to getApiResponse
                expectSpyCall(getApiResponseSpy, 0);

                // expect no request to url with given settings
                httpTestingController.expectNone((req: HttpRequest<any>) => {
                    return req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl;
                }, `GET to ${expectedUrl}`);
            }));

            it(`... should perform an HTTP GET request to the Knora API (via ApiService) with provided searchString`, async(() => {
                const expectedSearchString = 'Test';
                const expectedUrl = apiUrl + expectedSearchRoute + expectedSearchString;

                // call service function
                dataApiService.getFulltextSearchData(expectedSearchString).subscribe();

                // expect one request to url with given settings
                httpTestingController.expectOne((req: HttpRequest<any>) => {
                    return req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl;
                }, `GET to ${expectedUrl}`);
            }));

            it(`... should set default params for GET request if none is provided`, async(() => {
                const expectedSearchString = 'Test';
                const expectedRows = '-1';
                const expectedStartAt = '0';
                const expectedUrl = apiUrl + expectedSearchRoute + expectedSearchString;

                // call service function
                dataApiService.getFulltextSearchData(expectedSearchString).subscribe();

                // expect one request to url with given settings
                httpTestingController.expectOne((req: HttpRequest<any>) => {
                    expect(req.params).toBeDefined();
                    expect(req.params.keys().length).toBe(4, 'should be 4');
                    expect(req.params.get('searchtype')).toBe('fulltext', 'should be fulltext');
                    expect(req.params.get('filter_by_project')).toBe(
                        expectedProjectId,
                        `should be ${expectedProjectId}`
                    );
                    expect(req.params.get('show_nrows')).toBe(expectedRows, `should be ${expectedRows}`);
                    expect(req.params.get('start_at')).toBe(expectedStartAt, `should be ${expectedStartAt}`);

                    return req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl;
                }, `GET to ${expectedUrl}`);
            }));

            it(`... should apply provided params for GET request`, async(() => {
                const expectedSearchString = 'Test';
                const expectedRows = '5';
                const expectedStartAt = '20';
                const expectedUrl = apiUrl + expectedSearchRoute + expectedSearchString;

                // call service function
                dataApiService.getFulltextSearchData(expectedSearchString, expectedRows, expectedStartAt).subscribe();

                // expect one request to url with given settings
                httpTestingController.expectOne((req: HttpRequest<any>) => {
                    expect(req.params).toBeDefined();
                    expect(req.params.keys().length).toBe(4, 'should be 4');
                    expect(req.params.get('searchtype')).toBe('fulltext', 'should be fulltext');
                    expect(req.params.get('filter_by_project')).toBe(
                        expectedProjectId,
                        `should be ${expectedProjectId}`
                    );
                    expect(req.params.get('show_nrows')).toBe(expectedRows, `should be ${expectedRows}`);
                    expect(req.params.get('start_at')).toBe(expectedStartAt, `should be ${expectedStartAt}`);

                    return req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl;
                }, `GET to ${expectedUrl}`);
            }));

            it(`... should call getApiResponse (via ApiService) with search string`, async(() => {
                const expectedSearchString = 'Test';
                const expectedQueryPath = expectedSearchRoute + expectedSearchString;
                const expectedQueryHttpParams = new HttpParams()
                    .set('searchtype', 'fulltext')
                    .set('filter_by_project', '6')
                    .set('show_nrows', '-1')
                    .set('start_at', '0');

                getApiResponseSpy.and.returnValue(observableOf(expectedSearchResponseJson));

                dataApiService.getFulltextSearchData(expectedSearchString).subscribe((response: SearchResponseJson) => {
                    expectSpyCall(getApiResponseSpy, 1, [
                        SearchResponseJson,
                        expectedQueryPath,
                        expectedQueryHttpParams
                    ]);
                });
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it(`... should return an Observable<SearchResponseJson> (converted)`, async(() => {
                    const expectedSearchString = 'Test';

                    getApiResponseSpy.and.returnValue(observableOf(expectedSearchResponseConverted));

                    dataApiService
                        .getFulltextSearchData(expectedSearchString)
                        .subscribe((response: SearchResponseJson) => {
                            expect(response).toEqual(expectedSearchResponseConverted);
                        });
                }));
            });

            describe('fail', () => {
                it(`... should return an Observable<ApiServiceError>`, async(() => {
                    const expectedSearchString = 'Test';
                    const expectedQueryPath = expectedSearchRoute + expectedSearchString;
                    const expectedQueryHttpParams = new HttpParams()
                        .set('searchtype', 'fulltext')
                        .set('filter_by_project', '6')
                        .set('show_nrows', '-1')
                        .set('start_at', '0');

                    const expectedErrorMsg = 'failed HTTP response with 401 error';

                    const expectedApiServiceError = new ApiServiceError();
                    expectedApiServiceError.status = 401;
                    expectedApiServiceError.url = expectedQueryPath;

                    getApiResponseSpy.and.returnValue(observableThrowError(expectedApiServiceError));

                    dataApiService.getFulltextSearchData(expectedSearchString).subscribe(
                        result => fail(expectedErrorMsg),
                        (error: ApiServiceError) => {
                            expectSpyCall(getApiResponseSpy, 1, [
                                SearchResponseJson,
                                expectedQueryPath,
                                expectedQueryHttpParams
                            ]);
                            expect(error).toEqual(expectedApiServiceError);
                        }
                    );
                }));
            });
        });
    });

    describe('#getResourceDetailData', () => {
        describe('request', () => {
            it(`... should perform an HTTP GET request to the Knora API (via ApiService)`, async(() => {
                const expectedResourceId = '11398';
                const expectedUrl = apiUrl + expectedResourcesRoute + expectedResourceId + expectedResourceSuffix;

                // call service function
                dataApiService.getResourceDetailData(expectedResourceId).subscribe();

                // expect one request to url with given settings
                httpTestingController.expectOne((req: HttpRequest<any>) => {
                    expect(req.params).toBeDefined();
                    expect(req.params.keys().length).toBe(0, 'should be 0');

                    return req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl;
                }, `GET to ${expectedUrl}`);
            }));

            it(`... should call getApiResponse (via ApiService) with resource id`, async(() => {
                const expectedResourceId = '11398';
                const expectedQueryPath = expectedResourcesRoute + expectedResourceId + expectedResourceSuffix;
                const expectedQueryHttpParams = new HttpParams();

                getApiResponseSpy.and.returnValue(observableOf(expectedResourceFullResponseJson));

                dataApiService
                    .getResourceDetailData(expectedResourceId)
                    .subscribe((response: ResourceFullResponseJson) => {
                        expectSpyCall(getApiResponseSpy, 1, [
                            ResourceFullResponseJson,
                            expectedQueryPath,
                            expectedQueryHttpParams
                        ]);
                    });
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it(`... should return an Observable<ResourceFullResponseJson>`, async(() => {
                    const expectedResourceId = '11398';

                    getApiResponseSpy.and.returnValue(observableOf(expectedResourceFullResponseJson));

                    dataApiService
                        .getResourceDetailData(expectedResourceId)
                        .subscribe((response: ResourceFullResponseJson) => {
                            expect(response).toEqual(expectedResourceFullResponseJson);
                        });
                }));
            });

            describe('fail', () => {
                it(`... should return an Observable<ApiServiceError>`, async(() => {
                    const expectedResourceId = undefined;
                    const expectedQueryPath = expectedResourcesRoute + expectedResourceId + expectedResourceSuffix;
                    const expectedQueryHttpParams = new HttpParams();

                    const expectedErrorMsg = 'failed HTTP response with 401 error';

                    const expectedApiServiceError = new ApiServiceError();
                    expectedApiServiceError.status = 401;
                    expectedApiServiceError.url = expectedResourcesRoute + expectedResourceId + expectedResourceSuffix;

                    getApiResponseSpy.and.returnValue(observableThrowError(expectedApiServiceError));

                    dataApiService.getResourceDetailData(expectedResourceId).subscribe(
                        result => fail(expectedErrorMsg),
                        (error: ApiServiceError) => {
                            expectSpyCall(getApiResponseSpy, 1, [
                                ResourceFullResponseJson,
                                expectedQueryPath,
                                expectedQueryHttpParams
                            ]);
                            expect(error).toEqual(expectedApiServiceError);
                        }
                    );
                }));
            });
        });
    });
});
