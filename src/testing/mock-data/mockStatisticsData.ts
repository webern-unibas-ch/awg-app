/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Test helper data file: mockStatisticsData.
 *
 * It provides mocks for data used in the context of the statistics view of the app.
 *
 * Exposed to be called from tests.
 */
export const mockStatisticsData = {
    /**
     * Test helper data constant: mockSeriesBreakdown.
     *
     * It provides a mocked mockSeriesBreakdown object.
     */
    mockSeriesBreakdown: {
        series: 'TestSeries',
        activeSections: 1,
        totalSections: 2,
        activeComplexes: 5,
        totalComplexes: 10,
        activeComplexBreakdown: { mnr: 1, mnrX: 1, opus: 3 },
        complexBreakdown: { mnr: 3, mnrX: 2, opus: 5 },
        progressRate: 50,
        sectionBreakdown: [
            {
                section: 'TestSection1',
                disabled: false,
                activeComplexes: 5,
                totalComplexes: 10,
                activeComplexBreakdown: { mnr: 1, mnrX: 1, opus: 3 },
                complexBreakdown: { mnr: 3, mnrX: 2, opus: 5 },
                progressRate: 50,
            },
            {
                section: 'TestSection2',
                disabled: true,
                activeComplexes: 0,
                totalComplexes: 0,
                activeComplexBreakdown: { mnr: 0, mnrX: 0, opus: 0 },
                complexBreakdown: { mnr: 0, mnrX: 0, opus: 0 },
                progressRate: 0,
            },
        ],
    },
};
