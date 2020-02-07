import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { RouterEventsService } from '@awg-core/services';

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
     * It declares private instances of the Angular router and the RouterEventsService.
     *
     * @param {Router} router Instance of the Angular router.
     * @param {RouterEventsService} routerEventsService Instance of the RouterEventsService.
     */
    constructor(private readonly router: Router, private routerEventsService: RouterEventsService) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                /*
                // set current route to sessionStorage
                this.storageService.setStorageKey(
                    StorageType.sessionStorage,
                    AppConfig.AWG_APP_ROUTE_STORAGE_KEY,
                    event.urlAfterRedirects
                );
                */

                //  catch GoogleAnalytics pageview events,
                // cf. https://codeburst.io/using-google-analytics-with-angular-25c93bffaa18
                (window as any).ga('set', 'page', event.urlAfterRedirects);
                (window as any).ga('send', 'pageview');
            }
        });
    }
}
