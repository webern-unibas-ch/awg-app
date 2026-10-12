import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeDeDE from '@angular/common/locales/de';
import {
    ApplicationConfig,
    inject,
    LOCALE_ID,
    provideAppInitializer,
    provideZonelessChangeDetection,
} from '@angular/core';
import {
    PreloadAllModules,
    provideRouter,
    withComponentInputBinding,
    withInMemoryScrolling,
    withPreloading,
    withRouterConfig,
} from '@angular/router';

import { loadingInterceptor } from '@awg-shared/loading/loading.interceptor';

import { EditionComplexesService } from '@awg-views/edition-view/services/edition-complexes.service';
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';

import { APP_ROUTES } from './app.routes';

/* Load and register the used locale file */
registerLocaleData(localeDeDE);

/**
 * The application config.
 *
 * It provides the app-wide providers for the bootstrapping
 * of the {@link AppComponent}: zoneless change detection, router (with the {@link APP_ROUTES}),
 * http client (with loading interceptor), locale and the initialization of the edition data.
 */
export const appConfig: ApplicationConfig = {
    providers: [
        provideZonelessChangeDetection(),
        provideRouter(
            APP_ROUTES,
            withComponentInputBinding(),
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
            withPreloading(PreloadAllModules),
            withRouterConfig({ onSameUrlNavigation: 'reload' })
        ),
        provideHttpClient(withInterceptors([loadingInterceptor])),
        { provide: LOCALE_ID, useValue: 'de-DE' }, // Change global LOCALE-ID
        provideAppInitializer(() => {
            const editionOutlineService = inject(EditionOutlineService);
            const editionComplexesService = inject(EditionComplexesService);

            editionComplexesService.initializeEditionComplexesList();
            editionOutlineService.initializeEditionOutline();
        }),
    ],
};
