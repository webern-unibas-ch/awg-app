import { TestBed, inject } from '@angular/core/testing';

import { CachingInterceptor } from './caching.interceptor';

describe('CachingInterceptorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CachingInterceptor]
        });
    });

    it('should be created', inject([CachingInterceptor], (service: CachingInterceptor) => {
        expect(service).toBeTruthy();
    }));
});
