import { TestBed, inject } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoadingInterceptor]
        });
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', inject([LoadingInterceptor], (service: LoadingInterceptor) => {
        expect(service).toBeTruthy();
    }));
});
