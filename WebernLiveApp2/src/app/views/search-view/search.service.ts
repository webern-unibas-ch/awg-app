import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../api-service/api.service';
import { SearchResponseJson } from '../../api-service/api-objects';


@Injectable()
export class SearchService extends ApiService {

    private searchType: string = 'fulltext';
    private projectId: number = 6;

    getFulltextSearchData(searchString: string): Observable<SearchResponseJson> {
        let url: string = '/search/' + searchString + '?searchtype=' + this.searchType + '&filter_by_project=' + +this.projectId;
        console.info('SearchService#getfulltextSearchData: url: ', url);
        return this.httpGet(url);
    }

}
