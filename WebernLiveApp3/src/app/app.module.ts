import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

//
// main app
import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';

//
// feature modules
// import { ContactModule } from './views/contact/contact.module';
import { CoreModule } from './core/core.module';
import { HomeModule } from './views/home/home.module';
import { EditionModule } from './views/edition/edition.module';
import { SearchModule } from './views/search/search.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
    declarations: [ AppComponent, routedComponents ],
    imports: [
        BrowserModule, HttpModule,
        // ContactModule,
        CoreModule,
        SharedModule,
        HomeModule,
        EditionModule.forRoot(),
        SearchModule.forRoot(),
        AppRoutingModule    // has to be last routed Module
    ],
    providers: [ ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
