import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
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
        const params = new URLSearchParams();
            params.set('searchtype', 'fulltext');
            params.set('filter_by_project', this.projectId);
        return this.httpGet(queryString, { search: params });
    }

    /***************************************
    **
    **  resource detail search via salsah api
    **
    ****************************************/
    public getResourceData(id: string): Observable<ResourceFullResponseJson> {
        const queryString: string = '/resources/' + id + '_-_local';
        /*let params = new URLSearchParams();
        params.set('restype', 'info');
        params.set('reqtype', 'context');
        */
        return this.httpGet(queryString /*, { search: params } */);
    }

}
