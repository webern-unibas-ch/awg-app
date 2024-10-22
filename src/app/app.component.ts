import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

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
     * Public variable: showSideOutlet.
     *
     * It keeps track of the side outlet.
     */
    showSideOutlet = true;

    /**
     * Constructor of the AppComponent.
     *
     * It declares private instances of the Angular router and the AnalyticsService.
     *
     * @param {ActivatedRoute} activatedRoute Instance of the Angular ActivatedRoute.
     * @param {AnalyticsService} analyticsService Instance of the AnalyticsService.
     * @param {NgbConfig} ngbConfig Instance of the NGBootstrap NgbConfig.
     * @param {Router} router Instance of the Angular router.
     * @param {Title} titleService Instance of the Angular Title.
     */
    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private analyticsService: AnalyticsService,
        private editionInitService: EditionInitService,
        ngbConfig: NgbConfig,
        private readonly router: Router,
        private titleService: Title
    ) {
        // Disable Bootstrap animation
        ngbConfig.animation = false;

        // Get app title from index.html
        // Cf. https://blog.bitsrc.io/dynamic-page-titles-in-angular-98ce20b5c334
        const appTitle = this.titleService.getTitle();

        // Init analytics
        this.analyticsService.initializeAnalytics();

        // Init edition complexes and outline
        this.editionInitService.initializeEdition();

        // Track router events
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map((event: NavigationEnd) => {
                    // Track page view on every NavigationEnd
                    this.analyticsService.trackPageView(event.urlAfterRedirects);

                    // Get page title and sideOutlet info from route data
                    let route = this.activatedRoute.firstChild;
                    while (route?.firstChild) {
                        route = route.firstChild;
                    }
                    if (route.snapshot.data['title']) {
                        return {
                            pageTitle: route.snapshot.data['title'],
                            showSideOutlet: route.snapshot.data['showSideOutlet'] ?? true,
                        };
                    }
                    return { pageTitle: appTitle, showSideOutlet: true };
                })
            )
            .subscribe({
                next: ({ pageTitle, showSideOutlet }) => {
                    // Set page title
                    this.titleService.setTitle(pageTitle);
                    // Set showSideOutlet
                    this.showSideOutlet = showSideOutlet;
                },
            });
    }
}
