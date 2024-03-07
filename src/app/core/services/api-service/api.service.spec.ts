/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpClient, HttpClientModule, HttpParams, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Data } from '@angular/router';

import { throwError as observableThrowError } from 'rxjs';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { AppConfig } from '@awg-app/app.config';
import { ApiServiceError } from '@awg-core/services/api-service/api-service-error.model';
import { ApiServiceResult } from '@awg-core/services/api-service/api-service-result.model';
import { UserDataJson } from '@awg-shared/api-objects';

import { ApiService } from './api.service';

// For http service testing see https://medium.com/spektrakel-blog/angular-testing-snippets-httpclient-d1dc2f035eb8

// Helper function
function expectErrorResponse(error, expectedError) {
    expectToEqual(error.status, expectedError.status);
    expectToEqual(error.statusText, expectedError.statusText);
    expectToEqual(error.url, expectedError.url);
    expectToEqual(error.errorInfo, expectedError.errorInfo);
}

function createApiServiceError(status: number, statusText: string, noErrorInfo?: boolean): ApiServiceError {
    const apiUrl = 'https://www.salsah.org/api/search/Test?searchtype=fulltext&show_nrows=10';
    const errorInfoMessage = `Http failure response for ${apiUrl}: ${status} ${statusText}`;

    const apiServiceError = new ApiServiceError();
    apiServiceError.status = status;
    apiServiceError.statusText = statusText;
    apiServiceError.url = apiUrl;
    apiServiceError.errorInfo = noErrorInfo ? '' : errorInfoMessage;

    return apiServiceError;
}

