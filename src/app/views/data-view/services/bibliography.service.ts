import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiService } from '@awg-core/services';
import { ResourceFullResponseJson, SearchResponseJson } from '@awg-shared/api-objects';

/**
 * The Bibliography service.
 *
 * It handles the search requests to the given (SALSAH) API
 * for the data bibliography view and provides the bibliography data.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root'
})
export class BibliographyService extends ApiService {
    /**
     * Public variable: projectId.
     *
     * It keeps the SALSAH specific id of the webern project ('6').
     */
    projectId = '6';

    /**
     * Public variable: resTypeId.
     *
     * It keeps the SALSAH specific id of the bibligraphy resource type ('126').
     * For Test server test-01 it is: '127'
     */
    resTypeId = '126';

    /**
     * Public variable: bibShortTitlePropertyId.
     *
     * It keeps the SALSAH specific id of the bibligraphy's short title property ('614').
     * 614 = Bibligoraphie#Kurztitel
     */
    bibShortTitlePropertyId = '614';

    /**
     * Public variable: resourcesRoute.
     *
     * It keeps the SALSAH specific route for a resource ('resources/').
     */
    resourcesRoute = 'resources/';

    /**
     * Public variable: searchRoute.
     *
     * It keeps the SALSAH specific route for the search ('search/').
     */
    searchRoute = 'search/';

    /**
     * Constructor of the DataApiService.
     *
     * It declares a public {@link HttpClient} instance
     * to handle http requests.
     *
     * @param {HttpClient} http Instance of the HttpClient.
     */
    constructor(http: HttpClient) {
        super(http);
        this.serviceName = 'BibliographyService';
    }

    /**
     * Public method: getBibliographyList.
     *
     * It sets the path and params for an extended search query
     * to retrieve a list of bibliography entries
     * from the given (SALSAH) API.
     *
     * @returns {Observable<SearchResponseJson>} The observable with the SearchResponseJson data.
     */
    getBibliographyList(): Observable<SearchResponseJson> {
        // set path and params of query
        const queryPath: string = this.searchRoute;
        const queryHttpParams = new HttpParams()
            .set('searchtype', 'extended')
            .set('property_id', this.bibShortTitlePropertyId)
            .set('compop', 'EXISTS')
            .set('filter_by_project', this.projectId)
            .set('filter_by_restype', this.resTypeId);

        // request to API
        return this.getApiResponse(SearchResponseJson, queryPath, queryHttpParams);
    }

    /**
     * Public method: getBibliographyItemDetail.
     *
     * It sets the path and params for a resource query
     * to the given (SALSAH) API.
     * @todo Replace with {@link DataApiService#getResourceDetailData}.
     *
     * @params {string} resourceId The id of the requested resource.
     * @returns {Observable<ResourceFullResponseJson>} The observable with the ResourceFullResponseJson data.
     */
    getBibliographyItemDetail(resourceId: string): Observable<ResourceFullResponseJson> {
        // set path and params of query
        const queryPath: string = this.resourcesRoute + resourceId;
        const queryHttpParams = new HttpParams();

        // request to API
        return this.getApiResponse(ResourceFullResponseJson, queryPath, queryHttpParams);
    }
}
