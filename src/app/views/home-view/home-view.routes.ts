import { Routes } from '@angular/router';

import { HomeViewComponent } from './home-view.component';

/**
 * The routes for the home view.
 */
export const HOME_VIEW_ROUTES: Routes = [
    {
        path: 'home',
        component: HomeViewComponent,
        data: { title: 'AWG Online Edition – Home' },
    },
];
