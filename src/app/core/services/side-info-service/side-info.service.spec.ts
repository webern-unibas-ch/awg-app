import { TestBed, inject } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { SideInfoService } from './side-info.service';

describe('SideInfoService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SideInfoService]
        });
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', inject([SideInfoService], (service: SideInfoService) => {
        expect(service).toBeTruthy();
    }));
});
