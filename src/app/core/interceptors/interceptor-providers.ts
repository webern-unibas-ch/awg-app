import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoadingInterceptor } from './loading/loading.interceptor';

/**
 * HttpInterceptorProviders for the data (search) view.
 *
 * They allow to update the loading status using the {@link LoadingInterceptor}.
 *
 */
export const httpInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true,
    },
];
