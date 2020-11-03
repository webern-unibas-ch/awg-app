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

import { AppConfig } from '@awg-app/app.config';
import { HttpCacheService } from '@awg-views/data-view/services';

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

    let mockCache: {
        put: (req: HttpRequest<any>, resp: HttpResponse<any>) => void;
        get: (req: HttpRequest<any>) => HttpResponse<any> | null;
        clear: () => void;
    };
    let mockConsole: { log: (message: string) => void; get: (index: number) => string; clear: () => void };

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

        // inject services and http client handler
        httpCacheService = TestBed.inject(HttpCacheService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        // uses helper function to get interceptor instance
        cachingInterceptor = getInterceptorInstance<CachingInterceptor>(
            TestBed.inject(HTTP_INTERCEPTORS),
            CachingInterceptor
        );

        // mock cache (to catch cached responses)
        let cachedResponses = new Map<string, HttpResponse<any>>();
        mockCache = {
            put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
                cachedResponses[req.urlWithParams] = resp.clone();
            },
            get(req: HttpRequest<any>): HttpResponse<any> {
                return cachedResponses ? cachedResponses[req.urlWithParams] : null;
            },
            clear: () => {
                cachedResponses = new Map<string, HttpResponse<any>>();
            }
        };

        // mock Console (to catch console output)
        let consoleArray = [];
        mockConsole = {
            log: (message: string) => {
                consoleArray.push(message);
            },
            get: (index: number): string => {
                return consoleArray[index];
            },

            clear: () => {
                consoleArray = [];
            }
        };

        // spies on service functions
        interceptSpy = spyOn(cachingInterceptor, 'intercept').and.callThrough();
        cacheGetSpy = spyOn(httpCacheService, 'get').and.callFake(mockCache.get);
        cachePutSpy = spyOn(httpCacheService, 'put').and.callFake(mockCache.put);
        consoleSpy = spyOn(console, 'log').and.callFake(mockConsole.log);
    });

    afterEach(() => {
        // after every test, assert that there are no more pending requests
        httpTestingController.verify();

        // clear mock stores after each test
        mockCache.clear();
        mockConsole.clear();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it(`... should test if interceptor instance is created`, () => {
        expect(cachingInterceptor).toBeTruthy();
    });

    describe('httpTestingController', () => {
        it(
            `... should issue a mocked http get request`,
            waitForAsync(() => {
                const testData: Data = { name: 'TestData' };

                httpClient.get<Data>('/foo/bar').subscribe(data => {
                    expect(data).toEqual(testData);
                });

                // match the request url
                const call = httpTestingController.expectOne({
                    url: '/foo/bar'
                });

                // check for GET request
                expect(call.request.method).toBe('GET');

                // respond with mocked data
                call.flush(testData);
            })
        );
    });

    describe('mock test objects (self-test)', () => {
        // prepare HTTP call
        const expectedUrl = '/foo/bar';
        const testData: Data = { name: 'TestData' };
        const expectedRequest = new HttpRequest('GET', expectedUrl);
        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: testData });

        it(
            '... should use mock cache',
            waitForAsync(() => {
                // create cached response via cache service
                httpCacheService.put(expectedRequest, expectedResponse);

                // expect cache.put to be called
                expectSpyCall(cachePutSpy, 1, 0);

                // mock cache has created response
                expect(mockCache.get(expectedRequest)).toEqual(expectedResponse, `should equal ${expectedResponse}`);
                // spied service call returns created response
                expect(httpCacheService.get(expectedRequest)).toEqual(
                    expectedResponse,
                    `should equal ${expectedResponse}`
                );
                // real service does not have created response
                expect((httpCacheService as any).cachedResponses[expectedRequest.urlWithParams]).toBeUndefined(
                    `should be undefined`
                );
            })
        );

        it(
            '... should clear mock cache after each run',
            waitForAsync(() => {
                expect(mockCache.get(expectedRequest)).toBeUndefined(`should be undefined`);
                expect(httpCacheService.get(expectedRequest)).toBeUndefined(`should be undefined`);
            })
        );

        it('... should use mock console', () => {
            console.log('Test');

            expect(mockConsole.get(0)).toBe('Test');
        });

        it('... should clear mock console after each run', () => {
            expect(mockConsole.get(0)).toBeUndefined(`should be undefined`);
        });
    });

    describe('cachingInterceptor', () => {
        // prepare HTTP call
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
            `... should intercept HTTP requests`,
            waitForAsync(() => {
                // subscribe to GET Http Request
                httpClient.get<Data>(expectedUrl).subscribe(data => {
                    expect(data).toEqual(testData);
                });

                // expect an HTTP request
                call = httpTestingController.expectOne({
                    url: expectedUrl
                });

                expectSpyCall(interceptSpy, 1, call.request);
            })
        );

        describe(`no GET request`, () => {
            it(
                `... should do nothing if POST request`,
                waitForAsync(() => {
                    // subscribe to PUT Http Request
                    httpClient.post<Data>(expectedUrl, testData).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // expect an HTTP request
                    call = httpTestingController.expectOne(expectedUrl);
                    expect(call.request.method).toEqual('POST', 'should be POST');
                    expect(call.request.url).toEqual(expectedUrl, `should be ${expectedUrl}`);

                    // expect request to return the expected response after POST
                    call.event(expectedResponse);

                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 0, call.request);
                    expectSpyCall(cachePutSpy, 0, call.request);
                })
            );

            it(
                `... should do nothing if PUT request`,
                waitForAsync(() => {
                    // subscribe to PUT Http Request
                    httpClient.put<Data>(expectedUrl, testData).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // expect an HTTP request
                    call = httpTestingController.expectOne(expectedUrl);
                    expect(call.request.method).toEqual('PUT', 'should be PUT');
                    expect(call.request.url).toEqual(expectedUrl, `should be ${expectedUrl}`);

                    // expect request to return the expected response after PUT
                    call.event(expectedResponse);

                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 0, call.request);
                    expectSpyCall(cachePutSpy, 0, call.request);
                })
            );
        });

        describe(`GET request`, () => {
            it(
                `... should check for existing requests in cache via httpCacheService`,
                waitForAsync(() => {
                    const expectedRequest = new HttpRequest('GET', expectedUrl);

                    // mock cache is empty
                    expect(mockCache.get(expectedRequest)).toBeUndefined(`should be undefined`);

                    // subscribe to GET Http Request
                    const sub = httpClient.get<Data>(expectedUrl).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // expect an HTTP request
                    call = httpTestingController.expectOne({
                        url: expectedUrl
                    });

                    // resolve request
                    call.event(expectedResponse);

                    // make sure real request and expectedRequest are identical
                    expect(call.request).toEqual(expectedRequest);

                    // expect spy calls
                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 1, call.request);
                    expectSpyCall(cachePutSpy, 1, call.request);

                    // mock cache has created response
                    expect(mockCache.get(expectedRequest)).toEqual(
                        expectedResponse,
                        `should equal ${expectedResponse}`
                    );

                    // unsubscribe from first request
                    sub.unsubscribe();

                    // ----------------------
                    // subscribe to new GET Http Request
                    httpClient.get<Data>(expectedUrl).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // expect not an HTTP request, since response is delivered from cache
                    httpTestingController.expectNone({
                        url: expectedUrl
                    });

                    // expect spy calls
                    expectSpyCall(interceptSpy, 2, call.request);
                    // should get cache
                    expectSpyCall(cacheGetSpy, 2, call.request);
                    // should not have put response to cache again (still 1)
                    expectSpyCall(cachePutSpy, 1, call.request);

                    // mock cache still has response
                    expect(mockCache.get(expectedRequest)).toEqual(
                        expectedResponse,
                        `should equal ${expectedResponse}`
                    );
                })
            );

            it(
                `... should put new requests to cache via httpCacheService`,
                waitForAsync(() => {
                    const expectedRequest = new HttpRequest('GET', expectedUrl);

                    // return no cached response from cache
                    expect(mockCache.get(expectedRequest)).toBeUndefined('should be undefined');

                    // subscribe to GET Http Request
                    httpClient.get<Data>(expectedUrl).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // expect an HTTP request
                    call = httpTestingController.expectOne({
                        url: expectedUrl
                    });

                    // resolve request
                    call.flush(testData);

                    // expect spy calls
                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 1, call.request);
                    expectSpyCall(cachePutSpy, 1, call.request);

                    // expect new cached response
                    expect(call.request).toEqual(expectedRequest);
                    expect(httpCacheService.get(expectedRequest)).toBeDefined('should be defined');
                    expect(httpCacheService.get(expectedRequest)).toEqual(
                        expectedResponse,
                        `should equal ${expectedResponse}`
                    );
                })
            );

            it(
                `... should throw an error if request fails and log to console`,
                waitForAsync(() => {
                    // spy on HTTP handler to handle another response
                    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
                    const expectedError = new HttpErrorResponse({
                        status: 401,
                        statusText: 'error',
                        url: expectedUrl
                    });
                    httpHandlerSpy.handle.and.returnValue(observableThrowError(expectedError));

                    // set log message and spy on console
                    const expectedLogMessage = 'CachingInterceptor: Processing http error';

                    expectSpyCall(consoleSpy, 0);
                    expect(mockConsole.get(0)).toBeUndefined(`should be undefined`);

                    // subscribe to GET Http Request
                    httpClient.get<Data>(expectedUrl).subscribe(data => {
                        expect(data).toEqual(testData);
                    });

                    // expect an HTTP request
                    call = httpTestingController.expectOne({
                        url: expectedUrl
                    });

                    // expectg spy calls
                    expectSpyCall(interceptSpy, 1, call.request);
                    expectSpyCall(cacheGetSpy, 1, call.request);

                    // add another request to the stack
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
        });
    });
});
