import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { faCheckCircle, faFolder, faList, faMusic } from '@fortawesome/free-solid-svg-icons';

import { StatisticsSummaryCardData } from '../models';
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
     * Input signal: activeSeries.
     *
     * It holds the number of active series.
     */
    activeSeries = input.required<number>();

    /**
     * Input signal: activeSections.
     *
     * It holds the number of active sections.
     */
    activeSections = input.required<number>();

    /**
     * Input signal: totalComplexes.
     *
     * It holds the total number of complexes.
     */
    totalComplexes = input.required<number>();

    /**
     * Input signal: availableComplexes.
     *
     * It holds the number of available complexes.
     */
    availableComplexes = input.required<number>();

    /**
     * Computed signal: summaryCards.
     *
     * It computes the data for the statistics summary cards based on the input statistics data.
     */
    summaryCards = computed<StatisticsSummaryCardData[]>(() => [
        {
            title: 'Active Series',
            value: this.activeSeries(),
            icon: faList,
            bgClass: 'bg-primary',
        },
        {
            title: 'Active Sections',
            value: this.activeSections(),
            icon: faFolder,
            bgClass: 'bg-info',
        },
        {
            title: 'Total Complexes',
            value: this.totalComplexes(),
            icon: faMusic,
            bgClass: 'bg-secondary',
        },
        {
            title: 'Available Complexes',
            value: this.availableComplexes(),
            icon: faCheckCircle,
            bgClass: 'bg-success',
        },
    ]);
}
