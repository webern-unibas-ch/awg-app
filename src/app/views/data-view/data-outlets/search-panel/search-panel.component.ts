import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';

import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { DataApiService } from '@awg-views/data-view/services';

import { SearchResponseJson } from '@awg-shared/api-objects';
import { SearchParams, SearchParamsViewTypes, SearchResponseWithQuery } from '@awg-views/data-view/models';

/**
 * The SearchPanel component.
 *
 * It contains the search panel section
 * of the data (search) view of the app
 * with a {@link TwelveToneSpinnerComponent},
 * the {@link SearchFormComponent}
 * and the {@link SearchResultListComponent}.
 */
@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit, OnDestroy {
    /**
     * Public variable: destroy$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    destroy$: Subject<boolean> = new Subject<boolean>();

    /**
     * Public variable: currentQueryParams.
     *
     * It keeps the current ParamMap from the query url.
     */
    currentQueryParams: ParamMap;

    /**
     * Public variable: searchParams.
     *
     * It keeps the default parameters for the search.
     */
    searchParams: SearchParams = {
        query: '',
        nRows: '25',
        startAt: '0',
        view: SearchParamsViewTypes.table
    };

    /**
     * Getter for the httpGetUrl of the {@link DataApiService}.
     */
    get httpGetUrl(): string {
        return this.dataApiService.httpGetUrl;
    }

    /**
     * Getter for the loading status observable of the {@link LoadingService}.
     */
    get isLoading$(): Observable<boolean> {
        return this.loadingService.getLoadingStatus();
    }

    /**
     * Public variable: errorMessage.
     *
     * It keeps an errorMessage for the search response subscription.
     */
    errorMessage: any = undefined;

    /**
     * Public variable: viewChanged.
     *
     * If the view has changed.
     */
    viewChanged = false;

    /**
     * Constructor of the SearchPanelComponent.
     *
     * It declares private instances of the Angular ActivatedRoute,
     * the Angular Router, the ConversionService, the DataApiService,
     * the DataStreamerService, and the LoadingService.
     *
     * @param {ActivatedRoute} route Instance of the Angular ActivatedRoute.
     * @param {Router} router Instance of the Angular Router.
     * @param {ConversionService} conversionService Instance of the ConversionService.
     * @param {DataApiService} dataApiService Instance of the DataApiService.
     * @param {DataStreamerService} dataStreamerService Instance of the DataStreamerService.
     * @param {LoadingService} loadingService Instance of the LoadingService.
     */
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private conversionService: ConversionService,
        private dataApiService: DataApiService,
        private dataStreamerService: DataStreamerService,
        private loadingService: LoadingService
    ) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getFulltextSearchData();
    }

    /**
     * Public method: getFulltextSearchData.
     *
     * It gets the query parameters from the route's query params
     * and fetches the corresponding fulltext search data
     * from the {@link DataApiService}.
     *
     * @returns {void} Sets the search data.
     *
     * @todo Refactor nested subscription.
     */
    getFulltextSearchData(): void {
        this.router.events.pipe(takeUntil(this.destroy$)).subscribe(
            (e: any) => {
                // check for end of navigation
                if (e instanceof NavigationEnd) {
                    // snapshot of current route query params
                    const qp = this.route.snapshot.queryParamMap;

                    if (qp !== this.currentQueryParams) {
                        this.currentQueryParams = qp;

                        if (qp.keys.length < 4) {
                            // update search params
                            this.updateSearchParamsFromRoute(qp, true);
                        } else {
                            // update search params from route if available
                            this.updateSearchParamsFromRoute(qp, false);

                            if (this.searchParams.query && !this.viewChanged) {
                                // fetch search data
                                return this.dataApiService.getFulltextSearchData(this.searchParams).subscribe(
                                    (searchResponse: SearchResponseJson) => {
                                        // share search data via streamer service
                                        const searchResponseWithQuery: SearchResponseWithQuery = new SearchResponseWithQuery(
                                            searchResponse,
                                            this.searchParams.query
                                        );
                                        this.dataStreamerService.updateSearchResponseWithQuery(searchResponseWithQuery);
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
            },
            error => {
                this.errorMessage = error as any;
            }
        );
    }

    /**
     * Public method: onPageChange.
     *
     * It sets a new start position value in the searchParams
     * after a page change request and triggers the
     * {@link routeToSelf} method.
     *
     * @param {string} requestedStartAt The given start position.
     *
     * @returns {void} Sets the search params and routes to itself.
     */
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

    /**
     * Public method: onRowChange.
     *
     * It sets new row number value in the searchParams
     * after a row change request and triggers the
     * {@link routeToSelf} method.
     *
     * @param {string} requestedRows The given row.
     *
     * @returns {void} Sets the search params and routes to itself.
     */
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

    /**
     * Public method: onViewChange.
     *
     * It sets new view type value in the searchParams
     * after a view change request and triggers the
     * {@link routeToSelf} method.
     *
     * @param {string} requestedView The given view.
     *
     * @returns {void} Sets the search params and routes to itself.
     */
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

    /**
     * Public method: onSearch.
     *
     * It sets new query value in the searchParams
     * after a search request and triggers the
     * {@link routeToSelf} method.
     *
     * @param {string} requestedQuery The given search query.
     *
     * @returns {void} Sets the search params and routes to itself.
     */
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

    /**
     * Public method: updateSearchParamsFromRoute.
     *
     * It updates the searchParams from the query params
     * of the current route and routes to the component
     * itself again if 'routing' is truthy.
     *
     * @param {ParamMap} params The given url query params.
     * @param {boolean} routing If the search parameters should be set
     * by routing to the component itself again.
     *
     * @returns {void} Sets the search params and routes to itself if routing is truthy.
     */
    updateSearchParamsFromRoute(params: ParamMap, routing: boolean) {
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

        if (routing) {
            this.routeToSelf(this.searchParams);
        }
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // emit truthy value to end all subscriptions
        this.destroy$.next(true);

        // Now let's also unsubscribe from the subject itself:
        this.destroy$.unsubscribe();
    }
}
