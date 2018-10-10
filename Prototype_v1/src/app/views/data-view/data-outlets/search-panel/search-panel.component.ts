import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap,  map } from 'rxjs/operators';


import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';
import { DataApiService } from '@awg-views/data-view/services';

import { SearchResponseJson } from '@awg-shared/api-objects';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit, OnDestroy {

    dataApiServiceSubscription: Subscription;

    searchData: SearchResponseJson;
    searchValue = '';
    searchUrl = '';
    searchResultText: string;

    errorMessage: any;
    isLoadingData = false;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private conversionService: ConversionService,
        private dataApiService: DataApiService,
        private sideInfoService: SideInfoService,
        private streamerService: DataStreamerService,
    ) {}


    ngOnInit() {
        this.dataApiServiceSubscription = this.subscribeToDataApiService();
    }


    subscribeToDataApiService(): Subscription {
        return this.route.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    // get query param from route to update searchValue
                    if (params.get('query')) {
                        this.searchValue = params.get('query');
                    }

                    this.onLoadingStart();

                    // fetch search data for searchValue
                    return this.dataApiService.getFulltextSearchData(this.searchValue)
                        .pipe(
                            map((searchResponse: SearchResponseJson) => {

                                // update url for search
                                this.updateCurrentUrl();

                                // prepare search results
                                return this.prepareSearchResults(searchResponse);
                            })
                        );
                }))
            .subscribe((searchResponse: SearchResponseJson) => {
                    // share search data via streamer service
                    this.updateStreamerService(searchResponse, this.searchValue);

                    this.onLoadingEnd();
                },
                error => {
                    this.errorMessage = <any>error;
                });
    }


    // change the load status
    changeLoadingStatus(status: boolean) {
        this.isLoadingData = status;
    }


    // start loading activities
    onLoadingStart(): void {
        this.changeLoadingStatus(true);
    }


    // end loading activities
    onLoadingEnd(): void {
        this.changeLoadingStatus(false);
    }


    // route to url with query when getting submit request
    onSubmit(query: string) {
        if (query !== this.searchValue) {
            this.router.navigate(['data/search/fulltext', {query: query}]);
        }
    }


    prepareSearchResults(searchResponse: SearchResponseJson): SearchResponseJson {
        // conversion of search results for HTML display
        return this.conversionService.convertFullTextSearchResults(searchResponse);
    }


    updateCurrentUrl() {
        // get url from search service
        this.searchUrl = this.dataApiService.httpGetUrl;
    }


    // update search data via streamer service
    updateStreamerService(searchResponse: SearchResponseJson, query: string) {
        const searchResponseWithQuery: SearchResponseWithQuery = new SearchResponseWithQuery(searchResponse, query);
        this.streamerService.updateSearchResponseStream(searchResponseWithQuery);
    }


    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.dataApiServiceSubscription) {
            this.dataApiServiceSubscription.unsubscribe();
        }
    }

}
