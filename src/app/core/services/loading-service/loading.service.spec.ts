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
            let loadingStatus = false;

            loadingService.getLoadingStatus().subscribe((isLoading: boolean) => {
                expect(isLoading).toBe(loadingStatus, `should be ${loadingStatus}`);
                done();
            });

            // update status
            loadingStatus = true;
            loadingService.updateLoadingStatus(loadingStatus);
        });
    });
    describe('#updateLoadingStatus', () => {
        it(`... should emit updated loading status`, done => {
            // init status
            let loadingStatus = false;

            loadingService.getLoadingStatus().subscribe((isLoading: boolean) => {
                expect(isLoading).toBe(loadingStatus, `should be ${loadingStatus}`);
                done();
            });

            // update status
            loadingStatus = true;
            loadingService.updateLoadingStatus(loadingStatus);

            // update status
            loadingStatus = false;
            loadingService.updateLoadingStatus(loadingStatus);
        });
    });
});
