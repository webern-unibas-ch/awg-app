import { appVersion, appVersionReleaseDate, appHomepage } from './app.globals';

export class AppConfig {
    public static get API_ENDPOINT(): string {
        const root = 'http://www.salsah.org/';
        const api = 'api/';
        return root + api;
    }

    public static get WEBERN_HOME() {
        const url = 'https://www.anton-webern.ch/';
        return url;
    }

    public static get EDITION_HOME(): string {
        return appHomepage;
    }

    public static get VERSION(): string {
        return appVersion;
    }

    public static get VERSION_RELEASE_DATE(): string {
        return appVersionReleaseDate;
    }
}
