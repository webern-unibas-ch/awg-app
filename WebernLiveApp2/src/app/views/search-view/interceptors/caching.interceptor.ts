import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import {HttpCacheService} from '../services';


@Injectable()
export class CachingInterceptor implements HttpInterceptor {

    constructor(private cache: HttpCacheService) {}

    // private cache = {};

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        console.log('CachingInterceptor: intercepted request ... ');

        const started = Date.now();

        // Before doing anything, it's important to only cache GET requests.
        // Skip this interceptor if the request method isn't GET.
        if (req.method !== 'GET') {
            return next.handle(req);
        }

        // First, check the cache to see if this request exists.
        console.log('CachingInterceptor: looking for cachedResponse ... ');

        const cachedResponse = this.cache.get(req);
        if (cachedResponse) {
            console.log('CachingInterceptor: returning cachedResponse of ', req.urlWithParams);
            console.log('CachingInterceptor ---> cachedResponse: ', cachedResponse);

            // A cached response exists. Serve it instead of forwarding
            // the request to the next handler.
            return Observable.of(cachedResponse.clone());
        }

        console.log('CachingInterceptor: no cachedResponse ... ');

        // No cached response exists. Go to the network, and cache
        // the response when it arrives.
        return next.handle(req)
            .do(event => {

                console.log(`CachingInterceptor ---> next handle for ${req.urlWithParams}`);

                // Remember, there may be other events besides just the response.
                if (event instanceof HttpResponse) {

                    const elapsed = Date.now() - started;

                    // Update the cache.
                    console.log('CachingInterceptor ---> req:', req);
                    console.log('CachingInterceptor ---> event:', event);
                    console.log(`Request took ${elapsed} ms.`);

                    this.cache.put(req, event.clone());
                }
            })
            .catch(response => {
                if (response instanceof HttpErrorResponse) {
                    console.log('CachingInterceptor: Processing http error', response);
                }

                return Observable.throw(response);
            });
    }
}
