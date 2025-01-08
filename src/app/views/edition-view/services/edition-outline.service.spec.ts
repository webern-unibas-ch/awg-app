import { TestBed } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToEqual } from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionOutline, EditionOutlineSeries } from '@awg-views/edition-view/models';

import { EditionOutlineService } from './edition-outline.service';

describe('EditionOutlineService (DONE)', () => {
    let initializeEditionOutlineSpy: Spy;
    let setEditionOutlineSpy: Spy;
    let fetchEditionOutlineDataSpy: Spy;

    beforeAll(() => {
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});

        // Spies for service methods
        initializeEditionOutlineSpy = spyOn(EditionOutlineService, 'initializeEditionOutline').and.callThrough();
        setEditionOutlineSpy = spyOn(EditionOutlineService, 'setEditionOutline').and.callThrough();
        fetchEditionOutlineDataSpy = spyOn(EditionOutlineService as any, '_fetchEditionOutlineData').and.callThrough();
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
            expect(editionOutline).not.toBe([]);

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
            expect(editionOutline).not.toBe([]);

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
            const expectedOutline = new EditionOutline([
                {
                    series: '3',
                    sections: [
                        {
                            section: '4',
                            content: {
                                intro: { disabled: false },
                                complexTypes: {
                                    opus: [
                                        {
                                            complex: '',
                                            disabled: true,
                                        },
                                    ],
                                    mnr: [{ complex: '', disabled: true }],
                                },
                            },
                            disabled: false,
                        },
                        {
                            section: '5',
                            content: {
                                intro: { disabled: true },
                                complexTypes: {
                                    opus: [
                                        {
                                            complex: '',
                                            disabled: true,
                                        },
                                    ],
                                    mnr: [{ complex: '', disabled: true }],
                                },
                            },

                            disabled: true,
                        },
                    ],
                },
            ]);

            EditionOutlineService.setEditionOutline(expectedOutline.outline);

            const editionOutline = EditionOutlineService.getEditionOutline();

            expectToEqual(editionOutline, expectedOutline.outline);
        });

        it('... should do nothing if the edition outline is null', () => {
            const expectedOutline = new EditionOutline(null);

            EditionOutlineService.setEditionOutline(expectedOutline.outline);

            const editionOutline = EditionOutlineService.getEditionOutline();

            expect(editionOutline).toBeUndefined();
        });
    });

    describe('#getEditionSeriesById()', () => {
        it('... should have a method `getEditionSeriesById`', () => {
            expect(EditionOutlineService.getEditionSeriesById).toBeDefined();
        });

        it('... should return editionSeries with given id', () => {
            const expectedOutline: EditionOutlineSeries[] = [
                {
                    series: EDITION_ROUTE_CONSTANTS.SERIES_2,
                    sections: [
                        {
                            seriesParent: EDITION_ROUTE_CONSTANTS.SERIES_2,
                            section: EDITION_ROUTE_CONSTANTS.SECTION_5,
                            content: {
                                intro: { disabled: true },
                                complexTypes: { opus: [], mnr: [] },
                            },
                            disabled: true,
                        },
                        {
                            seriesParent: EDITION_ROUTE_CONSTANTS.SERIES_2,
                            section: EDITION_ROUTE_CONSTANTS.SECTION_4,
                            content: {
                                intro: { disabled: false },
                                complexTypes: { opus: [], mnr: [] },
                            },
                            disabled: false,
                        },
                    ],
                },
            ];
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
            const expectedOutline: EditionOutlineSeries[] = [
                {
                    series: EDITION_ROUTE_CONSTANTS.SERIES_2,
                    sections: [
                        {
                            seriesParent: EDITION_ROUTE_CONSTANTS.SERIES_2,
                            section: EDITION_ROUTE_CONSTANTS.SECTION_5,
                            content: {
                                intro: { disabled: true },
                                complexTypes: { opus: [], mnr: [] },
                            },
                            disabled: true,
                        },
                        {
                            seriesParent: EDITION_ROUTE_CONSTANTS.SERIES_2,
                            section: EDITION_ROUTE_CONSTANTS.SECTION_4,
                            content: {
                                intro: { disabled: false },
                                complexTypes: { opus: [], mnr: [] },
                            },
                            disabled: false,
                        },
                    ],
                },
            ];
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
            expect(editionOutline).not.toBe({});
            expect(Object.keys(editionOutline).length).toBeGreaterThan(0);
            expect(editionOutline.outline).toBeDefined();

            // Test for samples
            expectToEqual(editionOutline.outline[0].series, EDITION_ROUTE_CONSTANTS.SERIES_1);
            expectToEqual(editionOutline.outline[1].series, EDITION_ROUTE_CONSTANTS.SERIES_2);
            expectToEqual(editionOutline.outline[2].series, EDITION_ROUTE_CONSTANTS.SERIES_3);
        });
    });
});
