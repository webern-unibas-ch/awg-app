import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StatisticsComplexBreakdown } from '@awg-views/statistics-view/models';

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
    standalone: false,
})
export class StatisticsBreakdownBadgeComponent {
    /**
     * Input variable: breakdown.
     *
     * It keeps the breakdown data for the complex types to be displayed in the badges.
     */
    @Input() breakdown: StatisticsComplexBreakdown = new StatisticsComplexBreakdown();

    /**
     * Input variable: containerClasses.
     *
     * It keeps additional CSS classes to apply to the container.
     */
    @Input() containerClasses = 'small text-muted';

    /**
     * Input variable: hideEmptyBadges.
     *
     * It keeps a flag whether to hide badges when they are empty.
     */
    @Input() hideEmptyBadges = true;
}
