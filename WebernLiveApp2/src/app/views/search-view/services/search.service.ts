import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../core/services/api-service/api.service';
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
        return this.httpGet(queryString, queryParams);
    }

    /***************************************
     **
     **  resource detail search via salsah api
     **
     ****************************************/
    public getResourceData(resourceId: string): Observable<ResourceFullResponseJson> {
        const queryString: string = this.resourcesRoute + resourceId + this.resourceAppendix;
        const queryParams = new HttpParams();
        /*
            .set('restype', 'info')
            .set('reqtype', 'context');
        */
        return this.httpGet(queryString, queryParams);
    }

}
