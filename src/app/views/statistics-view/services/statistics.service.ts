import { Injectable } from '@angular/core';

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import {
    EditionOutlineComplexItem,
    EditionOutlineComplexTypes,
} from '@awg-views/edition-view/models/edition-outline.model';

import {
    Statistics,
    StatisticsComplexCounter,
    StatisticsComplexType,
    StatisticsSectionBreakdown,
    StatisticsSeriesBreakdown,
} from '../models/statistics.model';

/**
 * The Statistics service.
 *
 * It handles the calculation and provision of statistics
 * for the edition outline data.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    /**
     * Public method: calculateStatistics.
     *
     * It calculates comprehensive statistics from the edition outline data.
     *
     * @param {EditionOutlineSeries[]} editionOutline The edition outline data.
     * @returns {Statistics} The calculated statistics.
     */
    getStatisticsFromOutline(editionOutline: EditionOutlineSeries[]): Statistics {
        const stats = new Statistics();

        editionOutline.forEach(series => {
            stats.totalSeries++;

            const seriesStats = new StatisticsSeriesBreakdown(series.series.short);

            series.sections.forEach(section => {
                stats.totalSections++;
                seriesStats.totalSections++;

                const sectionStats = new StatisticsSectionBreakdown(section.section.short, section.disabled);

                if (!section.disabled) {
                    stats.activeSections++;
                    seriesStats.activeSections++;
                }

                // Count all complexes in section
                this._processComplexes(stats, seriesStats, sectionStats, section.content.complexTypes);

                // Calculate progress rate for this section
                sectionStats.progressRate = this._calculateProgressRate(
                    sectionStats.activeComplexes,
                    sectionStats.totalComplexes
                );

                // Add section to series breakdown
                seriesStats.sectionBreakdown.push(sectionStats);
            });

            // Only count series that have active content
            if (seriesStats.activeSections > 0 || seriesStats.activeComplexes > 0) {
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
     * It calculates a progressrate from active and total values.
     *
     * @param {number} active The number of active items.
     * @param {number} total The total number of items.
     * @returns {number} The rounded percentage rate.
     */
    private _calculateProgressRate(active: number, total: number): number {
        return total > 0 ? Math.round((active / total) * 100) : 0;
    }

    /**
     * Private method: _calculateCombinedProgressRate.
     *
     * It calculates a rounded average value from a list of progress rates.
     *
     * @param {number[]} progressRates The list of progress rates to average.
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
     * @param {boolean} isActive Flag indicating whether the complex is active.
     * @returns {void} Registers the complex in all targets by calling their registerComplex method.
     */
    private _incrementComplexCounters(
        targets: StatisticsComplexCounter[],
        complexType: StatisticsComplexType,
        isActive: boolean
    ): void {
        targets.forEach(target => target.registerComplex(complexType, isActive));
    }

    /**
     * Private method: _isMnrX.
     *
     * It checks whether a complex belongs to the MNR_X category.
     *
     * @param {EditionOutlineComplexItem} complex The complex object to inspect.
     * @returns {boolean} True if the complex route starts with `/mx`, otherwise false.
     */
    private _isMnrX(complex: EditionOutlineComplexItem): boolean {
        const route = complex.complex?.complexId?.route;
        return typeof route === 'string' && route.startsWith('/mx');
    }

    /**
     * Private method: _processComplexes.
     *
     * It processes all complex types (opus, mnr, mnrX) for a section and updates all relevant statistics counters.
     *
     * @param {Statistics} stats The overall edition statistics.
     * @param {StatisticsSeriesBreakdown} seriesStats The current series statistics.
     * @param {StatisticsSectionBreakdown} sectionStats The current section statistics.
     * @param {EditionOutlineComplexTypes | undefined} complexTypes The object containing the opus and mnr complex lists, or undefined.
     * @returns {void} Processes all complexes and updates the counters in the provided statistics objects.
     */
    private _processComplexes(
        stats: Statistics,
        seriesStats: StatisticsSeriesBreakdown,
        sectionStats: StatisticsSectionBreakdown,
        complexTypes: EditionOutlineComplexTypes | undefined
    ): void {
        if (!complexTypes) {
            return;
        }

        complexTypes.opus?.forEach(complex => {
            this._incrementComplexCounters([stats, seriesStats, sectionStats], 'opus', !complex.disabled);
        });

        complexTypes.mnr?.forEach(complex => {
            const type = this._isMnrX(complex) ? 'mnrX' : 'mnr';
            this._incrementComplexCounters([stats, seriesStats, sectionStats], type, !complex.disabled);
        });
    }
}
