export class AppConfig {
    public static get API_ENDPOINT(): string {
        const root = 'http://www.salsah.org';
        const api = '/api';
        return root + api;
    }
}
