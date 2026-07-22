import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ScrollToTopButtonComponent } from '@awg-shared/scroll-to-top-button/scroll-to-top-button.component';
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
        ScrollToTopButtonComponent,
    ],
})
export class StatisticsViewComponent {
    /**
     * Private readonly injection variable: _editionOutlineService.
     *
     * It keeps the instance of the injected EditionOutlineService.
     */
    private readonly _editionOutlineService = inject(EditionOutlineService);

    /**
     * Private readonly injection variable: _statisticsService.
     *
     * It keeps the instance of the injected StatisticsService.
     */
    private readonly _statisticsService = inject(StatisticsService);

    /**
     * Readonly computed signal: statisticsData.
     *
     * It automatically computes the statistics data whenever the edition outline signal updates.
     */
    readonly statisticsData = computed<Statistics | null>(() => {
        const outline = this._editionOutlineService.editionOutline();

        if (!outline || outline.length === 0) {
            return null;
        }

        return this._statisticsService.getStatisticsFromOutline(outline);
    });

    /**
     * Readonly computed signal: complexBreakdownData.
     *
     * It computes the complex breakdown data for the statistics breakdown badges based on the main statistics data.
     */
    readonly complexBreakdownData = computed<StatisticsComplexBreakdownData | null>(() => {
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
     * Readonly computed signal: overallProgressData.
     *
     * It computes the overall progress data for the statistics progress bar based on the main statistics data.
     */
    readonly overallProgressData = computed<StatisticsOverallProgressData | null>(() => {
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
     * Readonly computed signal: summaryData.
     *
     * It computes the summary data for the statistics summary cards based on the main statistics data.
     */
    readonly summaryData = computed<StatisticsSummaryData | null>(() => {
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
