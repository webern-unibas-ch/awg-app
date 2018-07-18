import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/do';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ConversionService, DataStreamerService, SideInfoService } from '../../../../core/services';
import { DataApiService} from '../../services';

import { SearchResponseJson } from '../../../../shared/api-objects';
import { SearchResponseWithQuery } from '../../models';
import { SearchInfo } from '../../../../side-info/side-info-models';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit, OnDestroy {

    searchServiceSubscription: Subscription;
    streamerServiceSubscription: Subscription;

    searchData: SearchResponseJson = new SearchResponseJson();
    searchval: string = 'Skizze';
    searchUrl: string = '';
    searchResultText: string;

    errorMessage: string = undefined;
    filteredOut: number;
    isLoadingData: boolean;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private conversionService: ConversionService,
        private searchService: DataApiService,
        private sideInfoService: SideInfoService,
        private streamerService: DataStreamerService,
        private loadingSpinnerService: Ng4LoadingSpinnerService
    ) {}


    ngOnInit() {
        console.log('searchData on Init', this.searchData);

        this.searchServiceSubscription = this.subscribeToSearchService();
        this.streamerServiceSubscription = this.subscribeToStreamerService();
    }


    subscribeToSearchService(): Subscription {
        console.log('SEARCH PANEL ONINIT');
        return this.route.paramMap
            .switchMap((params: ParamMap) => {
                // get query param from route to update searchvalue
                if (params.get('query')) {
                    this.searchval = params.get('query');
                }
                // start loading spinner
                this.loadingSpinnerService.show();

                // fetch search data for searchval
                return this.searchService.getFulltextSearchData(this.searchval).pipe(
                    map((searchBody: SearchResponseJson) => {
                        console.log('searchServiceSubscription changed: ', searchBody);

                        // prepare search results
                        return this.prepareSearchResults(searchBody);
                    })
                )
            })
            .subscribe((searchData: SearchResponseJson) => {
                    // share search data via streamer service
                    this.updateSearchResponseData(searchData, this.searchval);

                    // stop loading spinner
                    this.loadingSpinnerService.hide();
                },
                error => {
                    this.errorMessage = <any>error;
                });
    }


    subscribeToStreamerService(): Subscription {
        return this.streamerService.getCurrentSearchResults().pipe(
            map((response: SearchResponseWithQuery) => {
                // update current search params (url, text, sideinfo) via streamer service
                this.updateSearchParams(response.data);

                return response.data;
            })
        ).subscribe((searchData: SearchResponseJson) => {
                console.log('streamerServiceSubscription got data: ', searchData);
                this.searchData = searchData;
                },
                error => {
                    this.errorMessage = <any>error;
                    console.log('SearchPanel# searchResultData subscription error: ', this.errorMessage);
                });
    }


    // route to url with query when getting submit request
    onSubmit(query: string) {
        this.router.navigate(['data/search/fulltext', {query: query}]);
    }


    prepareSearchResults(searchBody: SearchResponseJson): SearchResponseJson {
        // conversion of search results for HTML display
        const searchResultsData = this.conversionService.convertFullTextSearchResults(searchBody);

        return searchResultsData;
    }


    updateSearchParams(searchBody: SearchResponseJson): void {
        // update url for search
        this.updateCurrentUrl();

        // prepare result text for fulltext search
        this.searchResultText = this.conversionService.prepareFullTextSearchResultText(searchBody, this.filteredOut, this.searchUrl);

        // update side info
        this.updateSearchInfoData();
    }


    updateCurrentUrl() {
        // get url from search service
        this.searchUrl = this.searchService.httpGetUrl;
    }


    // update data for searchInfo via sideinfo service
    updateSearchInfoData() {
        const searchInfo: SearchInfo = new SearchInfo(this.searchval, this.searchResultText);
        this.sideInfoService.updateSearchInfoData(searchInfo);
    }


    // update search data via streamer service
    updateSearchResponseData(data: SearchResponseJson, query: string) {
        const searchResponseWithQuery: SearchResponseWithQuery = new SearchResponseWithQuery(data, query);
        this.streamerService.updateSearchResponseStream(searchResponseWithQuery);
    }


    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.streamerServiceSubscription) {
            this.streamerServiceSubscription.unsubscribe();
        }
        if (this.searchServiceSubscription) {
            this.searchServiceSubscription.unsubscribe();
        }
    }

}
