import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToEqual } from '@testing/expect-helper';

import { EditionComplex } from '@awg-views/edition-view/models';

import { EditionComplexesService } from './edition-complexes.service';

describe('EditionComplexesService (DONE)', () => {
    let initializeEditionComplexesListSpy: Spy;
    let setEditionComplexesListSpy: Spy;
    let fetchEditionComplexesDataSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Spies for service methods
        initializeEditionComplexesListSpy = spyOn(
            EditionComplexesService,
            'initializeEditionComplexesList'
        ).and.callThrough();
        setEditionComplexesListSpy = spyOn(EditionComplexesService, 'setEditionComplexesList').and.callThrough();
        fetchEditionComplexesDataSpy = spyOn(
            EditionComplexesService as any,
            '_fetchEditionComplexesData'
        ).and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(EditionComplexesService).toBeTruthy();
    });

    it('... should have `_editionComplexesList`', () => {
        expect((EditionComplexesService as any)._editionComplexesList).toBeTruthy();
    });

    describe('#initializeEditionComplexesList()', () => {
        it('... should have a method `initializeEditionComplexesList`', () => {
            expect(EditionComplexesService.initializeEditionComplexesList).toBeDefined();
        });

        it('... should trigger `_fetchEditionComplexesData` and set the edition complexes list', () => {
            EditionComplexesService.initializeEditionComplexesList();

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectSpyCall(initializeEditionComplexesListSpy, 1);
            expectSpyCall(fetchEditionComplexesDataSpy, 1);
            expectSpyCall(setEditionComplexesListSpy, 1, [editionComplexesList]);
        });

        it('... should initialize the edition complexes list', () => {
            EditionComplexesService.initializeEditionComplexesList();

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expect(editionComplexesList).toBeDefined();
            expect(editionComplexesList).not.toBe({});

            // Test for samples
            expect(Object.keys(editionComplexesList).length).toBeGreaterThan(0);
            expect(editionComplexesList['OP3']).toBeDefined();
            expect(editionComplexesList['M22']).toBeDefined();

            // Test for sample properties
            expect(editionComplexesList['OP3'].titleStatement).toBeDefined();
            expect(editionComplexesList['OP3'].respStatement).toBeDefined();
            expect(editionComplexesList['OP3'].pubStatement).toBeDefined();
        });
    });

    describe('#getEditionComplexById()', () => {
        it('... should have a method `getEditionComplexById`', () => {
            expect(EditionComplexesService.getEditionComplexById).toBeDefined();
        });

        it('... should return the correct edition complex by ID', () => {
            const testComplex = new EditionComplex(
                {
                    title: 'Test Opus Complex',
                    catalogueType: 'OPUS',
                    catalogueNumber: '100',
                },
                {
                    editors: [],
                    lastModified: '---',
                },
                { series: '1', section: '5' }
            );
            const testComplexId = 'op100';
            const expectedList = { [testComplexId.toUpperCase()]: testComplex };
            EditionComplexesService.setEditionComplexesList(expectedList);

            const complex = EditionComplexesService.getEditionComplexById(testComplexId);

            expect(complex).toBeTruthy();
            expectToEqual(complex, testComplex);
        });
    });

    describe('#getEditionComplexesList()', () => {
        it('... should have a method `getEditionComplexesList`', () => {
            expect(EditionComplexesService.getEditionComplexesList).toBeDefined();
        });

        it('... should return the edition complexes list', () => {
            EditionComplexesService.initializeEditionComplexesList();

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expect(editionComplexesList).toBeDefined();
            expect(editionComplexesList).not.toBe({});

            // Test for samples
            expect(Object.keys(editionComplexesList).length).toBeGreaterThan(0);
            expect(editionComplexesList['OP3']).toBeDefined();
            expect(editionComplexesList['M22']).toBeDefined();

            // Test for sample properties
            expect(editionComplexesList['OP3'].titleStatement).toBeDefined();
            expect(editionComplexesList['OP3'].respStatement).toBeDefined();
            expect(editionComplexesList['OP3'].pubStatement).toBeDefined();
        });
    });

    describe('#setEditionComplexesList()', () => {
        it('... should have a method `setEditionComplexesList`', () => {
            expect(EditionComplexesService.setEditionComplexesList).toBeDefined();
        });

        it('... should set the edition complexes list', () => {
            const testComplex = new EditionComplex(
                {
                    title: 'Test Opus Complex',
                    catalogueType: 'OPUS',
                    catalogueNumber: '100',
                },
                {
                    editors: [],
                    lastModified: '---',
                },
                { series: '1', section: '5' }
            );
            const testComplexId = 'op100';
            const expectedList = { [testComplexId.toUpperCase()]: testComplex };
            EditionComplexesService.setEditionComplexesList(expectedList);

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList, expectedList);
        });

        it('... should set an edition complex with opus number', () => {
            const testComplex = new EditionComplex(
                {
                    title: 'Test Opus Complex',
                    catalogueType: 'OPUS',
                    catalogueNumber: '100',
                },
                {
                    editors: [],
                    lastModified: '---',
                },
                { series: '1', section: '5' }
            );
            const testComplexId = 'op100';
            const expectedList = { [testComplexId.toUpperCase()]: testComplex };
            EditionComplexesService.setEditionComplexesList(expectedList);

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList, expectedList);
        });

        it('... should set an edition complex with M number', () => {
            const testComplex = new EditionComplex(
                {
                    title: 'Test M Complex',
                    catalogueType: 'MNR',
                    catalogueNumber: '100',
                },
                {
                    editors: [],
                    lastModified: '---',
                },
                { series: '1', section: '5' }
            );
            const testComplexId = 'm100';
            const expectedList = { [testComplexId.toUpperCase()]: testComplex };
            EditionComplexesService.setEditionComplexesList(expectedList);

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList, expectedList);
        });

        it('... should set an edition complex with M* number', () => {
            const testComplex = new EditionComplex(
                {
                    title: 'Test M Complex',
                    catalogueType: 'MNR_PLUS',
                    catalogueNumber: '100',
                },
                {
                    editors: [],
                    lastModified: '---',
                },
                { series: '1', section: '5' }
            );
            const testComplexId = 'm_plus100';
            const expectedList = { [testComplexId.toUpperCase()]: testComplex };
            EditionComplexesService.setEditionComplexesList(expectedList);

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList, expectedList);
        });
    });

    describe('#_fetchEditionComplexesData()', () => {
        it('... should have a method `_fetchEditionComplexesData`', () => {
            expect((EditionComplexesService as any)._fetchEditionComplexesData).toBeDefined();
        });

        it('... should fetch the edition complexes data', () => {
            const editionComplexesList = (EditionComplexesService as any)._fetchEditionComplexesData();

            expect(editionComplexesList).toBeDefined();
            expect(editionComplexesList).not.toBe({});

            // Test for samples
            expect(Object.keys(editionComplexesList).length).toBeGreaterThan(0);
            expect(editionComplexesList['OP3']).toBeDefined();
            expect(editionComplexesList['M22']).toBeDefined();

            // Test for sample properties
            expect(editionComplexesList['OP3'].titleStatement).toBeDefined();
            expect(editionComplexesList['OP3'].respStatement).toBeDefined();
            expect(editionComplexesList['OP3'].pubStatement).toBeDefined();
        });
    });
});
