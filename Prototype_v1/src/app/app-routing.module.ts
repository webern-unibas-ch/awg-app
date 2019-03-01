import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeViewComponent } from './views/home-view/home-view.component';
import { PageNotFoundViewComponent } from './views/page-not-found-view/page-not-found-view.component';

const appRoutes: Routes = [
    // eager loaded
    { path: 'home', component: HomeViewComponent },

    // lazy loaded
    { path: 'contact', loadChildren: './views/contact-view/contact.module#ContactModule' },
    { path: 'data', loadChildren: './views/data-view/data.module#DataModule' },
    { path: 'edition', loadChildren: './views/edition-view/edition.module#EditionModule' },
    { path: 'editions', redirectTo: 'edition', pathMatch: 'full' },
    { path: 'structure', loadChildren: './views/structure-view/structure.module#StructureModule' },

    // default routes
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundViewComponent }
];

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

export const routedComponents = [HomeViewComponent, PageNotFoundViewComponent];
