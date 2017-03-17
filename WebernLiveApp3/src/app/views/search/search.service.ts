import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from '../../core/services/api-service/api.service';
import { SearchResponseJson } from '../../shared/api-objects';

@Injectable()
export class SearchService extends ApiService {

    private projectId: string = '6';

    // ################################
    //
    //  fulltextSearch via salsah api
    //
    // ################################
    getFulltextSearchData(searchString: string): Observable<SearchResponseJson> {
        let queryString: string = '/search/' + searchString;
        let params = new URLSearchParams();
            params.set('searchtype', 'fulltext');
            params.set('filter_by_project', this.projectId);
        return this.httpGet(queryString, { search: params });
    }

}
