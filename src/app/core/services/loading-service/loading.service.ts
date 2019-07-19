import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * The Loading service.
 *
 * It handles the loading status of outgoing http requests
 * that is set by the {@link LoadingInterceptor}
 * and it provides the status in a public variable
 * that can be subscribed by components.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    /**
     * Private behavior subject to handle loading status.
     */
    private isLoadingSubject = new BehaviorSubject<boolean>(false);

    /**
     * Private readonly isLoading stream as observable (`BehaviorSubject`).
     */
    private readonly isLoading$ = this.isLoadingSubject.asObservable();

    /**
     * Constructor of the LoadingService.
     */
    constructor() {}

    /**
     * Public method: getLoadingStatus.
     *
     * It provides the latest loading status from the isLoading stream.
     *
     * @returns {Observable<boolean>} The isLoading stream as observable.
     */
    getLoadingStatus(): Observable<boolean> {
        return this.isLoading$;
    }

    /**
     * Public method: updateLoadingStatus.
     *
     * It updates the isLoading stream with the given boolean value.
     *
     * @returns {void} Sets the next boolean value to the stream.
     */
    updateLoadingStatus(isLoading: boolean): void {
        this.isLoadingSubject.next(isLoading);
    }
}
