import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/do';

import { ConversionService } from '../../../../core/services';
import { DataStreamerService, DataApiService} from '../../services';
import { SideInfoService } from '../../../../side-info/side-info-services/side-info.service';

import { SearchResponseJson } from '../../../../shared/api-objects';
import { SearchResponseWithQuery } from '../../models';
import { SearchInfo } from '../../../../side-info/side-info-models';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit, OnDestroy {

    searchResponseSubscription: Subscription;

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
        private streamerService: DataStreamerService
    ) {
        // get query param from route to update searchvalue
        this.route.paramMap.subscribe((params: ParamMap) => {

            if (params.get('query')) {
                // perform search with query param
                this.doSearch(params.get('query'));
            }

            if (params.get('id')) {
                console.warn('SearchPanel# got id from route: ', params.get('id'));
            }
        });


        // get query & searchResultData from streamerService
        this.searchResponseSubscription = this.streamerService.getCurrentSearchResults()
            .subscribe((response: SearchResponseWithQuery) => {
                    // display search data
                    this.displayFulltextSearchData(response);
                },
                error => {
                    this.errorMessage = <any>error;
                    console.log('SearchPanel# searchResultData subscription error: ', this.errorMessage);
                });
    }


    ngOnInit() {
    }


    // display the search data
    displayFulltextSearchData(response: SearchResponseWithQuery) {
        // snapshot of values
        this.searchData = {...response.data};
        this.searchval = response.query;
        this.searchUrl = this.searchService.httpGetUrl;

        // prepare result text for fulltext search
        this.searchResultText = this.conversionService.prepareFullTextSearchResultText(this.searchData, this.filteredOut, this.searchUrl);

        // update side info
        this.updateSearchInfoData();
    }


    // search via service
    doSearch(query: string) {
        this.onLoadChange(true);

        this.searchService.getFulltextSearchData(query)
            .subscribe((data: SearchResponseJson) => {
                    // snapshot of data
                    let searchResultsData: SearchResponseJson = {...data};

                    // conversion of search results for HTML display
                    searchResultsData = this.conversionService.convertFullTextSearchResults(searchResultsData);

                    // share search data via streamer service
                    this.updateSearchResponseData(searchResultsData, query);

                    this.onLoadChange(false);
                },
                error => {
                    this.errorMessage = <any>error;
                });

    }


    // change the load status
    onLoadChange(status: boolean) {
        this.isLoadingData = status;
    }


    // route to url with query when getting submit request
    onSubmit(query: string) {
        this.router.navigate(['search/fulltext', {query: query}]);
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
        if (this.searchResponseSubscription) {
            this.searchResponseSubscription.unsubscribe();
        }
    }

}
