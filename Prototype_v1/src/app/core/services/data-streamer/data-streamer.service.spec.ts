import { TestBed, inject } from '@angular/core/testing';

import { DataStreamerService } from './data-streamer.service';

describe('DataStreamerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataStreamerService]
        });
    });

    it('should be created', inject([DataStreamerService], (service: DataStreamerService) => {
        expect(service).toBeTruthy();
    }));
});
