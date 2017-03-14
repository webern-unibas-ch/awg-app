import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';

// import { ContactModule } from './views/contact/contact.module';
import { CoreModule } from './core/core.module';
import { HomeModule } from './views/home/home.module';
import { EditionModule } from './views/edition/edition.module';
import { SearchModule } from './views/search/search.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
    declarations: [ AppComponent, routedComponents ],
    imports: [
        BrowserModule, FormsModule, HttpModule,
        MaterialModule,
       // ContactModule,
        CoreModule,
        HomeModule,
        EditionModule,
        SearchModule,
        SharedModule,
        AppRoutingModule    // has to be last routed Module
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
