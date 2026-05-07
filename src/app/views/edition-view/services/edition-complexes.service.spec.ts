import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToEqual } from '@testing/expect-helper';

import { PERSONS_DATA } from '@awg-core/core-data';
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
            expect(editionComplexesList['op3']).toBeDefined();
            expect(editionComplexesList['m22']).toBeDefined();

            // Test for sample properties
            expect(editionComplexesList['op3'].titleStatement).toBeDefined();
            expect(editionComplexesList['op3'].respStatement).toBeDefined();
            expect(editionComplexesList['op3'].pubStatement).toBeDefined();
        });

        it('... should resolve $ref entries in respStatement.editors', () => {
            EditionComplexesService.initializeEditionComplexesList();

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList['op3'].respStatement.editors[0], PERSONS_DATA['thomas_ahrend']);
            expectToEqual(editionComplexesList['m22'].respStatement.editors[0], PERSONS_DATA['michael_matter']);
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
            const expectedList = { [testComplexId]: testComplex };
            EditionComplexesService.setEditionComplexesList(expectedList);

            const complex = EditionComplexesService.getEditionComplexById(testComplexId);

            expect(complex).toBeTruthy();
            expectToEqual(complex, testComplex);
        });

        it('... should return the correct edition complex by ID in a case-insensitive way', () => {
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
            const expectedList = { [testComplexId]: testComplex };
            EditionComplexesService.setEditionComplexesList(expectedList);

            const complex = EditionComplexesService.getEditionComplexById(testComplexId.toUpperCase());

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
            expect(editionComplexesList['op3']).toBeDefined();
            expect(editionComplexesList['m22']).toBeDefined();

            // Test for sample properties
            expect(editionComplexesList['op3'].titleStatement).toBeDefined();
            expect(editionComplexesList['op3'].respStatement).toBeDefined();
            expect(editionComplexesList['op3'].pubStatement).toBeDefined();
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
            const expectedList = { [testComplexId]: testComplex };
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
            const expectedList = { [testComplexId]: testComplex };
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
            const expectedList = { [testComplexId]: testComplex };
            EditionComplexesService.setEditionComplexesList(expectedList);

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList, expectedList);
        });

        it('... should set an edition complex with M* number', () => {
            const testComplex = new EditionComplex(
                {
                    title: 'Test M Complex',
                    catalogueType: 'MNR_X',
                    catalogueNumber: '400',
                },
                {
                    editors: [],
                    lastModified: '---',
                },
                { series: '1', section: '5' }
            );
            const testComplexId = 'mx400';
            const expectedList = { [testComplexId]: testComplex };
            EditionComplexesService.setEditionComplexesList(expectedList);

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList, expectedList);
        });

        it('... should resolve $ref entries in respStatement.editors', () => {
            EditionComplexesService.initializeEditionComplexesList();

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList['op3'].respStatement.editors[0], PERSONS_DATA['thomas_ahrend']);
            expectToEqual(editionComplexesList['m22'].respStatement.editors[0], PERSONS_DATA['michael_matter']);
        });

        it('... should fall back to ref-based editor name when editor $ref is not found in PERSONS_DATA', () => {
            const unknownRef = { $ref: 'unknown_person' };
            const testComplex = new EditionComplex(
                {
                    title: 'Test Opus Complex',
                    catalogueType: 'OPUS',
                    catalogueNumber: '100',
                },
                {
                    editors: [unknownRef],
                    lastModified: '---',
                },
                { series: '1', section: '5' }
            );
            const testComplexId = 'op100';
            EditionComplexesService.setEditionComplexesList({ [testComplexId]: testComplex });

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList[testComplexId].respStatement.editors[0], {
                name: unknownRef.$ref,
                homepage: '',
            });
        });

        it('... should return empty editors and empty lastModified if respStatement is null', () => {
            const testComplex = new EditionComplex(
                {
                    title: 'Test Opus Complex',
                    catalogueType: 'OPUS',
                    catalogueNumber: '100',
                },
                null,
                { series: '1', section: '5' }
            );
            const testComplexId = 'op100';
            EditionComplexesService.setEditionComplexesList({ [testComplexId]: testComplex });

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList[testComplexId].respStatement.editors, []);
            expectToEqual(editionComplexesList[testComplexId].respStatement.lastModified, '');
        });

        it('... should return empty editors and preserve lastModified if respStatement.editors is null', () => {
            const testComplex = new EditionComplex(
                {
                    title: 'Test Opus Complex',
                    catalogueType: 'OPUS',
                    catalogueNumber: '100',
                },
                { editors: null, lastModified: '2024-01-01' },
                { series: '1', section: '5' }
            );
            const testComplexId = 'op100';
            EditionComplexesService.setEditionComplexesList({ [testComplexId]: testComplex });

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList[testComplexId].respStatement.editors, []);
            expectToEqual(editionComplexesList[testComplexId].respStatement.lastModified, '2024-01-01');
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
            expect(editionComplexesList['op3']).toBeDefined();
            expect(editionComplexesList['m22']).toBeDefined();

            // Test for sample properties
            expect(editionComplexesList['op3'].titleStatement).toBeDefined();
            expect(editionComplexesList['op3'].respStatement).toBeDefined();
            expect(editionComplexesList['op3'].pubStatement).toBeDefined();
        });
    });
});
