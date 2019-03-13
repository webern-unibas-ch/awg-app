import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiService } from '@awg-core/services';
import { ResourceFullResponseJson, SearchResponseJson } from '@awg-shared/api-objects';

@Injectable({
    providedIn: 'root'
})
export class BibliographyService extends ApiService {
    // issue with ServiceInheritance, cf. https://stackoverflow.com/questions/50263722/angular-6-services-and-class-inheritance
    static ngInjectableDef = undefined;

    projectId = '6';
    resTypeId = '126'; // test-01: 127
    bibShortTitlePropertyId = '614'; // 614 = Bibligoraphie#Kurztitel
    resourcesRoute = 'resources/';
    searchRoute = 'search/';

    constructor(http: HttpClient) {
        super(http);
        this.serviceName = 'BibliographyService';
    }

    /**********************************
     *
     *  get bibliography via salsah api
     *
     **********************************/
    getBibliographyList(): Observable<SearchResponseJson> {
        const queryPath: string = this.searchRoute;
        const queryHttpParams = new HttpParams()
            .set('searchtype', 'extended')
            .set('property_id', this.bibShortTitlePropertyId)
            .set('compop', 'EXISTS')
            .set('filter_by_project', this.projectId)
            .set('filter_by_restype', this.resTypeId);

        return this.getApiResponse(SearchResponseJson, queryPath, queryHttpParams);
    }

    getBibliographyItemDetail(resourceId: string): Observable<ResourceFullResponseJson> {
        const queryPath: string = this.resourcesRoute + resourceId;
        const queryHttpParams = new HttpParams();

        return this.getApiResponse(ResourceFullResponseJson, queryPath, queryHttpParams);
    }
}