describe('ApiService', () => {
    let apiService: ApiService;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    let queryHttpParams: HttpParams;
    let expectedApiServiceError: ApiServiceError;

    let queryPath: string;
    let expectedUrl: string;
    let expectedSearchType: string;
    let expectedNRows: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule],
            providers: [ApiService],
        });
        // Inject services and http client handler
        apiService = TestBed.inject(ApiService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        // Test data
        queryPath = 'search/Test';
        expectedUrl = AppConfig.API_ENDPOINT + queryPath;
        expectedSearchType = 'fulltext';
        expectedNRows = '10';
        queryHttpParams = new HttpParams().set('searchtype', expectedSearchType).set('show_nrows', expectedNRows);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests
        httpTestingController.verify();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should inject', () => {
        expect(apiService).toBeTruthy();
    });

    describe('default values', () => {
        it('... should have serviceName', () => {
            const expectedServiceName = 'ApiService';

            expectToBe(apiService.serviceName, expectedServiceName);
        });

        it("... should have empty 'httpGetUrl'", () => {
            expect(apiService.httpGetUrl).toBeDefined();
            expect(apiService.httpGetUrl).toBeFalsy();
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
            expectToBe(call.request.method, 'GET');

            // Respond with mocked data
            call.flush(testData);
        }));
    });

    describe('#getApiResponse()', () => {
        it('... should have a method `getApiResponse`', () => {
            expect(apiService.getApiResponse).toBeDefined();
        });

        describe('request', () => {
            it('... should perform an HTTP GET request to the Knora API', waitForAsync(() => {
                // Call service function
                apiService.getApiResponse(UserDataJson, queryPath, queryHttpParams).subscribe();

                // Expect one request to url with given settings
                const call = httpTestingController.expectOne(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' && req.responseType === 'json' && req.url === expectedUrl,
                    `GET to ${expectedUrl}`
                );

                expectToBe(call.request.method, 'GET');
                expectToBe(call.request.responseType, 'json');
                expectToEqual(call.request.url, expectedUrl);
            }));

            it('... should apply an empty param object for HTTP GET if none is provided', waitForAsync(() => {
                // Call service function
                apiService.getApiResponse(UserDataJson, queryPath).subscribe();

                // Expect one request to url with given settings
                const call = httpTestingController.expectOne(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' &&
                        req.responseType === 'json' &&
                        req.url === expectedUrl &&
                        req.params.keys().length === 0,
                    `GET to ${expectedUrl} without params`
                );

                expectToBe(call.request.method, 'GET');
                expectToBe(call.request.responseType, 'json');
                expectToEqual(call.request.url, expectedUrl);
                expect(call.request.params).toBeDefined();
                expectToBe(call.request.params.keys().length, 0);
            }));

            it('... should apply provided params for HTTP GET', waitForAsync(() => {
                // Call service function
                apiService.getApiResponse(UserDataJson, queryPath, queryHttpParams).subscribe();

                // Expect one request to url with given settings
                const call = httpTestingController.expectOne(
                    (req: HttpRequest<any>) =>
                        req.method === 'GET' &&
                        req.responseType === 'json' &&
                        req.url === expectedUrl &&
                        req.params.keys().length === 2 &&
                        req.params.get('searchtype') === expectedSearchType &&
                        req.params.get('show_nrows') === expectedNRows,
                    `GET to ${expectedUrl} with 'searchtype=fulltext' and 'nrows=10'`
                );

                expectToBe(call.request.method, 'GET');
                expectToBe(call.request.responseType, 'json');
                expectToEqual(call.request.url, expectedUrl);
                expect(call.request.params).toBeDefined();
                expectToBe(call.request.params.keys().length, 2);
                expectToBe(call.request.params.get('searchtype'), expectedSearchType);
                expectToBe(call.request.params.get('show_nrows'), expectedNRows);
            }));
        });

        describe('response', () => {
            describe('success', () => {
                it("... should return 'ApiServiceResult' for 200 Ok", waitForAsync(() => {
                    const expectedApiServiceResult = new ApiServiceResult();

                    // Call service function (success)
                    apiService.getApiResponse(ApiServiceResult, queryPath, queryHttpParams).subscribe({
                        next: (res: ApiServiceResult) => {
                            expectToEqual(res.status, expectedApiServiceResult.status);
                            expectToEqual(res.statusText, expectedApiServiceResult.statusText);
                            expectToEqual(res.url, expectedApiServiceResult.url);
                            expect(res.body).toBeUndefined();
                        },
                    });

                    // Expect one request to url with given settings
                    const call = httpTestingController.expectOne(
                        (req: HttpRequest<any>) => req.method === 'GET' && req.url === expectedUrl
                    );

                    // Respond with mock data
                    call.flush(expectedApiServiceResult);
                }));

                it('... should return a converted JSON object', waitForAsync(() => {
                    const expectedJsonResponse: UserDataJson = new UserDataJson();
                    expectedJsonResponse.lang = 'en';

                    // Call service function (success)
                    apiService.getApiResponse(UserDataJson, queryPath, queryHttpParams).subscribe({
                        next: (res: UserDataJson) => {
                            expectToEqual(res, expectedJsonResponse);
                        },
                    });

                    // Expect one request to url with given settings
                    const call = httpTestingController.expectOne(
                        (req: HttpRequest<any>) => req.method === 'GET' && req.url === expectedUrl
                    );

                    // Respond with mock data
                    call.flush(expectedJsonResponse);
                }));
            });

            describe('fail', () => {
                // See http://www.syntaxsuccess.com/viewarticle/unit-testing-rxjs-retries
                it('... should throw default ApiServiceError if httpGet fails with undefined handler', waitForAsync(() => {
                    const expectedErrorMsg = 'should fail HTTP response';
                    expectedApiServiceError = new ApiServiceError();

                    // Spy on mocked http get call & throw an error
                    spyOn(httpClient, 'get').and.returnValue(observableThrowError(() => expectedApiServiceError));

                    // Call service function (fail)
                    apiService.getApiResponse(UserDataJson, queryPath).subscribe({
                        next: () => fail(expectedErrorMsg),
                        error: (err: ApiServiceError) => {
                            expectErrorResponse(err, expectedApiServiceError);
                        },
                        complete: () => fail(expectedErrorMsg),
                    });

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) => req.method === 'GET' && req.url === expectedUrl
                    );
                }));

                it('... should throw specified ApiServiceError if httpGet fails with specified handler', waitForAsync(() => {
                    const expectedErrorMsg = 'should fail HTTP response with 500 error';
                    expectedApiServiceError = createApiServiceError(500, 'Internal Server Error', true);

                    // Spy on mocked http get call & throw an error
                    spyOn(apiService, 'getApiResponse').and.returnValue(
                        observableThrowError(() => expectedApiServiceError)
                    );

                    // Call service function (fail)
                    apiService.getApiResponse(UserDataJson, queryPath).subscribe({
                        next: () => fail(expectedErrorMsg),
                        error: (err: ApiServiceError) => {
                            expect(apiService.getApiResponse).toHaveBeenCalled();
                            expectErrorResponse(err, expectedApiServiceError);
                        },
                        complete: () => fail(expectedErrorMsg),
                    });

                    // Expect no request to url with given settings
                    httpTestingController.expectNone(
                        (req: HttpRequest<any>) => req.method === 'GET' && req.url === expectedUrl
                    );
                }));

                it("... should return 'ApiServiceError' for 401 Unauthorized", waitForAsync(() => {
                    const expectedErrorMsg = 'should fail HTTP response with 401 error';
                    expectedApiServiceError = createApiServiceError(401, 'Unauthorized');

                    // Call service function (fail)
                    apiService.getApiResponse(UserDataJson, queryPath, queryHttpParams).subscribe({
                        next: () => fail(expectedErrorMsg),
                        error: (err: ApiServiceError) => {
                            expectErrorResponse(err, expectedApiServiceError);
                        },
                        complete: () => fail(expectedErrorMsg),
                    });

                    // Expect one request to url with given settings
                    const call = httpTestingController.expectOne(
                        (req: HttpRequest<any>) => req.method === 'GET' && req.url === expectedUrl
                    );

                    // Respond with mock error
                    call.flush(expectedErrorMsg, expectedApiServiceError);
                }));

                it("... should return 'ApiServiceError' for 404 Not found", waitForAsync(() => {
                    const expectedErrorMsg = 'should fail HTTP response with 404 error';
                    expectedApiServiceError = createApiServiceError(404, 'Not found');

                    // Call service function (fail)
                    apiService.getApiResponse(UserDataJson, queryPath, queryHttpParams).subscribe({
                        next: () => fail(expectedErrorMsg),
                        error: (err: ApiServiceError) => {
                            expectErrorResponse(err, expectedApiServiceError);
                        },
                        complete: () => fail(expectedErrorMsg),
                    });

                    // Expect one request to url with given settings
                    const call = httpTestingController.expectOne(
                        (req: HttpRequest<any>) => req.method === 'GET' && req.url === expectedUrl
                    );

                    // Respond with mock error
                    call.flush(expectedErrorMsg, expectedApiServiceError);
                }));
            });
        });
    });
});
