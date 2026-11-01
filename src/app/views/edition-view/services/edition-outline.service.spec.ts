import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '../models/edition-complex.model';
import { EditionOutline, EditionOutlineSeries } from '../models/edition-outline.model';

import { EditionOutlineJsonData, EditionOutlineSeriesJsonData } from '../models/edition-outline.model';
import { EditionComplexesService } from './edition-complexes.service';
import { EditionOutlineService } from './edition-outline.service';

import * as jsonEditionOutline from 'assets/data/edition/edition-outline.json';

describe('EditionOutlineService (DONE)', () => {
    let service: EditionOutlineService;

    let editionComplexesService: EditionComplexesService;

    let initializeEditionOutlineSpy: Spy;

    let expectedRawOutlineData: EditionOutlineSeriesJsonData[];
    let rawOutlineDataWithParts: EditionOutlineSeriesJsonData[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EditionOutlineService],
        });

        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        service = TestBed.inject(EditionOutlineService);

        // Service spies
        initializeEditionOutlineSpy = vi.spyOn(service, 'initializeEditionOutline');
        vi.spyOn(editionComplexesService, 'editionComplexesList').mockReturnValue(
            EditionStateHelper.getComplexesList()
        );
        vi.spyOn(editionComplexesService, 'getEditionComplexById').mockImplementation((id: string) => {
            try {
                return EditionStateHelper.getComplex(id);
            } catch {
                return undefined;
            }
        });

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

        rawOutlineDataWithParts = [
            {
                series: '1',
                sections: [
                    {
                        section: '5',
                        content: {
                            intro: { disabled: false },
                            complexTypes: {
                                opus: [{ complex: 'op25', disabled: false }],
                                mnr: [{ complex: 'm317', disabled: true }],
                            },
                        },
                        disabled: false,
                    },
                ],
            },
        ];
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    it('... should have signal `_rawOutlineDataSignal` to hold empty array', () => {
        expectToBe(isSignal(service['_rawOutlineDataSignal']), true);

        expectToEqual(service['_rawOutlineDataSignal'](), []);
    });

    describe('... computed signal `editionOutline`', () => {
        it('... should have computed signal `editionOutline` to hold an empty array', () => {
            expectToBe(isSignal(service.editionOutline), true);

            expectToEqual(service.editionOutline(), []);
        });

        it('... should hold the edition outline of the raw data', () => {
            const expectedOutline: EditionOutlineSeries[] = new EditionOutline(expectedRawOutlineData, id =>
                editionComplexesService.getEditionComplexById(id)
            ).outline;

            service['_rawOutlineDataSignal'].set(expectedRawOutlineData);

            const outline = service.editionOutline();

            expectToEqual(outline, expectedOutline);
        });

        it('... should hold the edition outline without unknown complexes', () => {
            const getComplexSpy = vi
                .spyOn(editionComplexesService, 'getEditionComplexById')
                .mockReturnValueOnce(undefined);

            const rawOutlineDataWithUnknownComplex: EditionOutlineJsonData = {
                editionOutline: [
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
                ],
            };

            service['_rawOutlineDataSignal'].set(rawOutlineDataWithUnknownComplex.editionOutline);

            const outline = service.editionOutline();
            const section = outline[0].sections[0];

            expectToEqual(section.content.complexTypes.opus, []);
            expectToEqual(section.content.sectionComplexes, []);

            getComplexSpy.mockRestore();
        });

        it('... should hold the edition outline with the parts and composite complexes', () => {
            const opus = EditionStateHelper.getComplex('op25');
            const part = EditionStateHelper.getComplex('m317');
            vi.spyOn(editionComplexesService, 'getComplexParts').mockImplementation((id: string) =>
                id === 'op25' ? [part] : []
            );
            vi.spyOn(editionComplexesService, 'getCompositeComplexes').mockImplementation((id: string) =>
                id === 'm317' ? [{ compositeComplex: opus, partNumber: 1 }] : []
            );

            service['_rawOutlineDataSignal'].set(rawOutlineDataWithParts);

            const { opus: opusItems, mnr: mnrItems } = service.editionOutline()[0].sections[0].content.complexTypes;
            const partItem = opusItems[0].parts?.[0];
            const compositeItem = mnrItems[0].compositeComplexes?.[0];

            expectToBe(partItem?.complex.complexId.route, part.complexId.route);
            expectToBe(compositeItem?.complex.complexId.route, opus.complexId.route);
            expectToBe(compositeItem?.partNumber, 1);
        });

        describe('... should hold an empty array if the given raw edition data is', () => {
            it.each([
                { desc: 'empty array', rawData: [] },
                { desc: 'null', rawData: null },
                { desc: 'undefined', rawData: undefined },
            ])('... $desc', ({ rawData }) => {
                service['_rawOutlineDataSignal'].set(rawData as any);

                const editionOutline = service.editionOutline();

                expectToEqual(editionOutline, []);
            });
        });
    });

    describe('EditionOutline (Model)', () => {
        const mockGetComplex = (): EditionComplex | undefined => undefined;

        describe('... with parts and composite complexes', () => {
            const opus = new EditionComplex(
                { title: 'Test Opus', catalogueType: 'OPUS', catalogueNumber: '100' },
                { editors: [], lastModified: '---' },
                { series: '1', section: '5' }
            );
            const part1 = new EditionComplex(
                { title: 'Test Part 1', catalogueType: 'MNR', catalogueNumber: '1' },
                { editors: [], lastModified: '---' },
                { series: '1', section: '5' }
            );
            const part2 = new EditionComplex(
                { title: 'Test Part 2', catalogueType: 'MNR', catalogueNumber: '2' },
                { editors: [], lastModified: '---' },
                { series: '1', section: '5' }
            );
            const complexesList: Record<string, EditionComplex> = { op100: opus, m1: part1, m2: part2 };
            const rawData: EditionOutlineSeriesJsonData[] = [
                {
                    series: '1',
                    sections: [
                        {
                            section: '5',
                            content: {
                                intro: { disabled: false },
                                complexTypes: {
                                    opus: [{ complex: 'op100', disabled: true }],
                                    mnr: [{ complex: 'm1', disabled: false }],
                                },
                            },
                            disabled: false,
                        },
                    ],
                },
            ];
            const getLabeledRoute = (complex: EditionComplex) => ({
                label: complex.complexId.full,
                route: [complex.baseRoute, EDITION_ROUTE_CONSTANTS.EDITION_SHEETS.route],
            });

            let model: EditionOutline;

            beforeEach(() => {
                model = new EditionOutline(
                    rawData,
                    id => complexesList[id],
                    id => (id === 'op100' ? [part1, part2] : []),
                    id => (id === 'm1' ? [{ compositeComplex: opus, partNumber: 1 }] : [])
                );
            });

            it('... should hold the parts of a composite complex with their disabled flags', () => {
                const opusItem = model.outline[0].sections[0].content.complexTypes.opus[0];
                const expectedParts = [
                    { complex: part1, labeledRoute: getLabeledRoute(part1), disabled: false },
                    { complex: part2, labeledRoute: getLabeledRoute(part2), disabled: true },
                ];

                expectToEqual(opusItem.parts, expectedParts);
            });

            it('... should hold the composite complexes of a part with their disabled flags and part numbers', () => {
                const partItem = model.outline[0].sections[0].content.complexTypes.mnr[0];
                const expectedCompositeComplexes = [
                    { complex: opus, labeledRoute: getLabeledRoute(opus), disabled: true, partNumber: 1 },
                ];

                expectToEqual(partItem.compositeComplexes, expectedCompositeComplexes);
            });

            it('... should hold no parts and composite complexes for complexes without them', () => {
                const { opus: opusItems, mnr: mnrItems } = model.outline[0].sections[0].content.complexTypes;

                expect(opusItems[0].compositeComplexes).toBeUndefined();
                expect(mnrItems[0].parts).toBeUndefined();
            });
        });

        describe('... should return an empty outline array if ', () => {
            it('... input data is null', () => {
                const model = new EditionOutline(null, mockGetComplex);

                expectToEqual(model.outline, []);
            });

            it('... input data is undefined', () => {
                const model = new EditionOutline(undefined, mockGetComplex);

                expectToEqual(model.outline, []);
            });
        });
    });

    describe('METHODS', () => {
        describe('#initializeEditionOutline()', () => {
            it('... should have a method `initializeEditionOutline`', () => {
                expect(service.initializeEditionOutline).toBeDefined();
            });

            it('... should set the `_rawOutlineDataSignal`', () => {
                expectToEqual(service['_rawOutlineDataSignal'](), []);

                service.initializeEditionOutline();

                expectSpyCall(initializeEditionOutlineSpy, 1);

                expectToEqual(
                    service['_rawOutlineDataSignal'](),
                    jsonEditionOutline.editionOutline as EditionOutlineSeriesJsonData[]
                );
            });
        });

        describe('#getEditionSeriesById()', () => {
            it('... should have a method `getEditionSeriesById`', () => {
                expect(service.getEditionSeriesById).toBeDefined();
            });

            it('... should return editionSeries with given id', () => {
                const expectedOutline: EditionOutlineSeries[] = new EditionOutline(expectedRawOutlineData, id =>
                    editionComplexesService.getEditionComplexById(id)
                ).outline;

                service['_rawOutlineDataSignal'].set(expectedRawOutlineData);

                const series = service.getEditionSeriesById(EDITION_ROUTE_CONSTANTS.SERIES_2.route);

                expectToEqual(series, expectedOutline[0]);
            });
        });

        describe('#getEditionSectionById()', () => {
            it('... should have a method `getEditionSectionById`', () => {
                expect(service.getEditionSectionById).toBeDefined();
            });

            it('... should return editionSection with given id', () => {
                service['_rawOutlineDataSignal'].set(expectedRawOutlineData);

                const expectedOutline: EditionOutlineSeries[] = new EditionOutline(expectedRawOutlineData, id =>
                    editionComplexesService.getEditionComplexById(id)
                ).outline;

                expectedOutline[0].sections.forEach(section => {
                    const expectedSection = section;

                    const getSection = service.getEditionSectionById(
                        EDITION_ROUTE_CONSTANTS.SERIES_2.route,
                        section.section.route
                    );

                    expectToEqual(getSection, expectedSection);
                });
            });
        });

        describe('#getEditionOutlineComplexItem()', () => {
            it('... should have a method `getEditionOutlineComplexItem`', () => {
                expect(service.getEditionOutlineComplexItem).toBeDefined();
            });

            it('... should return the outline item of a given complex', () => {
                service['_rawOutlineDataSignal'].set(rawOutlineDataWithParts);
                const complex = EditionStateHelper.getComplex('m317');

                const item = service.getEditionOutlineComplexItem(complex);

                expectToBe(item?.complex.complexId.route, complex.complexId.route);
                expectToBe(item?.disabled, true);
            });

            it('... should return undefined for a complex missing from the outline', () => {
                service['_rawOutlineDataSignal'].set(rawOutlineDataWithParts);
                const complex = EditionStateHelper.getComplex('op12');

                const item = service.getEditionOutlineComplexItem(complex);

                expect(item).toBeUndefined();
            });
        });
    });
});
