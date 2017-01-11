import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

//TODO: remove AlertModule?
import { AlertModule, ButtonsModule, ModalModule } from 'ng2-bootstrap';

//
// main app component & routes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//
// app modules
import { EditionsModule } from './components/views/edition-view/editions.module';
import { FrameworkModule } from './components/framework/framework.module';


//
// views
import { ContactViewComponent } from './components/views/contact-view/contact-view.component';
import { HomeViewComponent } from './components/views/home-view/home-view.component';
import { PageNotFoundViewComponent } from './components/views/page-not-found-view/page-not-found-view.component';
import { SearchViewComponent } from './components/views/search-view/search-view.component';
import { StructureViewComponent } from './components/views/structure-view/structure-view.component';


@NgModule({
    imports: [
        AlertModule.forRoot(), ButtonsModule.forRoot(), ModalModule.forRoot(),

        BrowserModule, HttpModule,

        EditionsModule.forRoot(),
        FrameworkModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,

        ContactViewComponent,
        HomeViewComponent,
        PageNotFoundViewComponent,
        SearchViewComponent,
        StructureViewComponent,
    ],
    providers: [],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
