import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

import { filter, map } from 'rxjs/operators';

import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { AnalyticsService, EditionInitService } from '@awg-core/services';

/**
 * The main component of the AWG App.
 *
 * It contains the {@link NavbarComponent}, {@link ViewContainerComponent} and {@link FooterComponent}.
 */
@Component({
    selector: 'awg-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    /**
     * Public variable: activateSideOutlet.
     *
     * It keeps track of the side outlet.
     */
    activateSideOutlet = false;

    /**
     * Private readonly injection variable: _activatedRoute.
     *
     * It injects the ActivatedRoute.
     */
    private readonly _activatedRoute = inject(ActivatedRoute);

    /**
     * Private readonly injection variable: _analyticsService.
     *
     * It injects the AnalyticsService.
     */
    private readonly _analyticsService = inject(AnalyticsService);

    /**
     * Private readonly injection variable: _editionInitService.
     *
     * It injects the EditionInitService.
     */
    private readonly _editionInitService = inject(EditionInitService);

    /**
     * Private readonly injection variable: _ngbConfig.
     *
     * It injects the NgbConfig.
     */
    private readonly _ngbConfig = inject(NgbConfig);

    /**
     * Private readonly injection variable: _router.
     *
     * It injects the Router.
     */
    private readonly _router = inject(Router);

    /**
     * Private readonly injection variable: _titleService.
     *
     * It injects the Angular Title.
     */
    private readonly _titleService = inject(Title);

    /**
     * Constructor of the AppComponent.
     */
    constructor() {
        // Disable Bootstrap animation
        this._ngbConfig.animation = false;

        // Get app title from index.html
        // Cf. https://blog.bitsrc.io/dynamic-page-titles-in-angular-98ce20b5c334
        const appTitle = this._titleService.getTitle();

        // Init analytics
        this._analyticsService.initializeAnalytics();

        // Init edition complexes and outline
        this._editionInitService.initializeEdition();

        // Track router events
        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map((event: NavigationEnd) => {
                    // Track page view on every NavigationEnd
                    this._analyticsService.trackPageView(event.urlAfterRedirects);

                    // Get page title from route data
                    let child = this._activatedRoute.firstChild;
                    while (child.firstChild) {
                        child = child.firstChild;
                    }
                    if (child.snapshot.data['title']) {
                        return child.snapshot.data['title'];
                    }
                    return appTitle;
                })
            )
            .subscribe({
                next: (pageTitle: string) => {
                    // Set page title
                    this._titleService.setTitle(pageTitle);

                    // Activate side outlet
                    const currentRoute = this._router.routerState.snapshot.root;
                    this.activateSideOutlet = this._hasSideOutlet(currentRoute);
                },
            });
    }

    /**
     * Private method: hasSideOutlet.
     *
     * It checks if a route has a side outlet.
     *
     * @param {ActivatedRouteSnapshot} route The route to check.
     *
     * @returns {boolean} The result of the check.
     */
    private _hasSideOutlet(route: ActivatedRouteSnapshot): boolean {
        if (route.outlet === 'side') {
            return true;
        }
        for (const child of route.children) {
            if (this._hasSideOutlet(child)) {
                return true;
            }
        }
        return false;
    }
}
