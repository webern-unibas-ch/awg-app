/* tslint:disable:no-unused-variable */
import { TestBed } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { EditionService } from './edition.service';

describe('EditionService', () => {
    let editionService: EditionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionService]
        });
        editionService = TestBed.inject(EditionService);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should inject', () => {
        expect(editionService).toBeTruthy();
    });
});
