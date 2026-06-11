import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { EditionOutlineService } from '@awg-views/edition-view/services';
import {
    Statistics,
    StatisticsComplexBreakdownData,
    StatisticsOverallProgressData,
    StatisticsSummaryData,
} from '@awg-views/statistics-view/models';
import { StatisticsService } from '@awg-views/statistics-view/services';

import { StatisticsComplexBreakdownComponent } from '@awg-views/statistics-view/statistics-complex-breakdown';
import { StatisticsOverallProgressComponent } from '@awg-views/statistics-view/statistics-overall-progress';
import { StatisticsSeriesBreakdownComponent } from '@awg-views/statistics-view/statistics-series-breakdown';
import { StatisticsSummaryComponent } from '@awg-views/statistics-view/statistics-summary';

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
    standalone: false,
})
export class StatisticsViewComponent {
    /**
     * Private readonly injection variable: _statisticsService.
     *
     * It keeps the instance of the injected StatisticsService.
     */
    protected readonly _statisticsService = inject(StatisticsService);

    /**
     * Public signal: statisticsData.
     *
     * It holds the statistics data for the edition complexes.
     */
    statisticsData = signal<Statistics | null>(
        this._statisticsService.getStatisticsFromOutline(EditionOutlineService.getEditionOutline())
    );
}
