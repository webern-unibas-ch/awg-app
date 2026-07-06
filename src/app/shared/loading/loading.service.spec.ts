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

        // Inject services
        loadingService = TestBed.inject(LoadingService);
    });

    it('... should create', () => {
        expect(loadingService).toBeTruthy();
    });

    it('... should have private signal `_pendingRequests` to hold the default value', () => {
        expectToBe(isSignal((loadingService as any)._pendingRequests), true);

        expectToEqual((loadingService as any)._pendingRequests(), []);
    });

    it('... should have computed signal `isLoading` to hold true after registering a request', () => {
        expectToBe(isSignal(loadingService.isLoading), true);

        const req = createMockRequest('/api/test');

        loadingService.registerRequest(req);

        expectToBe(loadingService.isLoading(), true);
    });

    describe('... should have computed signal `isLoading` to hold false if ...', () => {
        it('... no requests are registered', () => {
            expectToEqual((loadingService as any)._pendingRequests(), []);
            expectToBe(loadingService.isLoading(), false);
        });

        it('... after deregistering the last request', () => {
            const req = createMockRequest('/api/test');

            loadingService.registerRequest(req);
            loadingService.deregisterRequest(req);
            expectToBe(loadingService.isLoading(), false);
        });
    });

    describe('METHODS', () => {
        describe('#registerRequest()', () => {
            it('... should have a method `registerRequest`', () => {
                expect(loadingService.registerRequest).toBeDefined();
            });

            it('... should update pending requests and recompute `isLoading` to true when a request is registered', () => {
                const req = createMockRequest('/api/test');

                loadingService.registerRequest(req);

                expectToEqual((loadingService as any)._pendingRequests(), [req]);
                expectToBe(loadingService.isLoading(), true);
            });

            it('... should update pending requests and recompute `isLoading` based on exact requests (in-place tracking)', () => {
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

            it('... should update pending requests and recompute `isLoading` to false when a request is deregistered', () => {
                const req = createMockRequest('/api/test');

                loadingService.registerRequest(req);
                expectToEqual((loadingService as any)._pendingRequests(), [req]);
                expectToBe(loadingService.isLoading(), true);

                loadingService.deregisterRequest(req);
                expectToEqual((loadingService as any)._pendingRequests(), []);
            });

            it('... should only update pending requests and recompute `isLoading` to false when all requests are deregistered', () => {
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
});
