import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { EditionOutlineService } from '@awg-views/edition-view/services';

import {
    Statistics,
    StatisticsComplexBreakdownData,
    StatisticsOverallProgressData,
    StatisticsSummaryData,
} from './models/statistics.model';
import { StatisticsService } from './services/statistics.service';
import { StatisticsComplexBreakdownComponent } from './statistics-complex-breakdown/statistics-complex-breakdown.component';
import { StatisticsOverallProgressComponent } from './statistics-overall-progress/statistics-overall-progress.component';
import { StatisticsSeriesBreakdownComponent } from './statistics-series-breakdown/statistics-series-breakdown.component';
import { StatisticsSummaryComponent } from './statistics-summary/statistics-summary.component';

/**
 * The Statistics view component.
 *
 * It contains the statistics view section of the app
 * with a statistics page about the edition complexes.
 */
@Component({
    selector: 'awg-statistics-view',
    templateUrl: './statistics-view.component.html',
    styleUrls: ['./statistics-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        StatisticsComplexBreakdownComponent,
        StatisticsOverallProgressComponent,
        StatisticsSeriesBreakdownComponent,
        StatisticsSummaryComponent,
    ],
})
export class StatisticsViewComponent {
    /**
     * Public signal: statisticsData.
     *
     * It holds the statistics data for the edition complexes,
     * which is retrieved from the StatisticsService based on data from the EditionOutlineService.
     */
    statisticsData = signal<Statistics | null>(
        inject(StatisticsService).getStatisticsFromOutline(EditionOutlineService.getEditionOutline())
    );

    /**
     * Computed signal: complexBreakdownData.
     *
     * It computes the complex breakdown data for the statistics breakdown badges based on the main statistics data.
     */
    complexBreakdownData = computed<StatisticsComplexBreakdownData | null>(() => {
        const data = this.statisticsData();
        if (!data) {
            return null;
        }

        return {
            activeComplexBreakdown: data.activeComplexBreakdown,
            complexBreakdown: data.complexBreakdown,
            totalComplexes: data.totalComplexes,
        };
    });

    /**
     * Computed signal: overallProgressData.
     *
     * It computes the overall progress data for the statistics progress bar based on the main statistics data.
     */
    overallProgressData = computed<StatisticsOverallProgressData | null>(() => {
        const data = this.statisticsData();
        if (!data) {
            return null;
        }

        return {
            progressRate: data.progressRate,
            activeComplexes: data.activeComplexes,
            totalComplexes: data.totalComplexes,
        };
    });

    /**
     * Computed signal: summaryData.
     *
     * It computes the summary data for the statistics summary cards based on the main statistics data.
     */
    summaryData = computed<StatisticsSummaryData | null>(() => {
        const data = this.statisticsData();
        if (!data) {
            return null;
        }

        return {
            activeSeries: data.activeSeries,
            activeSections: data.activeSections,
            activeComplexes: data.activeComplexes,
            totalComplexes: data.totalComplexes,
        };
    });
}
