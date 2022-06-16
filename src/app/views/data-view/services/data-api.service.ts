import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { forkJoin as observableForkJoin, Observable, of as observableOf } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';

import { ApiService, ConversionService } from '@awg-core/services/';
import {
    PropertyTypesInResourceClassResponseJson,
    ResourceContextResponseJson,
    ResourceFullResponseJson,
    ResourceTypesInVocabularyResponseJson,
    SearchResponseJson,
} from '@awg-shared/api-objects';
import {
    IResourceDataResponse,
    ResourceData,
    ResourceDetail,
    SearchParams,
    SearchResultsViewTypes,
} from '@awg-views/data-view/models';

/**
 * The DataApi service.
 *
 * It handles the search requests to the given (SALSAH) API
 * for the data view and provides the fulltext search data
 * and the resource detail data.
 *
 * Provided in: `root`.
 */
@Injectable({
    providedIn: 'root',
})
export class DataApiService extends ApiService {
    /**
     * Public variable: projectId.
     *
     * It keeps the SALSAH specific id of the webern project ('6').
     */
    projectId = '6';

    /**
     * Public variable: vocabularyId.
     *
     * It keeps the SALSAH specific id of the webern vocabulary ('4').
     */
    vocabularyId = '4';

    /**
     * Public variable: defaultLanguage.
     *
     * It keeps the SALSAH specific value for the defaut language ('de').
     */
    defaultLanguage = 'de';

    /**
     * Public variable: resourceSuffix.
     *
     * It keeps the SALSAH specific suffix for a resource ('_-_local').
     */
    resourceSuffix = '_-_local';

    /**
     * Public variable: routes.
     *
     * It keeps the SALSAH specific routes for
     *  propertylists, resources, resourcetypes and search.
     */
    routes = {
        propertylists: 'propertylists/',
        resources: 'resources/',
        resourcetypes: 'resourcetypes/',
        search: 'search/',
    };

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
     * Public method: getPropertyListsByResourceType.
     *
     * It sets the path and params for the Extended Search to retrieve
     * the list of properties of a given resource type id from the given (SALSAH) API.
     *
     * @params {string} restypeId The given resource type id.
     *
     * @returns {Observable<SearchResponseJson>} The observable with the PropertyTypesInResourceClassResponseJson data.
     */
    getPropertyListsByResourceType(restypeId: string): Observable<PropertyTypesInResourceClassResponseJson> {
        if (!restypeId) {
            return observableOf(new PropertyTypesInResourceClassResponseJson());
        }

        // Cold request to API
        const propertylistsData$: Observable<PropertyTypesInResourceClassResponseJson> =
            this._getResourceDataResponseFromApi(PropertyTypesInResourceClassResponseJson, restypeId);

        // Return resource types
        return propertylistsData$.pipe(
            // Default empty value
            defaultIfEmpty(new PropertyTypesInResourceClassResponseJson()),

            map((propertylists: PropertyTypesInResourceClassResponseJson) => propertylists)
        );
    }

    /**
     * Public method: getResourceData.
     *
     * It provides the data for the resource detail view
     * as an ResourceData observable.
     *
     * @params {string} resourceId The id of the requested resource.
     *
     * @returns {Observable<ResourceData>} The observable with the resource data.
     */
    getResourceData(resourceId: string): Observable<ResourceData> {
        if (!resourceId) {
            return undefined;
        }

        // Cold request to API
        const fullResponseData$: Observable<ResourceFullResponseJson> = this._getResourceDataResponseFromApi(
            ResourceFullResponseJson,
            resourceId
        );
        const contextData$: Observable<ResourceContextResponseJson> = this._getResourceDataResponseFromApi(
            ResourceContextResponseJson,
            resourceId
        );

        // Return converted search response
        return observableForkJoin([fullResponseData$, contextData$]).pipe(
            // Default empty value
            defaultIfEmpty([new ResourceFullResponseJson(), new ResourceContextResponseJson()]),

            // Map the forkJoined response to a ResourceData object
            map((resourceDataResponse: IResourceDataResponse) =>
                this._prepareResourceData(resourceDataResponse, resourceId)
            )
        );
    }

    /**
     * Public method: getResourceTypes.
     *
     * It sets the path and params for the Extended search to retrieve
     * all resource types of the Webern vocabulary (4) from the given (SALSAH) API.
     *
     * @returns {Observable<ResourceTypesInVocabularyResponseJson>} The observable with the ResourceTypesInVocabularyResponseJson data.
     */
    getResourceTypes(): Observable<ResourceTypesInVocabularyResponseJson> {
        // Cold request to API
        const resourcetypesData$: Observable<ResourceTypesInVocabularyResponseJson> =
            this._getResourceDataResponseFromApi(ResourceTypesInVocabularyResponseJson, '');

        // Return resource types
        return resourcetypesData$.pipe(
            // Default empty value
            defaultIfEmpty(new ResourceTypesInVocabularyResponseJson()),

            map((resourcetypes: ResourceTypesInVocabularyResponseJson) => resourcetypes)
        );
    }

