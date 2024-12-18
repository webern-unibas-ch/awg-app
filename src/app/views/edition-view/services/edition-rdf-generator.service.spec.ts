import { TestBed } from '@angular/core/testing';

import { EditionRdfGeneratorService } from './edition-rdf-generator.service';

describe('EditionRdfGeneratorService', () => {
    let service: EditionRdfGeneratorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EditionRdfGeneratorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
