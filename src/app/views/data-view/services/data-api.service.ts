import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { forkJoin as observableForkJoin, Observable, of as observableOf } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';

import { ApiService, ConversionService } from '@awg-core/services/';
import {
    GeoDataJson,
    HlistJson,
    ResourceContextResponseJson,
    ResourceFullResponseJson,
    ResourceTypesInVocabularyResponseJson,
    SearchResponseJson,
    SelectionJson,
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
     * resources, search, geonames, hlists and selections.
     */
    routes = {
        resources: 'resources/',
        resourcetypes: 'resourcetypes/',
        search: 'search/',
        geonames: 'geonames/',
        hlists: 'hlists/',
        selections: 'selections/',
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
            return;
        }

        // Default values
        const sp: SearchParams = {
            query: searchParams.query,
            nRows: searchParams.nRows || '-1',
            startAt: searchParams.startAt || '0',
            view: searchParams.view || SearchResultsViewTypes.table,
        };

        // Set path and params of query
        let queryPath: string = this.routes.search;
        if (typeof searchParams.query === 'string') {
            queryPath = queryPath + searchParams.query;
        }

        const queryHttpParams = this._createQueryParams(sp);

        // Cold request to API
        const searchData$: Observable<SearchResponseJson> = this.getApiResponse(
            SearchResponseJson,
            queryPath,
            queryHttpParams
        );

        // Return converted search response
        return searchData$.pipe(
            // Default empty value
            defaultIfEmpty(new SearchResponseJson()),

            // Map the response to a converted search response object for HTML display
            map((searchResponse: SearchResponseJson) => {
                console.log(this.httpGetUrl);

                return this.conversionService.convertFullTextSearchResults(searchResponse);
            })
        );
    }

    getExtendedSearchResourcetypes(): Observable<ResourceTypesInVocabularyResponseJson> {
        const vocabularyId = 4;

        // Set path and params of query
        const queryPath: string = this.routes.resourcetypes;
        const queryHttpParams = new HttpParams().set('vocabulary', vocabularyId).set('lang', this.defaultLanguage);

        // Cold request to API
        const resourcetypesData$: Observable<ResourceTypesInVocabularyResponseJson> = this.getApiResponse(
            ResourceTypesInVocabularyResponseJson,
            queryPath,
            queryHttpParams
        );

        // Return resource types
        return resourcetypesData$.pipe(
            // Default empty value
            defaultIfEmpty(new ResourceTypesInVocabularyResponseJson()),

            map((resourcetypes: ResourceTypesInVocabularyResponseJson) => {
                console.log(this.httpGetUrl);
                return resourcetypes;
            })
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
            return;
        }

        // Cold request to API
        const fullResponseData$: Observable<ResourceFullResponseJson> = this._getResourceFullResponseData(resourceId);
        const contextData$: Observable<ResourceContextResponseJson> = this._getResourceContextData(resourceId);

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

    private _createQueryParams(sp: SearchParams) {
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

            if (sp.query.propertyId.length > 0) {
                sp.query.propertyId.forEach(id => {
                    queryHttpParams = queryHttpParams.append('property_id', id);
                });
            }
            if (sp.query.compop.length > 0) {
                sp.query.compop.forEach(compop => {
                    queryHttpParams = queryHttpParams.append('compop', compop);
                });
            }
            if (sp.query.searchval.length > 0) {
                sp.query.searchval.forEach(searchval => {
                    queryHttpParams = queryHttpParams.append('searchval', searchval);
                });
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
        if (Object.keys(resourceDataResponse[0]).length === 0 && resourceDataResponse[0].constructor === Object) {
            return new ResourceData(new ResourceFullResponseJson(), undefined);
        }

        // Convert data for displaying resource detail
        const resourceDetail: ResourceDetail = this.conversionService.convertResourceData(
            resourceDataResponse,
            resourceId
        );

        // Return new resource data
        return new ResourceData(resourceDataResponse[0], resourceDetail);
    }

    /**
     * Private method: _getResourceContextData.
     *
     * It calls the {@link _getResourceDataResponseFromApi} method to
     * provide an Observable with the ResourceContextResponseJson data.
     *
     * @params {string} resourceId The id of the requested resource.
     *
     * @returns {Observable<ResourceContextResponseJson>} The observable of the response data.
     */
    private _getResourceContextData(resourceId: string): Observable<ResourceContextResponseJson> {
        return this._getResourceDataResponseFromApi(ResourceContextResponseJson, resourceId);
    }

    /**
     * Private method: _getResourceFullResponseData.
     *
     * It calls the {@link _getResourceDataResponseFromApi} method to
     * provide an Observable with the ResourceFullResponseJson data.
     *
     * @params {string} resourceId The id of the requested resource.
     *
     * @returns {Observable<ResourceFullResponseJson>} The observable of the response data.
     */
    private _getResourceFullResponseData(resourceId: string): Observable<ResourceFullResponseJson> {
        return this._getResourceDataResponseFromApi(ResourceFullResponseJson, resourceId);
    }

    /**
     * Private method: _getGeoData.
     *
     * * It calls the {@link _getResourceDataResponseFromApi} method to
     * provide an Observable with the GeoDataJson data.
     *
     * NOT USED.
     *
     * IMPLEMENTATION FOR FUTURE USE.
     *
     * @params {string} resourceId The id of the requested resource.
     *
     * @returns {Observable<GeoDataJson>} The observable of the response data.
     */
    private _getGeoData(resourceId: string): Observable<GeoDataJson> {
        return this._getResourceDataResponseFromApi(GeoDataJson, resourceId);
    }

    /**
     * Private method: _getHlistData.
     *
     * * It calls the {@link _getResourceDataResponseFromApi} method to
     * provide an Observable with the HlistJson data.
     *
     * NOT USED.
     *
     * IMPLEMENTATION FOR FUTURE USE.
     *
     * @params {string} resourceId The id of the requested resource.
     *
     * @returns {Observable<HlistJson>} The observable of the response data.
     */
    private _getHlistData(resourceId: string): Observable<HlistJson> {
        return this._getResourceDataResponseFromApi(HlistJson, resourceId);
    }

    /**
     * Private method: _getSelectionsData.
     *
     * * It calls the {@link _getResourceDataResponseFromApi} method to
     * provide an Observable with the SelectionJson data.
     *
     * NOT USED.
     *
     * IMPLEMENTATION FOR FUTURE USE.
     *
     * @params {string} resourceId The id of the requested resource.
     *
     * @returns {Observable<SelectionJson>} The observable of the response data.
     */
    private _getSelectionsData(resourceId: string): Observable<SelectionJson> {
        return this._getResourceDataResponseFromApi(SelectionJson, resourceId);
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
    private _getResourceDataResponseFromApi(responseJsonType: any, id: string): Observable<any> {
        // Init query path and params
        let queryPath: string;
        let queryHttpParams: HttpParams = new HttpParams();

        // Set path and params of query depending on responseJsonType
        switch (responseJsonType) {
            case GeoDataJson:
                queryPath = this.routes.geonames + id;
                queryHttpParams = queryHttpParams.set('reqtype', 'node');
                break;
            case HlistJson:
                queryPath = this.routes.hlists + id;
                break;
            case ResourceContextResponseJson:
                queryPath = this.routes.resources + id + this.resourceSuffix;
                queryHttpParams = queryHttpParams.set('reqtype', 'context');
                break;
            case ResourceFullResponseJson:
                queryPath = this.routes.resources + id + this.resourceSuffix;
                break;
            case SelectionJson:
                queryPath = this.routes.selections + id;
                break;
        }

        // Trigger call to API
        return this.getApiResponse(responseJsonType, queryPath, queryHttpParams);
    }

    /**
     * Private method: _getNodeIdFromAttributes.
     *
     * It gets a node id from the prop.attributes
     * of a selections or hlists value.
     *
     * NOT USED.
     *
     * IMPLEMENTATION FOR FUTURE USE.
     *
     * @param {string} attributes The given prop.attributes.
     *
     * @returns {string} id The node id.
     */
    private _getNodeIdFromAttributes(attributes: string): string {
        // Identify node id from prop.attributes
        // E.g. "hlist=17" or "selection=77"
        return attributes.split('=')[1].toString();
    }
}
