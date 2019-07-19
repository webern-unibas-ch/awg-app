import { TestBed, inject } from '@angular/core/testing';

import { LoadingInterceptor } from './loading.interceptor';

describe('LoadingInterceptor', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoadingInterceptor]
        });
    });

    it('should be created', inject([LoadingInterceptor], (service: LoadingInterceptor) => {
        expect(service).toBeTruthy();
    }));
});
