import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiService, ConversionService } from '@awg-core/services/';
import { ResourceFullResponseJson, SearchResponseJson } from '@awg-shared/api-objects';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataApiService extends ApiService {
    // issue with ServiceInheritance, cf. https://stackoverflow.com/questions/50263722/angular-6-services-and-class-inheritance
    static ngInjectableDef = undefined;

    projectId = '6';
    resourceAppendix = '_-_local';
    resourcesRoute = 'resources/';
    searchRoute = 'search/';

    constructor(http: HttpClient, private conversionService: ConversionService) {
        super(http);
        this.serviceName = 'DataApiService';
    }

    /**********************************
     **
     **  fulltextSearch via salsah api
     **
     **********************************/
    getFulltextSearchData(searchString: string, nRows?: string, startAt?: string): Observable<SearchResponseJson> {
        if (!searchString) {
            return;
        }
        if (!nRows) {
            nRows = '-1';
        }
        if (!startAt) {
            startAt = '0';
        }

        const queryPath: string = this.searchRoute + searchString;
        const queryHttpParams = new HttpParams()
            .set('searchtype', 'fulltext')
            .set('filter_by_project', this.projectId)
            .set('show_nrows', nRows)
            .set('start_at', startAt);

        return this.getApiResponse(SearchResponseJson, queryPath, queryHttpParams).pipe(
            map((searchResponse: SearchResponseJson) => {
                // conversion of search results for HTML display
                return this.conversionService.convertFullTextSearchResults(searchResponse);
            })
        );
    }

    /***************************************
     **
     **  resource detail search via salsah api
     **
     ****************************************/
    getResourceDetailData(resourceId: string): Observable<ResourceFullResponseJson> {
        const queryPath: string = this.resourcesRoute + resourceId + this.resourceAppendix;
        const queryHttpParams = new HttpParams();
        // .set('reqtype', 'info');
        //  .set('reqtype', 'context');
        return this.getApiResponse(ResourceFullResponseJson, queryPath, queryHttpParams);
    }
}
