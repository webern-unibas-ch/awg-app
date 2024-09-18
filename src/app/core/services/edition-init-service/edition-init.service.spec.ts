/* eslint-disable @typescript-eslint/no-unused-vars */
import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToEqual } from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-app/views/edition-view/edition-route-constants';
import { EditionComplexesService, EditionOutlineService } from '@awg-app/views/edition-view/services';

import { EditionInitService } from './edition-init.service';

describe('EditionInitService (DONE)', () => {
    let editionInitService: EditionInitService;

    let initializeEditionComplexesListSpy: Spy;
    let initializeEditionOutlineSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionInitService],
        });

        // Inject service
        editionInitService = TestBed.inject(EditionInitService);

        // Spies for service methods
        initializeEditionComplexesListSpy = spyOn(
            EditionComplexesService,
            'initializeEditionComplexesList'
        ).and.callThrough();
        initializeEditionOutlineSpy = spyOn(EditionOutlineService, 'initializeEditionOutline').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(editionInitService).toBeTruthy();
    });

    describe('#initializeEdition()', () => {
        it('... should have a method `initializeEdition`', () => {
            expect(editionInitService.initializeEdition).toBeDefined();
        });

        it('... should initialize the edition view', () => {
            editionInitService.initializeEdition();

            expectSpyCall(initializeEditionComplexesListSpy, 1);
            expectSpyCall(initializeEditionOutlineSpy, 1);
        });

        it('... should make the EditionComplexesList available', () => {
            editionInitService.initializeEdition();

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expect(editionComplexesList).toBeDefined();
            expect(editionComplexesList).not.toBe({});

            // Test for samples
            expect(editionComplexesList['OP3']).toBeDefined();
            expect(editionComplexesList['M22']).toBeDefined();

            // Test for sample properties
            expect(editionComplexesList['OP3'].titleStatement).toBeDefined();
            expect(editionComplexesList['OP3'].respStatement).toBeDefined();
            expect(editionComplexesList['OP3'].pubStatement).toBeDefined();
        });

        it('... should make the EditionOutline available', () => {
            editionInitService.initializeEdition();

            const editionOutline = EditionOutlineService.getEditionOutline();

            expect(editionOutline).toBeDefined();
            expect(editionOutline).not.toBe([]);

            // Test for samples
            expectToEqual(editionOutline[0].series, EDITION_ROUTE_CONSTANTS.SERIES_1);
            expectToEqual(editionOutline[1].series, EDITION_ROUTE_CONSTANTS.SERIES_2);
            expectToEqual(editionOutline[2].series, EDITION_ROUTE_CONSTANTS.SERIES_3);
        });
    });
});
