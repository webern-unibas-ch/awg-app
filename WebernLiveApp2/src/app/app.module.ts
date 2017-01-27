import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

//
// external modules
//TODO: remove AlertModule?
import { AlertModule, ButtonsModule, CarouselModule, ModalModule } from 'ng2-bootstrap';

//
// main app component/module & routes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//
// app modules
import { CoreModule } from './core/core.module';
import { EditionsModule } from './views/edition-view/editions.module';
import { SearchModule } from './views/search-view/search.module';
import { SharedModule } from './shared/shared.module';

//
// views
import { ContactViewComponent } from './views/contact-view/contact-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { PageNotFoundViewComponent } from './views/page-not-found-view/page-not-found-view.component';
import { StructureViewComponent } from './views/structure-view/structure-view.component';

//
// services
import { ApiService } from './api-service/api.service';
import { SearchService } from './views/search-view/search.service';


@NgModule({
    imports: [
        BrowserModule, HttpModule,

        AlertModule.forRoot(), ButtonsModule.forRoot(),
        CarouselModule.forRoot(), ModalModule.forRoot(),

        CoreModule,
        EditionsModule.forRoot(),
        SearchModule,
        SharedModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,

        ContactViewComponent,
        HomeViewComponent,
        PageNotFoundViewComponent,
        StructureViewComponent,
    ],
    providers: [ ApiService, SearchService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
