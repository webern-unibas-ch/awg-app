import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { expectToBe } from '@testing/expect-helper';

import { isSignal } from '@angular/core';
import { LoadingService } from './loading.service';

describe('LoadingService (DONE)', () => {
    let loadingService: LoadingService;

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

    it('... should have private `_isLoading` signal', () => {
        const privateIsLoading = (loadingService as any)._isLoading;

        expect(privateIsLoading).toBeTruthy();
        expectToBe(isSignal(privateIsLoading), true);
    });

    it('... should have public `isLoading` signal', () => {
        const publicIsLoading = loadingService.isLoading;

        expect(publicIsLoading).toBeTruthy();
        expectToBe(isSignal(publicIsLoading), true);
    });

    describe('#isLoading()', () => {
        it('... should have a signal `isLoading()`', () => {
            expect(loadingService.isLoading).toBeDefined();
        });

        it('... should return default false value', () => {
            expectToBe(loadingService.isLoading(), false);
        });

        it('... should return updated value', () => {
            loadingService.updateLoadingStatus(true);
            expectToBe(loadingService.isLoading(), true);

            loadingService.updateLoadingStatus(false);
            expectToBe(loadingService.isLoading(), false);
        });
    });

    describe('#updateLoadingStatus()', () => {
        it('... should have a method `updateLoadingStatus`', () => {
            expect(loadingService.updateLoadingStatus).toBeDefined();
        });

        it('... should emit updated loading status', () => {
            loadingService.updateLoadingStatus(true);
            expectToBe(loadingService.isLoading(), true);

            loadingService.updateLoadingStatus(false);
            expectToBe(loadingService.isLoading(), false);
        });
    });
});
