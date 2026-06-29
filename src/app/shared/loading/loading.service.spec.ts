import { HttpRequest } from '@angular/common/http';
import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from '@testing/expect-helper';

import { LoadingService } from './loading.service';

describe('LoadingService (DONE)', () => {
    let loadingService: LoadingService;

    // Helper function to create a mock HttpRequest
    function createMockRequest(url: string): HttpRequest<unknown> {
        return new HttpRequest('GET', url);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoadingService],
        });
        // Inject service
        loadingService = TestBed.inject(LoadingService);
    });

    it('... should create', () => {
        expect(loadingService).toBeTruthy();
    });

    it('... should have `_pendingRequests` signal', () => {
        expect((loadingService as any)._pendingRequests).toBeDefined();
        expectToBe(isSignal((loadingService as any)._pendingRequests), true);
    });

    describe('#isLoading()', () => {
        it('... should have a computed signal `isLoading()`', () => {
            expect(loadingService.isLoading).toBeDefined();
            expectToBe(isSignal(loadingService.isLoading), true);
        });

        it('... should return default false value (no requests registered)', () => {
            expectToEqual((loadingService as any)._pendingRequests(), []);
            expectToBe(loadingService.isLoading(), false);
        });

        it('... should return true value after registering a request', () => {
            const req = createMockRequest('/api/test');

            loadingService.registerRequest(req);

            expectToBe(loadingService.isLoading(), true);
        });

        it('... should return false value after deregistering the last request', () => {
            const req = createMockRequest('/api/test');

            loadingService.registerRequest(req);
            loadingService.deregisterRequest(req);
            expectToBe(loadingService.isLoading(), false);
        });
    });

    describe('#registerRequest()', () => {
        it('... should have a method `registerRequest`', () => {
            expect(loadingService.registerRequest).toBeDefined();
        });

        it('... should update loading status to true when a request is registered', () => {
            const req = createMockRequest('/api/test');

            loadingService.registerRequest(req);

            expectToEqual((loadingService as any)._pendingRequests(), [req]);
            expectToBe(loadingService.isLoading(), true);
        });

        it('... should update loading status based on exact requests (in-place tracking)', () => {
            const req1 = createMockRequest('/api/1');
            const req2 = createMockRequest('/api/2');

            loadingService.registerRequest(req1);

            expectToEqual((loadingService as any)._pendingRequests(), [req1]);
            expectToBe(loadingService.isLoading(), true);

            loadingService.registerRequest(req2);

            expectToEqual((loadingService as any)._pendingRequests(), [req1, req2]);
            expectToBe(loadingService.isLoading(), true);

            loadingService.deregisterRequest(req1);

            expectToEqual((loadingService as any)._pendingRequests(), [req2]);
            expectToBe(loadingService.isLoading(), true);

            loadingService.deregisterRequest(req2);

            expectToEqual((loadingService as any)._pendingRequests(), []);
            expectToBe(loadingService.isLoading(), false);
        });
    });

    describe('#deregisterRequest()', () => {
        it('... should have a method `deregisterRequest`', () => {
            expect(loadingService.deregisterRequest).toBeDefined();
        });

        it('... should update loading status to false when a request is deregistered', () => {
            const req = createMockRequest('/api/test');

            loadingService.registerRequest(req);
            expectToEqual((loadingService as any)._pendingRequests(), [req]);
            expectToBe(loadingService.isLoading(), true);

            loadingService.deregisterRequest(req);
            expectToEqual((loadingService as any)._pendingRequests(), []);
        });

        it('... should only update loading status to false when all requests are deregistered', () => {
            const req1 = createMockRequest('/api/1');
            const req2 = createMockRequest('/api/2');

            loadingService.registerRequest(req1);
            loadingService.registerRequest(req2);

            expectToEqual((loadingService as any)._pendingRequests(), [req1, req2]);
            expectToBe(loadingService.isLoading(), true);

            loadingService.deregisterRequest(req1);

            expectToEqual((loadingService as any)._pendingRequests(), [req2]);
            expectToBe(loadingService.isLoading(), true);

            loadingService.deregisterRequest(req2);

            expectToEqual((loadingService as any)._pendingRequests(), []);
            expectToBe(loadingService.isLoading(), false);
        });

        it('... should do nothing if trying to deregister a non-existent request', () => {
            const req1 = createMockRequest('/api/1');
            const fakeReq = createMockRequest('/api/fake');

            loadingService.registerRequest(req1);

            expectToEqual((loadingService as any)._pendingRequests(), [req1]);
            expectToBe(loadingService.isLoading(), true);

            loadingService.deregisterRequest(fakeReq);

            expectToEqual((loadingService as any)._pendingRequests(), [req1]);
            expectToBe(loadingService.isLoading(), true);
        });
    });
});
