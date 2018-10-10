import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiService } from '@awg-core/services/';
import { ResourceFullResponseJson, SearchResponseJson } from '@awg-shared/api-objects';


@Injectable({
    providedIn: 'root'
})
export class DataApiService extends ApiService {

    // issue with ServiceInheritance, cf. https://stackoverflow.com/questions/50263722/angular-6-services-and-class-inheritance
    static ngInjectableDef = undefined;

    projectId = '6';
    resourceAppendix = '_-_local';
    resourcesRoute = '/resources/';
    searchRoute = '/search/';

    constructor(http: HttpClient) {
        super(http);
        this.serviceName = 'DataApiService';
    }


    /**********************************
     **
     **  fulltextSearch via salsah api
     **
     **********************************/
    getFulltextSearchData(searchString: string): Observable<SearchResponseJson> {

        console.log('service # getFulltextSearchData for: ', searchString);

        const queryString: string = this.searchRoute + searchString;
        const queryParams = new HttpParams()
            .set('searchtype', 'fulltext')
            .set('filter_by_project', this.projectId);

        return this.getApiResponse(SearchResponseJson, queryString, queryParams);
    }

    /***************************************
     **
     **  resource detail search via salsah api
     **
     ****************************************/
    getResourceDetailData(resourceId: string): Observable<ResourceFullResponseJson> {
        const queryString: string = this.resourcesRoute + resourceId + this.resourceAppendix;
        const queryParams = new HttpParams();
            // .set('reqtype', 'info');
           //  .set('reqtype', 'context');
        return this.getApiResponse(ResourceFullResponseJson, queryString, queryParams);
    }
}
