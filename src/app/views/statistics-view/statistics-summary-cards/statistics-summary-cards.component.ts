import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { faCheckCircle, faFolder, faList, faMusic } from '@fortawesome/free-solid-svg-icons';

import { EditionStatistics, StatisticsSummaryCardData } from '../models';
import { StatisticsSummaryCardComponent } from '../statistics-summary-card';

/**
 * The StatisticsSummaryCards component.
 *
 * It displays a set of statistics summary cards with title, value, and icon.
 */
@Component({
    selector: 'awg-statistics-summary-cards',
    templateUrl: './statistics-summary-cards.component.html',
    styleUrl: './statistics-summary-cards.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [StatisticsSummaryCardComponent],
})
export class StatisticsSummaryCardsComponent {
    /**
     * Input signal: statisticsData.
     *
     * It holds the statistics data.
     */
    statisticsData = input.required<EditionStatistics>();

    /**
     * Computed signal: summaryCards.
     *
     * It computes the data for the statistics summary cards based on the input statistics data.
     */
    summaryCards = computed<StatisticsSummaryCardData[]>(() => {
        const statisticsData = this.statisticsData();
        if (!statisticsData) {return [];}

        return [
            {
                title: 'Active Series',
                value: statisticsData.activeSeries,
                icon: faList,
                bgClass: 'bg-primary',
            },
            {
                title: 'Active Sections',
                value: statisticsData.activeSections,
                icon: faFolder,
                bgClass: 'bg-info',
            },
            {
                title: 'Total Complexes',
                value: statisticsData.totalComplexes,
                icon: faMusic,
                bgClass: 'bg-secondary',
            },
            {
                title: 'Available Complexes',
                value: statisticsData.availableComplexes,
                icon: faCheckCircle,
                bgClass: 'bg-success',
            },
        ];
    });
}
