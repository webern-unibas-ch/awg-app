import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/do';

import { ConversionService } from '../../../../core/services';
import { SearchResultStreamerService, SearchService} from '../../services';
import { SearchResponseJson } from '../../../../shared/api-objects';
import { SideInfoService } from '../../../../side-info/side-info-services/side-info.service';
import { SearchInfo } from '../../../../side-info/side-info-models';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit, OnDestroy {

    searchResponseSubscription: Subscription;

    searchData: SearchResponseJson = new SearchResponseJson();
    searchval: string = 'Skizzenbuch';
    searchUrl: string = '';
    searchResultText: string;
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
        this.route.paramMap.subscribe((params: ParamMap) => {
            if (params.get('query')) {
                this.searchval = params.get('query');
            }
        });

        // get query & searchResultData from streamerService
        this.searchResponseSubscription = this.streamerService.getSearchResponse()
            .do( () => {
                this.isDataLoaded = false;
            })
            .subscribe(res => {
                    this.searchUrl = this.searchService.httpGetUrl;
                    this.searchval = res.query;
                    this.displayRouteWithQuery(res.query);
                    this.displayFulltextSearchData(res.data);
                },
                error => {
                    this.errorMessage = <any>error;
                    console.log('SearchPanel# searchResultData subscription error: ', this.errorMessage);
                });
    }


    ngOnInit() {
    }


    onSubmit(data: string | SearchResponseJson) {
        this.isFormSubmitted = true;      // now form is submitted
        this.isDataLoaded = false;        // no data loaded
        this.isDetailSelected = false;    // no detail selected
        this.isDetailLoaded = false;      // no detail loaded

        console.log('SearchPanel# onSubmit: got data ', data);

        // this.router.navigate(['search/fulltext', {data: data}]);
    }


    displayRouteWithQuery(query: string) {
        const url = this.router.createUrlTree(['search/fulltext', {query: query}]).toString();
        this.location.go(url);
    }


    displayFulltextSearchData(data: SearchResponseJson) {

        this.searchData = {...data};

        this.searchResultText = this.conversionService.prepareFullTextSearchResultText(this.searchData, this.filteredOut, this.searchUrl);

        this.updateSideInfoData();

        // TODO: rm
        console.info('SearchPanel# searchData: ', this.searchData);

        this.isFormSubmitted = false;
        this.isDataLoaded = true;
    }


    updateSideInfoData() {
        // share data for searchInfo via service
        const searchInfo: SearchInfo = new SearchInfo(this.searchval, this.searchResultText);
        this.sideInfoService.updateSearchInfoData(searchInfo);
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.searchResponseSubscription) {
            this.searchResponseSubscription.unsubscribe();
        }
    }

}
