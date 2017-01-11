import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//TODO: remove AlertModule?
import { AlertModule, ButtonsModule, ModalModule } from 'ng2-bootstrap';

//
// main app component & routes
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//
// framework components
import { FooterComponent } from './components/framework/footer/footer.component';
import { ModalComponent } from './components/framework/modal/modal.component';
import { NavbarComponent } from './components/framework/navbar/navbar.component';
import { SidenavComponent } from './components/framework/sidenav/sidenav.component';
import { SidenavOutlet } from './components/framework/sidenav-outlet.directive';

//
// view components
import { ContactViewComponent } from './components/views/contact-view/contact-view.component';
import { EditionViewComponent } from './components/views/edition-view/edition-view.component';
import { EditionHeadingComponent } from './components/views/edition-view/edition-heading/edition-heading.component';
import { EditionSheetControlComponent } from './components/views/edition-view/edition-sheet-control/edition-sheet-control.component';
import { EditionSvgPanelComponent } from './components/views/edition-view/edition-svg-panel/edition-svg-panel.component';
import { EditionTkaTableComponent } from './components/views/edition-view/edition-tka-table/edition-tka-table.component';
import { HomeViewComponent } from './components/views/home-view/home-view.component';
import { IntroViewComponent } from './components/views/intro-view/intro-view.component';
import { PageNotFoundViewComponent } from './components/views/page-not-found-view/page-not-found-view.component';
import { SearchViewComponent } from './components/views/search-view/search-view.component';
import { StructureViewComponent } from './components/views/structure-view/structure-view.component';

import { MapToIterablePipe } from './shared/map-to-iterable.pipe';

@NgModule({
    declarations: [
        AppComponent,

        FooterComponent,
        ModalComponent,
        NavbarComponent,
        SidenavComponent,
        SidenavOutlet,

        ContactViewComponent,
        EditionViewComponent,
        EditionHeadingComponent,
        EditionSheetControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent,
        HomeViewComponent,
        IntroViewComponent,
        PageNotFoundViewComponent,
        SearchViewComponent,
        StructureViewComponent,

        MapToIterablePipe
    ],
    imports: [
        AlertModule.forRoot(),
        ButtonsModule.forRoot(),
        ModalModule.forRoot(),

        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
