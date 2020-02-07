import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, RoutesRecognized } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap, filter, pairwise } from 'rxjs/operators';

/**
 * The RouterEvents service.
 *
 * It saves the previous route of a navigation event.
 * cf. https://stackoverflow.com/a/59046339
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class RouterEventsService {
    /**
     * Private behavior subject to handle previous route path.
     */
    private previousRoutePathSubject = new BehaviorSubject<string>('');

    /**
     * Private readonly previousRoutePath stream as observable (`BehaviorSubject`).
     */
    private readonly previousRoutePath$ = this.previousRoutePathSubject.asObservable();

    /**
     * Constructor of the StorageService.
     *
     * It declares private instances of the Angular router and the Location.
     * It filters the router events fo recognized routes
     * to get the previous path from routing and stores it in the previousRoutePath.
     *
     * @param {Router} router Instance of the Angular router.
     * @param {Location} locatoin Instance of the Location.
     */
    constructor(private router: Router, private locatoin: Location) {
        // ..initial previous route will be the current path for now
        this.previousRoutePathSubject.next(this.locatoin.path());

        // On every route change take the two events of two routes changed (using pairwise operator)
        // and save the old one in a behaviour subject to access it in another component.
        // Can be used if another component needs the previous route
        // because it needs to redirect the user to where he did came from.
        this.router.events
            .pipe(
                filter(e => e instanceof RoutesRecognized),
                pairwise()
            )
            .subscribe((event: any[]) => {
                this.previousRoutePathSubject.next(event[0].urlAfterRedirects);
                console.log('event', this.previousRoutePathSubject.value);
            });
    }

    /**
     * Public method: getPreviousRoute.
     *
     * It provides the previous route path from the previousRoutePath stream.
     *
     * @returns {Observable<string>} The previousRoutePath stream as observable.
     */
    getPreviousRoute(): Observable<string> {
        return this.previousRoutePath$;
    }
}
