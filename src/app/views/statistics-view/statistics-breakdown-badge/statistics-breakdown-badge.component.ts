import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { StatisticsBreakDownBadge, StatisticsComplexBreakdown } from '../models/statistics.model';

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
     * Readonly input signal: breakdown.
     *
     * It holds the breakdown data for the complex types to be displayed in the badges.
     */
    readonly breakdown = input.required<StatisticsComplexBreakdown>();

    /**
     * Readonly input signal: containerClasses.
     *
     * It holds additional CSS classes to apply to the container.
     * @default 'small text-muted'
     */
    readonly containerClasses = input<string>('small text-muted');

    /**
     * Readonly input signal: showEmptyBadges.
     *
     * It holds a flag whether to show badges when their value is zero.
     * @default false
     */
    readonly showEmptyBadges = input<boolean>(false);

    /**
     * Readonly computed signal: displayedBadges.
     *
     * It computes the list of badges to be displayed
     * based on the breakdown data and the showEmptyBadges flag.
     */
    readonly displayedBadges = computed<StatisticsBreakDownBadge[]>(() => {
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
