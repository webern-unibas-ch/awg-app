/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BibliographyService } from './bibliography.service';

describe('BibliographyService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BibliographyService]
        });
    });

    it('should ...', inject([BibliographyService], (service: BibliographyService) => {
        expect(service).toBeTruthy();
    }));
});
