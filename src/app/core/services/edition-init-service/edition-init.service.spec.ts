/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { EditionInitService } from './edition-init.service';

describe('EditionInitService', () => {
    let editionInitService: EditionInitService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionInitService],
        });

        // Inject service
        editionInitService = TestBed.inject(EditionInitService);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(editionInitService).toBeTruthy();
    });
});
