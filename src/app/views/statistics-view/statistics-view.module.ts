import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StatisticsBreakdownBadgeComponent } from './statistics-breakdown-badge';
import { StatisticsComplexBreakdownComponent } from './statistics-complex-breakdown';
import { StatisticsOverallProgressComponent } from './statistics-overall-progress';
import { StatisticsProgressBarComponent } from './statistics-progress-bar';
import { StatisticsSeriesBreakdownComponent } from './statistics-series-breakdown';
import { StatisticsSummaryComponent } from './statistics-summary';
import { StatisticsSummaryCardComponent } from './statistics-summary-card';
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
        StatisticsBreakdownBadgeComponent,
        StatisticsComplexBreakdownComponent,
        StatisticsSeriesBreakdownComponent,
        StatisticsOverallProgressComponent,
        StatisticsProgressBarComponent,
        StatisticsSummaryComponent,
        StatisticsSummaryCardComponent,
    ],
    declarations: [routedStatisticsViewComponents],
})
export class StatisticsViewModule {}
