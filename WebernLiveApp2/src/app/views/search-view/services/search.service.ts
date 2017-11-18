import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../core/services/api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../shared/api-objects';

@Injectable()
export class SearchService extends ApiService {

    private projectId: string = '6';

    /**********************************
     **
     **  fulltextSearch via salsah api
     **
     **********************************/
    public getFulltextSearchData(searchString: string): Observable<SearchResponseJson> {
        const queryString: string = '/search/' + searchString;
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
    public getResourceData(id: string): Observable<ResourceFullResponseJson> {
        const queryString: string = '/resources/' + id + '_-_local';
        const queryParams = new HttpParams();
        /*
            .set('restype', 'info')
            .set('reqtype', 'context');
        */
        return this.httpGet(queryString, queryParams);
    }

}
