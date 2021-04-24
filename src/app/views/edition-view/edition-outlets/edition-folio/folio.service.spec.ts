import { TestBed, inject } from '@angular/core/testing';

import { FolioService } from './folio.service';

describe('FolioService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FolioService],
        });
    });

    it('should be created', inject([FolioService], (service: FolioService) => {
        expect(service).toBeTruthy();
    }));
});
