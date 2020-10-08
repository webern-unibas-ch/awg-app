import { Injectable } from '@angular/core';
import { AppConfig } from '@awg-app/app.config';

/**
 * The AnalyticsConfig class.
 *
 * It is used to configure the Analytics setup.
 *
 */
export class AnalyticsConfig {
    /**
     * The tracking id for Analytics.
     */
    trackingId: string;

    /**
     * The cookieDomain for Analytics.
     */
    cookieDomain?: string;

    /**
     * The debug flag for Analytics.
     */
    debug?: boolean;
}

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
     * Private variable: analyticsConfig.
     *
     * It stores the analytics object.
     */
    private analyticsConfig: AnalyticsConfig = { trackingId: 'UA-64657372-2' };

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
        this.initializeAnalytics(this.analyticsConfig);
    }

    /**
     * Public method: trackPageView.
     *
     * It tracks a page view for Analytics
     * if initialization was successful.
     *
     * @params {string} page The given page string.
     *
     * @returns {void} Sets and sends the page view to GA.
     */
    trackPageView(page: string): void {
        // check if Analytics object was initialized
        if (!this.isInitialized) {
            console.log('Analytics not initialized');
            return;
        }

        // set the page to be tracked
        (window as any).ga('set', 'page', page);

        // Send a pageview hit from that page
        (window as any).ga('send', 'pageview');
    }

    /**
     * Private method: initializeAnalytics.
     *
     * It initializes the Analytics setup by setting the analytics object
     * and a boolean flag for successful initialization.
     *
     * @param {AnalyticsConfig} config The given config object.
     *
     * @returns {void} Sets analytics object and init flag.
     */
    private initializeAnalytics(config: AnalyticsConfig): void {
        if (!config || !config.trackingId) {
            this.isInitialized = false;
            console.log('No analytics config found');
            return;
        }

        // set debug or default version of analytics.js
        const analyticsJS = config.debug ? 'analytics_debug.js' : 'analytics.js';
        const analyticsURL = AppConfig.ANALYTICS_ENDPOINT + analyticsJS;

        /**
         * Creates a temporary global ga object and loads analytics.js.
         * Parameters o, a, and m are all used internally. They could have been
         * declared using 'var', instead they are declared as parameters to save
         * 4 bytes ('var ').
         *
         * @param {Window}        i The global context object.
         * @param {HTMLDocument}  s The DOM document object.
         * @param {string}        o Must be 'script'.
         * @param {string}        g Protocol relative URL of the analytics.js script.
         * @param {string}        r Global name of analytics object. Defaults to 'ga'.
         * @param {HTMLElement}   a Async script tag.
         * @param {HTMLElement}   m First script tag in document.
         */
        /* istanbul ignore next */
        ((i, s, o, g, r, a, m) => {
            // Acts as a pointer to support renaming.
            i['GoogleAnalyticsObject'] = r;

            // Creates an initial ga() function.
            // The queued commands will be executed once analytics.js loads.
            (i[r] =
                i[r] ||
                (() => {
                    (i[r].q = i[r].q || []).push(arguments);
                })),
                // Sets the time (as an integer) this tag was executed.
                // Used for timing hits.
                (i[r].l = 1 * (new Date() as any));

            // Insert the script tag asynchronously.
            // Inserts above current tag to prevent blocking in addition to using the
            // async attribute.
            (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        })(window, document, 'script', analyticsURL, 'ga');

        // enable debug mode if needed
        if (config.debug) {
            (window as any).ga_debug = { trace: true };
        }

        // create tracker
        if (config.cookieDomain) {
            // create a tracker with custom cookie domain configuration
            (window as any).ga('create', config.trackingId, {
                cookieDomain: config.cookieDomain
            });
        } else {
            // create a default tracker with automatic cookie domain configuration
            (window as any).ga('create', config.trackingId, 'auto');
        }

        // ignore non-production page calls
        // cf. https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging#testing_your_implementation_without_sending_hits
        /* istanbul ignore else  */
        if (!(document.location.hostname === 'edition.anton-webern.ch')) {
            console.log('Running non-production google analytics replacement now');
            (window as any).ga('set', 'sendHitTask', null);
        }

        // flag for successful initialization
        this.isInitialized = true;
    }
}
