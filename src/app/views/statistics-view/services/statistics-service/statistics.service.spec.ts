import { TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { expectSpyCall, expectToBe } from '@testing/expect-helper';

import { EditionOutlineSeries } from '@awg-app/views/edition-view/models';

import { EditionOutlineComplexTypes } from '@awg-app/views/edition-view/models/edition-outline.model';
import { Statistics, StatisticsSectionBreakdown, StatisticsSeriesBreakdown } from '../../models';
import { StatisticsService } from './statistics.service';

// Helper function to create a mock complex item
function createOutlineMock(seriesRoute: string, sectionsInput: any[]) {
    return [
        {
            series: { route: seriesRoute, full: `Series ${seriesRoute}`, short: seriesRoute },
            sections: sectionsInput.map(sec => ({
                section: { short: sec.short },
                disabled: sec.disabled ?? false,
                content: {
                    complexTypes: {
                        opus: (sec.opus ?? []).map((d: boolean) => ({
                            disabled: d,
                            complex: { complexId: { route: '/op' } },
                        })),
                        mnr: (sec.mnr ?? []).map((d: boolean) => ({
                            disabled: d,
                            complex: { complexId: { route: '/m' } },
                        })),
                        mnrX: (sec.mnrX ?? []).map((d: boolean) => ({
                            disabled: d,
                            complex: { complexId: { route: '/mx' } },
                        })),
                    },
                },
            })),
        },
    ] as unknown as EditionOutlineSeries[];
}

describe('StatisticsService', () => {
    let service: StatisticsService;

    let incrementSpy: Spy;

    let emptyOutline: EditionOutlineSeries[];
    let inactiveSeriesOutline: EditionOutlineSeries[];
    let singleSeriesSampleOutline: EditionOutlineSeries[];
    let sectionAverageOutline: EditionOutlineSeries[];

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.inject(StatisticsService);

        // Test data
        emptyOutline = [] as EditionOutlineSeries[];

        inactiveSeriesOutline = createOutlineMock('3', [
            { short: '1', disabled: true, opus: [true, true], mnr: [true] },
        ]);

        singleSeriesSampleOutline = createOutlineMock('1', [
            { short: '5', disabled: false, opus: [false, true], mnr: [false] },
        ]);

        sectionAverageOutline = createOutlineMock('2', [
            { short: '1', disabled: true },
            { short: '2A', disabled: false, opus: [false, false] },
            { short: '3', disabled: true },
        ]);

        // Spies
        incrementSpy = vi.spyOn(service as any, '_incrementComplexCounters');
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
                activeComplexes: number;
                progressRate: number;
            }
        ): void => {
            expectToBe(stats.totalSeries, summary.totalSeries);
            expectToBe(stats.activeSeries, summary.activeSeries);
            expectToBe(stats.totalSections, summary.totalSections);
            expectToBe(stats.activeSections, summary.activeSections);
            expectToBe(stats.totalComplexes, summary.totalComplexes);
            expectToBe(stats.activeComplexes, summary.activeComplexes);
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
                activeComplexes: 0,
                progressRate: 0,
            });
        });

        it('... should calculate correct statistics for sample data', () => {
            const stats = service.getStatisticsFromOutline(singleSeriesSampleOutline);
            const seriesBreakdown = stats.seriesBreakdown;
            const sectionBreakdown = stats.seriesBreakdown[0].sectionBreakdown;

            expectSummary(stats, {
                totalSeries: 1,
                activeSeries: 1,
                totalSections: 1,
                activeSections: 1,
                totalComplexes: 3,
                activeComplexes: 2,
                progressRate: 67,
            });

            // Test section breakdown
            expect(seriesBreakdown).toBeDefined();
            expectToBe(seriesBreakdown.length, 1);

            expect(sectionBreakdown).toBeDefined();
            expectToBe(sectionBreakdown.length, 1);

            expectToBe(sectionBreakdown[0].section, '5');
            expectToBe(sectionBreakdown[0].totalComplexes, 3);
            expectToBe(sectionBreakdown[0].activeComplexes, 2);
            expectToBe(sectionBreakdown[0].progressRate, 67);

            // Test series activity rate (should match single section rate)
            expectToBe(seriesBreakdown[0].progressRate, 67);
        });

        it('... should calculate series progress as average of all sections', () => {
            const stats = service.getStatisticsFromOutline(sectionAverageOutline);

            // Section 1: 0% (disabled, no complexes)
            // Section 2A: 100% (2 complexes, all active)
            // Section 3: 0% (disabled, no complexes)
            // Series average: (0 + 100 + 0) / 3 = 33%

            expectToBe(stats.seriesBreakdown[0].progressRate, 33);
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[0].progressRate, 0);
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[1].progressRate, 100);
            expectToBe(stats.seriesBreakdown[0].sectionBreakdown[2].progressRate, 0);
        });

        it('... should not increment activeSeries if a series has no active content', () => {
            const stats = service.getStatisticsFromOutline(inactiveSeriesOutline);

            expectToBe(stats.totalSeries, 1);
            expectToBe(stats.activeSeries, 0);

            expectToBe(stats.totalComplexes, 3);
            expectToBe(stats.activeComplexes, 0);
            expectToBe(stats.progressRate, 0);
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

            it('... active is 0', () => {
                expectToBe((service as any)._calculateProgressRate(0, 10), 0);
            });

            it('... both active and total are 0', () => {
                expectToBe((service as any)._calculateProgressRate(0, 0), 0);
            });
        });

        it('... should return 100 when active equals total', () => {
            expectToBe((service as any)._calculateProgressRate(5, 5), 100);
        });

        it('... should return the rounded percentage of active over total', () => {
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

        it('... should call registerComplex on each target with given type and activity', () => {
            const targetA = { registerComplex: vi.fn() };
            const targetB = { registerComplex: vi.fn() };

            (service as any)._incrementComplexCounters([targetA, targetB], 'opus', true);

            expectSpyCall(targetA.registerComplex, 1, ['opus', true]);
            expectSpyCall(targetB.registerComplex, 1, ['opus', true]);
        });

        it('... should pass isActive as false when complex is not active', () => {
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
        let stats: Statistics;
        let seriesStats: StatisticsSeriesBreakdown;
        let sectionStats: StatisticsSectionBreakdown;

        beforeEach(() => {
            stats = new Statistics();
            seriesStats = new StatisticsSeriesBreakdown('TestSeries');
            sectionStats = new StatisticsSectionBreakdown('TestSection', false);

            vi.spyOn(stats, 'registerComplex');
            vi.spyOn(seriesStats, 'registerComplex');
            vi.spyOn(sectionStats, 'registerComplex');
        });

        it('... should have a method `_processComplexes`', () => {
            expect((service as any)._processComplexes).toBeDefined();
        });

        it('... should do nothing if complexTypes is undefined', () => {
            (service as any)._processComplexes(stats, seriesStats, sectionStats, undefined);

            expectToBe(stats.totalComplexes, 0);
            expectToBe(seriesStats.totalComplexes, 0);
            expectToBe(sectionStats.totalComplexes, 0);

            expectSpyCall(incrementSpy, 0);
        });

        it('... should correctly count total and active opus complexes', () => {
            const complexTypes: EditionOutlineComplexTypes = {
                opus: [
                    { disabled: false, complex: { complexId: { route: '/op1' } } },
                    { disabled: false, complex: { complexId: { route: '/op2' } } },
                    { disabled: true, complex: { complexId: { route: '/op3' } } },
                ],
                mnr: [],
            } as EditionOutlineComplexTypes;

            (service as any)._processComplexes(stats, seriesStats, sectionStats, complexTypes);

            expectToBe(stats.totalComplexes, 3);
            expectToBe(stats.complexBreakdown.opus, 3);
            expectToBe(stats.complexBreakdown.mnr, 0);
            expectToBe(stats.complexBreakdown.mnrX, 0);

            expectToBe(stats.activeComplexes, 2);
            expectToBe(stats.activeComplexBreakdown.opus, 2);
            expectToBe(stats.activeComplexBreakdown.mnr, 0);
            expectToBe(stats.activeComplexBreakdown.mnrX, 0);
        });

        it('... should correctly count and separate mnr and mnrX complexes', () => {
            const complexTypes: EditionOutlineComplexTypes = {
                opus: [],
                mnr: [
                    { disabled: false, complex: { complexId: { route: '/m30' } } },
                    { disabled: false, complex: { complexId: { route: '/mx402' } } },
                ],
            } as EditionOutlineComplexTypes;

            (service as any)._processComplexes(stats, seriesStats, sectionStats, complexTypes);

            expectToBe(stats.totalComplexes, 2);
            expectToBe(stats.complexBreakdown.opus, 0);
            expectToBe(stats.complexBreakdown.mnr, 1);
            expectToBe(stats.complexBreakdown.mnrX, 1);

            expectToBe(stats.activeComplexes, 2);
            expectToBe(stats.activeComplexBreakdown.opus, 0);
            expectToBe(stats.activeComplexBreakdown.mnr, 1);
            expectToBe(stats.activeComplexBreakdown.mnrX, 1);
        });

        it('... should trigger the increment counters with correct parameters for all complex types', () => {
            const complexTypes: EditionOutlineComplexTypes = {
                opus: [
                    { disabled: false, complex: { complexId: { route: '/op1' } } },
                    { disabled: false, complex: { complexId: { route: '/op2' } } },
                    { disabled: true, complex: { complexId: { route: '/op3' } } },
                ],
                mnr: [
                    { disabled: false, complex: { complexId: { route: '/m30' } } },
                    { disabled: false, complex: { complexId: { route: '/mx402' } } },
                ],
            } as EditionOutlineComplexTypes;

            (service as any)._processComplexes(stats, seriesStats, sectionStats, complexTypes);

            const expectedTotalCalls = complexTypes.opus.length + complexTypes.mnr.length;
            expectSpyCall(incrementSpy, expectedTotalCalls);

            complexTypes.opus.forEach((complex, index) => {
                expect(incrementSpy).toHaveBeenNthCalledWith(
                    index + 1,
                    [stats, seriesStats, sectionStats],
                    'opus',
                    !complex.disabled
                );
            });

            complexTypes.mnr.forEach((complex, index) => {
                const expectedType = complex.complex.complexId.route.includes('/mx') ? 'mnrX' : 'mnr';

                // Calls for opus complexes come first, then mnr complexes
                const callNumber = complexTypes.opus.length + index + 1;

                expect(incrementSpy).toHaveBeenNthCalledWith(
                    callNumber,
                    [stats, seriesStats, sectionStats],
                    expectedType,
                    !complex.disabled
                );
            });
        });
    });
});
