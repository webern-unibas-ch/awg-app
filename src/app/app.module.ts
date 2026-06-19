import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeDeDE from '@angular/common/locales/de';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

//
// Main app modules
import { CoreModule } from '@awg-core/core.module';
import { SharedModule } from '@awg-shared/shared.module';
import { SideInfoModule } from '@awg-side-info/side-info.module';
import { AppComponent } from './app.component';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';

/* Load and register the used locale file */
registerLocaleData(localeDeDE);

/**
 * The bootstrapping app module.
 *
 * It embeds the {@link AppComponent} and its [routing definition]{@link AppRoutingModule}
 * as well as the {@link CoreModule}, {@link SharedModule} and {@link SideInfoModule}.
 */
@NgModule({
    imports: [BrowserModule, CoreModule, SharedModule, SideInfoModule, AppRoutingModule],
    declarations: [AppComponent],
    providers: [
        { provide: LOCALE_ID, useValue: 'de-DE' }, // Change global LOCALE-ID
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
