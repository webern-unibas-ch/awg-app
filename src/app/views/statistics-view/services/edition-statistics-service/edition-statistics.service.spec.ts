import { TestBed } from '@angular/core/testing';

import { EditionStatisticsService } from './edition-statistics.service';

describe('EditionStatisticsService', () => {
    let service: EditionStatisticsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EditionStatisticsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('#calculateStatistics', () => {
        it('... should calculate correct statistics for empty data', () => {
            const stats = service.calculateStatistics([]);

            expect(stats.totalSeries).toBe(0);
            expect(stats.activeSeries).toBe(0);
            expect(stats.totalSections).toBe(0);
            expect(stats.totalComplexes).toBe(0);
            expect(stats.availableComplexes).toBe(0);
            expect(stats.availabilityRate).toBe(0);
        });

        it('... should calculate correct statistics for sample data', () => {
            const sampleData = [
                {
                    series: { route: '1', full: 'Series 1' },
                    sections: [
                        {
                            section: '5',
                            disabled: false,
                            content: {
                                complexTypes: {
                                    opus: [
                                        { disabled: false, complex: {} },
                                        { disabled: true, complex: {} },
                                    ],
                                    mnr: [{ disabled: false, complex: { complexId: { route: '/m/op28' } } }],
                                },
                            },
                        },
                    ],
                },
            ] as any;

            const stats = service.calculateStatistics(sampleData);

            expect(stats.totalSeries).toBe(1);
            expect(stats.activeSeries).toBe(1);
            expect(stats.totalSections).toBe(1);
            expect(stats.totalComplexes).toBe(3);
            expect(stats.availableComplexes).toBe(2);
            expect(stats.availabilityRate).toBe(67);

            // Test section breakdown
            expect(stats.seriesBreakdown).toBeDefined();
            expect(stats.seriesBreakdown.length).toBe(1);
            expect(stats.seriesBreakdown[0].sectionBreakdown).toBeDefined();
            expect(stats.seriesBreakdown[0].sectionBreakdown.length).toBe(1);
            expect(stats.seriesBreakdown[0].sectionBreakdown[0].section).toBe('5');
            expect(stats.seriesBreakdown[0].sectionBreakdown[0].complexes).toBe(3);
            expect(stats.seriesBreakdown[0].sectionBreakdown[0].available).toBe(2);
            expect(stats.seriesBreakdown[0].sectionBreakdown[0].availabilityRate).toBe(67);

            // Test series availability rate (should match single section rate)
            expect(stats.seriesBreakdown[0].availabilityRate).toBe(67);
        });

        it('... should calculate series progress as average of all sections', () => {
            const sampleData = [
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
                                        { disabled: false, complex: {} },
                                        { disabled: false, complex: {} },
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

            const stats = service.calculateStatistics(sampleData);

            // Section 1: 0% (disabled, no complexes)
            // Section 2A: 100% (2 complexes, all available)
            // Section 3: 0% (disabled, no complexes)
            // Series average: (0 + 100 + 0) / 3 = 33%

            expect(stats.seriesBreakdown[0].availabilityRate).toBe(33);
            expect(stats.seriesBreakdown[0].sectionBreakdown[0].availabilityRate).toBe(0);
            expect(stats.seriesBreakdown[0].sectionBreakdown[1].availabilityRate).toBe(100);
            expect(stats.seriesBreakdown[0].sectionBreakdown[2].availabilityRate).toBe(0);
        });
    });

    describe('#getStatisticsSummary', () => {
        it('... should return correct summary', () => {
            const stats = {
                totalSeries: 3,
                activeSeries: 2,
                totalSections: 10,
                totalComplexes: 100,
                availableComplexes: 75,
                availabilityRate: 75,
                seriesBreakdown: [
                    {
                        series: '1',
                        sections: 2,
                        complexes: 50,
                        available: 40,
                        availabilityRate: 80,
                        sectionBreakdown: [],
                        complexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                        availableComplexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                    },
                ],
                complexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                availableComplexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
            };

            const summary = service.getStatisticsSummary(stats);

            expect(summary).toEqual({
                totalComplexes: 100,
                availableComplexes: 75,
                availabilityRate: 75,
                totalSeries: 3,
                activeSeries: 2,
                totalSections: 10,
            });
        });
    });
});
