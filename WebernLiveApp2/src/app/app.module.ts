import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

//
// external modules
import { ButtonsModule, CarouselModule, ModalModule } from 'ngx-bootstrap';

//
// main app modules & routes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

//
// view modules
import { EditionsModule } from './views/edition-view/editions.module';
import { SearchModule } from './views/search-view/search.module';

//
// views
import { ContactViewComponent } from './views/contact-view/contact-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { PageNotFoundViewComponent } from './views/page-not-found-view/page-not-found-view.component';
import { StructureViewComponent } from './views/structure-view/structure-view.component';

//
// services
import { ApiService } from './core/services/api-service/api.service';
import { ConversionService } from './core/services/conversion-service/conversion.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,

        ButtonsModule.forRoot(),
        CarouselModule.forRoot(),
        ModalModule.forRoot(),

        CoreModule,
        EditionsModule.forRoot(),
        SearchModule.forRoot(),
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
    providers: [ ApiService, ConversionService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
