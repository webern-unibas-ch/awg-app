import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { PERSONS_DATA } from '@awg-shared/meta/persons.data';
import { EditionComplex, EditionComplexJsonPersonRef } from '../models/edition-complex.model';

import { EditionComplexesService } from './edition-complexes.service';

const createComplex = (catalogueType: string, catalogueNumber: string): EditionComplex =>
    new EditionComplex(
        { title: `Test ${catalogueType} Complex`, catalogueType, catalogueNumber },
        { editors: [], lastModified: '---' },
        { series: '1', section: '5' }
    );

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
        fetchEditionComplexesDataSpy = vi.spyOn(service, '_fetchEditionComplexesData' as any);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    it('... should have signal `_editionComplexesListSignal` to hold an empty object', () => {
        expectToBe(isSignal(service['_editionComplexesListSignal']), true);

        expectToEqual(service['_editionComplexesListSignal'](), {});
    });

    it('... should have signal `_complexPartIdsSignal` to hold an empty object', () => {
        expectToBe(isSignal(service['_complexPartIdsSignal']), true);

        expectToEqual(service['_complexPartIdsSignal'](), {});
    });

    describe('... computed signal `_compositeComplexRefs`', () => {
        it('... should have computed signal `_compositeComplexRefs` to hold an empty map', () => {
            expectToBe(isSignal(service['_compositeComplexRefs']), true);

            expectToEqual(service['_compositeComplexRefs'](), new Map());
        });

        it('... should hold the ids of the composite complexes and the part numbers by the ids of the parts', () => {
            const expectedRefs = new Map([
                ['m1', [{ compositeId: 'op100', partNumber: 1 }]],
                [
                    'm2',
                    [
                        { compositeId: 'op100', partNumber: 2 },
                        { compositeId: 'op101', partNumber: 1 },
                    ],
                ],
            ]);

            service.setEditionComplexesList({}, { op100: ['m1', 'm2'], op101: ['m2'] });

            expectToEqual(service['_compositeComplexRefs'](), expectedRefs);
        });
    });

    describe('... signal `editionComplexesList`', () => {
        it('... should have signal `editionComplexesList` to hold an empty object', () => {
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
            const partIds = service['_complexPartIdsSignal']();

            expectSpyCall(initializeEditionComplexesListSpy, 1);
            expectSpyCall(fetchEditionComplexesDataSpy, 1);
            expectSpyCall(setEditionComplexesListSpy, 1, [editionComplexesList, partIds]);
        });

        it('... should initialize the part ids of the composite complexes', () => {
            service.initializeEditionComplexesList();

            const partIds = service['_complexPartIdsSignal']();

            expectToEqual(partIds['op25'], ['m317', 'm322', 'm321']);
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
        let testComplexId: string;
        let testComplex: EditionComplex;

        beforeEach(() => {
            testComplex = new EditionComplex(
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
            testComplexId = 'op100';
            const expectedList = { [testComplexId]: testComplex };
            service.setEditionComplexesList(expectedList);
        });
        it('... should have a method `getEditionComplexById`', () => {
            expect(service.getEditionComplexById).toBeDefined();
        });

        it('... should return undefined for an unknown edition complex ID', () => {
            const complex = service.getEditionComplexById('op101');

            expect(complex).toBeUndefined();
        });

        it('... should return the correct edition complex by ID', () => {
            const complex = service.getEditionComplexById(testComplexId);

            expect(complex).toBeTruthy();
            expectToEqual(complex, testComplex);
        });

        it('... should return the correct edition complex by ID in a case-insensitive way', () => {
            const complex = service.getEditionComplexById(testComplexId.toUpperCase());

            expect(complex).toBeTruthy();
            expectToEqual(complex, testComplex);
        });
    });

    describe('#getComplexParts()', () => {
        const opus = createComplex('OPUS', '100');
        const part1 = createComplex('MNR', '1');
        const part2 = createComplex('MNR', '2');

        beforeEach(() => {
            service.setEditionComplexesList({ op100: opus, m1: part1, m2: part2 }, { op100: ['m2', 'unknown', 'm1'] });
        });

        it('... should have a method `getComplexParts`', () => {
            expect(service.getComplexParts).toBeDefined();
        });

        it('... should return the known parts of a composite complex in their order', () => {
            const parts = service.getComplexParts('op100');

            expectToEqual(parts, [part2, part1]);
        });

        it('... should return the parts in a case-insensitive way', () => {
            const parts = service.getComplexParts('OP100');

            expectToEqual(parts, [part2, part1]);
        });

        it('... should return an empty array for a complex without parts', () => {
            const parts = service.getComplexParts('m1');

            expectToEqual(parts, []);
        });
    });

    describe('#getCompositeComplexes()', () => {
        const opus1 = createComplex('OPUS', '100');
        const opus2 = createComplex('OPUS', '101');
        const part = createComplex('MNR', '1');

        beforeEach(() => {
            service.setEditionComplexesList(
                { op100: opus1, op101: opus2, m1: part },
                { op100: ['m2', 'm1'], op101: ['m1'], unknown: ['m1'] }
            );
        });

        it('... should have a method `getCompositeComplexes`', () => {
            expect(service.getCompositeComplexes).toBeDefined();
        });

        it('... should return the known composite complexes of a part with its part numbers', () => {
            const compositeComplexes = service.getCompositeComplexes('m1');

            expectToEqual(compositeComplexes, [
                { compositeComplex: opus1, partNumber: 2 },
                { compositeComplex: opus2, partNumber: 1 },
            ]);
        });

        it('... should return the composite complexes in a case-insensitive way', () => {
            const compositeComplexes = service.getCompositeComplexes('M1');

            expectToEqual(compositeComplexes, [
                { compositeComplex: opus1, partNumber: 2 },
                { compositeComplex: opus2, partNumber: 1 },
            ]);
        });

        it('... should return an empty array for a complex that is not a part', () => {
            const compositeComplexes = service.getCompositeComplexes('op100');

            expectToEqual(compositeComplexes, []);
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
                const respStmt = { editors: [] as EditionComplexJsonPersonRef[], lastModified: '---' };
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

        it('... should set the given part ids', () => {
            service.setEditionComplexesList({}, { op100: ['m1'] });

            expectToEqual(service['_complexPartIdsSignal'](), { op100: ['m1'] });
        });

        it('... should set empty part ids by default', () => {
            service.setEditionComplexesList({}, { op100: ['m1'] });
            service.setEditionComplexesList({});

            expectToEqual(service['_complexPartIdsSignal'](), {});
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

        it('... should return empty editors and preserve lastModified if respStatement.editors is empty', () => {
            const { complex } = setupAndGetComplexList(
                defaultTitleStmt,
                { editors: [], lastModified: '2024-01-01' },
                'op100'
            );

            expectToEqual(complex.respStatement.editors, []);
            expectToBe(complex.respStatement.lastModified, '2024-01-01');
        });
    });

    describe('#_fetchEditionComplexesData()', () => {
        it('... should have a method `_fetchEditionComplexesData`', () => {
            expect(service['_fetchEditionComplexesData']).toBeDefined();
        });

        it('... should return the edition complexes list', () => {
            const { complexesList } = service['_fetchEditionComplexesData']();

            expect(complexesList).toBeDefined();
            expect(complexesList).not.toEqual({});

            // Test for samples
            expect(Object.keys(complexesList).length).toBeGreaterThan(0);
            expect(complexesList['op3']).toBeDefined();
            expect(complexesList['m22']).toBeDefined();

            // Test for sample properties
            expect(complexesList['op3'].titleStatement).toBeDefined();
            expect(complexesList['op3'].respStatement).toBeDefined();
            expect(complexesList['op3'].pubStatement).toBeDefined();
        });

        it('... should return the part ids of the composite complexes in their order', () => {
            const { partIds } = service['_fetchEditionComplexesData']();

            expectToEqual(partIds['op12'], ['m212', 'm217', 'm213', 'm216']);
            expectToEqual(partIds['op25'], ['m317', 'm322', 'm321']);
        });

        it('... should return no part ids for complexes without parts', () => {
            const { partIds } = service['_fetchEditionComplexesData']();

            expect(partIds['m22']).toBeUndefined();
        });
    });
});