    /**
     * Public method: getSearchData.
     *
     * It sets the path and params for a search query
     * depending on the search mode (fulltext or extended)
     * to retrieve all results from the given (SALSAH) API.
     *
     * @params {SearchParams} searchParams The given search parameters of the query.
     *
     * @returns {Observable<SearchResponseJson>} The observable with the SearchResponseJson data.
     */
    getSearchData(searchParams: SearchParams): Observable<SearchResponseJson> {
        if (!searchParams || !searchParams.query) {
            return observableOf(new SearchResponseJson());
        }
        if (typeof searchParams.query === 'object' && !searchParams.query['filterByRestype']) {
            return observableOf(new SearchResponseJson());
        }

        // Default values
        const sp: SearchParams = {
            query: searchParams.query,
            nRows: searchParams.nRows || '-1',
            startAt: searchParams.startAt || '0',
            view: searchParams.view || SearchResultsViewTypes.table,
        };

        // Cold request to API
        const searchData$: Observable<SearchResponseJson> = this._getResourceDataResponseFromApi(
            SearchResponseJson,
            '',
            sp
        );

        // Return converted search response
        return searchData$.pipe(
            // Default empty value
            defaultIfEmpty(new SearchResponseJson()),

            // Map the response to a converted search response object for HTML display
            map((searchResponse: SearchResponseJson) =>
                this.conversionService.convertFullTextSearchResults(searchResponse)
            )
        );
    }

    /**
     * Private method: _createSearchQueryParamsForApi.
     *
     * It creates queryHttp params for the API request from a given SearchParams object.
     *
     * @params {SearchParams} sp The given search params.
     *
     * @returns {HttpParams} The queryHttpParams object for the API.
     */
    private _createSearchQueryParamsForApi(sp: SearchParams): HttpParams {
        let queryHttpParams = new HttpParams()
            .set('filter_by_project', this.projectId)
            .set('lang', this.defaultLanguage)
            .set('show_nrows', sp.nRows)
            .set('start_at', sp.startAt);

        if (typeof sp.query === 'string') {
            queryHttpParams = queryHttpParams.append('searchtype', 'fulltext');
        } else if (typeof sp.query === 'object') {
            queryHttpParams = queryHttpParams.append('searchtype', 'extended');
            queryHttpParams = queryHttpParams.append('filter_by_restype', sp.query['filterByRestype']);

            if (
                sp.query.propertyId &&
                sp.query.propertyId.length > 0 &&
                sp.query.compop &&
                sp.query.compop.length > 0
            ) {
                // Compop not possible without property
                sp.query.propertyId.forEach(id => {
                    queryHttpParams = queryHttpParams.append('property_id', id);
                });
                sp.query.compop.forEach(compop => {
                    queryHttpParams = queryHttpParams.append('compop', compop);
                });
                // For compop EXISTS there is no searchval
                if (sp.query.searchval && sp.query.searchval.length > 0) {
                    sp.query.searchval.forEach(searchval => {
                        queryHttpParams = queryHttpParams.append('searchval', searchval);
                    });
                }
            }
        }

        return queryHttpParams;
    }

    /**
     * Private method: _prepareResourceData.
     *
     * It converts the data response of a requested resource
     * to a ResourceData object.
     *
     * @params {IResourceDataResponse} resourceData The data response of the requested resource.
     * @params {string} resourceId The id of the requested resource.
     *
     * @returns {ResourceData} The resource data object.
     */
    private _prepareResourceData(resourceDataResponse: IResourceDataResponse, resourceId: string): ResourceData {
        // Convert data for displaying resource detail
        const resourceDetail: ResourceDetail = this.conversionService.convertResourceData(
            resourceDataResponse,
            resourceId
        );

        // Return new resource data
        return new ResourceData(resourceDataResponse[0], resourceDetail);
    }
    /**
     * Private method: _getResourceDataResponseFromApi.
     *
     * It prepares the calls to the given (SALSAH) API
     * for a resource id depending on the responseJsonType
     * and the given resource id.
     *
     * @param {*} responseJsonType The given json type of the API response.
     * @param {string} id The given id of a resource.
     *
     * @returns {Observable<any>} The observable of the HTTP response.
     */
    private _getResourceDataResponseFromApi(
        responseJsonType: any,
        id: string,
        searchParams?: SearchParams
    ): Observable<any> {
        // Init query path and params
        let queryPath: string;
        let queryHttpParams: HttpParams;

        // Set path and params of query depending on responseJsonType
        switch (responseJsonType) {
            case PropertyTypesInResourceClassResponseJson:
                queryPath = this.routes.propertylists;
                queryHttpParams = new HttpParams().set('restype', id);
                break;
            case ResourceContextResponseJson:
                queryPath = this.routes.resources + id + this.resourceSuffix;
                queryHttpParams = new HttpParams().set('reqtype', 'context');
                break;
            case ResourceFullResponseJson:
                queryPath = this.routes.resources + id + this.resourceSuffix;
                queryHttpParams = new HttpParams();
                break;
            case ResourceTypesInVocabularyResponseJson:
                queryPath = this.routes.resourcetypes;
                queryHttpParams = new HttpParams()
                    .set('vocabulary', this.vocabularyId)
                    .set('lang', this.defaultLanguage);
                break;
            case SearchResponseJson:
                queryPath = this.routes.search;
                if (typeof searchParams.query === 'string') {
                    queryPath = queryPath + searchParams.query;
                }
                queryHttpParams = this._createSearchQueryParamsForApi(searchParams);
                break;
            default:
                break;
        }

        // Trigger call to API
        return this.getApiResponse(responseJsonType, queryPath, queryHttpParams);
    }
}
