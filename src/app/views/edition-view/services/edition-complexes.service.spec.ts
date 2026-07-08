import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { PERSONS_DATA } from '@awg-core/data/persons.data';
import { EditionComplex, EditionComplexJsonPersonRef } from '@awg-views/edition-view/models';

import { EditionComplexesService } from './edition-complexes.service';

describe('EditionComplexesService (DONE)', () => {
    let initializeEditionComplexesListSpy: Spy;
    let setEditionComplexesListSpy: Spy;
    let fetchEditionComplexesDataSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Spies for service methods
        initializeEditionComplexesListSpy = vi.spyOn(EditionComplexesService, 'initializeEditionComplexesList');
        setEditionComplexesListSpy = vi.spyOn(EditionComplexesService, 'setEditionComplexesList');
        fetchEditionComplexesDataSpy = vi.spyOn(EditionComplexesService as any, '_fetchEditionComplexesData');
    });

    afterEach(() => {
        vi.restoreAllMocks();
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
            expect(editionComplexesList).not.toEqual({});

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
            expect(editionComplexesList).not.toEqual({});

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
        const defaultTitleStmt = {
            title: 'Test OPUS Complex',
            catalogueType: 'OPUS',
            catalogueNumber: '100',
        };
        const setupAndGetComplexList = (
            titleStmt: { title: string; catalogueType: string; catalogueNumber: string },
            respStmt: Partial<{ editors: EditionComplexJsonPersonRef[]; lastModified: string }> | null,
            complexId: string
        ) => {
            const testComplex = new EditionComplex(
                titleStmt,
                respStmt as { editors: EditionComplexJsonPersonRef[]; lastModified: string },
                { series: '1', section: '5' }
            );
            const expectedList = { [complexId]: testComplex };

            EditionComplexesService.setEditionComplexesList(expectedList);
            return {
                expectedList,
                actualList: EditionComplexesService.getEditionComplexesList(),
                complex: EditionComplexesService.getEditionComplexesList()[complexId],
            };
        };

        it('... should have a method `setEditionComplexesList`', () => {
            expect(EditionComplexesService.setEditionComplexesList).toBeDefined();
        });

        describe('... should set and get edition complexes', () => {
            it.each([
                { desc: 'with an opus number', type: 'OPUS', num: '100', id: 'op100' },
                { desc: 'with M number', type: 'MNR', num: '100', id: 'm100' },
                { desc: 'with M* number', type: 'MNR_X', num: '400', id: 'mx400' },
            ])('... should set an edition complex $desc', ({ type, num, id }) => {
                const titleStmt = {
                    title: `Test ${type} Complex`,
                    catalogueType: type,
                    catalogueNumber: num,
                };
                const respStmt = { editors: [], lastModified: '---' };
                const { actualList, expectedList } = setupAndGetComplexList(titleStmt, respStmt, id);

                expectToEqual(actualList, expectedList);
            });
        });

        it('... should resolve $ref entries in respStatement.editors', () => {
            EditionComplexesService.initializeEditionComplexesList();

            const editionComplexesList = EditionComplexesService.getEditionComplexesList();

            expectToEqual(editionComplexesList['op3'].respStatement.editors[0], PERSONS_DATA['thomas_ahrend']);
            expectToEqual(editionComplexesList['m22'].respStatement.editors[0], PERSONS_DATA['michael_matter']);
        });

        it('... should fall back to ref-based editor name when editor $ref is not found in PERSONS_DATA', () => {
            const unknownRef = { $ref: 'unknown_person' };

            const { complex } = setupAndGetComplexList(
                defaultTitleStmt,
                { editors: [unknownRef], lastModified: '---' },
                'op100'
            );

            expectToEqual(complex.respStatement.editors[0], {
                name: unknownRef.$ref,
                homepage: '',
                identifiers: {},
            });
            expectToBe(complex.respStatement.lastModified, '---');
        });

        it('... should return empty editors and empty lastModified if respStatement is null', () => {
            const { complex } = setupAndGetComplexList(defaultTitleStmt, null, 'op100');

            expectToEqual(complex.respStatement.editors, []);
            expectToBe(complex.respStatement.lastModified, '');
        });

        it('... should return empty editors and preserve lastModified if respStatement.editors is null', () => {
            const { complex } = setupAndGetComplexList(
                defaultTitleStmt,
                { editors: null, lastModified: '2024-01-01' },
                'op100'
            );

            expectToEqual(complex.respStatement.editors, []);
            expectToBe(complex.respStatement.lastModified, '2024-01-01');
        });
    });

    describe('#_fetchEditionComplexesData()', () => {
        it('... should have a method `_fetchEditionComplexesData`', () => {
            expect((EditionComplexesService as any)._fetchEditionComplexesData).toBeDefined();
        });

        it('... should fetch the edition complexes data', () => {
            const editionComplexesList = (EditionComplexesService as any)._fetchEditionComplexesData();

            expect(editionComplexesList).toBeDefined();
            expect(editionComplexesList).not.toEqual({});

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
