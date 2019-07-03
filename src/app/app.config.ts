import { appHomepage, appVersion, appVersionReleaseDate } from './app.globals';

/**
 * App config with accessors to app-wide constants.
 */
export class AppConfig {
    /**
     * Getter for the URL of the Salsah API endpoint
     * ({@link https://www.salsah.org}).
     *
     * @returns {string}
     */
    public static get API_ENDPOINT(): string {
        const root = 'https://www.salsah.org/';
        const api = 'api/';
        return root + api;
    }

    /**
     * Getter for the URL of the AWG project website
     * ({@link https://anton-webern.ch}).
     *
     * @returns {string}
     */
    public static get WEBERN_HOME(): string {
        return 'https://www.anton-webern.ch/';
    }

    /**
     * Getter for the URL of the GitHub repository
     * of the AWG edition website (awg-app).
     * ({@link https://github.com/webern-unibas-ch/awg-app}).
     *
     * @returns {string}
     */
    public static get GITHUB_HOME(): string {
        return 'https://github.com/webern-unibas-ch/awg-app';
    }

    /**
     * Getter for the URL of the compodoc documentation
     * of the AWG edition website (awg-app).
     * ({@link compodoc/index.html}).
     *
     * @returns {string}
     */
    public static get COMPODOC_HOME(): string {
        return 'compodoc/index.html';
    }

    /**
     * Getter for the url of the AWG edition website (awg-app).
     *
     * @returns {string}
     */
    public static get EDITION_HOME(): string {
        return appHomepage;
    }

    /**
     * Getter for the latest version of the AWG edition website (awg-app).
     *
     * @returns {string}
     */
    public static get VERSION(): string {
        return appVersion;
    }

    /**
     * Getter for the release date of the latest version of the AWG edition website (awg-app).
     *
     * @returns {string}
     */
    public static get VERSION_RELEASE_DATE(): string {
        return appVersionReleaseDate;
    }
}
