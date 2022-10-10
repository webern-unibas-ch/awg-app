import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeViewComponent } from '@awg-views/home-view/home-view.component';

/* Routes of the AppModule */
const APP_ROUTES: Routes = [
    // Default route
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeViewComponent,
        data: { title: 'AWG Online Edition – Home' },
    },

    // Lazy loaded routes
    {
        path: 'contact',
        loadChildren: () => import('@awg-views/contact-view/contact-view.module').then(m => m.ContactViewModule),
    },
    {
        path: 'data',
        loadChildren: () => import('@awg-views/data-view/data-view.module').then(m => m.DataViewModule),
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
        path: 'structure',
        loadChildren: () => import('@awg-views/structure-view/structure-view.module').then(m => m.StructureViewModule),
    },

    // Fallback routes
    {
        path: '404',
        loadChildren: () =>
            import('@awg-views/page-not-found-view/page-not-found-view.module').then(m => m.PageNotFoundViewModule),
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full',
    },
];

/**
 * Routed components of the {@link AppModule}:
 * {@link HomeViewComponent}.
 */
export const routedAppComponents = [HomeViewComponent];

/**
 * Main app module routing.
 *
 * It activates the APP_ROUTES, esp. lazy-loaded View Modules.
 */
@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES, {
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload',
            scrollPositionRestoration: 'enabled',
            preloadingStrategy: PreloadAllModules, // Preload all lazy modules
            // EnableTracing: true          // TODO: do not enable tracing for production
            relativeLinkResolution: 'corrected',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
