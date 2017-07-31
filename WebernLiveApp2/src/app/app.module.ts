import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

//
// external modules
import { ButtonsModule, CarouselModule, ModalModule } from 'ngx-bootstrap';

//
// main app modules & routes
import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

//
// view modules
import { EditionModule } from './views/edition-view/edition.module';
import { SearchModule } from './views/search-view/search.module';

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
        EditionModule.forRoot(),
        SearchModule.forRoot(),
        SharedModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        routedComponents
    ],
    providers: [ ApiService, ConversionService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
