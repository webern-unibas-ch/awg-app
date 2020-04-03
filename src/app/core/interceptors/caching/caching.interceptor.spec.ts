import { TestBed, inject } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { CachingInterceptor } from './caching.interceptor';

describe('CachingInterceptor', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CachingInterceptor]
        });
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', inject([CachingInterceptor], (service: CachingInterceptor) => {
        expect(service).toBeTruthy();
    }));
});
