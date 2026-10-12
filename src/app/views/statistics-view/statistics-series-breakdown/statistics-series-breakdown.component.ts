import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';

import { StatisticsSeriesBreakdown } from '../models/statistics.model';
import { StatisticsBreakdownBadgeComponent } from '../statistics-breakdown-badge/statistics-breakdown-badge.component';
import { StatisticsProgressBarComponent } from '../statistics-progress-bar/statistics-progress-bar.component';

/**
 * The StatisticsSeriesBreakdown component.
 *
 * It displays a breakdown of the series statistics in the statistics view,
 * showing the distribution of active and disabled sections for each series.
 */
@Component({
    selector: 'awg-statistics-series-breakdown',
    templateUrl: './statistics-series-breakdown.component.html',
    styleUrl: './statistics-series-breakdown.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive, StatisticsBreakdownBadgeComponent, StatisticsProgressBarComponent],
})
export class StatisticsSeriesBreakdownComponent {
    /**
     * Readonly input signal: seriesBreakdown.
     *
     * It holds the series breakdown data.
     */
    readonly seriesBreakdownData = input.required<StatisticsSeriesBreakdown[]>();

    /**
     * Readonly variable: ROUTES.
     *
     * It keeps the edition route constants for the router links in the template.
     */
    readonly ROUTES = {
        edition: EDITION_ROUTE_CONSTANTS.EDITION,
        series: EDITION_ROUTE_CONSTANTS.SERIES,
        section: EDITION_ROUTE_CONSTANTS.SECTION,
    };
}
