import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from '../../core/services/api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../shared/api-objects';


@Injectable()
export class SearchService extends ApiService {

    private projectId: string = '6';

    /**********************************
    **
    **  fulltextSearch via salsah api
    **
    **********************************/
    public getFulltextSearchData(searchString: string): Observable<SearchResponseJson> {
        let queryString: string = '/search/' + searchString;
        let params = new URLSearchParams();
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
        let queryString: string = '/resources/' + id + '_-_local';
        /*let params = new URLSearchParams();
        params.set('restype', 'info');
        params.set('reqtype', 'context');
        */
        return this.httpGet(queryString /*, { search: params } */);
    }

}
