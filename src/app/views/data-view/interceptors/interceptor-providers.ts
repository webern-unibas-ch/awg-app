import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CachingInterceptor } from './caching.interceptor';

/**
 * httpInterceptorProviders for the search view.
 *
 * They allow to intercept and cache the search requests
 * using the {@link CachingInterceptor}.
 *
 */
export const httpInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: CachingInterceptor,
        multi: true
    }
];
