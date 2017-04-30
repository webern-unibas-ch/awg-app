import { Injectable } from '@angular/core';

import { Http, RequestOptionsArgs, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../app.config';
import { ApiServiceError } from './api-service-error';
import { ApiServiceResult } from './api-service-result';

@Injectable()
export class ApiService {

    constructor(
        private httpService: Http
    ) {}

    /**
     * Performs a HTTP GET request to the Knora API.
     * @param url
     * @param options
     * @returns {Observable<any>}
     */
    httpGet(url: string, options?: RequestOptionsArgs) {
        if (!options) options = {};
        console.log('URL: ', AppConfig.API_ENDPOINT + url, ' ||  Options: ' , options);
        return this.httpService.get(AppConfig.API_ENDPOINT + url, options)
            .map((response: Response) => {
                try {
                    return response.json();
                } catch (e) {
                    return Observable.throw(ApiService.handleError(response, url));
                }
            })
            .catch((error: any) => {
                return Observable.throw(ApiService.handleError(error, url));
            });
    }

    /**
     * Performs a HTTP POST request to the Knora API.
     * @param url
     * @param body
     * @param options
     * @returns {Observable<any>}
     */
    /*
    httpPost(url: string, body?: any, options?: RequestOptionsArgs): Observable<any> {
        if (!body) body = {};
        if (!options) options = {};
        return this.httpService.post(AppConfig.API_ENDPOINT + url, body, options).map((response: Response) => {
                try {
                    let apiServiceResult: ApiServiceResult = new ApiServiceResult();
                    apiServiceResult.status = response.status;
                    apiServiceResult.statusText = response.statusText;
                    apiServiceResult.body = response.json();
                    return apiServiceResult;
                } catch (e) {
                    return this.handleError(response);
                }
            }).catch((error: any) => {
                return Observable.throw(this.handleError(error));
            });
    }
    */

    static handleError(error: any, url: string): ApiServiceError {

        let response = new ApiServiceError();
        if (error instanceof Response) {
//            console.log(error);
            response.status = error.status;
            response.statusText = error.statusText;
            if(!response.statusText) response.statusText = "Connection to API endpoint failed";
            response.request = url;
        } else {
            response.status = 0;
            response.statusText = "Connection to API endpoint failed";
            response.request = url;
        }

        // response.status === 401 --> Unauthorized; password is wrong

        // response.status === 404 --> Not found; username is wrong

        return response;

    }

}
