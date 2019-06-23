import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';

import { of as observableOf, Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpCacheService } from '@awg-views/data-view/services';

/**
 * The Caching interceptor.
 *
 * It implements the `HttpInterceptor`
 * to intercept outgoing http requests and
 * it delegates them to the {@link HttpCacheService}.
 */
@Injectable({
    providedIn: 'root'
})
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

    // private cache = {};

    /**
     * Method: intercept.
     *
     * It intercepts outgoing http requests and
     * delegates them to the {@link HttpCacheService}.
     *
     * @param {HttpRequest<any>} req An HttpRequest to be intercepted.
     * @param {HttpHandler} next An HttpHandler.
     * @returns {Observable<HttpEvent<any>>} An HttpEvent observable.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // TODO: rm
        // console.log('------------> CachingInterceptor');
        // console.log('CI# RequestUrl: ', req.urlWithParams);

        const started = Date.now();

        if (req.method !== 'GET') {
            return next.handle(req);
        }

        // check the cache for existing responses
        const cachedResponse = this.cache.get(req);
        if (cachedResponse) {
            // TODO: rm
            // console.log('CI# cachedResponse: ', cachedResponse);
            // console.log('<------------ END CachingInterceptor');

            // serve existing cached response
            return observableOf(cachedResponse.clone());
        }

        // cache the new response
        return next.handle(req).pipe(
            tap(event => {
                // Remember, there may be other events besides just the response.
                if (event instanceof HttpResponse) {
                    const elapsed = Date.now() - started;

                    // TODO: rm
                    // console.log('CI# caching new response ---> req, event:', req, event);
                    // console.log(`Request took ${elapsed} ms.`);

                    // Update the cache.
                    this.cache.put(req, event.clone());

                    // TODO: rm
                    // console.log('<------------ END CachingInterceptor ');
                }
            }),
            catchError(response => {
                if (response instanceof HttpErrorResponse) {
                    console.log('CachingInterceptor: Processing http error', response);
                }

                return observableThrowError(response);
            })
        );
    }
}
