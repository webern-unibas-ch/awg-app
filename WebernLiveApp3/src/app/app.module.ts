import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';

// import { ContactModule } from './views/contact/contact.module';
import { CoreModule } from './core/core.module';
/*
import { EditionModule } from './views/edition/edition.module';
import { ProjectModule } from './views/project/project.module';
import { ResearchModule } from './views/research/research.module';
import { WebernModule } from './views/webern/webern.module';
import { WorksModule } from './views/works/works.module';
*/

@NgModule({
    declarations: [ AppComponent, routedComponents ],
    imports: [
        BrowserModule, FormsModule, HttpModule,
       // ContactModule,
        CoreModule,
        /*
        EditionModule,
        ProjectModule,
        ResearchModule,
        WebernModule,
        WorksModule,
        */
        AppRoutingModule    // has to be last routed Module
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
