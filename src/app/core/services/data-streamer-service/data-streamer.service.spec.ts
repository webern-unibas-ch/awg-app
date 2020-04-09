import { TestBed, inject } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { DataStreamerService } from './data-streamer.service';

describe('DataStreamerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataStreamerService]
        });
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should be created', inject([DataStreamerService], (service: DataStreamerService) => {
        expect(service).toBeTruthy();
    }));
});
