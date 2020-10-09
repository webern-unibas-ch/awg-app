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
    private analyticsConfig: AnalyticsConfig = { trackingId: AppConfig.ANALYTICS_ID };

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
        this.runAnalytics('set', 'page', page);

        // Send a pageview hit from that page
        this.runAnalytics('send', 'pageview');
    }

    /**
     * Private method: initializeAnalytics.
     *
     * It initializes the Analytics environment by setting
     * the global analytics object and
     * a boolean flag for successful initialization.
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

        this.createAnalytics(config);

        // enable debug mode if needed
        if (config.debug) {
            (window as any).ga_debug = { trace: true };
        }

        // create tracker
        if (config.cookieDomain) {
            // create a tracker with custom cookie domain configuration
            this.runAnalytics('create', config.trackingId, {
                cookieDomain: config.cookieDomain
            });
        } else {
            // create a default tracker with automatic cookie domain configuration
            this.runAnalytics('create', config.trackingId, 'auto');
        }

        // ignore non-production page calls
        // cf. https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging#testing_your_implementation_without_sending_hits
        /* istanbul ignore else  */
        if (!(document.location.hostname === 'edition.anton-webern.ch')) {
            console.log('Running non-production analytics replacement now');
            this.runAnalytics('set', 'sendHitTask', null);
        }

        // flag for successful initialization
        this.isInitialized = true;
    }

    /**
     * Private method: createAnalytics.
     *
     * It creates a global Analytics object and loads the necessary JS file.
     *
     * @param {AnalyticsConfig} config The given config object.
     *
     * @returns {void} Creates the global analytics object.
     */
    private createAnalytics(config: AnalyticsConfig): void {
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
    }

    /**
     * Private method: runAnalytics.
     *
     * It runs a given task on the global Analytics object.
     *
     * @param {string} task The given task method.
     * @param {string} field The given field.
     * @param {string} [option] The given option.
     *
     * @returns {void} Runs a task on the global analytics object.
     */
    private runAnalytics(task: string, field: string, option?: any): void {
        if (option || option === null) {
            (window as any).ga(task, field, option);
        } else {
            (window as any).ga(task, field);
        }
    }
}
