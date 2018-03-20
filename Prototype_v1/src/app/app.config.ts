export class AppConfig {

    public static get API_ENDPOINT(): string {
        const root: string = 'http://www.salsah.org';
        const api: string = '/api';
        return root + api;
    }
}
