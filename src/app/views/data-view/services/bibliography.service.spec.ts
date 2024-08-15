/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient, HttpParams, HttpRequest, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Data } from '@angular/router';

import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { JsonConvert } from 'json2typescript';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { mockResourceFullResponseJson, mockSearchResponseJson } from '@testing/mock-data';

import { AppConfig } from '@awg-app/app.config';
import { ApiServiceError } from '@awg-core/services/api-service/api-service-error.model';
import { ResourceFullResponseJson, SearchResponseJson } from '@awg-shared/api-objects';

import { BibliographyService } from './bibliography.service';

describe('BibliographyService (DONE)', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let bibliographyService: BibliographyService;

    let getApiResponseSpy: Spy;

    // Json object
    let jsonConvert: JsonConvert;
    let expectedResourceFullResponseJson: ResourceFullResponseJson;
    let expectedSearchResponseJson: SearchResponseJson;

    const expectedProjectId = '6';
    const expectedResTypeId = '126'; // Test-01: 127
    const expectedBibShortTitlePropertyId = '614'; // 614 = Bibligoraphie#Kurztitel
    const expectedResourcesRoute = 'resources/';
    const expectedSearchRoute = 'search/';
    const apiUrl = AppConfig.API_ENDPOINT;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [BibliographyService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        // Inject services and http client handler
        bibliographyService = TestBed.inject(BibliographyService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        // Convert json objects
        jsonConvert = new JsonConvert();
        expectedResourceFullResponseJson = jsonConvert.deserializeObject(
            mockResourceFullResponseJson,
            ResourceFullResponseJson
        );
        expectedSearchResponseJson = jsonConvert.deserializeObject(mockSearchResponseJson, SearchResponseJson);

        // Spies on service functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        getApiResponseSpy = spyOn(bibliographyService, 'getApiResponse').and.callThrough();
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('... should create', () => {
        expect(bibliographyService).toBeTruthy();
    });

    describe('default values', () => {
        it('... should have serviceName', () => {
            const expectedServiceName = 'BibliographyService';

            expectToBe(bibliographyService.serviceName, expectedServiceName);
        });

        it('... should have projectId', () => {
            expectToBe(bibliographyService.projectId, expectedProjectId);
        });

        it('... should have resTypeId', () => {
            expectToBe(bibliographyService.resTypeId, expectedResTypeId);
        });

        it('... should have bibShortTitlePropertyId', () => {
            expectToBe(bibliographyService.bibShortTitlePropertyId, expectedBibShortTitlePropertyId);
        });

        it('... should have routes', () => {
            expectToBe(bibliographyService.resourcesRoute, expectedResourcesRoute);
            expectToBe(bibliographyService.searchRoute, expectedSearchRoute);
        });

        it("... should have empty 'httpGetUrl' (inherited from ApiService)", () => {
            expectToBe(bibliographyService.httpGetUrl, '');
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
            const call = httpTestingController.expectOne({
                url: '/foo/bar',
            });

            // Check for GET request
            expectToEqual(call.request.method, 'GET');

            // Respond with mocked data
            call.flush(testData);
        }));
    });

    describe('#getBibliographyList()', () => {
        it('... should have a method `getBibliographyList`', () => {
            expect(bibliographyService.getBibliographyList).toBeDefined();
        });

        describe('request', () => {
            it('... should perform an HTTP GET request to the Knora API (via ApiService)', waitForAsync(() => {
                const expectedUrl = apiUrl + expectedSearchRoute;

                // Call service function
                bibliographyService.getBibliographyList().subscribe();

                // Expect one request to url with given settings
                const call = httpTestingController.expectOne(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                    `GET to ${expectedUrl}`
                );

                expectToBe(call.request.method, 'GET');
                expectToBe(call.request.responseType, 'json');
                expectToBe(call.request.url, expectedUrl);
            }));

            it('... should set filter params for GET request', waitForAsync(() => {
                const expectedUrl = apiUrl + expectedSearchRoute;

                // Call service function
                bibliographyService.getBibliographyList().subscribe();

                // Expect one request to url with given settings
                const call = httpTestingController.expectOne(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                    `GET to ${expectedUrl}`
                );

                expectToBe(call.request.method, 'GET');
                expectToBe(call.request.responseType, 'json');
                expectToBe(call.request.url, expectedUrl);

                expect(call.request.params).toBeDefined();
                expectToBe(call.request.params.keys().length, 5);
                expectToBe(call.request.params.get('searchtype'), 'extended');
                expectToBe(call.request.params.get('filter_by_project'), expectedProjectId);
                expectToBe(call.request.params.get('filter_by_restype'), expectedResTypeId);
                expectToBe(call.request.params.get('property_id'), expectedBibShortTitlePropertyId);
                expectToBe(call.request.params.get('compop'), 'EXISTS');
            }));

            it('... should call getApiResponse (via ApiService) with filter params', waitForAsync(() => {
                const expectedQueryPath = expectedSearchRoute;
                const expectedQueryHttpParams = new HttpParams()
                    .set('searchtype', 'extended')
                    .set('property_id', expectedBibShortTitlePropertyId)
                    .set('compop', 'EXISTS')
                    .set('filter_by_project', expectedProjectId)
                    .set('filter_by_restype', expectedResTypeId);

                getApiResponseSpy.and.returnValue(observableOf(expectedSearchResponseJson));

                bibliographyService.getBibliographyList().subscribe({
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

        describe('response', () => {
            describe('success', () => {
                it('... should return an Observable<SearchResponseJson>', waitForAsync(() => {
                    getApiResponseSpy.and.returnValue(observableOf(expectedSearchResponseJson));

                    bibliographyService.getBibliographyList().subscribe({
                        next: (response: SearchResponseJson) => {
                            expectToEqual(response, expectedSearchResponseJson);
                        },
                    });
                }));
            });

            describe('fail', () => {
                it('... should return an Observable<ApiServiceError>', waitForAsync(() => {
                    const expectedQueryPath = expectedSearchRoute;
                    const expectedQueryHttpParams = new HttpParams()
                        .set('searchtype', 'extended')
                        .set('property_id', expectedBibShortTitlePropertyId)
                        .set('compop', 'EXISTS')
                        .set('filter_by_project', expectedProjectId)
                        .set('filter_by_restype', expectedResTypeId);

                    const expectedErrorMsg = 'failed HTTP response with 401 error';

                    const expectedApiServiceError = new ApiServiceError();
                    expectedApiServiceError.status = 401;
                    expectedApiServiceError.url = expectedQueryPath;

                    getApiResponseSpy.and.returnValue(observableThrowError(() => expectedApiServiceError));

                    bibliographyService.getBibliographyList().subscribe({
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

    describe('#getBibliographyItemDetail()', () => {
        it('... should have a method `getBibliographyItemDetail`', () => {
            expect(bibliographyService.getBibliographyItemDetail).toBeDefined();
        });

        describe('request', () => {
            it('... should perform an HTTP GET request to the Knora API (via ApiService)', waitForAsync(() => {
                const expectedResourceId = '11398';
                const expectedUrl = apiUrl + expectedResourcesRoute + expectedResourceId;

                // Call service function
                bibliographyService.getBibliographyItemDetail(expectedResourceId).subscribe();

                // Expect one request to url with given settings
                httpTestingController.expectOne((req: HttpRequest<any>) => {
                    expect(req.params).toBeDefined();
                    expectToBe(req.params.keys().length, 0);

                    return req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl;
                }, `GET to ${expectedUrl}`);
            }));

            it('... should call getApiResponse (via ApiService) with resource id', waitForAsync(() => {
                const expectedResourceId = '11398';
                const expectedQueryPath = expectedResourcesRoute + expectedResourceId;
                const expectedQueryHttpParams = new HttpParams();

                getApiResponseSpy.and.returnValue(observableOf(expectedResourceFullResponseJson));

                bibliographyService.getBibliographyItemDetail(expectedResourceId).subscribe({
                    next: (response: ResourceFullResponseJson) => {
                        expectSpyCall(getApiResponseSpy, 1, [
                            ResourceFullResponseJson,
                            expectedQueryPath,
                            expectedQueryHttpParams,
                        ]);
                    },
                });
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it('... should return an Observable<ResourceFullResponseJson>', waitForAsync(() => {
                    const expectedResourceId = '11398';

                    getApiResponseSpy.and.returnValue(observableOf(expectedResourceFullResponseJson));

                    bibliographyService.getBibliographyItemDetail(expectedResourceId).subscribe({
                        next: (response: ResourceFullResponseJson) => {
                            expectToEqual(response, expectedResourceFullResponseJson);
                        },
                    });
                }));
            });

            describe('fail', () => {
                it('... should return an Observable<ApiServiceError>', waitForAsync(() => {
                    const expectedResourceId = undefined;
                    const expectedQueryPath = expectedResourcesRoute + expectedResourceId;
                    const expectedQueryHttpParams = new HttpParams();

                    const expectedErrorMsg = 'failed HTTP response with 401 error';

                    const expectedApiServiceError = new ApiServiceError();
                    expectedApiServiceError.status = 401;
                    expectedApiServiceError.url = expectedResourcesRoute + expectedResourceId;

                    getApiResponseSpy.and.returnValue(observableThrowError(() => expectedApiServiceError));

                    bibliographyService.getBibliographyItemDetail(expectedResourceId).subscribe({
                        next: () => fail(expectedErrorMsg),
                        error: (err: ApiServiceError) => {
                            expectSpyCall(getApiResponseSpy, 1, [
                                ResourceFullResponseJson,
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
});
