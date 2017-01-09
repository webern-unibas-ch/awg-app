import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

//TODO: remove?
import { AlertModule, ButtonsModule, ModalModule } from 'ng2-bootstrap';

//
// main app component
import { AppComponent } from './app.component';

//
// framework components
import { FooterComponent } from './components/framework/footer/footer.component';
import { NavbarComponent } from './components/framework/navbar/navbar.component';

//
// view components
import { ContactViewComponent } from './components/views/contact-view/contact-view.component';
import { EditionViewComponent } from './components/views/edition-view/edition-view.component';
import { EditionHeadingComponent } from './components/views/edition-view/edition-heading/edition-heading.component';
import { EditionImageControlComponent } from './components/views/edition-view/edition-image-control/edition-image-control.component';
import { EditionSvgPanelComponent } from './components/views/edition-view/edition-svg-panel/edition-svg-panel.component';
import { EditionTkaTableComponent } from './components/views/edition-view/edition-tka-table/edition-tka-table.component';
import { HomeViewComponent } from './components/views/home-view/home-view.component';
import { IntroViewComponent } from './components/views/intro-view/intro-view.component';
import { SearchViewComponent } from './components/views/search-view/search-view.component';
import { StructureViewComponent } from './components/views/structure-view/structure-view.component';
import { ModalComponent } from './components/framework/modal/modal.component';
import { SidenavComponent } from './components/framework/sidenav/sidenav.component';
import { SidenavOutlet } from './components/framework/sidenav-outlet.directive';

const appRoutes: Routes = [
    { path: 'home', component: HomeViewComponent },
    { path: 'intro', component: IntroViewComponent },
    { path: 'edition', component: EditionViewComponent },

    // TODO
    { path: 'edition/:id', redirectTo: 'edition' },

    { path: 'structure', component: StructureViewComponent },
    { path: 'search', component: SearchViewComponent },
    { path: 'contact', component: ContactViewComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    /* ,
    { path: '**', component: PageNotFoundComponent }
    */
];

@NgModule({
    declarations: [
        AppComponent,

        FooterComponent,
        NavbarComponent,

        ContactViewComponent,
        EditionViewComponent,
        EditionHeadingComponent,
        EditionImageControlComponent,
        EditionSvgPanelComponent,
        EditionTkaTableComponent,
        HomeViewComponent,
        IntroViewComponent,
        SearchViewComponent,
        StructureViewComponent,
        ModalComponent,
        SidenavComponent,
        SidenavOutlet
    ],
    imports: [
        AlertModule.forRoot(),
        ButtonsModule.forRoot(),
        ModalModule.forRoot(),

        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
