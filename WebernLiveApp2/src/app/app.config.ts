export class AppConfig {

    public static get API_ENDPOINT(): string {
        const url: string = 'http://www.salsah.org';
        const api: string = '/api';
        return url + api;
    }
}
