import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';

describe('DataApiService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataService]
        });
    });

    it('should ...', inject([DataService], (service: DataService) => {
        expect(service).toBeTruthy();
    }));
});
