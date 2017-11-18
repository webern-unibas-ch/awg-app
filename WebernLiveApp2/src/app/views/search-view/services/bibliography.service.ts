import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../core/services/api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../shared/api-objects';

@Injectable()
export class BibliographyService extends ApiService {

    private projectId: string = '6';
    private resTypeId: string = '126';      // test-01: 127
    private bibShortTitlePropertyId: string = '614';    // 614 = Bibligoraphie#Kurztitel

    // ################################
    //
    //  get bibliography via salsah api
    //
    // ################################
    getBibliographyList(): Observable<SearchResponseJson> {
        const queryString: string = '/search/';
        const queryParams = new HttpParams()
            .set('searchtype', 'extended')
            .set('property_id', this.bibShortTitlePropertyId)
            .set('compop', 'EXISTS')
            .set('filter_by_project', this.projectId)
            .set('filter_by_restype', this.resTypeId);
        return this.httpGet(queryString, queryParams);
    }

    getBibliographyItemDetail(objId: string): Observable<ResourceFullResponseJson> {
        const queryString: string = '/resources/' + objId;
        const queryParams = new HttpParams();
        return this.httpGet(queryString, queryParams);
    }

/* TODO#rm or use
    getBibliographyItems(idArray: Array<string>): Observable<any> {
        let observableItemsBatch = [];
        idArray.forEach((id: string) => {
            observableItemsBatch.push( this.getBibliographyItemDetail(id));
        });
        return Observable.forkJoin(observableItemsBatch);
    }
*/

}
