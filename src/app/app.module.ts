import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';

//
// main app modules
import { AppComponent } from './app.component';
import { CoreModule } from '@awg-core/core.module';
import { SharedModule } from '@awg-shared/shared.module';
import { SideInfoModule } from '@awg-side-info/side-info.module';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';

/* load and register the used locale file */
registerLocaleData(localeDeDE);

/**
 * The bootstrapping app module.
 *
 * It embeds the {@link AppComponent} and its [routing definition]{@link AppRoutingModule}
 * as well as the {@link CoreModule}, {@link SharedModule} and {@link SideInfoModule}.
 */
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        CoreModule,
        SharedModule,
        SideInfoModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }], // change global LOCALE-ID
    bootstrap: [AppComponent]
})
export class AppModule {}
