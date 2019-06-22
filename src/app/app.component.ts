import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

/**
 * The main component of the AWG App.
 * It contains the {@link NavbarComponent}, {@link ViewContainerComponent} and {@link FooterComponent}.
 */
@Component({
    selector: 'awg-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    /**
     * Constructor with private router instance to catch GoogleAnalytics pageview events.
     *
     * See {@link https://codeburst.io/using-google-analytics-with-angular-25c93bffaa18}.
     *
     * @param {Router} router Instance of the Angular router
     *
     */
    constructor(private router: Router) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                (window as any).ga('set', 'page', event.urlAfterRedirects);
                (window as any).ga('send', 'pageview');
            }
        });
    }
}
