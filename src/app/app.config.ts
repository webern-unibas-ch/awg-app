import { appHomepage, appVersion, appVersionReleaseDate } from './app.globals';

/**
 * App config with accessors to app-wide constants.
 */
export class AppConfig {
    /**
     * Getter for the URL of the Salsah API endpoint
     * (https://www.salsah.org).
     *
     * @returns {string}
     */
    public static get API_ENDPOINT(): string {
        const root = 'https://www.salsah.org/';
        const api = 'api/';
        return root + api;
    }

    /**
     * Getter for the URL of the Analytics endpoint
     * (https://www.google-analytics.com/).
     *
     * @returns {string}
     */
    public static get ANALYTICS_ENDPOINT(): string {
        return 'https://www.googletagmanager.com/gtag/js';
    }

    /**
     * Getter for the Analytics id
     * ('UA-XXXXXXX-Y').
     *
     * @returns {string}
     */
    public static get ANALYTICS_ID(): string {
        return 'UA-64657372-2';
    }

    /**
     * Getter for the URL of the INSERI Instance
     * (https://apps.inseri.swiss).
     *
     * @returns {string}
     */
    public static get INSERI_URL(): string {
        return 'https://apps.inseri.swiss';
    }

    /**
     * Getter for the URL of the localhost
     * (http://localhost:4200).
     *
     * @returns {string}
     */
    public static get LOCALHOST_URL(): string {
        return 'http://localhost:4200';
    }

    /**
     * Getter for the name of the AWG.
     *
     * @returns {string}
     */
    public static get AWG_PROJECT_NAME(): string {
        return 'Anton Webern Gesamtausgabe';
    }

    /**
     * Getter for the URL of the AWG project website
     * (https://anton-webern.ch).
     *
     * @returns {string}
     */
    public static get AWG_PROJECT_URL(): string {
        return 'https://www.anton-webern.ch/';
    }

    /**
     * Getter for the url of the AWG edition website (awg-app).
     * (https://edition.anton-webern.ch/)
     *
     * @returns {string}
     */
    public static get AWG_APP_URL(): string {
        return appHomepage;
    }

    /**
     * Getter for the URL of the compodoc documentation
     * of the AWG edition website (awg-app).
     * (compodoc/index.html).
     *
     * @returns {string}
     */
    public static get AWG_APP_COMPODOC_URL(): string {
        return 'compodoc/index.html';
    }

    /**
     * Getter for the URL of the GitHub repository
     * of the AWG edition website (awg-app).
     * (https://github.com/webern-unibas-ch/awg-app).
     *
     * @returns {string}
     */
    public static get AWG_APP_GITHUB_URL(): string {
        return 'https://github.com/webern-unibas-ch/awg-app';
    }

    /**
     * Getter for the latest version of the AWG edition website (awg-app).
     *
     * @returns {string}
     */
    public static get AWG_APP_VERSION(): string {
        return appVersion;
    }

    /**
     * Getter for the release date of the latest version of the AWG edition website (awg-app).
     *
     * @returns {string}
     */
    public static get AWG_APP_VERSION_RELEASE_DATE(): string {
        return appVersionReleaseDate;
    }

    /**
     * Getter for the unsanitized OSM embed link.
     *
     * @returns {string}
     */
    public static get UNSAFE_OSM_EMBED_URL(): string {
        const osmRoot = 'https://www.openstreetmap.org/export/embed.html';
        const osmId =
            '?bbox=7.582175731658936%2C47.55789611508066%2C7.586840093135835%2C47.56003739001212&layer=mapnik&marker=47.55896585846639%2C7.584506571292877';

        return osmRoot + osmId;
    }

    /**
     * Getter for the unsanitized OSM external link.
     *
     * @returns {string}
     */
    public static get UNSAFE_OSM_LINK_URL() {
        const osmLinkRoot = 'https://www.openstreetmap.org/';
        const osmLinkId = '?mlat=47.55897&amp;mlon=7.58451#map=19/47.55897/7.58451';
        return osmLinkRoot + osmLinkId;
    }
}
