import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
     * Public behaviour subject to handle loading status.
     */
    public isLoading$ = new BehaviorSubject(false);

    /**
     * Constructor of the LoadingService.
     */
    constructor() {}
}
