/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';

import { EditionOutlineService } from './edition-outline.service';

describe('EditionOutlineService', () => {
    let initializeEditionComplexesListSpy: Spy;
    let setEditionComplexesListSpy: Spy;
    let fetchEditionComplexesDataSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(EditionOutlineService).toBeTruthy();
    });

    it('... should have `_editionOutline`', () => {
        expect((EditionOutlineService as any)._editionOutline).toBeTruthy();
    });
});
