import { Injectable } from '@angular/core';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';

import {
    EditionStatistics,
    EditionStatisticsSectionBreakdown,
    EditionStatisticsSeriesBreakdown,
} from '@awg-views/statistics-view/models';

/**
 * The EditionStatistics service.
 *
 * It handles the calculation and provision of statistics
 * for the edition outline data.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class EditionStatisticsService {
    /**
     * Public method: calculateStatistics.
     *
     * It calculates comprehensive statistics from the edition outline data.
     *
     * @param {EditionOutlineSeries[]} editionOutline The edition outline data.
     *
     * @returns {EditionStatistics} The calculated statistics.
     */
    calculateStatistics(editionOutline: EditionOutlineSeries[]): EditionStatistics {
        const stats: EditionStatistics = {
            totalSeries: 0,
            activeSeries: 0,
            totalSections: 0,
            totalComplexes: 0,
            availableComplexes: 0,
            availabilityRate: 0,
            seriesBreakdown: [],
            complexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
            availableComplexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
        };

        editionOutline.forEach(series => {
            stats.totalSeries++;

            const seriesStats: EditionStatisticsSeriesBreakdown = {
                series: series.series.route || series.series.full,
                sections: 0,
                complexes: 0,
                available: 0,
                availabilityRate: 0,
                sectionBreakdown: [],
                complexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                availableComplexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
            };

            let hasActiveContent = false;

            series.sections.forEach(section => {
                const sectionStats: EditionStatisticsSectionBreakdown = {
                    section: section.section.short,
                    disabled: section.disabled,
                    complexes: 0,
                    available: 0,
                    availabilityRate: 0,
                    complexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                    availableComplexTypeBreakdown: { opus: 0, mnr: 0, mnrX: 0 },
                };

                if (!section.disabled) {
                    stats.totalSections++;
                    seriesStats.sections++;
                    hasActiveContent = true;
                }

                // Count opus complexes in section
                section.content.complexTypes.opus?.forEach(complex => {
                    stats.totalComplexes++;
                    seriesStats.complexes++;
                    sectionStats.complexes++;
                    stats.complexTypeBreakdown.opus++;
                    seriesStats.complexTypeBreakdown.opus++;
                    sectionStats.complexTypeBreakdown.opus++;
                    hasActiveContent = true;

                    if (!complex.disabled) {
                        stats.availableComplexes++;
                        seriesStats.available++;
                        sectionStats.available++;
                        stats.availableComplexTypeBreakdown.opus++;
                        seriesStats.availableComplexTypeBreakdown.opus++;
                        sectionStats.availableComplexTypeBreakdown.opus++;
                    }
                });

                // Count mnr complexes in section
                section.content.complexTypes.mnr?.forEach(complex => {
                    stats.totalComplexes++;
                    seriesStats.complexes++;
                    sectionStats.complexes++;
                    hasActiveContent = true;

                    // Distinguish between regular MNR (m) and MNR_X (mx)
                    if (complex.complex?.complexId?.route?.startsWith('/mx')) {
                        stats.complexTypeBreakdown.mnrX++;
                        seriesStats.complexTypeBreakdown.mnrX++;
                        sectionStats.complexTypeBreakdown.mnrX++;
                        if (!complex.disabled) {
                            stats.availableComplexes++;
                            seriesStats.available++;
                            sectionStats.available++;
                            stats.availableComplexTypeBreakdown.mnrX++;
                            seriesStats.availableComplexTypeBreakdown.mnrX++;
                            sectionStats.availableComplexTypeBreakdown.mnrX++;
                        }
                    } else {
                        stats.complexTypeBreakdown.mnr++;
                        seriesStats.complexTypeBreakdown.mnr++;
                        sectionStats.complexTypeBreakdown.mnr++;
                        if (!complex.disabled) {
                            stats.availableComplexes++;
                            seriesStats.available++;
                            sectionStats.available++;
                            stats.availableComplexTypeBreakdown.mnr++;
                            seriesStats.availableComplexTypeBreakdown.mnr++;
                            sectionStats.availableComplexTypeBreakdown.mnr++;
                        }
                    }
                });

                // Calculate availability rate for this section
                sectionStats.availabilityRate =
                    sectionStats.complexes > 0
                        ? Math.round((sectionStats.available / sectionStats.complexes) * 100)
                        : 0;

                // Add section to series breakdown
                seriesStats.sectionBreakdown.push(sectionStats);
            });

            // Only count series that have active content
            if (hasActiveContent) {
                stats.activeSeries++;
            }

            // Calculate availability rate for this series based on average of all section progress
            const totalSectionsInSeries = seriesStats.sectionBreakdown.length;
            const sumOfSectionProgressRates = seriesStats.sectionBreakdown.reduce(
                (sum, section) => sum + section.availabilityRate,
                0
            );
            seriesStats.availabilityRate =
                totalSectionsInSeries > 0 ? Math.round(sumOfSectionProgressRates / totalSectionsInSeries) : 0;

            stats.seriesBreakdown.push(seriesStats);
        });

        // Calculate overall availability rate as average of series rates
        // Each series contributes equally to the overall rate
        const totalSeriesRates = stats.seriesBreakdown.reduce((sum, series) => sum + series.availabilityRate, 0);
        stats.availabilityRate =
            stats.seriesBreakdown.length > 0 ? Math.round(totalSeriesRates / stats.seriesBreakdown.length) : 0;

        return stats;
    }

    /**
     * Public method: getStatisticsSummary.
     *
     * It provides a summary of the most important statistics.
     *
     * @param {EditionStatistics} stats The full statistics object.
     *
     * @returns {object} The statistics summary.
     */
    getStatisticsSummary(stats: EditionStatistics): object {
        return {
            totalComplexes: stats.totalComplexes,
            availableComplexes: stats.availableComplexes,
            availabilityRate: stats.availabilityRate,
            totalSeries: stats.totalSeries,
            activeSeries: stats.activeSeries,
            totalSections: stats.totalSections,
        };
    }
}
