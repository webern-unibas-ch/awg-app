import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeViewComponent } from './views/home-view/home-view.component';
import { ContactViewComponent } from './views/contact-view/contact-view.component';
import { StructureViewComponent } from './views/structure-view/structure-view.component';
import { PageNotFoundViewComponent } from './views/page-not-found-view/page-not-found-view.component';


const appRoutes: Routes = [
    // eager loaded
    { path: 'home', component: HomeViewComponent },
    { path: 'structure', component: StructureViewComponent },
    { path: 'contact', component: ContactViewComponent },

    // lazy loaded
    { path: 'edition', loadChildren: './views/edition-view/edition.module#EditionModule'},
    { path: 'editions', redirectTo: 'edition', pathMatch: 'full' },

    { path: 'search', loadChildren: './views/search-view/search.module#SearchModule'},

    // default routes
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundViewComponent }
];

@NgModule({
    // TODO: rm route tracing for prodcution
    imports: [ RouterModule.forRoot(appRoutes)], // , {enableTracing: true}
    exports: [ RouterModule ]
})
export class AppRoutingModule { }

export const routedComponents = [
    ContactViewComponent,
    HomeViewComponent,
    StructureViewComponent,
    PageNotFoundViewComponent,
];
