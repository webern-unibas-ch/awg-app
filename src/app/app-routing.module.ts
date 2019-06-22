import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeViewComponent } from './views/home-view/home-view.component';
import { PageNotFoundViewComponent } from './views/page-not-found-view/page-not-found-view.component';

/* routes of the AppModule */
const appRoutes: Routes = [
    // eager loaded
    { path: 'home', component: HomeViewComponent },

    // lazy loaded
    { path: 'contact', loadChildren: () => import('./views/contact-view/contact.module').then(m => m.ContactModule) },
    { path: 'data', loadChildren: () => import('./views/data-view/data.module').then(m => m.DataModule) },
    { path: 'edition', loadChildren: () => import('./views/edition-view/edition.module').then(m => m.EditionModule) },
    { path: 'editions', redirectTo: 'edition', pathMatch: 'full' },
    {
        path: 'structure',
        loadChildren: () => import('./views/structure-view/structure.module').then(m => m.StructureModule)
    },

    // default routes
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundViewComponent }
];

/**
 * Routed components of the {@link AppModule}:
 * {@link HomeViewComponent} and {@link PageNotFoundViewComponent}.
 */
export const routedAppComponents = [HomeViewComponent, PageNotFoundViewComponent];

/**
 * Main app module routing.
 *
 * It activates the appRoutes, esp. lazy-loaded View Modules.
 */
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            anchorScrolling: 'enabled', // use anchor scrolling
            scrollPositionRestoration: 'enabled', // restore scroll position
            onSameUrlNavigation: 'reload', // reload when navigating to same url
            preloadingStrategy: PreloadAllModules // preload all lazy modules
            // enableTracing: true          // TODO: do not enable tracing for prodcution
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
