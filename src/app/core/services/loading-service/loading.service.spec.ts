import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { LoadingService } from './loading.service';

describe('LoadingService (DONE)', () => {
    let loadingService: LoadingService;

    let loadingStatus: boolean;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoadingService]
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

    it('should have isLoadingSubject', () => {
        expect((loadingService as any).isLoadingSubject).toBeTruthy();
    });

    it('should have isLoadingStream$', () => {
        expect((loadingService as any).isLoadingStream$).toBeTruthy();
    });

    describe('#getLoadingStatus', () => {
        it('... should return default false value', done => {
            loadingService.getLoadingStatus().subscribe((isLoading: boolean) => {
                expect(isLoading).toBeFalse();
                done();
            });
        });

        it('... should return updated value', done => {
            loadingService.getLoadingStatus().subscribe((isLoading: boolean) => {
                expect(isLoading).toBe(loadingStatus, `should be ${loadingStatus}`);
                done();
            });

            // Update status
            loadingStatus = true;
            loadingService.updateLoadingStatus(loadingStatus);
        });
    });

    describe('#updateLoadingStatus', () => {
        it('... should emit updated loading status', done => {
            loadingService.getLoadingStatus().subscribe((isLoading: boolean) => {
                expect(isLoading).toBe(loadingStatus, `should be ${loadingStatus}`);
                done();
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
