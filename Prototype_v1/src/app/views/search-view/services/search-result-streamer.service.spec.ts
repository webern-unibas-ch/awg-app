import { TestBed, inject } from '@angular/core/testing';

import { SearchResultStreamerService } from './search-result-streamer.service';

describe('SearchResultStreamerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchResultStreamerService]
        });
    });

    it('should be created', inject([SearchResultStreamerService], (service: SearchResultStreamerService) => {
        expect(service).toBeTruthy();
    }));
});
