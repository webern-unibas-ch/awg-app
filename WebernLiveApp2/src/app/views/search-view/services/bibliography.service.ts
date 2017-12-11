import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../../core/services/api-service/api.service';
import { ResourceFullResponseJson, SearchResponseJson } from '../../../shared/api-objects';

@Injectable()
export class BibliographyService extends ApiService {

    projectId: string = '6';
    resTypeId: string = '126';      // test-01: 127
    bibShortTitlePropertyId: string = '614';    // 614 = Bibligoraphie#Kurztitel
    resourcesRoute: string = '/resources/';
    searchRoute: string = '/search/';

    // ################################
    //
    //  get bibliography via salsah api
    //
    // ################################
    getBibliographyList(): Observable<SearchResponseJson> {
        const queryString: string = this.searchRoute;
        const queryParams = new HttpParams()
            .set('searchtype', 'extended')
            .set('property_id', this.bibShortTitlePropertyId)
            .set('compop', 'EXISTS')
            .set('filter_by_project', this.projectId)
            .set('filter_by_restype', this.resTypeId);
        return this.httpGet(queryString, queryParams);
    }

    getBibliographyItemDetail(resourceId: string): Observable<ResourceFullResponseJson> {
        const queryString: string = this.resourcesRoute + resourceId;
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
