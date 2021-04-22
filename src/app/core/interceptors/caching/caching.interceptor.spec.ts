import { TestBed, waitForAsync } from '@angular/core/testing';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Data } from '@angular/router';

import { throwError as observableThrowError } from 'rxjs/internal/observable/throwError';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';
import { getInterceptorInstance } from '@testing/interceptor-helper';
import { mockCache, mockConsole } from '@testing/mock-helper';

import { AppConfig } from '@awg-app/app.config';
import { HttpCacheService } from '@awg-core/services';

import { CachingInterceptor } from './caching.interceptor';

describe('CachingInterceptor (DONE)', () => {
    let cachingInterceptor: HttpInterceptor;
    let httpCacheService: HttpCacheService;

    let interceptSpy: Spy;
    let cacheGetSpy: Spy;
    let cachePutSpy: Spy;
    let consoleSpy: Spy;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const apiUrl = AppConfig.API_ENDPOINT;
    const searchRoute = 'search/';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                HttpCacheService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: CachingInterceptor,
                    multi: true
                }
            ]
        });

        // Inject services and http client handler
        httpCacheService = TestBed.inject(HttpCacheService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        // Uses helper function to get interceptor instance
        cachingInterceptor = getInterceptorInstance<CachingInterceptor>(
            TestBed.inject(HTTP_INTERCEPTORS),
            CachingInterceptor
        );

        // Spies on service functions
        interceptSpy = spyOn(cachingInterceptor, 'intercept').and.callThrough();
        cacheGetSpy = spyOn(httpCacheService, 'get').and.callFake(mockCache.get);
        cachePutSpy = spyOn(httpCacheService, 'put').and.callFake(mockCache.put);
        consoleSpy = spyOn(console, 'error').and.callFake(mockConsole.log);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests
        httpTestingController.verify();

        // Clear mock stores after each test
        (httpCacheService as any).cachedResponses = new Map<string, HttpResponse<any>>();
        mockCache.clear();
        mockConsole.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should test if interceptor instance is created', () => {
        expect(cachingInterceptor).toBeTruthy();
    });

    describe('httpTestingController', () => {
        it(
            '... should issue a mocked http get request',
            waitForAsync(() => {
                const testData: Data = { name: 'TestData' };

                httpClient.get<Data>('/foo/bar').subscribe(data => {
                    expect(data).toEqual(testData);
                });

                // Match the request url
                const call = httpTestingController.expectOne({
                    url: '/foo/bar'
                });

                // Check for GET request
                expect(call.request.method).toBe('GET');

                // Respond with mocked data
                call.flush(testData);
            })
        );
    });

    describe('mock test objects (self-test)', () => {
        // Prepare HTTP call
        const expectedUrl = '/foo/bar';
        const testData: Data = { name: 'TestData' };
        const expectedRequest = new HttpRequest('GET', expectedUrl);
        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: testData });

        it(
            '... should use mock cache',
            waitForAsync(() => {
                // Create cached response via cache service
                httpCacheService.put(expectedRequest, expectedResponse);

                // Expect cache.put to be called
                expectSpyCall(cachePutSpy, 1, 0);

                // Mock cache has created response
                expect(mockCache.get(expectedRequest)).toEqual(expectedResponse, `should equal ${expectedResponse}`);
                // Spied service call returns created response
                expect(httpCacheService.get(expectedRequest)).toEqual(
                    expectedResponse,
                    `should equal ${expectedResponse}`
                );
                // Real service does not have created response
                expect((httpCacheService as any).cachedResponses.has(expectedRequest.urlWithParams)).toBeFalse();
            })
        );

        it(
            '... should clear mock cache after each run',
            waitForAsync(() => {
                expect(mockCache.get(expectedRequest)).toBeNull('should be null');
                expect(httpCacheService.get(expectedRequest)).toBeNull('should be null');
            })
        );

        it('... should use mock console', () => {
            console.error('Test');

            expect(mockConsole.get(0)).toBe('Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined('should be undefined');
        });
    });

    describe('cachingInterceptor', () => {
        // Prepare HTTP call
        const expectedUrl = apiUrl + searchRoute + 'Test';
        const testData: Data = { name: 'TestData' };
        const expectedResponse = new HttpResponse({
            headers: new HttpHeaders(),
            status: 200,
            statusText: 'OK',
            url: expectedUrl,
            body: testData
        });
        let call: TestRequest;

        it(
            '... should intercept HTTP requests',
            waitForAsync(() => {
                // Subscribe to GET Http Request
                httpClient.get<Data>(expectedUrl).subscribe(data => {
                    expect(data).toEqual(testData);
                });

                // Expect an HTTP request
                call = httpTestingController.expectOne({
                    url: expectedUrl
                });

                expectSpyCall(interceptSpy, 1, call.request);
            })
        );

        describe('no GET request', () => {
            it(
                '... should do nothing if POST request',
                waitForAsync(() => {
                    // Subscribe to PUT Http Request
                    httpClient.post<Data>(expectedUrl, testData).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // Expect an HTTP request
                    call = httpTestingController.expectOne(expectedUrl);
                    expect(call.request.method).toEqual('POST', 'should be POST');
                    expect(call.request.url).toEqual(expectedUrl, `should be ${expectedUrl}`);

                    // Expect request to return the expected response after POST
                    call.event(expectedResponse);

                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 0, call.request);
                    expectSpyCall(cachePutSpy, 0, call.request);
                })
            );

            it(
                '... should do nothing if PUT request',
                waitForAsync(() => {
                    // Subscribe to PUT Http Request
                    httpClient.put<Data>(expectedUrl, testData).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // Expect an HTTP request
                    call = httpTestingController.expectOne(expectedUrl);
                    expect(call.request.method).toEqual('PUT', 'should be PUT');
                    expect(call.request.url).toEqual(expectedUrl, `should be ${expectedUrl}`);

                    // Expect request to return the expected response after PUT
                    call.event(expectedResponse);

                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 0, call.request);
                    expectSpyCall(cachePutSpy, 0, call.request);
                })
            );
        });

        describe('GET request', () => {
            it(
                '... should check for existing requests in cache via httpCacheService',
                waitForAsync(() => {
                    const expectedRequest = new HttpRequest('GET', expectedUrl);

                    // Mock cache is empty
                    expect(mockCache.get(expectedRequest)).toBeNull('should be null');

                    // Subscribe to GET Http Request
                    const sub = httpClient.get<Data>(expectedUrl).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // Expect an HTTP request
                    call = httpTestingController.expectOne({
                        url: expectedUrl
                    });

                    // Resolve request
                    call.event(expectedResponse);

                    // Make sure real request and expectedRequest are identical
                    expect(call.request).toEqual(expectedRequest);

                    // Expect spy calls
                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 1, call.request);
                    expectSpyCall(cachePutSpy, 1, call.request);

                    // Mock cache has created response
                    expect(mockCache.get(expectedRequest)).toEqual(
                        expectedResponse,
                        `should equal ${expectedResponse}`
                    );

                    // Unsubscribe from first request
                    sub.unsubscribe();

                    // ----------------------
                    // Subscribe to new GET Http Request
                    httpClient.get<Data>(expectedUrl).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // Expect not an HTTP request, since response is delivered from cache
                    httpTestingController.expectNone({
                        url: expectedUrl
                    });

                    // Expect spy calls
                    expectSpyCall(interceptSpy, 2, call.request);
                    // Should get cache
                    expectSpyCall(cacheGetSpy, 2, call.request);
                    // Should not have put response to cache again (still 1)
                    expectSpyCall(cachePutSpy, 1, call.request);

                    // Mock cache still has response
                    expect(mockCache.get(expectedRequest)).toEqual(
                        expectedResponse,
                        `should equal ${expectedResponse}`
                    );
                })
            );

            it(
                '... should put new requests to cache via httpCacheService',
                waitForAsync(() => {
                    const expectedRequest = new HttpRequest('GET', expectedUrl);

                    // No cached response in cache
                    expect(mockCache.get(expectedRequest)).toBeNull('should be null');

                    // Subscribe to GET Http Request
                    httpClient.get<Data>(expectedUrl).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // Expect an HTTP request
                    call = httpTestingController.expectOne({
                        url: expectedUrl
                    });

                    // Resolve request
                    call.flush(testData);

                    // Expect spy calls
                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 1, call.request);
                    expectSpyCall(cachePutSpy, 1, call.request);

                    // Expect new cached response
                    expect(call.request).toEqual(expectedRequest);
                    expect(mockCache.get(expectedRequest)).toBeTruthy('should be truthy');
                    expect(mockCache.get(expectedRequest)).toEqual(
                        expectedResponse,
                        `should equal ${expectedResponse}`
                    );
                })
            );

            it(
                '... should throw an error and log to console if request fails with HttpErrorResponse',
                waitForAsync(() => {
                    // Spy on HTTP handler to handle another response
                    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
                    const expectedError = new HttpErrorResponse({
                        status: 401,
                        statusText: 'error',
                        url: expectedUrl
                    });
                    httpHandlerSpy.handle.and.returnValue(observableThrowError(expectedError));

                    // Set log message and spy on console
                    const expectedLogMessage = 'CachingInterceptor: Processing http error';

                    expectSpyCall(consoleSpy, 0);
                    expect(mockConsole.get(0)).toBeUndefined('should be undefined');

                    // Subscribe to GET Http Request
                    httpClient.get<Data>(expectedUrl).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // Expect an HTTP request
                    call = httpTestingController.expectOne({
                        url: expectedUrl
                    });

                    // Expecting spy calls
                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 1, call.request);

                    // Add another request to the stack
                    cachingInterceptor.intercept(call.request, httpHandlerSpy).subscribe(
                        response => fail('should have been failed'),
                        err => {
                            expect(err).toEqual(expectedError);
                        },
                        () => {
                            fail('should have been failed');
                        }
                    );

                    expectSpyCall(cachePutSpy, 0);
                    expectSpyCall(consoleSpy, 1, expectedLogMessage);
                    expect(mockConsole.get(0)).toBe(expectedLogMessage, `should be ${expectedLogMessage}`);
                })
            );

            it(
                '... should throw an error, but not log to console if request fails with another error',
                waitForAsync(() => {
                    // Spy on HTTP handler to handle another response
                    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
                    const expectedError = new Error('error');
                    httpHandlerSpy.handle.and.returnValue(observableThrowError(expectedError));

                    // Set log message and spy on console
                    const expectedLogMessage = 'CachingInterceptor: Processing http error';

                    expectSpyCall(consoleSpy, 0);
                    expect(mockConsole.get(0)).toBeUndefined('should be undefined');

                    // Subscribe to GET Http Request
                    httpClient.get<Data>(expectedUrl).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // Expect an HTTP request
                    call = httpTestingController.expectOne({
                        url: expectedUrl
                    });

                    // Expecting spy calls
                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 1, call.request);

                    // Add another request to the stack
                    cachingInterceptor.intercept(call.request, httpHandlerSpy).subscribe(
                        response => fail('should not call next'),
                        err => {
                            expect(err).toEqual(expectedError);
                        },
                        () => {
                            fail('should not complete');
                        }
                    );

                    expectSpyCall(cachePutSpy, 0);
                    expectSpyCall(consoleSpy, 0);
                    expect(mockConsole.get(0)).toBeUndefined('should be undefined');
                })
            );
        });
    });
});
