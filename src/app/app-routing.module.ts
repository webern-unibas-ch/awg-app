import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

/* Routes of the AppModule */
const appRoutes: Routes = [
    // Lazy loaded
    {
        path: 'home',
        loadChildren: () => import('@awg-views/home-view/home-view.module').then(m => m.HomeViewModule),
    },
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

    // Default routes
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
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
 * Main app module routing.
 *
 * It activates the appRoutes, esp. lazy-loaded View Modules.
 */
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload',
            scrollPositionRestoration: 'enabled',
            preloadingStrategy: PreloadAllModules, // Preload all lazy modules
            // EnableTracing: true          // TODO: do not enable tracing for production
            relativeLinkResolution: 'legacy',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
