import {
    HTTP_INTERCEPTORS,
    HttpClient,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpTestingController, TestRequest, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Data } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { of as observableOf, throwError as observableThrowError } from 'rxjs';

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';
import { getInterceptorInstance } from '@testing/interceptor-helper';

import { AppConfig } from '@awg-app/app.config';
import { LoadingService } from '@awg-core/services';

import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor (DONE)', () => {
    let loadingService: LoadingService;

    let loadingInterceptor: HttpInterceptor;

    let updateLoadingStatusSpy: Spy;
    let interceptSpy: Spy;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    const apiUrl = AppConfig.API_ENDPOINT;
    const searchRoute = 'search/';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                LoadingService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: LoadingInterceptor,
                    multi: true,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        // Inject services and http client handler
        loadingService = TestBed.inject(LoadingService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);

        // Uses helper function to get interceptor instance
        loadingInterceptor = getInterceptorInstance<LoadingInterceptor>(
            TestBed.inject(HTTP_INTERCEPTORS),
            LoadingInterceptor
        );

        // Spies on service functions
        updateLoadingStatusSpy = vi.spyOn(loadingService, 'updateLoadingStatus');
        interceptSpy = vi.spyOn(loadingInterceptor, 'intercept');
    });

    // After every test, assert that there are no more pending requests
    afterEach(() => {
        httpTestingController.verify();

        vi.restoreAllMocks();
    });

    it('... should test if interceptor instance is created', () => {
        expect(loadingInterceptor).toBeTruthy();
    });

    describe('httpTestingController', () => {
        it('... should issue a mocked http get request', () => {
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
        });
    });

    describe('loadingInterceptor', () => {
        // Prepare HTTP call
        const expectedUrl = apiUrl + searchRoute + 'Test';
        const testData: Data = { name: 'TestData' };
        let call: TestRequest;

        beforeEach(() => {
            // Subscribe to GET Http Request
            httpClient.get<Data>(expectedUrl).subscribe({
                next: data => {
                    expectToEqual(data, testData);
                },
            });
        });

        it('... should intercept HTTP requests', () => {
            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
        });

        it('... should call loadingService to update status (true) for pending HTTP requests', () => {
            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
            expectSpyCall(updateLoadingStatusSpy, 1, true);
        });

        it('... should call loadingService to update status (false) for resolved HTTP requests', () => {
            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
            expectSpyCall(updateLoadingStatusSpy, 1, true);

            // Resolve request
            call.flush(testData);

            expectSpyCall(updateLoadingStatusSpy, 2, false);
        });

        it('... should call loadingService to update status for multiple HTTP requests and decrease pending requests', () => {
            // Spy on HTTP handler to handle another response
            const httpHandlerSpy = {
                handle: vi.fn().mockName('HttpHandler.handle'),
            };
            const expectedHttpResponse = new HttpResponse({
                status: 201,
                statusText: 'Created',
                body: 'anotherResponse',
                url: expectedUrl,
            });
            httpHandlerSpy.handle.mockReturnValue(observableOf(expectedHttpResponse));

            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
            expectSpyCall(updateLoadingStatusSpy, 1, true);

            // Add another request to the stack
            loadingInterceptor.intercept(call.request, httpHandlerSpy).subscribe({
                next: response => {
                    expectToEqual(response, expectedHttpResponse);
                },
                error: () => {
                    throw new Error('error should not have been called');
                },
                complete: () => {
                    /* Intentionally left blank */
                },
            });

            expectSpyCall(interceptSpy, 2, call.request);
            // 4 times: 1 original call, 1 additional call, 2 decrease calls
            expectSpyCall(updateLoadingStatusSpy, 4, false);
        });

        it('... should call loadingService to update status (false) for failed HTTP requests', () => {
            // Spy on HTTP handler to throw a mocked error
            // Cf. https://stackoverflow.com/a/53688721
            const httpHandlerSpy = {
                handle: vi.fn().mockName('HttpHandler.handle'),
            };
            const expectedError = { status: 401, statusText: 'error', message: 'test-error' };
            httpHandlerSpy.handle.mockReturnValue(observableThrowError(() => expectedError));

            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
            expectSpyCall(updateLoadingStatusSpy, 1, true);

            // Throw error via httpHandlerSpy
            loadingInterceptor.intercept(call.request, httpHandlerSpy).subscribe({
                next: () => {
                    throw new Error('should have been failed');
                },
                error: err => {
                    expectToEqual(err, expectedError);
                },
                complete: () => {
                    throw new Error('should have been failed');
                },
            });

            expectSpyCall(interceptSpy, 2, call.request);
            // 4 times: 1 original call, 1 error call, 2 decrease calls
            expectSpyCall(updateLoadingStatusSpy, 4, false);
        });
    });

    describe('#_decreaseRequest()', () => {
        it('... should have a private method `_decreaseRequest`', () => {
            expect((loadingInterceptor as any)._decreaseRequest).toBeDefined();
        });

        it('... should remove a request from pending requests if it exists', () => {
            const requestA = new HttpRequest('GET', '/a');
            const requestB = new HttpRequest('GET', '/b');

            (loadingInterceptor as any)._pendingRequests.push(requestA, requestB);

            (loadingInterceptor as any)._decreaseRequest(requestA);

            expectToBe((loadingInterceptor as any)._pendingRequests.length, 1);
            expectToEqual((loadingInterceptor as any)._pendingRequests[0], requestB);
            expectSpyCall(updateLoadingStatusSpy, 1, true);
        });

        it('... should update loading status to false if no pending requests remain', () => {
            const request = new HttpRequest('GET', '/single');

            (loadingInterceptor as any)._pendingRequests.push(request);

            (loadingInterceptor as any)._decreaseRequest(request);

            expectToBe((loadingInterceptor as any)._pendingRequests.length, 0);
            expectSpyCall(updateLoadingStatusSpy, 1, false);
        });

        it('... should keep pending requests unchanged if request is not in the pending array', () => {
            const pendingRequest = new HttpRequest('GET', '/pending');
            const otherRequest = new HttpRequest('GET', '/other');

            (loadingInterceptor as any)._pendingRequests.push(pendingRequest);

            (loadingInterceptor as any)._decreaseRequest(otherRequest);

            expectToBe((loadingInterceptor as any)._pendingRequests.length, 1);
            expectToEqual((loadingInterceptor as any)._pendingRequests[0], pendingRequest);
            expectSpyCall(updateLoadingStatusSpy, 1, true);
        });
    });
});
