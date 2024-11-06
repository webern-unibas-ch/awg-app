import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LoadingService } from '@awg-core/services';

/**
 * The Loading interceptor.
 *
 * It implements the `HttpInterceptor`
 * to intercept outgoing http pendingRequests and
 * to delegate a loading status to the {@link LoadingService}.
 *
 * @see Jørn Are Hatlelid: Loading-status in Angular done right, April 18, 2018.
 * {@link https://medium.com/grensesnittet/loading-status-in-angular-done-right-aeed09cfbea6}.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    /**
     * Private readonly variable: _pendingRequests.
     *
     * It stores the array of pending requests.
     */
    private readonly _pendingRequests: HttpRequest<any>[] = [];

    /**
     * Private readonly injection variable: _loadingService.
     *
     * It injects the LoadingService.
     */
    private readonly _loadingService = inject(LoadingService);

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
        // Store the request
        this._pendingRequests.push(req);

        // Start loading and update status
        this._loadingService.updateLoadingStatus(true);

        // Create a new observable to return instead of the original
        return new Observable(observer => {
            // Subscribe to the original observable to ensure the HttpRequest is made
            const subscription = next.handle(req).subscribe({
                next: event => {
                    if (event instanceof HttpResponse) {
                        this._decreaseRequest(req);
                        observer.next(event);
                    }
                },
                error: err => {
                    this._decreaseRequest(req);
                    observer.error(err);
                },
                complete: () => {
                    if (this._pendingRequests.length > 0) {
                        this._decreaseRequest(req);
                    }
                    observer.complete();
                },
            });
            // Return teardown logic in case of cancelled requests
            return () => {
                if (this._pendingRequests.length > 0) {
                    this._decreaseRequest(req);
                }
                subscription.unsubscribe();
            };
        });
    }

    /**
     * Private method: _decreaseRequest.
     *
     * It removes a given http request from the pendingRequests array
     * and sets the loading status of the {@link LoadingService}
     * depending on the pending requests.
     *
     * @param {HttpRequest<any>} req The given HttpRequest to be removed.
     *
     * @returns {void} Sets the loading status.
     */
    private _decreaseRequest(req: HttpRequest<any>): void {
        // Find index position of request in pending requests array
        const i = this._pendingRequests.indexOf(req);

        /* istanbul ignore else */
        if (i >= 0) {
            // Remove the request from the array
            this._pendingRequests.splice(i, 1);
        }

        // Update loading status depending on the pending requests
        this._loadingService.updateLoadingStatus(this._pendingRequests.length > 0);
    }
}
