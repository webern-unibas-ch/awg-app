/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';

import { EditionService } from './edition.service';

describe('EditionService', () => {
    let editionService: EditionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionService]
        });
        editionService = TestBed.get(EditionService);
    });

    it('should inject', () => {
        expect(editionService).toBeTruthy();
    });
});
