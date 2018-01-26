import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ApiService, ApiServiceError, ApiServiceResult } from '../../../core/services/';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../shared/api-objects';

@Injectable()
export class SearchService extends ApiService {

    projectId: string = '6';
    resourceAppendix: string = '_-_local';
    resourcesRoute: string = '/resources/';
    searchRoute: string = '/search/';

    /**********************************
     **
     **  fulltextSearch via salsah api
     **
     **********************************/
    public getFulltextSearchData(searchString: string): Observable<SearchResponseJson> {
        const queryString: string = this.searchRoute + searchString;
        const queryParams = new HttpParams()
            .set('searchtype', 'fulltext')
            .set('filter_by_project', this.projectId);

        return this.httpGet(queryString, queryParams).map(
            (result: ApiServiceResult) => {
                const searchResponse: SearchResponseJson = result.getBody(SearchResponseJson);
                return searchResponse;
            },
            (error: ApiServiceError ) => {
                const errorMessage = <any>error;
                console.error('SearchService - getResource - error: ', errorMessage);
                throw error;
            })
    }

    /***************************************
     **
     **  resource detail search via salsah api
     **
     ****************************************/
    public getResourceDetailData(resourceId: string): Observable<ResourceFullResponseJson> {
        const queryString: string = this.resourcesRoute + resourceId + this.resourceAppendix;
        const queryParams = new HttpParams();
            // .set('reqtype', 'info');
           //  .set('reqtype', 'context');

        return this.httpGet(queryString, queryParams).map(
            (result: ApiServiceResult) => {
                console.log(`SearchService - getResource - id: ${resourceId}, result: `, result);
                const resource: ResourceFullResponseJson = result.getBody(ResourceFullResponseJson);
                console.log(`SearchService - getResource - id: ${resourceId}, resource: `, resource);
                return resource;
            },
            (error: ApiServiceError ) => {
                const errorMessage = <any>error;
                console.error('SearchService - getResource - error: ', errorMessage);
                throw error;
            })
    }

}
