import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToEqual } from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplexesService, EditionOutlineService } from '@awg-views/edition-view/services';

import { EditionInitService } from './edition-init.service';

describe('EditionInitService (DONE)', () => {
    let editionInitService: EditionInitService;

    let initializeEditionComplexesListSpy: Spy;
    let initializeEditionOutlineSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionInitService],
        });

        // Inject services
        editionInitService = TestBed.inject(EditionInitService);

        // Spies for service methods
        initializeEditionComplexesListSpy = vi.spyOn(EditionComplexesService, 'initializeEditionComplexesList');
        initializeEditionOutlineSpy = vi.spyOn(EditionOutlineService, 'initializeEditionOutline');
    });

    afterEach(() => {
        vi.restoreAllMocks();
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
            expect(editionComplexesList).not.toEqual({});

            // Test for samples
            expect(editionComplexesList['op3']).toBeDefined();
            expect(editionComplexesList['m22']).toBeDefined();

            // Test for sample properties
            expect(editionComplexesList['op3'].titleStatement).toBeDefined();
            expect(editionComplexesList['op3'].respStatement).toBeDefined();
            expect(editionComplexesList['op3'].pubStatement).toBeDefined();
        });

        it('... should make the EditionOutline available', () => {
            editionInitService.initializeEdition();

            const editionOutline = EditionOutlineService.getEditionOutline();

            expect(editionOutline).toBeDefined();
            expect(editionOutline).not.toEqual([]);

            // Test for samples
            expectToEqual(editionOutline[0].series, EDITION_ROUTE_CONSTANTS.SERIES_1);
            expectToEqual(editionOutline[1].series, EDITION_ROUTE_CONSTANTS.SERIES_2);
            expectToEqual(editionOutline[2].series, EDITION_ROUTE_CONSTANTS.SERIES_3);
        });
    });
});
