import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { SearchInfo } from '@awg-side-info/side-info-models';
import { SearchResponseJson } from '@awg-shared/api-objects';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';

import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';
import { DataApiService } from '@awg-views/data-view/services';

@Component({
    selector: 'awg-search-result-list',
    templateUrl: './search-result-list.component.html',
    styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnInit, OnDestroy {
    @Input()
    searchUrl: string;

    errorMessage: any = undefined;
    currentId: string;
    filteredOut: number;

    streamerServiceSubscription: Subscription;
    searchResponse: SearchResponseJson;
    searchResultText: string;
    searchValue: string;

    constructor(
        private router: Router,
        private conversionService: ConversionService,
        private searchService: DataApiService,
        private sideInfoService: SideInfoService,
        private streamerService: DataStreamerService
    ) {}

    ngOnInit() {
        this.streamerServiceSubscription = this.subscribeToStreamerService();
    }

    subscribeToStreamerService(): Subscription {
        return this.streamerService
            .getCurrentSearchResults()
            .pipe(
                map((searchResponseWithQuery: SearchResponseWithQuery) => {
                    // update current search params (url, text, sideinfo) via streamer service
                    this.updateSearchParams(searchResponseWithQuery);

                    return searchResponseWithQuery.data;
                })
            )
            .subscribe(
                (searchResponse: SearchResponseJson) => {
                    this.searchResponse = searchResponse;
                },
                error => {
                    this.errorMessage = <any>error;
                    console.log('SearchResultList# searchResultData subscription error: ', this.errorMessage);
                }
            );
    }

    updateSearchParams(response: SearchResponseWithQuery): void {
        // update current search values
        this.updateCurrentValues(response);

        // update side info
        this.updateSearchInfoService();
    }

    // update current search values
    updateCurrentValues(response: SearchResponseWithQuery) {
        // get current search value
        this.searchValue = response.query;
        // prepare result text for fulltext search
        this.searchResultText = this.conversionService.prepareFullTextSearchResultText(
            response.data,
            this.filteredOut,
            this.searchUrl
        );
    }

    // update data for searchInfo via sideinfo service
    updateSearchInfoService() {
        const searchInfo: SearchInfo = new SearchInfo(this.searchValue, this.searchResultText);
        this.sideInfoService.updateSearchInfoData(searchInfo);
    }

    isActiveResource(id: string) {
        return this.currentId === id;
    }

    navigateToResource(id: string) {
        this.currentId = id;
        this.router.navigate(['/data/resource', this.currentId]);
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.streamerServiceSubscription) {
            this.streamerServiceSubscription.unsubscribe();
        }
    }
}
