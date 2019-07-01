import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService, ConversionService } from '@awg-core/services/';
import { ResourceFullResponseJson, SearchResponseJson } from '@awg-shared/api-objects';

/**
 * The DataApi service.
 *
 * It handles the search responses to the given (SALSAH) API
 * for the data view and provides the fulltext search data
 * and the resource detail data.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class DataApiService extends ApiService {
    /**
     * Private variable: projectId.
     *
     * It keeps the SALSAH specific id of the webern project ('6').
     */
    projectId = '6';

    /**
     * Private variable: resourceSuffix.
     *
     * It keeps the SALSAH specific suffix for a resource ('_-_local').
     */
    resourceSuffix = '_-_local';

    /**
     * Private variable: resourceSuffix.
     *
     * It keeps the SALSAH specific route for a resource ('resources/').
     */
    resourcesRoute = 'resources/';

    /**
     * Private variable: resourceSuffix.
     *
     * It keeps the SALSAH specific route for the search ('search/').
     */
    searchRoute = 'search/';

    /**
     * Constructor of the DataApiService.
     *
     * It declares a public {@link HttpClient} instance
     * to handle http requests and a private {@link ConversionService}
     * instance for the conversion of the response data.
     *
     * @param {HttpClient} http Instance of the HttpClient.
     * @param {ConversionService} conversionService Instance of the ConversionService.
     */
    constructor(http: HttpClient, private conversionService: ConversionService) {
        super(http);
        this.serviceName = 'DataApiService';
    }

    /**
     * Public method: getFulltextSearchData.
     *
     * It sets the path and params for a fulltext search query
     * to the given (SALSAH) API.
     *
     * @params {string} searchString The search string of the query.
     * @params {string} [nRows] The optional number of rows to return with the query.
     * @params {string} [startAt] The optional start position in the result list to return results.
     * @returns {Observable<SearchResponseJson>} The observable with the SearchResponseJson data.
     */
    getFulltextSearchData(searchString: string, nRows?: string, startAt?: string): Observable<SearchResponseJson> {
        if (!searchString) {
            return;
        }
        // default values
        if (!nRows) {
            nRows = '-1';
        }
        if (!startAt) {
            startAt = '0';
        }

        // set path and params of query
        const queryPath: string = this.searchRoute + searchString;
        const queryHttpParams = new HttpParams()
            .set('searchtype', 'fulltext')
            .set('filter_by_project', this.projectId)
            .set('show_nrows', nRows)
            .set('start_at', startAt);

        // request to API
        return this.getApiResponse(SearchResponseJson, queryPath, queryHttpParams).pipe(
            map((searchResponse: SearchResponseJson) => {
                // conversion of search results for HTML display
                return this.conversionService.convertFullTextSearchResults(searchResponse);
            })
        );
    }

    /**
     * Public method: getResourceDetailData.
     *
     * It sets the path and params for a resource query
     * to the given (SALSAH) API.
     *
     * @params {string} resourceId The id of the requested resource.
     * @returns {Observable<ResourceFullResponseJson>} The observable with the ResourceFullResponseJson data.
     */
    getResourceDetailData(resourceId: string): Observable<ResourceFullResponseJson> {
        // set path and params of query
        const queryPath: string = this.resourcesRoute + resourceId + this.resourceSuffix;
        const queryHttpParams = new HttpParams();
        // .set('reqtype', 'info');
        //  .set('reqtype', 'context');
        return this.getApiResponse(ResourceFullResponseJson, queryPath, queryHttpParams);
    }
}
