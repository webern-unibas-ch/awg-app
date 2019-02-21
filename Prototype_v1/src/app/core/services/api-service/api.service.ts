import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';

import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiServiceResult } from './api-service-result.model';
import { ApiServiceError } from './api-service-error.model';
import { ApiRequest } from './api-request.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    serviceName = 'ApiService';

    httpGetUrl = '';
    loading = false;

    constructor(public http: HttpClient) {
        // console.log(`called ${this.serviceName} with httpClient`, http);
    }

    /**
     * Returns an HTTP GET request response from the Knora API.
     * @param {any} responseType
     * @param {string} queryPath
     * @param {HttpParams} queryHttpParams?
     * @returns {Observable<any>}
     */
    getApiResponse(responseType: any, queryPath: string, queryHttpParams?: HttpParams): Observable<any> {
        if (!queryHttpParams) {
            queryHttpParams = new HttpParams();
        }

        return this.httpGet(queryPath, queryHttpParams).pipe(
            map(
                (result: ApiServiceResult): Observable<any> => {
                    return result.getBody(responseType);
                },
                (error: ApiServiceError): Observable<ApiServiceError> => {
                    const errorMessage = <any>error;
                    console.error('ApiService - getApiResponse - error: ', errorMessage);
                    throw error;
                }
            )
        );
    }

    /**
     * Performs a HTTP GET request to the Knora API.
     * @param {string} queryPath
     * @param {HttpParams} httpGetParams
     * @returns {Observable<ApiServiceResult | ApiServiceError>}
     */
    private httpGet(queryPath: string, httpGetParams: HttpParams): Observable<ApiServiceResult | ApiServiceError> {
        const apiRequest = new ApiRequest(queryPath, httpGetParams);

        this.loading = true;

        return this.http
            .get<ApiServiceResult | ApiServiceError>(apiRequest.url, {
                observe: 'response',
                params: apiRequest.params,
                headers: apiRequest.headers
            })
            .pipe(
                tap((response: HttpResponse<ApiServiceResult>) => {
                    this.httpGetUrl = response.url;
                }),
                map(
                    (response: HttpResponse<any>): ApiServiceResult => {
                        this.loading = false;

                        const apiServiceResult = new ApiServiceResult();
                        apiServiceResult.status = response.status;
                        apiServiceResult.statusText = response.statusText;
                        apiServiceResult.body = response.body;
                        apiServiceResult.url = response.url;

                        return apiServiceResult;
                    }
                ),
                catchError(
                    (error: HttpErrorResponse): Observable<ApiServiceError> => {
                        this.loading = false;
                        return this.handleRequestError(error);
                    }
                )
            );
    }

    /**
     * Performs a HTTP POST request to the Knora API.
     * @param url
     * @param body
     * @param options
     * @returns {Observable<any>}
     */
    /*
    private httpPost(url: string, body?: any, options?: RequestOptionsArgs): Observable<any> {
        if (!body) body = {};
        if (!options) options = {};
        return this.http.post(AppConfig.API_ENDPOINT + url, body, options).map((response: Response) => {
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

    /**
     * handle request error in case of server error
     *
     * @param {HttpErrorResponse} error
     * @returns {Observable<ApiServiceError>}
     */
    private handleRequestError(error: HttpErrorResponse): Observable<ApiServiceError> {
        // console.error(error);
        const apiServiceError = new ApiServiceError();
        apiServiceError.status = error.status ? error.status : apiServiceError.status;
        apiServiceError.statusText = error.statusText ? error.statusText : apiServiceError.statusText;
        apiServiceError.errorInfo = error.message ? error.message : apiServiceError.errorInfo;
        apiServiceError.url = error.url ? error.url : apiServiceError.url;
        return observableThrowError(apiServiceError);
    }
}
