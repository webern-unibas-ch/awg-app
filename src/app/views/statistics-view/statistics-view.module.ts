import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StatisticsBreakdownBadgeComponent } from './statistics-breakdown-badge';
import { StatisticsProgressBarComponent } from './statistics-progress-bar';
import { StatisticsSummaryCardComponent } from './statistics-summary-card';
import { StatisticsSummaryCardsComponent } from './statistics-summary-cards';
import { StatisticsViewRoutingModule, routedStatisticsViewComponents } from './statistics-view-routing.module';

/**
 * The statistics view module.
 *
 * It embeds the statistics view components and their
 * [routing definition]{@link StatisticsViewRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [
        CommonModule,
        StatisticsViewRoutingModule,
        StatisticsSummaryCardsComponent,
        StatisticsSummaryCardComponent,
    ],
    declarations: [routedStatisticsViewComponents, StatisticsProgressBarComponent, StatisticsBreakdownBadgeComponent],
})
export class StatisticsViewModule {}
