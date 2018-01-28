import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { ApiServiceError } from './api-service-error';
import { ApiServiceResult } from './api-service-result';
import { ApiRequest } from './api-request.model';

@Injectable()
export class ApiService {

    httpGetUrl: string = '';

    constructor(private http: HttpClient) {}

    public getApiResponse(responseType: any, queryString, queryParams?: HttpParams): Observable<any> {
        if (!responseType) { return; }
        if (!queryParams) { queryParams = new HttpParams(); }

        return this.httpGet(queryString, queryParams).map(
            (result: ApiServiceResult) => {
                return result.getBody(responseType);
            },
            (error: ApiServiceError ) => {
                const errorMessage = <any>error;
                console.error('ApiService - getApiResponse - error: ', errorMessage);
                throw error;
            });
    }

    /**
     * Performs a HTTP GET request to the Knora API.
     * @param url
     * @param httpGetParams
     * @returns {Observable<ApiServiceResult>}
     */
    httpGet(url: string, httpGetParams?: HttpParams ): Observable<ApiServiceResult> {
        if (!httpGetParams) { httpGetParams = new HttpParams(); }
        const apiRequest = new ApiRequest(url, httpGetParams);
        console.warn('ApiService: ApiRequest: ', apiRequest);

        return this.http
            .get(
                apiRequest.url,
                {
                    observe: 'response',
                    params: apiRequest.params,
                    headers: apiRequest.headers
                })
            .pipe(
                tap((response: HttpResponse<ApiServiceResult>) => {
                    this.httpGetUrl = response.url;
                }),
                map((response: HttpResponse<ApiServiceResult>) => {
                    try {
                        const apiServiceResult: ApiServiceResult = new ApiServiceResult();
                        apiServiceResult.status = response.status;
                        apiServiceResult.statusText = response.statusText;
                        apiServiceResult.body = response.body;
                        apiServiceResult.url = response.url;
                        console.log('ApiService - Result: ', apiServiceResult);
                        return apiServiceResult;
                    } catch (e) {
                        // console.log('ApiService - catch - local e: ', e);
                        // TODO: use full response.url for errorhandling
                        return ApiService.handleError(response, url);
                    }
                }),
                // catchError(this.handleError('ApiService#httpGet', []))
                catchError((error: any) => {
                    // console.log('ApiService - catchError - global e: ', error);
                    return Observable.throw(ApiService.handleError(error, url));
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

    static handleError(error: any, url: string): ApiServiceError {
        const response: ApiServiceError = new ApiServiceError();
        if (error instanceof Response) {
            response.status = error.status;
            response.statusText = error.statusText;
            if (!response.statusText) {
                response.statusText = 'Connection to API endpoint failed';
            }
            response.route = url;
        } else {
            response.status = 0;
            response.statusText = 'Connection to API endpoint failed';
            response.route = url;
        }
        // response.status === 401 --> Unauthorized
        // response.status === 404 --> Not found
        console.log('ApiService: handleError: ', response);
        return response;
    }
}
