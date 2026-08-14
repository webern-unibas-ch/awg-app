import { isSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { EditionStateHelper } from '@testing/edition-state-helper';
import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex, EditionOutline, EditionOutlineSeries } from '@awg-views/edition-view/models';

import { EditionOutlineJsonData, EditionOutlineSeriesJsonData } from '../models/edition-outline.model';
import { EditionComplexesService } from './edition-complexes.service';
import { EditionOutlineService } from './edition-outline.service';

import * as jsonEditionOutline from 'assets/data/edition/edition-outline.json';

describe('EditionOutlineService (DONE)', () => {
    let service: EditionOutlineService;

    let editionComplexesService: EditionComplexesService;

    let initializeEditionOutlineSpy: Spy;

    let expectedRawOutlineData: EditionOutlineSeriesJsonData[];

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
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(service).toBeTruthy();
    });

    it('... should have signal `_rawOutlineDataSignal` to hold empty array', () => {
        expectToBe(isSignal((service as any)._rawOutlineDataSignal), true);

        expectToEqual((service as any)._rawOutlineDataSignal(), []);
    });

    describe('#editionOutline()', () => {
        it('... should have computed signal `getEditionOutline` to hold an empty array', () => {
            expectToBe(isSignal(service.editionOutline), true);

            expectToEqual(service.editionOutline(), []);
        });

        it('... should compute the edition outline from raw data', () => {
            const expectedOutline: EditionOutlineSeries[] = new EditionOutline(expectedRawOutlineData, id =>
                editionComplexesService.getEditionComplexById(id)
            ).outline;

            (service as any)._rawOutlineDataSignal.set(expectedRawOutlineData);

            const outline = service.editionOutline();

            expectToEqual(outline, expectedOutline);
        });

        it('... should filter out unknown complexes during instantiation via the computed signal', () => {
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

            (service as any)._rawOutlineDataSignal.set(rawOutlineDataWithUnknownComplex['editionOutline']);

            const outline = service.editionOutline();
            const section = outline[0].sections[0];

            expectToEqual(section.content.complexTypes.opus, []);
            expectToEqual(section.content.sectionComplexes, []);

            getComplexSpy.mockRestore();
        });

        describe('... should compute an empty array if the given raw edition data is', () => {
            it('... null', () => {
                (service as any)._rawOutlineDataSignal.set(null);

                const editionOutline = service.editionOutline();

                expectToEqual(editionOutline, []);
            });

            it('... undefined', () => {
                (service as any)._rawOutlineDataSignal.set(undefined);

                const editionOutline = service.editionOutline();

                expectToEqual(editionOutline, []);
            });

            it('... empty array', () => {
                (service as any)._rawOutlineDataSignal.set([]);

                const editionOutline = service.editionOutline();

                expectToEqual(editionOutline, []);
            });
        });
    });

    describe('EditionOutline (Model)', () => {
        const mockGetComplex = (): EditionComplex | undefined => undefined;

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
                expectToEqual((service as any)._rawOutlineDataSignal(), []);

                service.initializeEditionOutline();

                expectSpyCall(initializeEditionOutlineSpy, 1);

                expectToEqual(
                    (service as any)._rawOutlineDataSignal(),
                    jsonEditionOutline['editionOutline'] as EditionOutlineSeriesJsonData[]
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

                (service as any)._rawOutlineDataSignal.set(expectedRawOutlineData);

                const series = service.getEditionSeriesById(EDITION_ROUTE_CONSTANTS.SERIES_2.route);

                expectToEqual(series, expectedOutline[0]);
            });
        });

        describe('#getEditionSectionById()', () => {
            it('... should have a method `getEditionSectionById`', () => {
                expect(service.getEditionSectionById).toBeDefined();
            });

            it('... should return editionSection with given id', () => {
                (service as any)._rawOutlineDataSignal.set(expectedRawOutlineData);

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
    });
});
