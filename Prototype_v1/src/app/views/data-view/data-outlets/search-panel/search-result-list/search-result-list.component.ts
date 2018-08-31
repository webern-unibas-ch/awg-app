import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';

import { SearchInfo } from '../../../../../side-info/side-info-models';
import { SearchResponseJson } from '../../../../../shared/api-objects';
import { SearchResponseWithQuery } from '../../../models';

import { ConversionService, DataStreamerService, SideInfoService } from '../../../../../core/services';
import { DataApiService } from '../../../services';


@Component({
    selector: 'awg-search-result-list',
    templateUrl: './search-result-list.component.html',
    styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnInit, OnDestroy {
    @Input() searchUrl: string;

    errorMessage: any = undefined;
    currentId: string;
    filteredOut: number;

    streamerServiceSubscription: Subscription;
    searchData: SearchResponseJson;
    searchResultText: string;
    searchVal: string;

    constructor(
        private router: Router,
        private conversionService: ConversionService,
        private searchService: DataApiService,
        private sideInfoService: SideInfoService,
        private streamerService: DataStreamerService,
    ) { }

    ngOnInit() {
        this.streamerServiceSubscription = this.subscribeToStreamerService();
    }


    subscribeToStreamerService(): Subscription {
        return this.streamerService.getCurrentSearchResults().pipe(
            map((response: SearchResponseWithQuery) => {
                // update current search params (url, text, sideinfo) via streamer service
                this.updateSearchParams(response);

                return response.data;
            })
        ).subscribe((searchData: SearchResponseJson) => {
                this.searchData = searchData;
            },
            error => {
                this.errorMessage = <any>error;
                console.log('SearchResultList# searchResultData subscription error: ', this.errorMessage);
            });
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
        this.searchVal = response.query;
        // prepare result text for fulltext search
        this.searchResultText = this.conversionService.prepareFullTextSearchResultText(response.data, this.filteredOut, this.searchUrl);
    }


    // update data for searchInfo via sideinfo service
    updateSearchInfoService() {
        const searchInfo: SearchInfo = new SearchInfo(this.searchVal, this.searchResultText);
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
