import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from './loading.service';

describe('LoadingInterceptor (DONE)', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let loadingService: LoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                LoadingService,
                provideHttpClient(withInterceptors([loadingInterceptor])),
                provideHttpClientTesting(),
            ],
        });

        // Inject services
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        loadingService = TestBed.inject(LoadingService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests
        httpTestingController.verify();
    });

    it('... should test if interceptor function is created', () => {
        expect(loadingInterceptor).toBeTruthy();
    });

    describe('httpTestingController', () => {
        it('... should issue a mocked http get request', () => {
            const testData: Record<string, unknown> = { name: 'TestData' };

            httpClient.get<Record<string, unknown>>('/foo/bar').subscribe({
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
        const expectedUrl = '/api/test-data';

        it('... should set loading status to true when a request is made', () => {
            expectToBe(loadingService.isLoading(), false);

            httpClient.get(expectedUrl).subscribe();

            expectToBe(loadingService.isLoading(), true);

            const req = httpTestingController.expectOne(expectedUrl);
            req.flush({});
        });

        it('... should set loading status to false when the request completes successfully', () => {
            httpClient.get(expectedUrl).subscribe();

            expectToBe(loadingService.isLoading(), true);

            const req = httpTestingController.expectOne(expectedUrl);
            req.flush({ data: 'success' });

            expectToBe(loadingService.isLoading(), false);
        });

        it('... should set loading status to false when the request fails with an error', () => {
            httpClient.get(expectedUrl).subscribe({
                error: () => {
                    // Intentionally left empty to catch the error case
                },
            });

            expectToBe(loadingService.isLoading(), true);

            const req = httpTestingController.expectOne(expectedUrl);
            req.flush('Error occurred', { status: 500, statusText: 'Server Error' });

            expectToBe(loadingService.isLoading(), false);
        });

        it('... should maintain loading status true if at least one request is still pending', () => {
            httpClient.get('/api/first').subscribe();
            httpClient.get('/api/second').subscribe();

            expectToBe(loadingService.isLoading(), true);

            const req1 = httpTestingController.expectOne('/api/first');
            req1.flush({});

            expectToBe(loadingService.isLoading(), true);

            const req2 = httpTestingController.expectOne('/api/second');
            req2.flush({});

            expectToBe(loadingService.isLoading(), false);
        });
    });
});
