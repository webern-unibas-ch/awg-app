import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeViewComponent } from './views/home-view/home-view.component';
import { ContactViewComponent } from './views/contact-view/contact-view.component';
import { StructureViewComponent } from './views/structure-view/structure-view.component';
import { PageNotFoundViewComponent } from './views/page-not-found-view/page-not-found-view.component';


const appRoutes: Routes = [
    { path: 'home', component: HomeViewComponent },
    // { path: 'edition', loadChildren: 'app/components/views/edition-view/editions.module#EditionsModule'},
    { path: 'structure', component: StructureViewComponent },
    // { path: 'search', loadChildren: 'app/components/views/search-view/search.module#SearchModule'},
    { path: 'contact', component: ContactViewComponent },

    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundViewComponent }
];

@NgModule({
    // TODO: rm route tracing for prodcution
    imports: [ RouterModule.forRoot(appRoutes, {enableTracing: true}) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }

export const routedComponents = [
    ContactViewComponent,
    HomeViewComponent,
    StructureViewComponent,
    PageNotFoundViewComponent,
];
