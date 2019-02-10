import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

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
    searchResultText: string;
    searchUrl = '';
    searchValue = '';

    nRows = '10';
    startAt = '0';

    errorMessage: any;
    isLoadingData = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private conversionService: ConversionService,
        private dataApiService: DataApiService,
        private streamerService: DataStreamerService
    ) {}

    ngOnInit() {
        this.dataApiServiceSubscription = this.subscribeToDataApiService();
    }

    subscribeToDataApiService(): Subscription {
        return this.route.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    // start loading
                    this.onLoadingStart();

                    // get params from route if available
                    this.checkForRouteParams(params);

                    // fetch search data for searchValue
                    return this.dataApiService.getFulltextSearchData(this.searchValue, this.nRows, this.startAt).pipe(
                        map((searchResponse: SearchResponseJson) => {
                            // update url for search
                            this.updateCurrentUrl();

                            // prepare search results
                            return this.prepareSearchResults(searchResponse);
                        })
                    );
                })
            )
            .subscribe(
                (searchResponse: SearchResponseJson) => {
                    // share search data via streamer service
                    this.updateStreamerService(searchResponse, this.searchValue);

                    // end loading
                    this.onLoadingEnd();
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    // check for route params
    checkForRouteParams(params: ParamMap) {
        if (!params) {
            return;
        }

        if (params.get('query')) {
            this.searchValue = params.get('query');
        }
        if (params.get('nRows')) {
            this.nRows = params.get('nRows');
        }
        if (params.get('startAt')) {
            this.startAt = params.get('startAt');
        }
    }

    // switch the load status
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

    // new startPosition after page change request
    onPageChange(startPosition: string): void {
        console.log('new startPosition: ', startPosition);
        if (startPosition !== this.startAt) {
            this.routeToSelf(this.searchValue, this.nRows, startPosition);
        }
    }

    // new row number after row change request
    onRowChange(rows: string): void {
        console.log('new nrows: ', rows);
        this.startAt = '0';
        if (rows !== this.nRows) {
            this.routeToSelf(this.searchValue, rows, this.startAt);
        }
    }

    // new query after search request
    onSearch(query: string): void {
        if (query !== this.searchValue) {
            this.routeToSelf(query, this.nRows, this.startAt);
        }
    }

    // prepare search result text
    prepareSearchResults(searchResponse: SearchResponseJson): SearchResponseJson {
        // conversion of search results for HTML display
        return this.conversionService.convertFullTextSearchResults(searchResponse);
    }

    // route to self to set new params
    routeToSelf(query: string, nRows: string, startAt: string) {
        this.router.navigate(['data/search/fulltext', { query: query, nRows: nRows, startAt: startAt }]);
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
