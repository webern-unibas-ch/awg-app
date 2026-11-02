import { describe, expect, it } from 'vitest';

import { expectToBe, expectToEqual } from './expect-helper';

import { EditionStateHelper } from './edition-state-helper';

describe('EditionStateHelper (DONE)', () => {
    describe('#getOutline()', () => {
        it('... should have a method `getOutline`', () => {
            expect(EditionStateHelper.getOutline).toBeDefined();
        });

        it('... should return the complete edition outline array', () => {
            const outline = EditionStateHelper.getOutline();

            expect(outline).toBeTruthy();
            expectToBe(Array.isArray(outline), true);
            expect(outline.length).toBeGreaterThan(0);
        });

        it('... should return a structured clone (deep copy) that protects the cache from mutations', () => {
            const firstRun = EditionStateHelper.getOutline();

            if (firstRun.length && firstRun[0].sections?.length) {
                firstRun[0].sections[0].section.route = 'MUTATED_ROUTE';
            }

            const secondRun = EditionStateHelper.getOutline();

            expect(secondRun[0].sections[0].section.route).not.toBe('MUTATED_ROUTE');
        });

        it('... should check if the returned items are still instances of EditionOutlineSeries', () => {
            const outline = EditionStateHelper.getOutline();

            expect(outline[0]).toHaveProperty('series');
            expect(outline[0]).toHaveProperty('sections');
        });
    });

    describe('#getSeries()', () => {
        it('... should have a method `getSeries`', () => {
            expect(EditionStateHelper.getSeries).toBeDefined();
        });

        it('... should return the series with the default id "1" if no id is provided', () => {
            const series = EditionStateHelper.getSeries();

            expect(series).toBeTruthy();
            expectToBe(series.series.route, '1');
        });

        it('... should return the correct series for a valid given seriesId', () => {
            const validSeriesId = '2';

            const series = EditionStateHelper.getSeries(validSeriesId);

            expect(series).toBeTruthy();
            expectToBe(series.series.route, validSeriesId);
        });

        it('... should throw an error if the seriesId is not found', () => {
            const invalidSeriesId = 'NON_EXISTENT_SERIES_ID';

            expect(() => EditionStateHelper.getSeries(invalidSeriesId)).toThrow(
                `[EditionStateHelper] Series ${invalidSeriesId} not found in the edition outline data!`
            );
        });

        it('... should return a structured clone (deep copy) that protects the cache from mutations', () => {
            const firstRun = EditionStateHelper.getSeries('1');

            firstRun.sections[0].section.route = 'MUTATED_ROUTE';

            const secondRun = EditionStateHelper.getSeries('1');

            expect(secondRun.sections[0].section.route).not.toBe('MUTATED_ROUTE');
        });

        it('... should check if the returned series is still an instance of EditionOutlineSeries', () => {
            const series = EditionStateHelper.getSeries('1');

            expect(series).toHaveProperty('series');
            expect(series).toHaveProperty('sections');
        });
    });

    describe('#getSection()', () => {
        it('... should have a method `getSection`', () => {
            expect(EditionStateHelper.getSection).toBeDefined();
        });

        it('... should return the default section (series "1", section "5") if no parameters are provided', () => {
            const section = EditionStateHelper.getSection();

            expect(section).toBeTruthy();
            expectToBe(section.section.route, '5');
        });

        it('... should return the correct section for valid seriesId and sectionId', () => {
            const seriesId = '1';
            const sectionId = '5';

            const section = EditionStateHelper.getSection(seriesId, sectionId);

            expect(section).toBeTruthy();
            expectToBe(section.section.route, sectionId);
        });

        it('... should throw an error if the seriesId is not found', () => {
            const invalidSeriesId = 'NON_EXISTENT_SERIES_ID';
            const sectionId = '5';

            expect(() => EditionStateHelper.getSection(invalidSeriesId, sectionId)).toThrow(
                `[EditionStateHelper] Series ${invalidSeriesId} not found in the edition outline data!`
            );
        });

        it('... should throw an error if the series is found but the section does not exist', () => {
            const seriesId = '1';
            const invalidSectionId = 'NON_EXISTENT_SECTION_ID';

            expect(() => EditionStateHelper.getSection(seriesId, invalidSectionId)).toThrow(
                `[EditionStateHelper] Section ${invalidSectionId} not found in series ${seriesId} of the edition outline data!`
            );
        });

        it('... should return a structured clone (deep copy) that protects the cache from mutations', () => {
            const firstRun = EditionStateHelper.getSection('1', '5');

            firstRun.section.route = 'MUTATED_ROUTE';

            const secondRun = EditionStateHelper.getSection('1', '5');

            expect(secondRun.section.route).not.toBe('MUTATED_ROUTE');
        });

        it('... should check if the returned section is still an instance of EditionOutlineSection', () => {
            const section = EditionStateHelper.getSection('1', '5');

            expect(section).toHaveProperty('seriesParent');
            expect(section).toHaveProperty('section');
            expect(section).toHaveProperty('labeledRoute');
            expect(section).toHaveProperty('content');
            expect(section).toHaveProperty('disabled');
        });
    });

    describe('#getComplexesList()', () => {
        it('... should have a method `getComplexesList`', () => {
            expect(EditionStateHelper.getComplexesList).toBeDefined();
        });

        it('... should return the complete complexes list object', () => {
            const list = EditionStateHelper.getComplexesList();

            expect(list).toBeTruthy();
            expectToBe(typeof list, 'object');
            expect(Object.keys(list).length).toBeGreaterThan(0);
        });

        it('... should return a structured clone that protects the cache from mutations', () => {
            const firstRun = EditionStateHelper.getComplexesList();
            const firstKey = Object.keys(firstRun)[0];

            firstRun[firstKey].titleStatement.title = 'MUTATED_TITLE';

            const secondRun = EditionStateHelper.getComplexesList();

            expect(secondRun[firstKey].titleStatement.title).not.toBe('MUTATED_TITLE');
        });

        it('... should check if the returned items are still instances of EditionComplex', () => {
            const list = EditionStateHelper.getComplexesList();

            const firstKey = Object.keys(list)[0];
            const complexItem = list[firstKey];

            expect(complexItem).toHaveProperty('titleStatement');
            expect(complexItem).toHaveProperty('respStatement');
            expect(complexItem).toHaveProperty('pubStatement');
            expect(complexItem).toHaveProperty('complexId');
            expect(complexItem).toHaveProperty('baseRoute');
        });
    });

    describe('#getComplex()', () => {
        it('... should have a method `getComplex`', () => {
            expect(EditionStateHelper.getComplex).toBeDefined();
        });

        it('... should return the correct complex for a valid complexId', () => {
            const validComplexId = 'op12';

            const complex = EditionStateHelper.getComplex(validComplexId);

            expect(complex).toBeTruthy();
            expect(complex.titleStatement).toBeDefined();
        });

        it('... should return the correct complex for a valid complexId (case-insensitive)', () => {
            const casedComplexId = 'OP12';
            const complex = EditionStateHelper.getComplex(casedComplexId);

            expect(complex).toBeTruthy();
            expect(complex.titleStatement).toBeDefined();
        });

        it('... should throw an error if the complexId is not found', () => {
            const invalidComplexId = 'UNKNOWN_COMPLEX';

            expect(() => EditionStateHelper.getComplex(invalidComplexId)).toThrow(
                `[EditionStateHelper] Complex ${invalidComplexId} not found in the edition complexes data!`
            );
        });

        it('... should return a structured clone that protects the cache from mutations', () => {
            const firstRun = EditionStateHelper.getComplex('op12');

            firstRun.titleStatement.title = 'MUTATED_TITLE';

            const secondRun = EditionStateHelper.getComplex('op12');

            expect(secondRun.titleStatement.title).not.toBe('MUTATED_TITLE');
        });

        it('... should check if the returned complex is still an instance of EditionComplex', () => {
            const complex = EditionStateHelper.getComplex('op12');

            expect(complex).toHaveProperty('titleStatement');
            expect(complex).toHaveProperty('respStatement');
            expect(complex).toHaveProperty('pubStatement');
            expect(complex).toHaveProperty('complexId');
            expect(complex).toHaveProperty('baseRoute');
        });
    });

    describe('#getOutlineComplexItem()', () => {
        it('... should have a method `getOutlineComplexItem`', () => {
            expect(EditionStateHelper.getOutlineComplexItem).toBeDefined();
        });

        it('... should return the outline item of a composite complex with its parts', () => {
            const complexItem = EditionStateHelper.getOutlineComplexItem('op12');

            const partRoutes = complexItem.parts?.map(part => part.complex.complexId.route);

            expectToBe(complexItem.complex.complexId.route, '/op12');
            expectToEqual(partRoutes, ['/m212', '/m217', '/m213', '/m216']);
        });

        it('... should return the outline item of a part with its composite complex', () => {
            const complexItem = EditionStateHelper.getOutlineComplexItem('m217');

            const composite = complexItem.compositeComplexes?.[0];

            expectToBe(composite?.complex.complexId.route, '/op12');
            expectToBe(composite?.partNumber, 2);
        });

        it('... should throw an error if the complexId is not found', () => {
            const invalidComplexId = 'UNKNOWN_COMPLEX';

            expect(() => EditionStateHelper.getOutlineComplexItem(invalidComplexId)).toThrow(
                `[EditionStateHelper] Complex ${invalidComplexId} not found in the edition complexes data!`
            );
        });

        it('... should return a structured clone that protects the cache from mutations', () => {
            const firstRun = EditionStateHelper.getOutlineComplexItem('op12');

            firstRun.complex.titleStatement.title = 'MUTATED_TITLE';

            const secondRun = EditionStateHelper.getOutlineComplexItem('op12');

            expect(secondRun.complex.titleStatement.title).not.toBe('MUTATED_TITLE');
        });
    });
});
