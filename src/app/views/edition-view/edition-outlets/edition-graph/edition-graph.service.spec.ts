import { TestBed } from '@angular/core/testing';

import { EditionGraphService } from './edition-graph.service';

describe('GraphServiceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: EditionGraphService = TestBed.get(EditionGraphService);
        expect(service).toBeTruthy();
    });
});
