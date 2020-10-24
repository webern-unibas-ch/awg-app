import { Injectable } from '@angular/core';
import { AppConfig } from '@awg-app/app.config';
import { environment } from '../../../../environments/environment';

/**
 * gtag function for Analytics.
 */
declare let gtag: Function;

/**
 * The Analytics service.
 *
 * It handles the configuration for the GoogleAnalytics setup.
 * Inspired by https://medium.com/madhash/how-to-properly-add-google-analytics-tracking-to-your-angular-web-app-bc7750713c9e
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    /**
     * Constructor of the AnalyticsService.
     *
     * It calls the initialization method.
     */
    constructor() {}

    /**
     * Public method: initAnalytics.
     *
     * It inits the Analytics script.
     *
     * @returns {void} Inits Analytics.
     */
    initAnalytics() {
        const gtagScript: HTMLScriptElement = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = AppConfig.ANALYTICS_ENDPOINT + '?id=' + AppConfig.ANALYTICS_ID;
        document.head.prepend(gtagScript);
    }

    /**
     * Public method: trackPageView.
     *
     * It tracks a page view for Analytics.
     *
     * @params {string} page The given page string.
     *
     * @returns {void} Sets and sends the page view to GA.
     */
    trackPageView(page: string): void {
        if (environment.GA_SEND_PAGE_VIEW === false) {
            console.log('Running non-production analytics replacement now');
        }
        gtag('config', AppConfig.ANALYTICS_ID, {
            page_path: page,
            anonymize_ip: true,
            send_page_view: environment.GA_SEND_PAGE_VIEW
        });
    }
}
