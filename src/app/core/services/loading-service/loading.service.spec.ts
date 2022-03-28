import { TestBed } from '@angular/core/testing';

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

    it('should be created', () => {
        expect(loadingService).toBeTruthy();
    });

    it('should have _isLoadingSubject', () => {
        expect((loadingService as any)._isLoadingSubject).toBeTruthy();
    });

    it('should have _isLoadingStream$', () => {
        expect((loadingService as any)._isLoadingStream$).toBeTruthy();
    });

    describe('#getLoadingStatus', () => {
        it('... should return default false value', done => {
            loadingService.getLoadingStatus().subscribe({
                next: (isLoading: boolean) => {
                    expect(isLoading).toBeFalse();
                    done();
                },
            });
        });

        it('... should return updated value', done => {
            loadingService.getLoadingStatus().subscribe({
                next: (isLoading: boolean) => {
                    expect(isLoading).withContext(`should be ${loadingStatus}`).toBe(loadingStatus);
                    done();
                },
            });

            // Update status
            loadingStatus = true;
            loadingService.updateLoadingStatus(loadingStatus);
        });
    });

    describe('#updateLoadingStatus', () => {
        it('... should emit updated loading status', done => {
            loadingService.getLoadingStatus().subscribe({
                next: (isLoading: boolean) => {
                    expect(isLoading).withContext(`should be ${loadingStatus}`).toBe(loadingStatus);
                    done();
                },
            });

            // Update status
            loadingStatus = true;
            loadingService.updateLoadingStatus(loadingStatus);

            // Update status
            loadingStatus = false;
            loadingService.updateLoadingStatus(loadingStatus);
        });
    });
});
