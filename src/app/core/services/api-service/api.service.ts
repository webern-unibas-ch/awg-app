import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';

import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';

import { ApiServiceResult } from './api-service-result.model';
import { ApiServiceError } from './api-service-error.model';
import { ApiRequest } from './api-request.model';

/**
 * The Api service.
 *
 * It handles the calls to the given (Salsah) API viA HTTP
 * and provides the data responses for the data view.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    /**
     * Public variable: serviceName.
     *
     * It keeps the name of the service.
     */
    serviceName = 'ApiService';

    /**
     * Public variable: httpGetUrl.
     *
     * It keeps the url of the HTTP GET request.
     */
    httpGetUrl = '';

    /**
     * Constructor of the ApiService.
     *
     * It declares a private {@link HttpClient} instance
     * to handle http requests.
     *
     * @param {HttpClient} http Instance of the HttpClient.
     */
    constructor(public http: HttpClient) {
        // console.log(`called ${this.serviceName} with httpClient`, http);
    }

    /**
     * Public method: getApiResponse.
     *
     * It returns an HTTP GET request response from the given (Salsah) API.
     *
     * @param {any} responseJsonType The given expected response JSON type of the query.
     * @param {string} queryPath The given path of the query.
     * @param {HttpParams} [queryHttpParams] The given optional HTTP params for the query.
     *
     * @returns {Observable<any>} The observable of the API request.
     */
    getApiResponse(responseJsonType: any, queryPath: string, queryHttpParams?: HttpParams): Observable<any> {
        if (!queryHttpParams) {
            queryHttpParams = new HttpParams();
        }

        return this.httpGet(queryPath, queryHttpParams).pipe(
            map(
                (result: ApiServiceResult): Observable<any> => {
                    return result.getBody(responseJsonType);
                }
            ),
            catchError(
                (error: ApiServiceError): Observable<ApiServiceError> => {
                    // console.error('ApiService - getApiResponse - error: ', error);
                    return observableThrowError(error);
                }
            )
        );
    }

    /**
     * Private method: httpGet.
     *
     * Performs an HTTP GET request to the given (Salsah) API.
     *
     * @param {string} queryPath The given path of the query.
     * @param {HttpParams} queryHttpParams The given HTTP params for the query.
     *
     * @returns {Observable<ApiServiceResult | ApiServiceError>} The observable of the api service result or error.
     */
    private httpGet(queryPath: string, queryHttpParams: HttpParams): Observable<ApiServiceResult | ApiServiceError> {
        const apiRequest = new ApiRequest(queryPath, queryHttpParams);

        return this.http
            .get<ApiServiceResult | ApiServiceError>(apiRequest.url, {
                observe: 'response',
                params: apiRequest.params,
                headers: apiRequest.headers
            })
            .pipe(
                // store the actual url
                tap((response: HttpResponse<ApiServiceResult>) => {
                    this.httpGetUrl = response.url;
                }),
                // map the response into ApiServiceResult class
                map(
                    (response: HttpResponse<any>): ApiServiceResult => {
                        const apiServiceResult = new ApiServiceResult();
                        apiServiceResult.status = response.status;
                        apiServiceResult.statusText = response.statusText;
                        apiServiceResult.body = response.body;
                        apiServiceResult.url = response.url;

                        return apiServiceResult;
                    }
                ),
                // catch any errors
                catchError(
                    (error: HttpErrorResponse): Observable<ApiServiceError> => {
                        return this.handleRequestError(error);
                    }
                )
            );
    }

    /**
     * Private method: handleRequestError.
     *
     * It handles request errors in case of server error.
     *
     * @param {HttpErrorResponse} error The given error.
     *
     * @returns {Observable<ApiServiceError>} The observable of the api service error.
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
