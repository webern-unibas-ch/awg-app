import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'awg-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private router: Router) {
        // configuration for GoogleAnalytics pageview events
        // cf. https://codeburst.io/using-google-analytics-with-angular-25c93bffaa18
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                (window as any).ga('set', 'page', event.urlAfterRedirects);
                (window as any).ga('send', 'pageview');
            }
        });
    }
}
