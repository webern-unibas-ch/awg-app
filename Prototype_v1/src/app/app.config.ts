import { appVersion, appVersionReleaseDate } from '@awg-app/app.version';

export class AppConfig {
    public static get API_ENDPOINT(): string {
        const root = 'http://www.salsah.org/';
        const api = 'api/';
        return root + api;
    }

    public static get VERSION(): string {
        return appVersion;
    }

    public static get VERSION_RELEASE_DATE(): string {
        return appVersionReleaseDate;
    }
}
