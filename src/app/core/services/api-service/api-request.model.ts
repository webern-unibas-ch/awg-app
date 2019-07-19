import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AppConfig } from '@awg-app/app.config';

/**
 * The ApiRequest class.
 *
 * It is used in the context of the ApiService
 * to store the data of an API request.
 */
export class ApiRequest {
    /**
     * The headers of an API request.
     */
    headers: HttpHeaders;

    /**
     * The HTTP parameters of an API request.
     */
    params: HttpParams;

    /**
     * The url of an API request.
     *
     * It combines the API_ENDPOINT stored in AppConfig
     * with the given queryPath.
     */
    url: string;

    /**
     * Constructor of the ApiRequest class.
     *
     * It initializes the class with values
     * from given query path and parameters.
     *
     * @param {string} queryPath The given query path.
     * @param {HttpParams} queryHttpParams The given query parameters.
     */
    constructor(queryPath: string, queryHttpParams: HttpParams) {
        this.headers = new HttpHeaders().set('Accept', 'application/json');
        this.params = queryHttpParams;
        this.url = AppConfig.API_ENDPOINT + queryPath;
    }
}
