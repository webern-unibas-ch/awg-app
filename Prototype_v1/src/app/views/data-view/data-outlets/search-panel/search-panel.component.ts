import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/do';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ConversionService, DataStreamerService, SideInfoService } from '../../../../core/services';
import { DataApiService } from '../../services';

import { SearchResponseJson } from '../../../../shared/api-objects';
import { SearchResponseWithQuery } from '../../models';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit, OnDestroy {

    searchServiceSubscription: Subscription;

    searchData: SearchResponseJson;
    searchValue: string = 'Skizze';
    searchUrl: string = '';
    searchResultText: string;

    errorMessage: any;
    isLoadingData: boolean = false;


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
        this.searchServiceSubscription = this.subscribeToSearchService();
    }


    subscribeToSearchService(): Subscription {
        console.log('SEARCH PANEL ONINIT');
        return this.route.paramMap
            .switchMap((params: ParamMap) => {
                // get query param from route to update searchValue
                if (params.get('query')) {
                    this.searchValue = params.get('query');
                }
                // start loading spinner
                // this.loadingSpinnerService.show();
                this.changeLoadingStatus(true);

                // fetch search data for searchValue
                return this.searchService.getFulltextSearchData(this.searchValue).pipe(
                    map((searchResponse: SearchResponseJson) => {
                        console.log('searchServiceSubscription changed: ', searchResponse);

                        // update url for search
                        this.updateCurrentUrl();

                        // prepare search results
                        return this.prepareSearchResults(searchResponse);
                    })
                );
            })
            .subscribe((searchResponse: SearchResponseJson) => {
                    // share search data via streamer service
                    this.updateStreamerService(searchResponse, this.searchValue);

                    // stop loading spinner
                    // this.loadingSpinnerService.hide();
                    this.changeLoadingStatus(false);

                },
                error => {
                    this.errorMessage = <any>error;
                });
    }


    // change the load status
    changeLoadingStatus(status: boolean) {
        this.isLoadingData = status;
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
        this.searchUrl = this.searchService.httpGetUrl;
    }


    // update search data via streamer service
    updateStreamerService(searchResponse: SearchResponseJson, query: string) {
        const searchResponseWithQuery: SearchResponseWithQuery = new SearchResponseWithQuery(searchResponse, query);
        this.streamerService.updateSearchResponseStream(searchResponseWithQuery);
    }


    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.searchServiceSubscription) {
            this.searchServiceSubscription.unsubscribe();
        }
    }

}
