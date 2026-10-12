import { HttpRequest } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';

/**
 * The Loading service.
 *
 * It handles the loading status of outgoing HTTP requests
 * that is set by the {@link loadingInterceptor}
 * and it provides the status as a readonly signal
 * that can be read by components and templates.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    /**
     * Private readonly signal: _pendingRequests.
     *
     * It tracks the active HTTP requests directly within a reactive state.
     */
    private readonly _pendingRequests = signal<HttpRequest<unknown>[]>([]);

    /**
     * Readonly computed signal: isLoading.
     *
     * It automatically derives the loading status from the active requests array.
     * If the array contains entries, it returns true, otherwise false.
     */
    readonly isLoading = computed(() => this._pendingRequests().length > 0);

    /**
     * Public method: registerRequest.
     *
     * It registers an outgoing HTTP request and updates the loading status.
     */
    registerRequest(req: HttpRequest<unknown>): void {
        this._pendingRequests.update(requests => [...requests, req]);
    }

    /**
     * Public method: deregisterRequest.
     *
     * It deregisters a completed, errored, or canceled HTTP request and updates the loading status.
     */
    deregisterRequest(req: HttpRequest<unknown>): void {
        this._pendingRequests.update(requests => requests.filter(r => r !== req));
    }
}
