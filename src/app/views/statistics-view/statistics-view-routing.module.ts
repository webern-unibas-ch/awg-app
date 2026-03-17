import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StatisticsViewComponent } from './statistics-view.component';

/* Routes for the StatisticsViewModule */
const STATISTICS_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: StatisticsViewComponent,
        data: { title: 'AWG Online Edition – Statistics' },
    },
];

/**
 * Routed components of the {@link StatisticsViewModule}:
 * {@link StatisticsViewComponent}.
 */
export const routedStatisticsViewComponents = [StatisticsViewComponent];

/**
 * StatisticsView routing module.
 *
 * It activates the STATISTICS_VIEW_ROUTES.
 */
@NgModule({
    imports: [RouterModule.forChild(STATISTICS_VIEW_ROUTES)],
    exports: [RouterModule],
})
export class StatisticsViewRoutingModule {}