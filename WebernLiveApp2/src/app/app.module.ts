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
import { HomeViewComponent } from './components/views/home-view/home-view.component';
import { IntroViewComponent } from './components/views/intro-view/intro-view.component';
import { SearchViewComponent } from './components/views/search-view/search-view.component';
import { StructureViewComponent } from './components/views/structure-view/structure-view.component';
import { ModalComponent } from './components/framework/modal/modal.component';

const appRoutes: Routes = [
    { path: 'contact', component: ContactViewComponent },
    { path: 'edition', component: EditionViewComponent },
    { path: 'home', component: HomeViewComponent },
    { path: 'intro', component: IntroViewComponent },
    { path: 'search', component: SearchViewComponent },
    { path: 'structure', component: StructureViewComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full'  },
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
        HomeViewComponent,
        IntroViewComponent,
        SearchViewComponent,
        StructureViewComponent,
        ModalComponent
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
