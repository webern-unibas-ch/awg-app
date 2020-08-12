import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', () => {
        const service: LoadingService = TestBed.inject(LoadingService);
        expect(service).toBeTruthy();
    });
});
