import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
 * Inspired by https://www.ngdevelop.tech/integrate-google-analytics-with-angular-angular-seo/
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    /**
     * Private variable: analyticsId.
     *
     * It stores the analytics id.
     *
     */
    private analyticsId: string = AppConfig.ANALYTICS_ID;

    /**
     * Private variable: analyticsEndpoint.
     *
     * It stores the analytics endpoint.
     */
    private analyticsEndpoint: string = AppConfig.ANALYTICS_ENDPOINT;

    /**
     * Private variable: isInitialized.
     *
     * It stores a boolean flag for successful initialization.
     */
    private isInitialized = false;

    /**
     * Private variable: sendPageView.
     *
     * It stores a boolean flag to send page views dependent from environment.
     *
     * DEVELOP: FALSE
     * PRODUCTION: TRUE
     */
    private sendPageView = environment.GA_SEND_PAGE_VIEW;

    /**
     * Constructor of the AnalyticsService.
     *
     * It injects a private DOCUMENT instance.
     *
     * @param {DOCUMENT} doc Instance of the Angular DOCUMENT.
     */
    constructor(@Inject(DOCUMENT) private doc: any) {}

    /**
     * Public method: initializeAnalytics.
     *
     * It initializes the Analytics script.
     *
     * @returns {void} Inits Analytics.
     */
    initializeAnalytics(): void {
        if (!this.analyticsEndpoint || !this.analyticsId) {
            return;
        }
        if (this.sendPageView === false) {
            console.log('Running non-production analytics replacement now');
        } else {
            this.prependAnalyticsScript();
        }
        this.isInitialized = true;
    }

    /**
     * Public method: trackPageView.
     *
     * It tracks a page view for Analytics.
     *
     * @params {string} page The given page string.
     *
     * @returns {void} Configures and sends the page view to Analytics.
     */
    trackPageView(page: string): void {
        if (!page || this.isInitialized !== true) {
            return;
        }

        gtag('config', this.analyticsId, {
            page_path: page,
            anonymize_ip: true,
            send_page_view: this.sendPageView
        });
    }

    /**
     * Private method: prependAnalyticsScript.
     *
     * It prepends the Analytics <script> tag to index.html via DOCUMENT.
     *
     * @returns {void} Prepends Analytics script.
     */
    private prependAnalyticsScript(): void {
        const gtagScript: HTMLScriptElement = this.doc.createElement('script');
        gtagScript.async = true;
        gtagScript.src = this.analyticsEndpoint + '?id=' + this.analyticsId;
        this.doc.head.prepend(gtagScript);
    }
}
