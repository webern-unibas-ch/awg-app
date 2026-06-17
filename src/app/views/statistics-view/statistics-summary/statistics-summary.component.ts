import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { faCheckCircle, faFolder, faList, faMusic } from '@fortawesome/free-solid-svg-icons';

import { StatisticsSummaryCardData, StatisticsSummaryData } from '../models/statistics.model';
import { StatisticsSummaryCardComponent } from '../statistics-summary-card/statistics-summary-card.component';

/**
 * The StatisticsSummary component.
 *
 * It displays the statistics summary with summary cards.
 */
@Component({
    selector: 'awg-statistics-summary',
    templateUrl: './statistics-summary.component.html',
    styleUrl: './statistics-summary.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StatisticsSummaryCardComponent],
})
export class StatisticsSummaryComponent {
    /**
     * Input signal: summaryData.
     *
     * It holds the summary data.
     */
    summaryData = input.required<StatisticsSummaryData>();

    /**
     * Computed signal: summaryCards.
     *
     * It computes the data for the statistics summary cards based on the input data.
     */
    summaryCards = computed<StatisticsSummaryCardData[]>(() => {
        const data = this.summaryData();
        if (!data) {
            return [];
        }

        return [
            {
                title: 'Active Series',
                value: data.activeSeries,
                icon: faList,
                bgClass: 'bg-primary',
            },
            {
                title: 'Active Sections',
                value: data.activeSections,
                icon: faFolder,
                bgClass: 'bg-info',
            },
            {
                title: 'Total Complexes',
                value: data.totalComplexes,
                icon: faMusic,
                bgClass: 'bg-secondary',
            },
            {
                title: 'Active Complexes',
                value: data.activeComplexes,
                icon: faCheckCircle,
                bgClass: 'bg-success',
            },
        ];
    });
}
