import { appVersion, appVersionReleaseDate, appHomepage } from './app.globals';

/**
 * App config with accessors to app-wide constants.
 */
export class AppConfig {
    /**
     * Getter for the URL of the Salsah API endpoint
     * ({@link https://www.salsah.org}).
     */
    public static get API_ENDPOINT(): string {
        const root = 'https://www.salsah.org/';
        const api = 'api/';
        return root + api;
    }

    /**
     * Getter for the URL of the AWG project website
     * ({@link https://anton-webern.ch}).
     */
    public static get WEBERN_HOME(): string {
        const url = 'https://www.anton-webern.ch/';
        return url;
    }

    /**
     * Getter for the url of the AWG edition website (AWG App).
     */
    public static get EDITION_HOME(): string {
        return appHomepage;
    }

    /**
     * Getter for the latest version of the AWG edition website (AWG App).
     */
    public static get VERSION(): string {
        return appVersion;
    }

    /**
     * Getter for the release date of the latest version of the AWG edition website (AWG App).
     */
    public static get VERSION_RELEASE_DATE(): string {
        return appVersionReleaseDate;
    }
}
