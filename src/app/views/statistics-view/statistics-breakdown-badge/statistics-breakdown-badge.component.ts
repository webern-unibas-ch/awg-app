import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatisticsBreakDownBadge, StatisticsComplexBreakdown } from '@awg-views/statistics-view/models';

/**
 * The StatisticsBreakdownBadge component.
 *
 * It displays colored badges showing the breakdown of complex types (opus, m-numbers, mx-numbers).
 */
@Component({
    selector: 'awg-statistics-breakdown-badge',
    templateUrl: './statistics-breakdown-badge.component.html',
    styleUrls: ['./statistics-breakdown-badge.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsBreakdownBadgeComponent {
    /**
     * Input signal: breakdown.
     *
     * Holds the breakdown data for the complex types to be displayed in the badges.
     */
    breakdown = input<StatisticsComplexBreakdown>(new StatisticsComplexBreakdown());

    /**
     * Input signal: containerClasses.
     *
     * Holds additional CSS classes to apply to the container.
     * @default 'small text-muted'
     */
    containerClasses = input<string>('small text-muted');

    /**
     * Input signal: showEmptyBadges.
     *
     * Holds a flag whether to show badges when their value is zero.
     * @default false
     */
    showEmptyBadges = input<boolean>(false);

    /**
     * Computed signal: visibleBadges.
     *
     * Computes the list of badges to be displayed
     * based on the breakdown data and the showEmptyBadges flag.
     */
    visibleBadges = computed<StatisticsBreakDownBadge[]>(() => {
        const data = this.breakdown();
        const showEmpty = this.showEmptyBadges();

        const allBadges: StatisticsBreakDownBadge[] = [
            { label: 'Op', val: data.opus, type: 'primary' },
            { label: 'M', val: data.mnr, type: 'secondary' },
            { label: 'M*', val: data.mnrX, type: 'info' },
        ];

        // Keep badges if showEmpty is true, or if their value is greater than zero
        return allBadges.filter(badge => showEmpty || badge.val > 0);
    });
}
