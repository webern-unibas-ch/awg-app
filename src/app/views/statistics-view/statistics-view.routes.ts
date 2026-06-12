import { Routes } from '@angular/router';

import { StatisticsViewComponent } from './statistics-view.component';

/**
 * The routes for the statistics view.
 */
export const STATISTICS_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: StatisticsViewComponent,
        data: { title: 'AWG Online Edition – Statistics' },
    },
];
