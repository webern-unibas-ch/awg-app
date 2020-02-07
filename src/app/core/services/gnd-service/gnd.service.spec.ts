import { TestBed } from '@angular/core/testing';

import { GndService } from './gnd.service';

describe('GndService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: GndService = TestBed.get(GndService);
        expect(service).toBeTruthy();
    });
});
