import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

/* routes of the AppModule */
const appRoutes: Routes = [
    // lazy loaded
    { path: 'home', loadChildren: () => import('@awg-views/home-view/home-view.module').then(m => m.HomeViewModule) },
    {
        path: 'contact',
        loadChildren: () => import('@awg-views/contact-view/contact-view.module').then(m => m.ContactViewModule)
    },
    { path: 'data', loadChildren: () => import('@awg-views/data-view/data-view.module').then(m => m.DataViewModule) },
    {
        path: 'edition',
        loadChildren: () => import('@awg-views/edition-view/edition-view.module').then(m => m.EditionViewModule)
    },
    { path: 'editions', redirectTo: 'edition', pathMatch: 'full' },
    {
        path: 'structure',
        loadChildren: () => import('@awg-views/structure-view/structure-view.module').then(m => m.StructureViewModule)
    },

    // default routes
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '404',
        loadChildren: () =>
            import('@awg-views/page-not-found-view/page-not-found-view.module').then(m => m.PageNotFoundViewModule)
    },
    { path: '**', redirectTo: '404', pathMatch: 'full' }
];

/**
 * Main app module routing.
 *
 * It activates the appRoutes, esp. lazy-loaded View Modules.
 */
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            anchorScrolling: 'enabled', // use anchor scrolling
            onSameUrlNavigation: 'reload', // reload when navigating to same url
            scrollPositionRestoration: 'enabled', // restore scroll position
            preloadingStrategy: PreloadAllModules // preload all lazy modules
            // enableTracing: true          // TODO: do not enable tracing for production
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
