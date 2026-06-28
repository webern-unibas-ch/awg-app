import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize, Observable } from 'rxjs';

import { LoadingService } from './loading.service';

/**
 * Object variable: pendingRequests.
 *
 * Shared array to track all currently active HTTP requests.
 */
let pendingRequests: HttpRequest<unknown>[] = [];

/**
 * The Loading interceptor.
 *
 * It intercepts outgoing HTTP requests, registers them, and delegates
 * the application's overall loading status to the {@link LoadingService}.
 * It automatically handles request completion, errors, and cancellations.
 *
 * @param {HttpRequest<unknown>} req The outgoing HTTP request.
 * @param {HttpHandlerFn} next The next interceptor or backend handler in the chain.
 *
 * @returns {Observable<HttpEvent<unknown>>} An observable of the HTTP event stream.
 */
export const loadingInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const loadingService = inject(LoadingService);

    // Register the request in the pendingRequests array and set loading status to true
    pendingRequests.push(req);
    loadingService.updateLoadingStatus(true);

    // Handle the request and finalize the loading status when the request completes
    return next(req).pipe(
        finalize(() => {
            // Remove the request from the pendingRequests array
            pendingRequests = pendingRequests.filter(activeReq => activeReq !== req);

            // Update the loading status based on the number of pending requests
            loadingService.updateLoadingStatus(pendingRequests.length > 0);
        })
    );
};
