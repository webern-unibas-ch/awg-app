import { Injectable } from '@angular/core';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import {
    EditionOutlineComplexItem,
    EditionOutlineComplexTypes,
} from '@awg-views/edition-view/models/edition-outline.model';

import {
    EditionStatistics,
    StatisticsComplexCounter,
    StatisticsComplexType,
    StatisticsSectionBreakdown,
    StatisticsSeriesBreakdown,
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
        const stats = new EditionStatistics();

        editionOutline.forEach(series => {
            stats.totalSeries++;

            const seriesStats = new StatisticsSeriesBreakdown(series.series.short);

            let hasActiveContent = false;

            series.sections.forEach(section => {
                const sectionStats = new StatisticsSectionBreakdown(section.section.short, section.disabled);

                if (!section.disabled) {
                    stats.totalSections++;
                    seriesStats.sections++;
                    hasActiveContent = true;
                }

                // Count all complexes in section
                hasActiveContent =
                    this._processComplexes(stats, seriesStats, sectionStats, section.content.complexTypes) ||
                    hasActiveContent;

                // Calculate progress rate for this section
                sectionStats.progressRate = this._calculateProgressRate(
                    sectionStats.availableComplexes,
                    sectionStats.totalComplexes
                );

                // Add section to series breakdown
                seriesStats.sectionBreakdown.push(sectionStats);
            });

            // Only count series that have active content
            if (hasActiveContent) {
                stats.activeSeries++;
            }

            // Calculate progress rate for this series based on average of all section progress
            const sectionProgressRates: number[] = seriesStats.sectionBreakdown.map(section => section.progressRate);
            seriesStats.progressRate = this._calculateCombinedProgressRate(sectionProgressRates);

            stats.seriesBreakdown.push(seriesStats);
        });

        // Calculate overall progress rate as average of all series progress
        const seriesProgressRates: number[] = stats.seriesBreakdown.map(series => series.progressRate);
        stats.progressRate = this._calculateCombinedProgressRate(seriesProgressRates);

        return stats;
    }

    /**
     * Private method: _calculateProgressRate.
     *
     * It calculates a progressrate from available and total values.
     *
     * @param {number} available The number of available items.
     * @param {number} total The total number of items.
     *
     * @returns {number} The rounded percentage rate.
     */
    private _calculateProgressRate(available: number, total: number): number {
        return total > 0 ? Math.round((available / total) * 100) : 0;
    }

    /**
     * Private method: _calculateCombinedProgressRate.
     *
     * It calculates a rounded average value from a list of progress rates.
     *
     * @param {number[]} progressRates The list of progress rates to average.
     *
     * @returns {number} The rounded averageprogress rate, or 0 if the list is empty.
     */
    private _calculateCombinedProgressRate(progressRates: number[]): number {
        if (!progressRates.length) {
            return 0;
        }

        const sum = progressRates.reduce((total, value) => total + value, 0);
        return Math.round(sum / progressRates.length);
    }

    /**
     * Private method: _incrementComplexCounters.
     *
     * It registers one complex for all given statistics targets.
     *
     * @param {StatisticsComplexCounter[]} targets The statistics targets to update.
     * @param {StatisticsComplexType} complexType The complex category.
     * @param {boolean} isAvailable Flag indicating whether the complex is available.
     *
     * @returns {void} Registers the complex in all targets by calling their registerComplex method.
     */
    private _incrementComplexCounters(
        targets: StatisticsComplexCounter[],
        complexType: StatisticsComplexType,
        isAvailable: boolean
    ): void {
        targets.forEach(target => target.registerComplex(complexType, isAvailable));
    }

    /**
     * Private method: _isMnrX.
     *
     * It checks whether a complex belongs to the MNR_X category.
     *
     * @param {unknown} complex The complex object to inspect.
     *
     * @returns {boolean} True if the complex route starts with `/mx`, otherwise false.
     */
    private _isMnrX(complex: EditionOutlineComplexItem | undefined): boolean {
        const route = complex?.complex?.complexId?.route;
        return typeof route === 'string' && route.startsWith('/mx');
    }

    /**
     * Private method: _processComplexes.
     *
     * It processes all complex types (opus, mnr, mnrX) for a section and updates all relevant statistics counters.
     *
     * @param {EditionStatistics} stats The overall edition statistics.
     * @param {StatisticsSeriesBreakdown} seriesStats The current series statistics.
     * @param {StatisticsSectionBreakdown} sectionStats The current section statistics.
     * @param {Object} complexTypes The object containing the opus and mnr complex lists.
     *
     * @returns {boolean} True if at least one complex was processed, otherwise false.
     */
    private _processComplexes(
        stats: EditionStatistics,
        seriesStats: StatisticsSeriesBreakdown,
        sectionStats: StatisticsSectionBreakdown,
        complexTypes: EditionOutlineComplexTypes
    ): boolean {
        const hasOpusComplexes = this._processComplexesByType(
            stats,
            seriesStats,
            sectionStats,
            complexTypes.opus,
            () => 'opus'
        );
        const hasMnrComplexes = this._processComplexesByType(
            stats,
            seriesStats,
            sectionStats,
            complexTypes.mnr,
            complex => (this._isMnrX(complex) ? 'mnrX' : 'mnr')
        );

        return hasOpusComplexes || hasMnrComplexes;
    }

    /**
     * Private method: _processComplexesByType.
     *
     * It processes a list of complexes and updates all relevant statistics counters.
     *
     * @param {EditionStatistics} stats The overall edition statistics.
     * @param {StatisticsSeriesBreakdown} seriesStats The current series statistics.
     * @param {StatisticsSectionBreakdown} sectionStats The current section statistics.
     * @param {EditionOutlineComplexItem[]} complexes The complexes to process.
     * @param {Function} getComplexType Resolver function for the complex category.
     *
     * @returns {boolean} True if at least one complex was processed, otherwise false.
     */
    private _processComplexesByType(
        stats: EditionStatistics,
        seriesStats: StatisticsSeriesBreakdown,
        sectionStats: StatisticsSectionBreakdown,
        complexes: EditionOutlineComplexItem[] | undefined,
        getComplexType: (complex: EditionOutlineComplexItem) => StatisticsComplexType
    ): boolean {
        if (!complexes?.length) {
            return false;
        }

        complexes.forEach(complex => {
            const complexType = getComplexType(complex);
            this._incrementComplexCounters([stats, seriesStats, sectionStats], complexType, !complex.disabled);
        });

        return true;
    }
}
