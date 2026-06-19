import { NgModule } from '@angular/core';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HOME_VIEW_ROUTES } from '@awg-views/home-view/home-view.routes';

/* Routes of the AppModule */
const APP_ROUTES: Routes = [
    // Default route
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },

    ...HOME_VIEW_ROUTES,

    // Lazy loaded routes
    {
        path: 'contact',
        loadChildren: () => import('@awg-views/contact-view/contact-view.routes').then(m => m.CONTACT_VIEW_ROUTES),
    },
    {
        path: 'edition',
        loadChildren: () => import('@awg-views/edition-view/edition-view.module').then(m => m.EditionViewModule),
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

/**
 * Options for the app routes.
 */
const APP_ROUTER_OPTIONS: ExtraOptions = {
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: PreloadAllModules,
};

/**
 * Main app module routing.
 *
 * It activates the APP_ROUTES, esp. lazy-loaded View Modules.
 */
@NgModule({
    imports: [RouterModule.forRoot(APP_ROUTES, APP_ROUTER_OPTIONS)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
