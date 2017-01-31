import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../../api-service/api-objects';

@Injectable()
export class BibliographyService extends ApiService {

    private searchType: string = 'extended';
    private projectId: number = 6;
    private resTypeId: number = 126;    // test-01: 127

    // ################################
    //
    //  get bibliography via salsah api
    //
    // ################################
    getBibliographyList(): Observable<SearchResponseJson> {
        let url: string = '/search/?searchtype=' + this.searchType + '&filter_by_project=' + +this.projectId + '&filter_by_restype=' + +this.resTypeId;
        return this.httpGet(url);
    }

    getBibliographyItem(obj_id: string): Observable<ResourceFullResponseJson> {
        let url: string = '/resources/' + obj_id;
        return this.httpGet(url);
    }

}
