import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe, expectToEqual } from '@testing/expect-helper';

import { EditionOutlineComplexItem } from '@awg-app/views/edition-view/models';

import { EditionStatisticsService } from './edition-statistics.service';

describe('EditionStatisticsService', () => {
    let service: EditionStatisticsService;

    let incrementSpy: Spy;
    let processComplexesByTypeSpy: Spy;

    let emptyOutline: any;
    let singleSeriesSampleOutline: any;
    let sectionAverageOutline: any;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(EditionStatisticsService);

        // Test data
        emptyOutline = [] as any;

        singleSeriesSampleOutline = [
            {
                series: { route: '1', full: 'Series 1' },
                sections: [
                    {
                        section: { short: '5' },
                        disabled: false,
                        content: {
                            complexTypes: {
                                opus: [
                                    { disabled: false, complex: { complexId: { route: '/op25' } } },
                                    { disabled: true, complex: { complexId: { route: '/op26' } } },
                                ],
                                mnr: [{ disabled: false, complex: { complexId: { route: '/m28' } } }],
                            },
                        },
                    },
                ],
            },
        ] as any;

        sectionAverageOutline = [
            {
                series: { route: '2', full: 'Series 2' },
                sections: [
                    {
                        section: { short: '1' },
                        disabled: true,
                        content: {
                            complexTypes: { opus: [], mnr: [] },
                        },
                    },
                    {
                        section: { short: '2A' },
                        disabled: false,
                        content: {
                            complexTypes: {
                                opus: [
                                    { disabled: false, complex: { complexId: { route: '/op27' } } },
                                    { disabled: false, complex: { complexId: { route: '/op28' } } },
                                ],
                                mnr: [],
                            },
                        },
                    },
                    {
                        section: { short: '3' },
                        disabled: true,
                        content: {
                            complexTypes: { opus: [], mnr: [] },
                        },
                    },
                ],
            },
        ] as any;

        // Spies
        incrementSpy = vi.spyOn(service as any, '_incrementComplexCounters');
        processComplexesByTypeSpy = vi.spyOn(service as any, '_processComplexesByType');
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('#getStatisticsFromOutline()', () => {
        const expectSummary = (
            stats: any,
            summary: {
                totalSeries: number;
                activeSeries: number;
                totalSections: number;
                activeSections: number;
                totalComplexes: number;
                availableComplexes: number;
                progressRate: number;
            }
        ): void => {
            expectToBe(stats.totalSeries, summary.totalSeries);
            expectToBe(stats.activeSeries, summary.activeSeries);
            expectToBe(stats.totalSections, summary.totalSections);
            expectToBe(stats.activeSections, summary.activeSections);
            expectToBe(stats.totalComplexes, summary.totalComplexes);
            expectToBe(stats.availableComplexes, summary.availableComplexes);
            expectToBe(stats.progressRate, summary.progressRate);
        };

        it('... should have a method `getStatisticsFromOutline`', () => {
            expect(service.getStatisticsFromOutline).toBeDefined();
        });

        it('... should calculate correct statistics for empty data', () => {
            const stats = service.getStatisticsFromOutline(emptyOutline);

            expectSummary(stats, {
                totalSeries: 0,
                activeSeries: 0,
                totalSections: 0,
                activeSections: 0,
                totalComplexes: 0,
                availableComplexes: 0,
                progressRate: 0,
            });
        });

        it('... should calculate correct statistics for sample data', () => {
            const stats = service.getStatisticsFromOutline(singleSeriesSampleOutline);

            expectSummary(stats, {
                totalSeries: 1,
                activeSeries: 1,
                totalSections: 1,
                activeSections: 1,
                totalComplexes: 3,
                availableComplexes: 2,
                progressRate: 67,
            });

            // Test section breakdown
            expect(stats.seriesBreakdown).toBeDefined();
            expectToBe(stats.seriesBreakdown.length, 1);

            expect(stats.seriesBreakdown[0].sectionBreakdown).toBeDefined();
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown.length, 1);

            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[0].section, '5');
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[0].totalComplexes, 3);
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[0].availableComplexes, 2);
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[0].progressRate, 67);

            // Test series availability rate (should match single section rate)
            expectToBe(stats.seriesBreakdown[0].progressRate, 67);
        });

        it('... should calculate series progress as average of all sections', () => {
            const stats = service.getStatisticsFromOutline(sectionAverageOutline);

            // Section 1: 0% (disabled, no complexes)
            // Section 2A: 100% (2 complexes, all available)
            // Section 3: 0% (disabled, no complexes)
            // Series average: (0 + 100 + 0) / 3 = 33%

            expectToBe(stats.seriesBreakdown[0].progressRate, 33);
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[0].progressRate, 0);
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[1].progressRate, 100);
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[2].progressRate, 0);
        });
    });

    describe('#_calculateProgressRate()', () => {
        it('... should have a method `_calculateProgressRate`', () => {
            expect((service as any)._calculateProgressRate).toBeDefined();
        });

        describe('... should return 0 when ...', () => {
            it('... total is 0', () => {
                expectToBe((service as any)._calculateProgressRate(10, 0), 0);
            });

            it('... available is 0', () => {
                expectToBe((service as any)._calculateProgressRate(0, 10), 0);
            });

            it('... both available and total are 0', () => {
                expectToBe((service as any)._calculateProgressRate(0, 0), 0);
            });
        });

        it('... should return 100 when available equals total', () => {
            expectToBe((service as any)._calculateProgressRate(5, 5), 100);
        });

        it('... should return the rounded percentage of available over total', () => {
            expectToBe((service as any)._calculateProgressRate(1, 3), 33);
            expectToBe((service as any)._calculateProgressRate(2, 3), 67);
            expectToBe((service as any)._calculateProgressRate(1, 4), 25);
        });
    });

    describe('#_calculateCombinedProgressRate()', () => {
        it('... should have a method `_calculateCombinedProgressRate`', () => {
            expect((service as any)._calculateCombinedProgressRate).toBeDefined();
        });

        describe('... should return 0 when ...', () => {
            it('... the input array is empty', () => {
                expectToBe((service as any)._calculateCombinedProgressRate([]), 0);
            });

            it('... all values in the array are 0', () => {
                expectToBe((service as any)._calculateCombinedProgressRate([0, 0, 0]), 0);
            });
        });

        it('... should return the single value for a one-element array', () => {
            expectToBe((service as any)._calculateCombinedProgressRate([75]), 75);
        });

        it('... should return the rounded average for multiple values', () => {
            expectToBe((service as any)._calculateCombinedProgressRate([0, 100]), 50);
            expectToBe((service as any)._calculateCombinedProgressRate([0, 100, 0]), 33);
            expectToBe((service as any)._calculateCombinedProgressRate([33, 67, 100]), 67);
        });
    });

    describe('#_incrementComplexCounters()', () => {
        it('... should have a method `_incrementComplexCounters`', () => {
            expect((service as any)._incrementComplexCounters).toBeDefined();
        });

        it('... should call registerComplex on each target with given type and availability', () => {
            const targetA = { registerComplex: vi.fn() };
            const targetB = { registerComplex: vi.fn() };

            (service as any)._incrementComplexCounters([targetA, targetB], 'opus', true);

            expectSpyCall(targetA.registerComplex, 1, ['opus', true]);
            expectSpyCall(targetB.registerComplex, 1, ['opus', true]);
        });

        it('... should pass isAvailable as false when complex is not available', () => {
            const target = { registerComplex: vi.fn() };

            (service as any)._incrementComplexCounters([target], 'mnr', false);

            expectSpyCall(target.registerComplex, 1, ['mnr', false]);
        });
    });

    describe('#_isMnrX()', () => {
        it('... should have a method `_isMnrX`', () => {
            expect((service as any)._isMnrX).toBeDefined();
        });

        describe('... should return true when ...', () => {
            it('... route starts with `/mx`', () => {
                const complex = { complex: { complexId: { route: '/mx403' } } };
                expectToBe((service as any)._isMnrX(complex), true);
            });

            it('... route is exactly `/mx`', () => {
                const complex = { complex: { complexId: { route: '/mx' } } };
                expectToBe((service as any)._isMnrX(complex), true);
            });
        });

        describe('... should return false when ...', () => {
            it('... route does not start with `/mx`', () => {
                const complex = { complex: { complexId: { route: '/m403' } } };
                expectToBe((service as any)._isMnrX(complex), false);
            });

            it('... route is undefined', () => {
                const complex = { complex: { complexId: {} } };
                expectToBe((service as any)._isMnrX(complex), false);
            });

            it('... complex object is missing complexId', () => {
                const complex = { complex: {} };
                expectToBe((service as any)._isMnrX(complex), false);
            });

            it('... complex object is undefined', () => {
                expectToBe((service as any)._isMnrX(undefined), false);
            });
        });
    });

    describe('#_processComplexes()', () => {
        let stats: any;
        let seriesStats: any;
        let sectionStats: any;

        beforeEach(() => {
            stats = { registerComplex: vi.fn() };
            seriesStats = { registerComplex: vi.fn() };
            sectionStats = { registerComplex: vi.fn() };
        });

        it('... should have a method `_processComplexes`', () => {
            expect((service as any)._processComplexes).toBeDefined();
        });

        describe('... should return false when ...', () => {
            it('... both opus and mnr arrays are empty', () => {
                const result = (service as any)._processComplexes(stats, seriesStats, sectionStats, {
                    opus: [],
                    mnr: [],
                });

                expectToBe(result, false);
            });

            it('... both opus and mnr arrays are undefined', () => {
                const result = (service as any)._processComplexes(stats, seriesStats, sectionStats, {
                    opus: undefined,
                    mnr: undefined,
                });

                expectToBe(result, false);
                expect(incrementSpy).not.toHaveBeenCalled();
            });

            it('... opus is undefined and mnr is empty', () => {
                const result = (service as any)._processComplexes(stats, seriesStats, sectionStats, {
                    opus: undefined,
                    mnr: [],
                });

                expectToBe(result, false);
                expect(incrementSpy).not.toHaveBeenCalled();
            });

            it('... opus is empty and mnr is undefined', () => {
                const result = (service as any)._processComplexes(stats, seriesStats, sectionStats, {
                    opus: [],
                    mnr: undefined,
                });

                expectToBe(result, false);
                expect(incrementSpy).not.toHaveBeenCalled();
            });
        });

        describe('... should return true and trigger `processComplexesByType` when ...', () => {
            it('... only opus complexes are present', () => {
                const expectedOpusComplexes = [{ disabled: false, complex: { complexId: { route: '/op25' } } }];
                const expectedComplexTypes = { opus: expectedOpusComplexes, mnr: [] };

                const result = (service as any)._processComplexes(
                    stats,
                    seriesStats,
                    sectionStats,
                    expectedComplexTypes
                );

                expectToBe(result, true);
                expectSpyCall(processComplexesByTypeSpy, 2);

                const callArgs = processComplexesByTypeSpy.mock.calls;

                expectToBe(callArgs[0][0], stats);
                expectToBe(callArgs[0][1], seriesStats);
                expectToBe(callArgs[0][2], sectionStats);
                expectToBe(callArgs[0][3], expectedComplexTypes.opus);
                expectToEqual(callArgs[0][4], expect.any(Function));

                expectToBe(callArgs[1][0], stats);
                expectToBe(callArgs[1][1], seriesStats);
                expectToBe(callArgs[1][2], sectionStats);
                expectToBe(callArgs[1][3], expectedComplexTypes.mnr);
                expectToEqual(callArgs[1][4], expect.any(Function));
            });

            it('... only disabled opus complexes are present', () => {
                const expectedOpusComplexes = [{ disabled: true, complex: { complexId: { route: '/op26' } } }];
                const expectedComplexTypes = { opus: expectedOpusComplexes, mnr: [] };

                const result = (service as any)._processComplexes(
                    stats,
                    seriesStats,
                    sectionStats,
                    expectedComplexTypes
                );

                expectToBe(result, true);
                expectSpyCall(processComplexesByTypeSpy, 2);

                const callArgs = processComplexesByTypeSpy.mock.calls;

                expectToBe(callArgs[0][0], stats);
                expectToBe(callArgs[0][1], seriesStats);
                expectToBe(callArgs[0][2], sectionStats);
                expectToBe(callArgs[0][3], expectedComplexTypes.opus);
                expectToEqual(callArgs[0][4], expect.any(Function));

                expectToBe(callArgs[1][0], stats);
                expectToBe(callArgs[1][1], seriesStats);
                expectToBe(callArgs[1][2], sectionStats);
                expectToBe(callArgs[1][3], expectedComplexTypes.mnr);
                expectToEqual(callArgs[1][4], expect.any(Function));
            });

            it('... only mnr complexes are present', () => {
                const expectedMnrComplexes = [{ disabled: false, complex: { complexId: { route: '/m28' } } }];
                const expectedComplexTypes = { opus: [], mnr: expectedMnrComplexes };

                const result = (service as any)._processComplexes(
                    stats,
                    seriesStats,
                    sectionStats,
                    expectedComplexTypes
                );

                expectToBe(result, true);
                expectSpyCall(processComplexesByTypeSpy, 2);

                const callArgs = processComplexesByTypeSpy.mock.calls;

                expectToBe(callArgs[0][0], stats);
                expectToBe(callArgs[0][1], seriesStats);
                expectToBe(callArgs[0][2], sectionStats);
                expectToBe(callArgs[0][3], expectedComplexTypes.opus);
                expectToEqual(callArgs[0][4], expect.any(Function));

                expectToBe(callArgs[1][0], stats);
                expectToBe(callArgs[1][1], seriesStats);
                expectToBe(callArgs[1][2], sectionStats);
                expectToBe(callArgs[1][3], expectedComplexTypes.mnr);
                expectToEqual(callArgs[1][4], expect.any(Function));
            });

            it('... only disabled mnr complexes are present', () => {
                const expectedMnrComplexes = [{ disabled: true, complex: { complexId: { route: '/m29' } } }];
                const expectedComplexTypes = { opus: [], mnr: expectedMnrComplexes };

                const result = (service as any)._processComplexes(
                    stats,
                    seriesStats,
                    sectionStats,
                    expectedComplexTypes
                );

                expectToBe(result, true);
                expectSpyCall(processComplexesByTypeSpy, 2);

                const callArgs = processComplexesByTypeSpy.mock.calls;

                expectToBe(callArgs[0][0], stats);
                expectToBe(callArgs[0][1], seriesStats);
                expectToBe(callArgs[0][2], sectionStats);
                expectToBe(callArgs[0][3], expectedComplexTypes.opus);
                expectToEqual(callArgs[0][4], expect.any(Function));

                expectToBe(callArgs[1][0], stats);
                expectToBe(callArgs[1][1], seriesStats);
                expectToBe(callArgs[1][2], sectionStats);
                expectToBe(callArgs[1][3], expectedComplexTypes.mnr);
                expectToEqual(callArgs[1][4], expect.any(Function));
            });

            it('... mnr complexes are classified as `mnrX` when route starts with `/mx`', () => {
                const expectedMnrComplexes = [{ disabled: false, complex: { complexId: { route: '/mx401' } } }];
                const expectedComplexTypes = { opus: [], mnr: expectedMnrComplexes };

                const result = (service as any)._processComplexes(
                    stats,
                    seriesStats,
                    sectionStats,
                    expectedComplexTypes
                );

                expectToBe(result, true);
                expectSpyCall(processComplexesByTypeSpy, 2);

                const callArgs = processComplexesByTypeSpy.mock.calls;

                expectToBe(callArgs[0][0], stats);
                expectToBe(callArgs[0][1], seriesStats);
                expectToBe(callArgs[0][2], sectionStats);
                expectToBe(callArgs[0][3], expectedComplexTypes.opus);
                expectToEqual(callArgs[0][4], expect.any(Function));

                expectToBe(callArgs[1][0], stats);
                expectToBe(callArgs[1][1], seriesStats);
                expectToBe(callArgs[1][2], sectionStats);
                expectToBe(callArgs[1][3], expectedComplexTypes.mnr);
                expectToEqual(callArgs[1][4], expect.any(Function));
            });

            it('... mnr complexes are classified as `mnr` when route does not start with `/mx`', () => {
                const expectedMnrComplexes = [{ disabled: true, complex: { complexId: { route: '/m28' } } }];
                const expectedComplexTypes = { opus: [], mnr: expectedMnrComplexes };

                const result = (service as any)._processComplexes(
                    stats,
                    seriesStats,
                    sectionStats,
                    expectedComplexTypes
                );

                expectToBe(result, true);
                expectSpyCall(processComplexesByTypeSpy, 2);

                const callArgs = processComplexesByTypeSpy.mock.calls;

                expectToBe(callArgs[0][0], stats);
                expectToBe(callArgs[0][1], seriesStats);
                expectToBe(callArgs[0][2], sectionStats);
                expectToBe(callArgs[0][3], expectedComplexTypes.opus);
                expectToEqual(callArgs[0][4], expect.any(Function));

                expectToBe(callArgs[1][0], stats);
                expectToBe(callArgs[1][1], seriesStats);
                expectToBe(callArgs[1][2], sectionStats);
                expectToBe(callArgs[1][3], expectedComplexTypes.mnr);
                expectToEqual(callArgs[1][4], expect.any(Function));
            });

            it('... both opus and mnr groups are processed together', () => {
                const expectedOpusComplexes = [{ disabled: false, complex: { complexId: { route: '/op25' } } }];
                const expectedMnrComplexes = [
                    { disabled: false, complex: { complexId: { route: '/m28' } } },
                    { disabled: true, complex: { complexId: { route: '/mx401' } } },
                ];
                const expectedComplexTypes = { opus: expectedOpusComplexes, mnr: expectedMnrComplexes };

                const result = (service as any)._processComplexes(
                    stats,
                    seriesStats,
                    sectionStats,
                    expectedComplexTypes
                );

                expectToBe(result, true);
                expectSpyCall(processComplexesByTypeSpy, 2);

                const callArgs = processComplexesByTypeSpy.mock.calls;

                expectToBe(callArgs[0][0], stats);
                expectToBe(callArgs[0][1], seriesStats);
                expectToBe(callArgs[0][2], sectionStats);
                expectToBe(callArgs[0][3], expectedComplexTypes.opus);
                expectToEqual(callArgs[0][4], expect.any(Function));

                expectToBe(callArgs[1][0], stats);
                expectToBe(callArgs[1][1], seriesStats);
                expectToBe(callArgs[1][2], sectionStats);
                expectToBe(callArgs[1][3], expectedComplexTypes.mnr);
                expectToEqual(callArgs[1][4], expect.any(Function));
            });
        });
    });

    describe('#_processComplexesByType()', () => {
        it('... should have a method `_processComplexesByType`', () => {
            expect((service as any)._processComplexesByType).toBeDefined();
        });

        describe('... should return false when ...', () => {
            it('... complexes array is undefined', () => {
                const target = { registerComplex: vi.fn() };
                expectToBe(
                    (service as any)._processComplexesByType(target, target, target, undefined, () => 'opus'),
                    false
                );
            });

            it('... complexes array is empty', () => {
                const target = { registerComplex: vi.fn() };
                expectToBe(
                    (service as any)._processComplexesByType(target, target, target, [], () => 'opus'),
                    false
                );
            });
        });
        describe('... should return true and trigger `_incrementComplexCounters` when ...', () => {
            let stats: any;
            let seriesStats: any;
            let sectionStats: any;

            beforeEach(() => {
                stats = { registerComplex: vi.fn() };
                seriesStats = { registerComplex: vi.fn() };
                sectionStats = { registerComplex: vi.fn() };
            });

            it('... opus complexes are provided', () => {
                const complexes = [
                    { complex: { complexId: { route: '/op25' } }, disabled: false },
                    { complex: { complexId: { route: '/op26' } }, disabled: true },
                ];

                const result = (service as any)._processComplexesByType(
                    stats,
                    seriesStats,
                    sectionStats,
                    complexes,
                    () => 'opus'
                );

                expectToBe(result, true);

                expectSpyCall(incrementSpy, 2);
                expect(incrementSpy).toHaveBeenCalledWith([stats, seriesStats, sectionStats], 'opus', true);
                expect(incrementSpy).toHaveBeenCalledWith([stats, seriesStats, sectionStats], 'opus', false);
            });

            it('... mnr complexes are provided', () => {
                const complexes = [
                    { complex: { complexId: { route: '/m28' } }, disabled: false },
                    { complex: { complexId: { route: '/m29' } }, disabled: true },
                ];

                const result = (service as any)._processComplexesByType(
                    stats,
                    seriesStats,
                    sectionStats,
                    complexes,
                    () => 'mnr'
                );

                expectToBe(result, true);

                expectSpyCall(incrementSpy, 2);
                expect(incrementSpy).toHaveBeenCalledWith([stats, seriesStats, sectionStats], 'mnr', true);
                expect(incrementSpy).toHaveBeenCalledWith([stats, seriesStats, sectionStats], 'mnr', false);
            });

            it('... when mnrX complexes are provided', () => {
                const complexes = [
                    { complex: { complexId: { route: '/mx28' } }, disabled: false },
                    { complex: { complexId: { route: '/mx29' } }, disabled: true },
                ];

                const result = (service as any)._processComplexesByType(
                    stats,
                    seriesStats,
                    sectionStats,
                    complexes,
                    () => 'mnrX'
                );

                expectToBe(result, true);

                expectSpyCall(incrementSpy, 2);
                expect(incrementSpy).toHaveBeenCalledWith([stats, seriesStats, sectionStats], 'mnrX', true);
                expect(incrementSpy).toHaveBeenCalledWith([stats, seriesStats, sectionStats], 'mnrX', false);
            });

            it('... should use getComplexType resolver to determine complex type', () => {
                const complexes = [
                    { complex: { complexId: { route: '/m28' } }, disabled: false },
                    { complex: { complexId: { route: '/mx29' } }, disabled: true },
                ];

                const result = (service as any)._processComplexesByType(
                    stats,
                    seriesStats,
                    sectionStats,
                    complexes,
                    (complex: EditionOutlineComplexItem) =>
                        complex.complex.complexId.route.startsWith('/mx') ? 'mnrX' : 'mnr'
                );

                expectToBe(result, true);

                expectSpyCall(incrementSpy, 2);
                expect(incrementSpy).toHaveBeenCalledWith([stats, seriesStats, sectionStats], 'mnr', true);
                expect(incrementSpy).toHaveBeenCalledWith([stats, seriesStats, sectionStats], 'mnrX', false);
            });
        });
    });
});
