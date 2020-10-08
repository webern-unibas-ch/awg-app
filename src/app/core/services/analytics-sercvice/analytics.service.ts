import { Injectable } from '@angular/core';

/**
 * The Analytics service.
 *
 * It handles the configuration for the GoogleAnalytics setup.
 * Inspired by https://jaxenter.de/google-analytics-angular-57919
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {
    /**
     * Private variable: analytics.
     *
     * It stores the analytics object.
     */
    private analytics: any;

    /**
     * Private variable: isInitialized.
     *
     * It stores a boolean flag for successful initialization.
     */
    private isInitialized = false;

    /**
     * Constructor of the AnalyticsService.
     *
     * It calls the initialization method.
     */
    constructor() {
        this.initializeAnalytics();
    }

    /**
     * Public method: trackPageView.
     *
     * It tracks a page view for Analytics
     * if initialization was successful.
     *
     * @params {string} [page] The given page string.
     *
     * @returns {void} Sets and sends the page view to GA.
     */
    trackPageView(page: string): void {
        if (!this.isInitialized) {
            console.log('Analytics not initialized');
            return;
        }
        (window as any).ga('set', 'page', page);
        (window as any).ga('send', 'pageview');
    }

    /**
     * Private method: initializeAnalytics.
     *
     * It initializes the Analytics setup by setting the analytics object
     * and a boolean flag for successful initialization.
     *
     * @returns {void} Sets analytics object and init flag.
     */
    private initializeAnalytics(): void {
        if (!(window as any).analyticsConfig || !(window as any).analyticsConfig.trackingId) {
            console.log('No analytics config found');
            return;
        }
        this.analytics = (window as any).analyticsConfig;

        if (document.location.hostname === 'edition.anton-webern.ch') {
            ((i, s, o, g, r, a, m) => {
                i['GoogleAnalyticsObject'] = r;
                (i[r] =
                    i[r] ||
                    (() => {
                        (i[r].q = i[r].q || []).push(arguments);
                    })),
                    (i[r].l = 1 * (new Date() as any));
                (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
        } else {
            // exclude non-production page calls
            // cf. https://stackoverflow.com/questions/1251922/is-there-a-way-to-stop-google-analytics-counting-development-work-as-hits#8178283
            console.log('Running non-production google analytics replacement now');
            (window as any).ga = arg => {
                // console.info('ga:', arguments);
            };
        }

        if (this.analytics.debug) {
            window['ga_debug'] = { trace: true };
        }
        if (this.analytics.cookieDomain) {
            (window as any).ga('create', this.analytics.trackingId, {
                cookieDomain: this.analytics.cookieDomain
            });
        } else {
            (window as any).ga('create', this.analytics.trackingId, 'auto');
        }
        this.isInitialized = true;
    }
}
