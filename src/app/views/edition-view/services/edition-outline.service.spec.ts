import { TestBed } from '@angular/core/testing';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToEqual } from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionOutline, EditionOutlineSeries } from '@awg-views/edition-view/models';

import { EditionOutlineSeriesJsonData } from '../models/edition-outline.model';
import { EditionComplexesService } from './edition-complexes.service';
import { EditionOutlineService } from './edition-outline.service';

describe('EditionOutlineService (DONE)', () => {
    let initializeEditionOutlineSpy: Spy;
    let setEditionOutlineSpy: Spy;
    let fetchEditionOutlineDataSpy: Spy;

    let expectedRawOutlineData: EditionOutlineSeriesJsonData[];

    beforeAll(() => {
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Spies for service methods
        initializeEditionOutlineSpy = vi.spyOn(EditionOutlineService, 'initializeEditionOutline');
        setEditionOutlineSpy = vi.spyOn(EditionOutlineService, 'setEditionOutline');
        fetchEditionOutlineDataSpy = vi.spyOn(EditionOutlineService as any, '_fetchEditionOutlineData');

        // Test data
        expectedRawOutlineData = [
            {
                series: '2',
                sections: [
                    {
                        section: '4',
                        content: {
                            intro: { disabled: false },
                            complexTypes: { opus: [], mnr: [] },
                        },
                        disabled: false,
                    },
                    {
                        section: '5',
                        disabled: true,
                        content: {
                            intro: { disabled: true },
                            complexTypes: { opus: [], mnr: [] },
                        },
                    },
                ],
            },
        ];
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(EditionOutlineService).toBeTruthy();
    });

    it('... should have `_editionOutline`', () => {
        expect((EditionOutlineService as any)._editionOutline).toBeTruthy();
    });

    describe('#initializeEditionOutline()', () => {
        it('... should have a method `initializeEditionOutline`', () => {
            expect(EditionOutlineService.initializeEditionOutline).toBeDefined();
        });

        it('... should trigger `_fetchEditionOutlineData` and set the edition complexes list', () => {
            EditionOutlineService.initializeEditionOutline();

            const editionOutline = EditionOutlineService.getEditionOutline();

            expectSpyCall(initializeEditionOutlineSpy, 1);
            expectSpyCall(fetchEditionOutlineDataSpy, 1);
            expectSpyCall(setEditionOutlineSpy, 1, [editionOutline]);
        });

        it('... should initialize the edition outline', () => {
            EditionOutlineService.initializeEditionOutline();

            const editionOutline = EditionOutlineService.getEditionOutline();

            expect(editionOutline).toBeDefined();
            expect(editionOutline).not.toEqual([]);

            // Test for samples
            expect(editionOutline.length).toBeGreaterThan(0);
            expectToEqual(editionOutline[0].series, EDITION_ROUTE_CONSTANTS.SERIES_1);
            expectToEqual(editionOutline[1].series, EDITION_ROUTE_CONSTANTS.SERIES_2);
            expectToEqual(editionOutline[2].series, EDITION_ROUTE_CONSTANTS.SERIES_3);
        });
    });

    describe('#getEditionOutline()', () => {
        it('... should have a method `getEditionOutline`', () => {
            expect(EditionOutlineService.getEditionOutline).toBeDefined();
        });

        it('... should return the edition outline', () => {
            const editionOutline = EditionOutlineService.getEditionOutline();

            expect(editionOutline).toBeDefined();
            expect(editionOutline).not.toEqual([]);

            // Test for samples
            expect(editionOutline.length).toBeGreaterThan(0);
            expectToEqual(editionOutline[0].series, EDITION_ROUTE_CONSTANTS.SERIES_1);
            expectToEqual(editionOutline[1].series, EDITION_ROUTE_CONSTANTS.SERIES_2);
            expectToEqual(editionOutline[2].series, EDITION_ROUTE_CONSTANTS.SERIES_3);
        });
    });

    describe('#setEditionOutline()', () => {
        it('... should have a method `setEditionOutline`', () => {
            expect(EditionOutlineService.setEditionOutline).toBeDefined();
        });

        it('... should set the edition outline', () => {
            const expectedOutline: EditionOutlineSeries[] = new EditionOutline(expectedRawOutlineData).outline;

            EditionOutlineService.setEditionOutline(expectedOutline);

            const outline = EditionOutlineService.getEditionOutline();

            expectToEqual(outline, expectedOutline);
        });

        it('... should filter out unknown complexes during instantiation', () => {
            const getComplexSpy = vi.spyOn(EditionComplexesService, 'getEditionComplexById').mockReturnValue(undefined);

            const rawOutlineDataWithUnknownComplex = [
                {
                    series: '2',
                    sections: [
                        {
                            section: '4',
                            content: {
                                intro: { disabled: false },
                                complexTypes: { opus: [{ complex: 'UNKNOWN_ID', disabled: false }], mnr: [] },
                            },
                            disabled: false,
                        },
                    ],
                },
            ];
            const expectedOutline: EditionOutlineSeries[] = new EditionOutline(rawOutlineDataWithUnknownComplex)
                .outline;

            EditionOutlineService.setEditionOutline(expectedOutline);

            const outline = EditionOutlineService.getEditionOutline();
            const section = outline[0].sections[0];

            expectToEqual(section.content.complexTypes.opus, []);
            expectToEqual(section.content.sectionComplexes, []);

            getComplexSpy.mockRestore();
        });

        describe('... should set empty array if the given edition data is', () => {
            it('... null', () => {
                const expectedOutline = new EditionOutline(null);

                EditionOutlineService.setEditionOutline(expectedOutline.outline);

                const editionOutline = EditionOutlineService.getEditionOutline();

                expectToEqual(editionOutline, []);
            });

            it('... undefined', () => {
                const expectedOutline = new EditionOutline(undefined);

                EditionOutlineService.setEditionOutline(expectedOutline.outline);

                const editionOutline = EditionOutlineService.getEditionOutline();

                expectToEqual(editionOutline, []);
            });

            it('... empty array', () => {
                const expectedOutline = new EditionOutline([]);

                EditionOutlineService.setEditionOutline(expectedOutline.outline);

                const editionOutline = EditionOutlineService.getEditionOutline();

                expectToEqual(editionOutline, []);
            });
        });
    });

    describe('#getEditionSeriesById()', () => {
        it('... should have a method `getEditionSeriesById`', () => {
            expect(EditionOutlineService.getEditionSeriesById).toBeDefined();
        });

        it('... should return editionSeries with given id', () => {
            const expectedOutline: EditionOutlineSeries[] = new EditionOutline(expectedRawOutlineData).outline;

            EditionOutlineService.setEditionOutline(expectedOutline);

            const series = EditionOutlineService.getEditionSeriesById(EDITION_ROUTE_CONSTANTS.SERIES_2.route);

            expectToEqual(series, expectedOutline[0]);
        });
    });

    describe('#getEditionSectionById()', () => {
        it('... should have a method `getEditionSectionById`', () => {
            expect(EditionOutlineService.getEditionSectionById).toBeDefined();
        });

        it('... should return editionSection with given id', () => {
            const expectedOutline: EditionOutlineSeries[] = new EditionOutline(expectedRawOutlineData).outline;

            expectedOutline[0].sections.forEach(section => {
                const expectedEditionSection = section;

                const getSection = EditionOutlineService.getEditionSectionById(
                    EDITION_ROUTE_CONSTANTS.SERIES_2.route,
                    section.section.route
                );

                expectToEqual(getSection, expectedEditionSection);
            });
        });
    });

    describe('#_fetchEditionOutlineData()', () => {
        it('... should have a method `_fetchEditionOutlineData`', () => {
            expect((EditionOutlineService as any)._fetchEditionOutlineData).toBeDefined();
        });

        it('... should fetch the edition outline data', () => {
            const editionOutline = (EditionOutlineService as any)._fetchEditionOutlineData();

            expect(editionOutline).toBeDefined();
            expect(editionOutline).not.toEqual({});
            expect(Object.keys(editionOutline).length).toBeGreaterThan(0);
            expect(editionOutline.outline).toBeDefined();

            // Test for samples
            expectToEqual(editionOutline.outline[0].series, EDITION_ROUTE_CONSTANTS.SERIES_1);
            expectToEqual(editionOutline.outline[1].series, EDITION_ROUTE_CONSTANTS.SERIES_2);
            expectToEqual(editionOutline.outline[2].series, EDITION_ROUTE_CONSTANTS.SERIES_3);
        });
    });
});
