import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { AppConfig } from '@awg-app/app.config';

import { environment } from 'environments/environment';

/**
 * The global gtag variable for Analytics.
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
    providedIn: 'root',
})
export class AnalyticsService {
    /**
     * Private variable: _analyticsId.
     *
     * It stores the analytics id.
     *
     */
    private _analyticsId: string = AppConfig.ANALYTICS_ID;

    /**
     * Private variable: _analyticsEndpoint.
     *
     * It stores the analytics endpoint.
     */
    private _analyticsEndpoint: string = AppConfig.ANALYTICS_ENDPOINT;

    /**
     * Private variable: _isInitialized.
     *
     * It stores a boolean flag for successful initialization.
     */
    private _isInitialized = false;

    /**
     * Private variable: _sendPageView.
     *
     * It stores a boolean flag to send page views dependent from environment.
     *
     * DEVELOP: FALSE
     * PRODUCTION: TRUE
     */
    private _sendPageView = environment.GA_SEND_PAGE_VIEW;

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
        if (!this._analyticsEndpoint || !this._analyticsId) {
            return;
        }
        if (this._sendPageView === false) {
            console.info('Running non-production analytics replacement now');
        } else {
            this._prependAnalyticsScript();
        }
        this._isInitialized = true;
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
        if (!page || this._isInitialized !== true) {
            return;
        }

        gtag('config', this._analyticsId, {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            page_path: page,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            send_page_view: this._sendPageView,
        });
    }

    /**
     * Private method: _prependAnalyticsScript.
     *
     * It prepends the Analytics <script> tag to index.html via DOCUMENT.
     *
     * @returns {void} Prepends Analytics script.
     */
    private _prependAnalyticsScript(): void {
        const gtagScript: HTMLScriptElement = this.doc.createElement('script');
        gtagScript.async = true;
        gtagScript.src = this._analyticsEndpoint + '?id=' + this._analyticsId;
        this.doc.head.prepend(gtagScript);
    }
}
