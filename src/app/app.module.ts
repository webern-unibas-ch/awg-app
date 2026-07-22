import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeDeDE from '@angular/common/locales/de';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

//
// Main app modules
import { SharedModule } from '@awg-shared/shared.module';
import { AppComponent } from './app.component';

// Core components
import { FooterComponent } from './core/footer/footer.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { ViewContainerComponent } from './core/view-container/view-container.component';

// Services
import { EditionComplexesService, EditionOutlineService } from '@awg-views/edition-view/services';

// Loading interceptor
import { loadingInterceptor } from './shared/loading/loading.interceptor';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';

/* Load and register the used locale file */
registerLocaleData(localeDeDE);

/**
 * The bootstrapping app module.
 *
 * It embeds the {@link AppComponent} and its [routing definition]{@link AppRoutingModule},
 * the {@link SharedModule} and {@link SideInfoModule} as well as the {@link FooterComponent},
 * {@link NavbarComponent} and {@link ViewContainerComponent}.
 */
@NgModule({
    imports: [BrowserModule, FooterComponent, NavbarComponent, ViewContainerComponent, SharedModule, AppRoutingModule],
    declarations: [AppComponent],
    providers: [
        { provide: LOCALE_ID, useValue: 'de-DE' }, // Change global LOCALE-ID
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideAnimations(),
        Title,
        {
            provide: APP_INITIALIZER,
            useFactory:
                (editionOutlineService: EditionOutlineService, editionComplexesService: EditionComplexesService) =>
                () => {
                    editionComplexesService.initializeEditionComplexesList();
                    editionOutlineService.initializeEditionOutline();
                },
            deps: [EditionOutlineService, EditionComplexesService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
