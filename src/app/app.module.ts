import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';

//
// main app modules & routes
import { AppComponent } from './app.component';
import { AppRoutingModule, routedComponents } from './app-routing.module';
import { CoreModule } from '@awg-core/core.module';
import { SharedModule } from '@awg-shared/shared.module';
import { SideInfoModule } from '@awg-side-info/side-info.module';

//
//  load and register the used locale file
registerLocaleData(localeDeDE);

@NgModule({
    imports: [BrowserModule, HttpClientModule, CoreModule, SharedModule, SideInfoModule, AppRoutingModule],
    declarations: [AppComponent, routedComponents],
    providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }], // change global LOCALE-ID
    bootstrap: [AppComponent]
})
export class AppModule {}
