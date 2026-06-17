import { Routes } from '@angular/router';

import { PageNotFoundViewComponent } from '@awg-views/page-not-found-view/page-not-found-view.component';

/**
 * The routes for the page not found view.
 */
export const PAGE_NOT_FOUND_VIEW_ROUTES: Routes = [
    {
        path: '',
        component: PageNotFoundViewComponent,
        data: { title: 'AWG Online Edition – 404' },
    },
];
