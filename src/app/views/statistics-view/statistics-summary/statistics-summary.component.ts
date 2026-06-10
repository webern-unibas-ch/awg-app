import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { faCheckCircle, faFolder, faList, faMusic } from '@fortawesome/free-solid-svg-icons';

import { StatisticsSummaryCardData } from '@awg-views/statistics-view/models';
import { StatisticsSummaryCardComponent } from '@awg-views/statistics-view/statistics-summary-card';

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
     * Input signal: activeComplexes.
     *
     * It holds the number of active complexes.
     */
    activeComplexes = input.required<number>();

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
            title: 'Active Complexes',
            value: this.activeComplexes(),
            icon: faCheckCircle,
            bgClass: 'bg-success',
        },
    ]);
}
