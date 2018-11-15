/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BibliographyService } from './bibliography.service';
import { AppModule } from '@awg-app/app.module';

describe('BibliographyService', () => {
    let bibliographyService: BibliographyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule],
            providers: [BibliographyService]
        });
        bibliographyService = TestBed.get(BibliographyService);
    });

    it('should be created', inject([BibliographyService], (service: BibliographyService) => {
        expect(service).toBeTruthy();
    }));
});
