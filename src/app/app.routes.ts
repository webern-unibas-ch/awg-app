import { Routes } from '@angular/router';

import { HOME_VIEW_ROUTES } from '@awg-views/home-view/home-view.routes';

/**
 * The routes of the app.
 *
 * The home view is loaded eagerly, all other views are lazy-loaded.
 */
export const APP_ROUTES: Routes = [
    // Default route
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: '',
        children: HOME_VIEW_ROUTES,
    },

    // Lazy loaded routes
    {
        path: 'contact',
        loadChildren: () => import('@awg-views/contact-view/contact-view.routes').then(m => m.CONTACT_VIEW_ROUTES),
    },
    {
        path: 'edition',
        loadChildren: () => import('@awg-views/edition-view/edition-view.routes').then(m => m.EDITION_VIEW_ROUTES),
    },
    {
        path: 'editions',
        redirectTo: 'edition',
        pathMatch: 'full',
    },
    {
        path: 'statistics',
        loadChildren: () =>
            import('@awg-views/statistics-view/statistics-view.routes').then(m => m.STATISTICS_VIEW_ROUTES),
    },
    {
        path: 'structure',
        loadChildren: () =>
            import('@awg-views/structure-view/structure-view.routes').then(m => m.STRUCTURE_VIEW_ROUTES),
    },

    // Fallback routes
    {
        path: '404',
        loadChildren: () =>
            import('@awg-views/page-not-found-view/page-not-found-view.routes').then(m => m.PAGE_NOT_FOUND_VIEW_ROUTES),
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full',
    },
];
