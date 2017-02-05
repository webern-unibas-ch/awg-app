import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';

import { ApiService } from '../../../../core/services/api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../../shared/api-objects';

@Injectable()
export class BibliographyService extends ApiService {

    private projectId: string = '6';
    private resTypeId: string = '126';    // test-01: 127

    // ################################
    //
    //  get bibliography via salsah api
    //
    // ################################
    getBibliographyList(): Observable<SearchResponseJson> {
        let queryString: string = '/search/';
        let params = new URLSearchParams();
        params.set('searchtype', 'extended');
        params.set('filter_by_project', this.projectId);
        params.set('filter_by_restype', this.resTypeId);
        return this.httpGet(queryString, { search: params });
    }

    getBibliographyItems(idArray: Array<string>): Observable<any> {
        let observableItemsBatch = [];
        idArray.forEach((id: string) => {
            observableItemsBatch.push( this.getBibliographyItemDetail(id));
        });
        return Observable.forkJoin(observableItemsBatch);
    }


    getBibliographyItemDetail(obj_id: string): Observable<ResourceFullResponseJson> {
        let queryString: string = '/resources/' + obj_id;
        return this.httpGet(queryString);
    }

}
