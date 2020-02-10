import { TestBed } from '@angular/core/testing';

import { GraphServiceService } from './edition-graph.service';

describe('GraphServiceService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: GraphServiceService = TestBed.get(GraphServiceService);
        expect(service).toBeTruthy();
    });
});
