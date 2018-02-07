/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EditionService } from './edition.service';

describe('EditionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionService]
        });
    });

    it('should ...', inject([EditionService], (service: EditionService) => {
        expect(service).toBeTruthy();
    }));
});
