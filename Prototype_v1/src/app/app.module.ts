import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

//
// external modules
import { AccordionModule, ButtonsModule, CarouselModule, ModalModule } from 'ngx-bootstrap';

//
// main app modules & routes
import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

//
// feature modules
import { EditionModule } from './views/edition-view/edition.module';
import { SearchModule } from './views/search-view/search.module';
import { SideInfoModule } from './side-info/side-info.module';

//
// services
import { ApiService } from './core/services/api-service/api.service';
import { ConversionService } from './core/services/conversion-service/conversion.service';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,

        AccordionModule.forRoot(),
        ButtonsModule.forRoot(),
        CarouselModule.forRoot(),
        ModalModule.forRoot(),

        CoreModule,
        SharedModule,
        EditionModule.forRoot(),
        SearchModule.forRoot(),
        SideInfoModule.forRoot(),
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
