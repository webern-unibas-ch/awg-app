import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { DataApiService } from '@awg-views/data-view/services';

import { SearchResponseJson } from '@awg-shared/api-objects';
import { SearchParams, SearchParamsViewTypes, SearchResponseWithQuery } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit, OnDestroy {
    navigationSubscription: Subscription;

    searchUrl = '';
    currentQueryParams: ParamMap;

    searchParams: SearchParams = {
        query: '',
        nRows: '25',
        startAt: '0',
        view: SearchParamsViewTypes.table
    };

    errorMessage: any;

    /**
     * Public variable: isLoadingData.
     *
     * If the data is loading.
     */
    isLoadingData = false;

    /**
     * Public variable: viewChanged.
     *
     * If the view has changed.
     */
    viewChanged = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private conversionService: ConversionService,
        private dataApiService: DataApiService,
        private streamerService: DataStreamerService,
        public loadingService: LoadingService
    ) {}

    ngOnInit() {
        this.navigationSubscription = this.subscribeToDataApiService();
    }

    /**
     * Public method: changeLoadingStatus.
     *
     * It changes the loading status
     * to the given value.
     *
     * @param {boolean} status The given status value.
     * @returns {void} Sets the isLoadingData variable.
     */
    changeLoadingStatus(status: boolean): void {
        this.isLoadingData = status;
    }

    /**
     * Public method: onLoadingStart.
     *
     * It marks the start of a loading activity
     * and calls the changeLoadingStatus method to
     * set the loading status to true.
     *
     * @returns {void} Triggers the change of the loading status.
     */
    onLoadingStart(): void {
        this.changeLoadingStatus(true);
    }

    /**
     * Public method: onLoadingEnd.
     *
     * It marks the end of a loading activity
     * and calls the changeLoadingStatus method to
     * set the loading status to false.
     *
     * @returns {void} Triggers the change of the loading status.
     */
    onLoadingEnd(): void {
        this.changeLoadingStatus(false);
    }

    // new startPosition after page change request
    onPageChange(requestedStartAt: string): void {
        if (requestedStartAt !== this.searchParams.startAt) {
            // view has not changed
            this.viewChanged = false;

            this.searchParams = {
                query: this.searchParams.query,
                nRows: this.searchParams.nRows,
                startAt: requestedStartAt,
                view: this.searchParams.view
            };
            // route to new params
            this.routeToSelf(this.searchParams);
        }
    }

    // new row number after row change request
    onRowChange(requestedRows: string): void {
        if (requestedRows !== this.searchParams.nRows) {
            // view has not changed
            this.viewChanged = false;

            this.searchParams = {
                query: this.searchParams.query,
                nRows: requestedRows,
                startAt: '0',
                view: this.searchParams.view
            };

            // route to new params
            this.routeToSelf(this.searchParams);
        }
    }

    // new row number after row change request
    onViewChange(requestedView: string): void {
        if (requestedView !== this.searchParams.view) {
            // view has changed
            this.viewChanged = true;

            this.searchParams = {
                query: this.searchParams.query,
                nRows: this.searchParams.nRows,
                startAt: this.searchParams.startAt,
                view: SearchParamsViewTypes[requestedView]
            };

            // route to new params
            this.routeToSelf(this.searchParams);
        }
    }

    // new query after search request
    onSearch(requestedQuery: string): void {
        if (requestedQuery !== this.searchParams.query) {
            // view has not changed
            this.viewChanged = false;

            this.searchParams = {
                query: requestedQuery,
                nRows: this.searchParams.nRows,
                startAt: this.searchParams.startAt,
                view: this.searchParams.view
            };

            // route to new search params
            this.routeToSelf(this.searchParams);
        }
    }

    /**
     * Public method: routeToSelf.
     *
     * It navigates to itself to set
     * new search parameters.
     *
     * @param {SearchParams} sp The given search parameters.
     * @returns {void} Navigates to itself.
     */
    routeToSelf(sp: SearchParams) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { query: sp.query, nrows: sp.nRows, startAt: sp.startAt, view: sp.view },
            queryParamsHandling: 'merge'
        });
    }

    subscribeToDataApiService(): Subscription {
        return this.router.events.subscribe((e: any) => {
            // check for end of navigation
            if (e instanceof NavigationEnd) {
                // snapshot of current route query params
                const qp = this.route.snapshot.queryParamMap;

                if (qp !== this.currentQueryParams) {
                    this.currentQueryParams = qp;

                    if (qp.keys.length < 4) {
                        // update search params (immutable)
                        this.updateSearchParamsFromRoute(qp);

                        this.routeToSelf(this.searchParams);
                    } else {
                        // update search params from route if available
                        this.updateSearchParamsFromRoute(qp);

                        if (this.searchParams.query && !this.viewChanged) {
                            // start loading
                            this.onLoadingStart();

                            // fetch search data
                            return this.dataApiService
                                .getFulltextSearchData(
                                    this.searchParams.query,
                                    this.searchParams.nRows,
                                    this.searchParams.startAt
                                )
                                .subscribe(
                                    (searchResponse: SearchResponseJson) => {
                                        // update url for search
                                        this.updateCurrentUrl();

                                        // share search data via streamer service
                                        this.updateStreamerService(searchResponse, this.searchParams.query);

                                        // end loading
                                        this.onLoadingEnd();
                                    },
                                    error => {
                                        this.errorMessage = error as any;
                                    }
                                );
                        } else {
                            // console.log('No search query!');
                        }
                    }
                } else {
                    // console.log('Routed on same page with same query params');
                }
            }
        });
    }

    updateCurrentUrl() {
        // get url from search service
        this.searchUrl = this.dataApiService.httpGetUrl;
    }

    // update search params from route
    updateSearchParamsFromRoute(params: ParamMap) {
        if (!params) {
            return;
        }

        // update search params (immutable)
        this.searchParams = {
            query: params.get('query') || this.searchParams.query,
            nRows: params.get('nrows') || this.searchParams.nRows,
            startAt: params.get('startAt') || this.searchParams.startAt,
            view: SearchParamsViewTypes[params.get('view')] || this.searchParams.view
        };
    }

    // update search data via streamer service
    updateStreamerService(searchResponse: SearchResponseJson, query: string) {
        const searchResponseWithQuery: SearchResponseWithQuery = new SearchResponseWithQuery(searchResponse, query);
        this.streamerService.updateSearchResponseWithQuery(searchResponseWithQuery);
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }
}
