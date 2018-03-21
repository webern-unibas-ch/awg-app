/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataApiService } from './data-api.service';

describe('DataApiService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DataApiService]
        });
    });

    it('should ...', inject([DataApiService], (service: DataApiService) => {
        expect(service).toBeTruthy();
    }));
});
