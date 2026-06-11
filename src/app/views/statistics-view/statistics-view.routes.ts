import { Routes } from '@angular/router';

import { StatisticsViewComponent } from './statistics-view.component';

/* Routes for the StatisticsView */
export const STATISTICS_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: StatisticsViewComponent,
        data: { title: 'AWG Online Edition – Statistics' },
    },
];
