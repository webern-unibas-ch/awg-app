import { Injectable } from '@angular/core';

import { Http, RequestOptionsArgs, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../../app.config';
import { ApiServiceError } from './api-service-error';
import { ApiServiceResult } from './api-service-result';

@Injectable()
export class ApiService {

    constructor(private _httpService: Http) {}

    /**
     * Performs a HTTP GET request to the Knora API.
     * @param url
     * @param options
     * @returns {Observable<any>}
     */
    httpGet(url: string, options?: RequestOptionsArgs): Observable<Response> {
        if (!options) options = {};
        return this._httpService.get(AppConfig.API_ENDPOINT + url, options)
            .map((response: Response) => {
                try {
                    return response.json();
                } catch (e) {
                    return Observable.throw(this.handleError(response));
                }
            })
            .catch((error: any) => {
                return Observable.throw(this.handleError(error));
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
        return this._httpService.post(AppConfig.API_ENDPOINT + url, body, options).map((response: Response) => {
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

    handleError(error: any): ApiServiceError {

        let response = new ApiServiceError();
        if (error instanceof Response) {
            response.status = error.status;
            response.statusText = error.statusText;
        } else {
            response.status = 0;
            response.statusText = 'Connection to API endpoint failed';
        }
        console.log('APISERVICE#handleError: response: ', response);
        return response;

    }

}
