import { Injectable, signal } from '@angular/core';

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
     * Private readonly signal: _isLoading.
     *
     * It keeps the current loading status.
     */
    private readonly _isLoading = signal<boolean>(false);

    /**
     * Public readonly signal: isLoading.
     *
     * It provides the current loading status.
     */
    readonly isLoading = this._isLoading.asReadonly();

    /**
     * Public method: updateLoadingStatus.
     *
     * It updates the loading state.
     *
     * @param {boolean} isLoading The new loading state.
     *
     * @returns {void} Sets the next boolean value to the loading state signal.
     */
    updateLoadingStatus(isLoading: boolean): void {
        this._isLoading.set(isLoading);
    }
}
