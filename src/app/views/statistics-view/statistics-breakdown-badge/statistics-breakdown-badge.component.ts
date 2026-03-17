import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { EditionStatisticsComplexTypeBreakdown } from '@awg-views/statistics-view/models';

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
     * The complex type breakdown data to display as badges.
     */
    @Input() breakdown: EditionStatisticsComplexTypeBreakdown = { opus: 0, mnr: 0, mnrX: 0 };

    /**
     * Additional CSS classes to apply to the container.
     */
    @Input() containerClasses: string = 'small text-muted';

    /**
     * Whether to show badges only when there are complexes (hide empty badges).
     */
    @Input() hideEmpty: boolean = true;
}
