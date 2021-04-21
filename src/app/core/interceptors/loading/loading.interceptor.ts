import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { LoadingService } from '@awg-core/services';

/**
 * The Loading interceptor.
 *
 * It implements the `HttpInterceptor`
 * to intercept outgoing http pendingRequests and
 * to delegate a loading status to the  {@link LoadingService}.
 *
 * @see Jørn Are Hatlelid: Loading-status in Angular done right, April 18, 2018.
 * {@link https://medium.com/grensesnittet/loading-status-in-angular-done-right-aeed09cfbea6}.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    /**
     * Private variable: pendingRequests.
     *
     * It stores the array of pending requests.
     */
    private pendingRequests: HttpRequest<any>[] = [];

    /**
     * Constructor of the LoadingInterceptor.
     *
     * It declares a private {@link LoadingService} instance
     * to handle the loading status.
     *
     * @param {LoadingService} loadingService Instance of the LoadingService.
     */
    constructor(private loadingService: LoadingService) {}

    /**
     * Private method: decreaseRequest.
     *
     * It removes a given http request from the pendingRequests array
     * and sets the loading status of the {@link LoadingService}
     * depending on the pending requests.
     *
     * @param {HttpRequest<any>} req The given HttpRequest to be removed.
     *
     * @returns {void} Sets the loading status.
     */
    private decreaseRequest(req: HttpRequest<any>): void {
        // Find index position of request in pending requests array
        const i = this.pendingRequests.indexOf(req);

        /*
        Console.log('------------> ');
        console.log('i', i);
        console.log('length BEFORE', this.pendingRequests.length);
        console.log('pendingRequests', [...this.pendingRequests]);
        console.log(req.urlWithParams);
        */

        /* istanbul ignore else  */
        if (i >= 0) {
            // Remove the request from the array
            this.pendingRequests.splice(i, 1);
        }

        /*
        Console.log('length AFTER', this.pendingRequests.length);
        console.log('loading > ', this.pendingRequests.length > 0);
        */

        // Update loading status depending on the pending requests
        this.loadingService.updateLoadingStatus(this.pendingRequests.length > 0);
    }

    /**
     * Public method: intercept.
     *
     * It intercepts outgoing http requests and
     * delegates them to the {@link LoadingService}.
     *
     * @param {HttpRequest<any>} req An HttpRequest to be intercepted.
     * @param {HttpHandler} next An HttpHandler.
     *
     * @returns {Observable<HttpEvent<any>>} An HttpEvent observable.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Console.log('LOADINGINTERCEPTOR ------------>');

        // Store the request
        this.pendingRequests.push(req);

        // Console.log('REQ', req);

        // Start loading and update status
        this.loadingService.updateLoadingStatus(true);

        // Create a new observable to return instead of the original
        return new Observable(observer => {
            // Subscribe to the original observable to ensure the HttpRequest is made
            const subscription = next.handle(req).subscribe(
                event => {
                    if (event instanceof HttpResponse) {
                        // Console.warn('------------> event', event.url);
                        this.decreaseRequest(req);
                        observer.next(event);
                    }
                },
                err => {
                    // Console.warn('------------> err', err);
                    this.decreaseRequest(req);
                    observer.error(err);
                },
                () => {
                    // Console.warn('------------> complete');
                    if (this.pendingRequests.length > 0) {
                        this.decreaseRequest(req);
                    }
                    observer.complete();
                }
            );
            // Return teardown logic in case of cancelled requests
            return () => {
                // Console.warn('------------> teardown');
                if (this.pendingRequests.length > 0) {
                    this.decreaseRequest(req);
                }
                subscription.unsubscribe();
            };
        });
    }
}
