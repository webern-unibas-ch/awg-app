import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AppConfig } from '@awg-app/app.config';

export class ApiRequest {
    headers: HttpHeaders;
    params: HttpParams;
    url: string;

    constructor(queryPath: string, queryHttpParams: HttpParams) {
        this.headers = new HttpHeaders().set('Accept', 'application/json');
        this.params = queryHttpParams;
        this.url = AppConfig.API_ENDPOINT + queryPath;
    }
}
