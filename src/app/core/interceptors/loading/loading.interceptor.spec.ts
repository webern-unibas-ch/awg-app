import { HttpClient, HttpInterceptor, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Data } from '@angular/router';

import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall } from '@testing/expect-helper';
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
            imports: [HttpClientTestingModule],
            providers: [
                LoadingService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: LoadingInterceptor,
                    multi: true,
                },
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
        updateLoadingStatusSpy = spyOn(loadingService, 'updateLoadingStatus').and.callThrough();
        interceptSpy = spyOn(loadingInterceptor, 'intercept').and.callThrough();
    });

    // After every test, assert that there are no more pending requests
    afterEach(() => {
        httpTestingController.verify();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should test if interceptor instance is created', () => {
        expect(loadingInterceptor).toBeTruthy();
    });

    describe('httpTestingController', () => {
        it('... should issue a mocked http get request', waitForAsync(() => {
            const testData: Data = { name: 'TestData' };

            httpClient.get<Data>('/foo/bar').subscribe({
                next: data => {
                    expect(data).toEqual(testData);
                },
            });

            // Match the request url
            const call = httpTestingController.expectOne({
                url: '/foo/bar',
            });

            // Check for GET request
            expect(call.request.method).toBe('GET');

            // Respond with mocked data
            call.flush(testData);
        }));
    });

    describe('loadingInterceptor', () => {
        // Prepare HTTP call
        const expectedUrl = apiUrl + searchRoute + 'Test';
        const testData: Data = { name: 'TestData' };
        let call: TestRequest;

        beforeEach(waitForAsync(() => {
            // Subscribe to GET Http Request
            httpClient.get<Data>(expectedUrl).subscribe({
                next: data => {
                    expect(data).toEqual(testData);
                },
            });
        }));

        it('... should intercept HTTP requests', waitForAsync(() => {
            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
        }));

        it('... should call loadingService to update status (true) for pending HTTP requests', waitForAsync(() => {
            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
            expectSpyCall(updateLoadingStatusSpy, 1, true);
        }));

        it('... should call loadingService to update status (false) for resolved HTTP requests', waitForAsync(() => {
            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
            expectSpyCall(updateLoadingStatusSpy, 1, true);

            // Resolve request
            call.flush(testData);

            expectSpyCall(updateLoadingStatusSpy, 2, false);
        }));

        it('... should call loadingService to update status for multiple HTTP requests and decrease pending requests', waitForAsync(() => {
            // Spy on HTTP handler to handle another response
            const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
            const expectedHttpResponse = new HttpResponse({
                status: 201,
                statusText: 'Created',
                body: 'anotherResponse',
                url: expectedUrl,
            });
            httpHandlerSpy.handle.and.returnValue(observableOf(expectedHttpResponse));

            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
            expectSpyCall(updateLoadingStatusSpy, 1, true);

            // Add another request to the stack
            loadingInterceptor.intercept(call.request, httpHandlerSpy).subscribe({
                next: response => {
                    expect(response).withContext(`should equal ${expectedHttpResponse}`).toEqual(expectedHttpResponse);
                },
                error: () => {
                    fail('error should not have been called');
                },
                complete: () => {
                    /* Intentionally left blank */
                },
            });

            expectSpyCall(interceptSpy, 2, call.request);
            // 4 times: 1 original call, 1 additional call, 2 decrease calls
            expectSpyCall(updateLoadingStatusSpy, 4, false);
        }));

        it('... should call loadingService to update status (false) for failed HTTP requests', waitForAsync(() => {
            // Spy on HTTP handler to throw a mocked error
            // Cf. https://stackoverflow.com/a/53688721
            const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
            const expectedError = { status: 401, statusText: 'error', message: 'test-error' };
            httpHandlerSpy.handle.and.returnValue(observableThrowError(() => expectedError));

            // Expect an HTTP request
            call = httpTestingController.expectOne({
                url: expectedUrl,
            });

            expectSpyCall(interceptSpy, 1, call.request);
            expectSpyCall(updateLoadingStatusSpy, 1, true);

            // Throw error via httpHandlerSpy
            loadingInterceptor.intercept(call.request, httpHandlerSpy).subscribe({
                next: () => fail('should have been failed'),
                error: err => {
                    expect(err).toEqual(expectedError);
                },
                complete: () => {
                    fail('should have been failed');
                },
            });

            expectSpyCall(interceptSpy, 2, call.request);
            // 4 times: 1 original call, 1 error call, 2 decrease calls
            expectSpyCall(updateLoadingStatusSpy, 4, false);
        }));
    });
});
