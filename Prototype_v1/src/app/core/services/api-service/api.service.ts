import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from '@angular/common/http';

import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ApiServiceResult } from './api-service-result';
import { ApiServiceError } from './api-service-error';
import { ApiRequest } from './api-request.model';

@Injectable()
export class ApiService {

    httpGetUrl: string = '';
    loading = false;

    constructor(private http: HttpClient) {}

    getApiResponse(responseType: any, queryString, queryParams?: HttpParams): Observable<any> {
        if (!responseType) { return; }
        if (!queryParams) { queryParams = new HttpParams(); }

        return this.httpGet(queryString, queryParams)
            .pipe(
                map(
            (result: ApiServiceResult) => {
                        return result.getBody(responseType);
                        },
            (error: ApiServiceError ) => {
                        const errorMessage = <any>error;
                        console.error('ApiService - getApiResponse - error: ', errorMessage);
                        throw error;
                        }
                )
            );
    }

    /**
     * Performs a HTTP GET request to the Knora API.
     * @param url
     * @param httpGetParams
     * @returns {Observable<ApiServiceResult>}
     */
    httpGet(url: string, httpGetParams?: HttpParams ): Observable<ApiServiceResult | ApiServiceError> {
        if (!httpGetParams) { httpGetParams = new HttpParams(); }
        const apiRequest = new ApiRequest(url, httpGetParams);

        this.loading = true;

        return this.http.get<ApiServiceResult | ApiServiceError>(apiRequest.url,
                {
                    observe: 'response',
                    params: apiRequest.params,
                    headers: apiRequest.headers
                })
            .pipe(
                tap((response: HttpResponse<ApiServiceResult>) => {
                    this.httpGetUrl = response.url;
                }),
                map((response: HttpResponse<any>): ApiServiceResult => {
                    this.loading = false;

                    const apiServiceResult = new ApiServiceResult();
                    apiServiceResult.status = response.status;
                    apiServiceResult.statusText = response.statusText;
                    apiServiceResult.body = response.body;
                    apiServiceResult.url = response.url;

                    return apiServiceResult;
                }),
                catchError((error: HttpErrorResponse): Observable<ApiServiceError> => {
                    this.loading = false;
                    return this.handleRequestError(error);
                })
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
    protected handleRequestError(error: HttpErrorResponse): Observable<ApiServiceError> {
        // console.error(error);
        const apiServiceError = new ApiServiceError();
        apiServiceError.status = error.status;
        apiServiceError.statusText = error.statusText;
        apiServiceError.errorInfo = error.message;
        apiServiceError.url = error.url;
        return observableThrowError(apiServiceError);
    }
}
