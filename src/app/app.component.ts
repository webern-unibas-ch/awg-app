import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { filter, map } from 'rxjs/operators';

import { NgbConfig } from '@ng-bootstrap/ng-bootstrap';

import { AnalyticsService } from '@awg-core/services';

/**
 * The main component of the AWG App.
 *
 * It contains the {@link NavbarComponent}, {@link ViewContainerComponent} and {@link FooterComponent}.
 */
@Component({
    selector: 'awg-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
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
        ngbConfig: NgbConfig,
        private readonly router: Router,
        private titleService: Title
    ) {
        // disable Bootstrap animation
        ngbConfig.animation = false;

        // get app title from index.html
        // cf. https://blog.bitsrc.io/dynamic-page-titles-in-angular-98ce20b5c334
        const appTitle = this.titleService.getTitle();

        // init analytics
        this.analyticsService.initializeAnalytics();

        // track router events
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map((event: NavigationEnd) => {
                    // track page view on every NavigationEnd
                    this.analyticsService.trackPageView(event.urlAfterRedirects);

                    // get page title from route data
                    let child = this.activatedRoute.firstChild;
                    while (child.firstChild) {
                        child = child.firstChild;
                    }
                    if (child.snapshot.data['title']) {
                        return child.snapshot.data['title'];
                    }
                    return appTitle;
                })
            )
            .subscribe((pageTitle: string) => {
                // set page title
                this.titleService.setTitle(pageTitle);
            });
    }
}
