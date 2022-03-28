import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';

import { of as observableOf, Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpCacheService } from '@awg-core/services';

/**
 * The Caching interceptor.
 *
 * It implements the `HttpInterceptor`
 * to intercept outgoing http requests and
 * to delegate them to the {@link HttpCacheService}.
 */
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    /**
     * Constructor of the CachingInterceptor.
     *
     * It declares a private {@link HttpCacheService} instance
     * to handle the caching of http responses.
     *
     * @param {HttpCacheService} cache Instance of the HttpCacheService.
     */
    constructor(private cache: HttpCacheService) {}

    /**
     * Public method: intercept.
     *
     * It intercepts outgoing http requests and
     * delegates them to the {@link HttpCacheService}.
     *
     * @param {HttpRequest<any>} req An HttpRequest to be intercepted.
     * @param {HttpHandler} next An HttpHandler.
     *
     * @returns {Observable<HttpEvent<any>>} An HttpEvent observable.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method !== 'GET') {
            return next.handle(req);
        }

        // Check the cache for existing responses
        const cachedResponse = this.cache.get(req);
        if (cachedResponse) {
            // Serve existing cached response
            return observableOf(cachedResponse.clone());
        }

        // Cache the new response
        return next.handle(req).pipe(
            tap(event => {
                // Remember, there may be other events besides just the response
                if (event instanceof HttpResponse) {
                    // Update the cache
                    this.cache.put(req, event.clone());
                }
            }),
            catchError(response => {
                if (response instanceof HttpErrorResponse) {
                    console.error('CachingInterceptor: Processing http error', response);
                }

                return observableThrowError(() => response);
            })
        );
    }
}
