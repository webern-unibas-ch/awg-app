import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { StatisticsSeriesBreakdown } from '@awg-views/statistics-view/models';
import { StatisticsBreakdownBadgeComponent } from '@awg-views/statistics-view/statistics-breakdown-badge';
import { StatisticsProgressBarComponent } from '@awg-views/statistics-view/statistics-progress-bar';

@Component({
    selector: 'awg-statistics-series-breakdown',
    templateUrl: './statistics-series-breakdown.component.html',
    styleUrl: './statistics-series-breakdown.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, RouterLinkActive, StatisticsBreakdownBadgeComponent, StatisticsProgressBarComponent],
})
export class StatisticsSeriesBreakdownComponent {
    /**
     * Input signal: seriesBreakdown.
     *
     * It holds the series breakdown data.
     */
    seriesBreakdownData = input.required<StatisticsSeriesBreakdown[]>();

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
