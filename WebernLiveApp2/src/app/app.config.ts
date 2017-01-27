export class AppConfig {

    public static get API_ENDPOINT(): string {
        let url: string = 'http://www.salsah.org';
        let api: string = '/api';

        return url + api;
    }
}
