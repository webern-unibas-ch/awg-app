import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { PERSONS_DATA } from '@awg-shared/meta/persons.data';
import { EditionComplex, EditionComplexJsonPersonRef } from '@awg-views/edition-view/models';

import { isSignal } from '@angular/core';
import { EditionComplexesService } from './edition-complexes.service';

describe('EditionComplexesService (DONE)', () => {
    let service: EditionComplexesService;

    let initializeEditionComplexesListSpy: Spy;
    let setEditionComplexesListSpy: Spy;
    let fetchEditionComplexesDataSpy: Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionComplexesService],
        });

        // Inject services
        service = TestBed.inject(EditionComplexesService);

        // Spies for service methods
        initializeEditionComplexesListSpy = vi.spyOn(service, 'initializeEditionComplexesList');
        setEditionComplexesListSpy = vi.spyOn(service, 'setEditionComplexesList');
        fetchEditionComplexesDataSpy = vi.spyOn(service as any, '_fetchEditionComplexesData');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    it('... should have signal `_editionComplexesListSignal` to hold an empty object', () => {
        expectToBe(isSignal((service as any)._editionComplexesListSignal), true);

        expectToEqual((service as any)._editionComplexesListSignal(), {});
    });

    describe('#editionComplexesList()', () => {
        it('... should have signal `getEditionComplexesList` to hold an empty object', () => {
            expectToBe(isSignal(service.editionComplexesList), true);

            expectToEqual(service.editionComplexesList(), {});
        });

        it('... should hold the edition complexes list after initialization', () => {
            service.initializeEditionComplexesList();

            const editionComplexesList = service.editionComplexesList();

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

    describe('#initializeEditionComplexesList()', () => {
        it('... should have a method `initializeEditionComplexesList`', () => {
            expect(service.initializeEditionComplexesList).toBeDefined();
        });

        it('... should trigger `_fetchEditionComplexesData` and set the edition complexes list', () => {
            service.initializeEditionComplexesList();

            const editionComplexesList = service.editionComplexesList();

            expectSpyCall(initializeEditionComplexesListSpy, 1);
            expectSpyCall(fetchEditionComplexesDataSpy, 1);
            expectSpyCall(setEditionComplexesListSpy, 1, [editionComplexesList]);
        });

        it('... should initialize the edition complexes list', () => {
            service.initializeEditionComplexesList();

            const editionComplexesList = service.editionComplexesList();

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
            service.initializeEditionComplexesList();

            const editionComplexesList = service.editionComplexesList();

            expectToEqual(editionComplexesList['op3'].respStatement.editors[0], PERSONS_DATA['thomas_ahrend']);
            expectToEqual(editionComplexesList['m22'].respStatement.editors[0], PERSONS_DATA['michael_matter']);
        });
    });

    describe('#getEditionComplexById()', () => {
        it('... should have a method `getEditionComplexById`', () => {
            expect(service.getEditionComplexById).toBeDefined();
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
            service.setEditionComplexesList(expectedList);

            const complex = service.getEditionComplexById(testComplexId);

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
            service.setEditionComplexesList(expectedList);

            const complex = service.getEditionComplexById(testComplexId.toUpperCase());

            expect(complex).toBeTruthy();
            expectToEqual(complex, testComplex);
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

            service.setEditionComplexesList(expectedList);
            return {
                expectedList,
                actualList: service.editionComplexesList(),
                complex: service.editionComplexesList()[complexId],
            };
        };

        it('... should have a method `setEditionComplexesList`', () => {
            expect(service.setEditionComplexesList).toBeDefined();
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
            service.initializeEditionComplexesList();

            const editionComplexesList = service.editionComplexesList();

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
            expect((service as any)._fetchEditionComplexesData).toBeDefined();
        });

        it('... should fetch the edition complexes data', () => {
            const editionComplexesList = (service as any)._fetchEditionComplexesData();

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
