import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
    let loadingService: LoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoadingService]
        });
        // inject service
        loadingService = TestBed.inject(LoadingService);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should be created', () => {
        expect(loadingService).toBeTruthy();
    });

    describe('#getLoadingStatus', () => {
        it(`... should return default false value`, done => {
            loadingService.getLoadingStatus().subscribe((isLoading: boolean) => {
                expect(isLoading).toBeFalse();
                done();
            });
        });

        it(`... should return updated value`, done => {
            // init status
            let loading = false;

            loadingService.getLoadingStatus().subscribe((isLoading: boolean) => {
                expect(isLoading).toBe(loading);
                done();
            });

            // update status
            loading = true;
            loadingService.updateLoadingStatus(loading);
        });
    });
    describe('#updateLoadingStatus', () => {
        it(`... should emit loading status to isLoadingSubject`, done => {
            // init status
            let loading = false;

            loadingService.getLoadingStatus().subscribe((isLoading: boolean) => {
                expect(isLoading).toBe(loading);
                done();
            });
            // update status
            loading = true;
            loadingService.updateLoadingStatus(loading);
        });
    });
});
