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
import { SideInfoModule } from './side-info/side-info.module';


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
        SideInfoModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        routedComponents
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
