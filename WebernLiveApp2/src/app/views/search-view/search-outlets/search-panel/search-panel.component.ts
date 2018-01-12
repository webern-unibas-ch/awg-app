import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ConversionService } from '../../../../core/services';
import { SearchResultStreamerService, SearchService} from '../../services';
import { SearchResponseJson } from '../../../../shared/api-objects';
import { SideInfoService } from '../../../../side-info/side-info-services/side-info.service';
import { SearchInfo } from '../../../../side-info/side-info-models;

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit, OnDestroy {

    querySubscription: Subscription;
    searchResultSubscription: Subscription;

    searchData: SearchResponseJson = new SearchResponseJson();
    searchval: string = 'Skizzenbuch';
    searchUrl: string = '';
    errorMessage: string = undefined;
    filteredOut: number;

    isFormSubmitted = false;     // no form submitted
    isDataLoaded = false;        // no data loaded
    isDetailSelected = false;    // no object selected
    isDetailLoaded = false;      // no object loaded
    isEventButtonClicked = false;     // no button clicked
    isEventLoaded = false;       // no event loaded
    isEventCached = false;       // no event cached

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private conversionService: ConversionService,
        private searchService: SearchService,
        private sideInfoService: SideInfoService,
        private streamerService: SearchResultStreamerService
    ) {
        // get query param from route to update searchvalue
        this.route.paramMap.subscribe(params => {
            if (params.get('query')) {
                this.searchval = params.get('query');
            }
        });

        // get query from streamerService
        this.querySubscription = this.streamerService.getQuery()
            .subscribe(query => {
                    this.searchval = query;
                    const url = this.router.createUrlTree(['search/fulltext', {query: this.searchval}]).toString();
                    this.location.go(url);
                },
                error => {
                    this.errorMessage = <any>error;
                    console.log('SearchPanel# query subscription error: ', this.errorMessage);
                });

        // get searchResultData from streamerService
        this.searchResultSubscription = this.streamerService.getSearchResults()
            .subscribe(data => {
                    this.displayFulltextSearchData(data);
                },
                error => {
                    this.errorMessage = <any>error;
                    console.log('SearchPanel# searchResultData subscription error: ', this.errorMessage);
                });
    }


    ngOnInit() {
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.querySubscription.unsubscribe();
        this.searchResultSubscription.unsubscribe();
    }


    onSubmit(data: string | SearchResponseJson) {
        this.isFormSubmitted = true;      // now form is submitted
        this.isDataLoaded = false;        // no data loaded
        this.isDetailSelected = false;    // no detail selected
        this.isDetailLoaded = false;      // no detail loaded

        console.log('SearchPanel# onSubmit: got data ', data);

        // this.router.navigate(['search/fulltext', {data: data}]);
    }


    displayFulltextSearchData(data: SearchResponseJson) {
        console.info('-----> SearchPanel# displayData <-----');

        this.searchUrl = data['url'];
        console.info('SearchPanel# searchUrl: ', this.searchUrl);

        const searchResultsBody: SearchResponseJson = {...data['body']};

        // remove duplicates from response subjects
        searchResultsBody['subjects'] = this.distinctArray(searchResultsBody['subjects']);

        // conversion of search results for HTML display
        this.searchData = this.conversionService.convertFullTextSearchResults(searchResultsBody);

        this.shareSideInfoData();

        // TODO: rm
        console.info('SearchPanel# searchData: ', this.searchData);
        this.isFormSubmitted = false;
        this.isDataLoaded = true;
        console.info('SearchPanel# isDataLoaded: ', this.isDataLoaded);
    }

    shareSideInfoData() {
        // share data for sideInfo via service
        const searchInfoData: SearchInfo = {
            query: this.searchval,
            nhits: this.searchData.subjects.length
        };
        this.sideInfoService.shareSideInfoData(searchInfoData);
    }


    private distinctArray(arr) {
        /*
        * see https://gist.github.com/telekosmos/3b62a31a5c43f40849bb#gistcomment-2137855
        *
        * This function checks for every array position (reduce)
        * if the obj_id of the entry at the current position (y) is already in the array (findIndex)
        * and if not pushes y into x that is initalized as empty array []
        *
        */
        if (!arr) { return; }
        this.filteredOut = 0;
        return arr.reduce((x, y) => x.findIndex(e => e.obj_id === y.obj_id) < 0 ? [...x, y] : (this.filteredOut += 1, x), []);
    }
}
