import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { AppConfig } from '@awg-app/app.config';

import { HttpCacheService } from './http-cache.service';

describe('HttpCacheService (DONE)', () => {
    let httpCacheService: HttpCacheService;

    // Prepare HTTP call
    const apiUrl = AppConfig.API_ENDPOINT;
    const searchRoute = 'search/';
    const expectedUrl = apiUrl + searchRoute + 'Test';
    const testData = { name: 'TestData' };

    const expectedRequest = new HttpRequest('GET', expectedUrl);
    const expectedResponse = new HttpResponse({
        headers: new HttpHeaders(),
        status: 200,
        statusText: 'OK',
        url: expectedUrl,
        body: testData,
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HttpCacheService],
        });

        // Inject services and http client handler
        httpCacheService = TestBed.inject(HttpCacheService);
    });

    it('should be created', () => {
        expect(httpCacheService).toBeTruthy();
    });

    it('should have empty _cachedResponses before any call is made', () => {
        expect((httpCacheService as any)._cachedResponses).toBeTruthy();
        expect((httpCacheService as any)._cachedResponses.size)
            .withContext('should be 0')
            .toBe(0);
    });

    describe('#put', () => {
        it('... should add an HTTP request to cache', () => {
            httpCacheService.put(expectedRequest, expectedResponse);

            const expectedCachedResponse = (httpCacheService as any)._cachedResponses.get(
                expectedRequest.urlWithParams
            );

            expect(expectedCachedResponse).toBeTruthy();
            expect(expectedCachedResponse).withContext(`should be ${expectedResponse}`).toEqual(expectedResponse);
        });
    });

    describe('#get', () => {
        it('... should return null if an HTTP request is not available from cache', () => {
            const expectedCachedResponse = (httpCacheService as any)._cachedResponses.get(
                expectedRequest.urlWithParams
            );
            expect(expectedCachedResponse).toBeUndefined();

            const expectedGetCache = httpCacheService.get(expectedRequest);
            expect(expectedGetCache).toBeNull();
        });

        it('... should return an HTTP response from cache if available', () => {
            httpCacheService.put(expectedRequest, expectedResponse);

            const expectedCachedResponse = (httpCacheService as any)._cachedResponses.get(
                expectedRequest.urlWithParams
            );
            expect(expectedCachedResponse).toBeTruthy();
            expect(expectedCachedResponse).withContext(`should be ${expectedResponse}`).toEqual(expectedResponse);

            const expectedGetCache = httpCacheService.get(expectedRequest);
            expect(expectedGetCache).toBeTruthy();
            expect(expectedGetCache).withContext(`should equal ${expectedResponse}`).toEqual(expectedResponse);
        });
    });
});
