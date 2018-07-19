import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/do';

import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

import {ConversionService, DataStreamerService, SideInfoService} from '../../../../core/services';
import {DataApiService} from '../../services';

import {SearchResponseJson} from '../../../../shared/api-objects';
import {SearchResponseWithQuery} from '../../models';
import {SearchInfo} from '../../../../side-info/side-info-models';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit, OnDestroy {

    searchServiceSubscription: Subscription;

    searchData: SearchResponseJson;
    searchval: string = 'Skizze';
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
                // get query param from route to update searchvalue
                if (params.get('query')) {
                    this.searchval = params.get('query');
                }
                // start loading spinner
                // this.loadingSpinnerService.show();
                this.onLoadChange(true);

                // fetch search data for searchval
                return this.searchService.getFulltextSearchData(this.searchval).pipe(
                    map((searchBody: SearchResponseJson) => {
                        console.log('searchServiceSubscription changed: ', searchBody);

                        // update url for search
                        this.updateCurrentUrl();

                        // prepare search results
                        return this.prepareSearchResults(searchBody);
                    })
                );
            })
            .subscribe((searchData: SearchResponseJson) => {
                    // share search data via streamer service
                    this.updateStreamerService(searchData, this.searchval);

                    // stop loading spinner
                    // this.loadingSpinnerService.hide();
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
        this.router.navigate(['data/search/fulltext', {query: query}]);
    }


    prepareSearchResults(searchBody: SearchResponseJson): SearchResponseJson {
        // conversion of search results for HTML display
        return this.conversionService.convertFullTextSearchResults(searchBody);
    }


    updateCurrentUrl() {
        // get url from search service
        this.searchUrl = this.searchService.httpGetUrl;
    }


    // update search data via streamer service
    updateStreamerService(data: SearchResponseJson, query: string) {
        const searchResponseWithQuery: SearchResponseWithQuery = new SearchResponseWithQuery(data, query);
        this.streamerService.updateSearchResponseStream(searchResponseWithQuery);
    }


    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.searchServiceSubscription) {
            this.searchServiceSubscription.unsubscribe();
        }
    }

}
