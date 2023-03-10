import { TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { LoadingService } from './loading.service';

describe('LoadingService (DONE)', () => {
    let loadingService: LoadingService;

    let loadingStatus: boolean;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoadingService],
        });
        // Inject service
        loadingService = TestBed.inject(LoadingService);

        // Test data (default)
        loadingStatus = false;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(loadingService).toBeTruthy();
    });

    it('... should have _isLoadingSubject', () => {
        expect((loadingService as any)._isLoadingSubject).toBeTruthy();
    });

    it('... should have _isLoadingStream$', () => {
        expect((loadingService as any)._isLoadingStream$).toBeTruthy();
    });

    describe('#getLoadingStatus()', () => {
        it('... should have a method `getLoadingStatus`', () => {
            expect(loadingService.getLoadingStatus).toBeDefined();
        });

        it('... should return default false value', waitForAsync(() => {
            loadingService.getLoadingStatus().subscribe({
                next: (isLoading: boolean) => {
                    expect(isLoading).toBeFalse();
                },
            });
        }));

        it('... should return updated value', waitForAsync(() => {
            loadingService.getLoadingStatus().subscribe({
                next: (isLoading: boolean) => {
                    expect(isLoading).withContext(`should be ${loadingStatus}`).toBe(loadingStatus);
                },
            });

            // Update status
            loadingStatus = true;
            loadingService.updateLoadingStatus(loadingStatus);
        }));
    });

    describe('#updateLoadingStatus()', () => {
        it('... should have a method `updateLoadingStatus`', () => {
            expect(loadingService.updateLoadingStatus).toBeDefined();
        });

        it('... should emit updated loading status', waitForAsync(() => {
            loadingService.getLoadingStatus().subscribe({
                next: (isLoading: boolean) => {
                    expect(isLoading).withContext(`should be ${loadingStatus}`).toBe(loadingStatus);
                },
            });

            // Update status
            loadingStatus = true;
            loadingService.updateLoadingStatus(loadingStatus);

            // Update status
            loadingStatus = false;
            loadingService.updateLoadingStatus(loadingStatus);
        }));
    });
});
