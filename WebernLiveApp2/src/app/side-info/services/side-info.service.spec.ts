import { TestBed, inject } from '@angular/core/testing';

import { SideInfoService } from './side-info.service';

describe('SideInfoService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SideInfoService]
        });
    });

    it('should be created', inject([SideInfoService], (service: SideInfoService) => {
        expect(service).toBeTruthy();
    }));
});
