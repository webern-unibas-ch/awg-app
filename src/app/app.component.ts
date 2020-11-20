import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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
     * @param {Router} router Instance of the Angular router.
     * @param {AnalyticsService} analyticsService Instance of the AnalyticsService.
     */
    constructor(private readonly router: Router, private analyticsService: AnalyticsService) {
        this.analyticsService.initializeAnalytics();

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.analyticsService.trackPageView(event.urlAfterRedirects);
            }
        });
    }
}
