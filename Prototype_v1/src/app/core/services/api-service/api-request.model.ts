import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AppConfig } from '../../../app.config';

export class ApiRequest {
    headers: HttpHeaders;
    params: HttpParams;
    url: string;

    constructor(url: string, params: HttpParams) {
        this.headers = new HttpHeaders().set('Accept', 'application/json');
        this.params = params;
        this.url = AppConfig.API_ENDPOINT + url;
    }
}
