import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CachingInterceptor } from './caching/caching.interceptor';
import { LoadingInterceptor } from './loading/loading.interceptor';

/**
 * HttpInterceptorProviders for the data (search) view.
 *
 * They allow to intercept and cache the search requests
 * using the {@link CachingInterceptor} and to
 * update the loading status using the {@link LoadingInterceptor}.
 *
 */
export const httpInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: CachingInterceptor,
        multi: true,
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true,
    },
];
