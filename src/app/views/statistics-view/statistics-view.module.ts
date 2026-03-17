import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StatisticsBreakdownBadgeComponent } from './statistics-breakdown-badge';
import { StatisticsCardComponent } from './statistics-card';
import { StatisticsProgressBarComponent } from './statistics-progress-bar';
import { StatisticsViewRoutingModule, routedStatisticsViewComponents } from './statistics-view-routing.module';

/**
 * The statistics view module.
 *
 * It embeds the statistics view components and their
 * [routing definition]{@link StatisticsViewRoutingModule}
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [CommonModule, StatisticsViewRoutingModule],
    declarations: [
        routedStatisticsViewComponents,
        StatisticsProgressBarComponent,
        StatisticsBreakdownBadgeComponent,
        StatisticsCardComponent,
    ],
})
export class StatisticsViewModule {}
