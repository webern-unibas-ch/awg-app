import { inject, TestBed } from '@angular/core/testing';

import { FolioService } from './folio.service';

describe('FolioService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [FolioService],
        });
    });

    it('... should create', inject([FolioService], (service: FolioService) => {
        expect(service).toBeTruthy();
    }));
});
