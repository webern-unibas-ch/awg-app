import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiService } from '@awg-core/services/';
import { ResourceFullResponseJson, SearchResponseJson } from '@awg-shared/api-objects';

@Injectable()
export class DataApiService extends ApiService {

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

        return this.getApiResponse(SearchResponseJson, queryString, queryParams);
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
        return this.getApiResponse(ResourceFullResponseJson, queryString, queryParams);
    }
}
