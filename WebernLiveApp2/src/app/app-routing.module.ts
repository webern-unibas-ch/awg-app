import { NgModule } from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { HomeViewComponent } from './components/views/home-view/home-view.component';
import { ContactViewComponent } from './components/views/contact-view/contact-view.component';
import { StructureViewComponent } from './components/views/structure-view/structure-view.component';
import { SearchViewComponent } from './components/views/search-view/search-view.component';
import { PageNotFoundViewComponent } from './components/views/page-not-found-view/page-not-found-view.component';


const appRoutes: Routes = [
    { path: 'home', component: HomeViewComponent },
    // { path: 'edition', loadChildren: 'app/components/views/edition-view/editions.module#EditionsModule'},
    { path: 'structure', component: StructureViewComponent },
    { path: 'search', component: SearchViewComponent },
    { path: 'contact', component: ContactViewComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundViewComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(appRoutes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }
