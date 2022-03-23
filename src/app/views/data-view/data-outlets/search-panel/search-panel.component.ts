import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Params, Router } from '@angular/router';

import { EMPTY, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { SearchResponseJson } from '@awg-shared/api-objects';

import { DataApiService } from '@awg-views/data-view/services';
import {
    SearchParams,
    SearchResultsViewTypes,
    SearchResponseWithQuery,
    SearchQuery,
    ExtendedSearchParams,
} from '@awg-views/data-view/models';

/**
 * The SearchPanel component.
 *
 * It contains the search panel section
 * of the data (search) view of the app
 * with a {@link TwelveToneSpinnerComponent},
 * the {@link FulltextSearchFormComponent}
 * and the {@link SearchResultListComponent}.
 */
@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.scss'],
})
export class SearchPanelComponent implements OnInit, OnDestroy {
    /**
     * Public variable: currentQueryParams.
     *
     * It keeps the current ParamMap from the query url.
     */
    currentQueryParams: ParamMap;

    /**
     * Public variable: errorMessage.
     *
     * It keeps an errorMessage for the search response subscription.
     */
    errorMessage: any = undefined;

    /**
     * Public variable: selectedSearchTabId.
     *
     * It keeps the id of the selected tab panel.
     */
    selectedSearchTabId: string;

    /**
     * Public variable: searchParams.
     *
     * It keeps the default parameters for the search.
     */
    searchParams: SearchParams;

    /**
     * Public variable: searchResponseWithQuery.
     *
     * It keeps the query and response of the search request.
     */
    searchResponseWithQuery: SearchResponseWithQuery;

    /**
     * Public variable: searchTabs.
     *
     * It keeps the default objects for the search tab panels.
     */
    searchTabs = {
        fulltext: { id: 'fulltext', title: 'Volltext-Suche' },
        extended: { id: 'extended', title: 'Erweiterte Suche' },
    };

    /**
     * Public variable: viewChanged.
     *
     * If the view has changed.
     */
    viewChanged = false;

    /**
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

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
     * Gets the httpGetUrl from the {@link DataApiService}.
     *
     * @returns {string}
     */
    get httpGetUrl(): string {
        return this.dataApiService.httpGetUrl;
    }

    /**
     * Gets the loading status observable from the {@link LoadingService}.
     *
     * @returns {Observable<boolean>}
     */
    get isLoading$(): Observable<boolean> {
        return this.loadingService.getLoadingStatus();
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.resetSearchParams();
        this.getSearchData();
    }

    /**
     * Public method: getSearchData.
     *
     * It gets the query parameters from the route's query params
     * and fetches the corresponding search data
     * from the {@link DataApiService}.
     *
     * @returns {void} Sets the search data.
     *
     */
    getSearchData(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this.route),
                map((route: ActivatedRoute) => {
                    // Snapshot of tab route
                    let r = route;
                    while (r.firstChild) {
                        r = r.firstChild;
                    }
                    // Set search tab from url if given, otherwise router will redirect to fulltext automatically
                    if (this._isValidTabIdInRoute(r)) {
                        this.selectedSearchTabId = r.snapshot.url[0].path;
                    }

                    return route;
                }),
                switchMap((route: ActivatedRoute) => {
                    // Snapshot of current route query params
                    const qp = route.snapshot.queryParamMap;

                    if (qp !== this.currentQueryParams) {
                        this.currentQueryParams = qp;

                        if (qp.keys.length < 4) {
                            // Update search params
                            this.updateSearchParamsFromRoute(qp, true);
                        } else {
                            // Update search params from route if available
                            this.updateSearchParamsFromRoute(qp, false);

                            if (!this.viewChanged) {
                                if (this.searchParams.query && typeof this.searchParams.query === 'string') {
                                    // Fetch search data
                                    return this.dataApiService.getSearchData(this.searchParams);
                                }
                                if (
                                    typeof this.searchParams.query === 'object' &&
                                    this.searchParams.query.filterByRestype
                                ) {
                                    // Fetch search data
                                    return this.dataApiService.getSearchData(this.searchParams);
                                }
                            }
                        }
                    }
                    // In any other cases return empty observable
                    return EMPTY;
                }),
                takeUntil(this._destroyed$)
            )
            .subscribe({
                next: (searchResponse: SearchResponseJson) => {
                    // Share search data via streamer service
                    this.searchResponseWithQuery = new SearchResponseWithQuery(searchResponse, this.searchParams.query);
                    this.dataStreamerService.updateSearchResponseWithQuery(this.searchResponseWithQuery);
                },
                error: err => {
                    console.error(err);
                    this.errorMessage = err as any;
                },
            });
    }

    /**
     * Public method: onPageChange.
     *
     * It sets a new start position value in the searchParams
     * after a page change request and triggers the
     * {@link _routeToSelf} method.
     *
     * @param {string} requestedStartAt The given start position.
     *
     * @returns {void} Sets the search params and routes to itself.
     */
    onPageChange(requestedStartAt: string): void {
        if (requestedStartAt !== this.searchParams.startAt) {
            // View has not changed
            this.viewChanged = false;

            this.searchParams = {
                query: this.searchParams.query,
                nRows: this.searchParams.nRows,
                startAt: requestedStartAt,
                view: this.searchParams.view,
            };
            // Route to new params
            this._routeToSelf(this.searchParams);
        }
    }

    /**
     * Public method: onRowNumberChange.
     *
     * It sets new row number value in the searchParams
     * after a row change request and triggers the
     * {@link _routeToSelf} method.
     *
     * @param {string} requestedRows The given row.
     *
     * @returns {void} Sets the search params and routes to itself.
     */
    onRowNumberChange(requestedRows: string): void {
        if (requestedRows !== this.searchParams.nRows) {
            // View has not changed
            this.viewChanged = false;

            this.searchParams = {
                query: this.searchParams.query,
                nRows: requestedRows,
                startAt: '0',
                view: this.searchParams.view,
            };

            // Route to new params
            this._routeToSelf(this.searchParams);
        }
    }

    /**
     * Public method: onSearch.
     *
     * It sets new query value in the searchParams
     * after a search request and triggers the
     * {@link _routeToSelf} method.
     *
     * @param {SearchQuery} requestedQuery The given search query (string or ExtendedSearchParams).
     *
     * @returns {void} Sets the search params and routes to itself.
     */
    onSearch(requestedQuery: SearchQuery): void {
        if (requestedQuery !== this.searchParams.query) {
            // View has not changed
            this.viewChanged = false;

            this.searchParams = {
                query: requestedQuery,
                nRows: this.searchParams.nRows,
                startAt: this.searchParams.startAt,
                view: this.searchParams.view,
            };

            // Route to new search params
            this._routeToSelf(this.searchParams);
        }
    }

    /**
     * Public method: onSearchTabChange.
     *
     * It resets the search params and triggers the
     * {@link _routeToSelf} method after a tab change request
     * to update the URL.
     *
     * @param {NgbNavChangeEvent} tabEvent The given tabEvent with an id of the next route.
     *
     * @returns {void} Routes to itself with the given id as route.
     */
    onSearchTabChange(tabEvent: NgbNavChangeEvent): void {
        const newTabId = tabEvent.nextId;
        this.resetSearchParams(newTabId);
        this.resetSearchResponse();

        this.errorMessage = undefined;
        // Route to new tab with resetted searchParams
        this._routeToSelf(this.searchParams, newTabId);
    }

    /**
     * Public method: onViewChange.
     *
     * It sets new view type value in the searchParams
     * after a view change request and triggers the
     * {@link _routeToSelf} method.
     *
     * @param {string} requestedView The given view.
     *
     * @returns {void} Sets the search params and routes to itself.
     */
    onViewChange(requestedView: string): void {
        if (requestedView !== this.searchParams.view) {
            // View has changed
            this.viewChanged = true;

            this.searchParams = {
                query: this.searchParams.query,
                nRows: this.searchParams.nRows,
                startAt: this.searchParams.startAt,
                view: SearchResultsViewTypes[requestedView],
            };

            // Route to new params
            this._routeToSelf(this.searchParams);
        }
    }

    /**
     * Public method: resetSearchParams.
     *
     * It resets the search params to the default value
     * according to the target tab.
     * @param {string} [tabId] The given tab id.
     *
     * @returns {void} Resets the search params.
     */
    resetSearchParams(tabId?: string): void {
        let query: SearchQuery;
        if (!tabId || tabId === this.searchTabs.fulltext.id) {
            query = '';
        } else if (tabId === this.searchTabs.extended.id) {
            query = new ExtendedSearchParams();
            query.filterByRestype = '';
            query.propertyId = [];
            query.compop = [];
            query.searchval = [];
        }
        this.searchParams = {
            query: query,
            nRows: '25',
            startAt: '0',
            view: SearchResultsViewTypes.table,
        };
    }

    /**
     * Public method: resetSearchResponse.
     *
     * It resets the search response to an empty searchResponseWithQuery object.
     *
     * @returns {void} Resets the search response.
     */
    resetSearchResponse(): void {
        this.searchResponseWithQuery = new SearchResponseWithQuery(new SearchResponseJson(), '');

        this.dataStreamerService.updateSearchResponseWithQuery(this.searchResponseWithQuery);
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
    updateSearchParamsFromRoute(params: ParamMap, routing: boolean): void {
        if (!params) {
            return;
        }

        let query: SearchQuery;
        if (
            !this.selectedSearchTabId ||
            this.selectedSearchTabId === this.searchTabs.fulltext.id ||
            typeof this.searchParams.query === 'string'
        ) {
            query = params.get('query') || this.searchParams.query;
        } else if (
            this.selectedSearchTabId === this.searchTabs.extended.id ||
            typeof this.searchParams.query === 'object'
        ) {
            query = new ExtendedSearchParams();
            query.filterByRestype = params.get('filterByRestype') || this.searchParams.query.filterByRestype;
            query.propertyId = params.getAll('propertyId') || this.searchParams.query.propertyId;
            query.compop = params.getAll('compop') || this.searchParams.query.compop;
            query.searchval = params.getAll('searchval') || this.searchParams.query.searchval;
        }

        // Update search params (immutable)
        this.searchParams = {
            query: query,
            nRows: params.get('nrows') || this.searchParams.nRows,
            startAt: params.get('startAt') || this.searchParams.startAt,
            view: SearchResultsViewTypes[params.get('view')] || this.searchParams.view,
        };

        if (routing) {
            this._routeToSelf(this.searchParams);
        }
    }

    /**
     * Public method: getSearchQueryType.
     *
     * It checks the type of a SearchQuery value (UNION type)
     * and returns the value typed as string or ExtendedSearchParams.
     *
     * @param {SearchQuery} value The given value.
     *
     * @returns {any} The value as string or ExtendedSearchParams type.
     */
    getSearchQueryType(value: SearchQuery): any {
        if (typeof value === 'string') {
            return value as string;
        } else if (typeof value === 'object') {
            return value as ExtendedSearchParams;
        }
    }

    /**
     * Public method: isSearchResultListShown.
     *
     * It checks if the search result list shall be shown (not used yet).
     *
     * @returns {boolean} The boolean result of the check.
     */
    isSearchResultListShown(): boolean {
        this.dataStreamerService
            .getSearchResponseWithQuery()
            .pipe(takeUntil(this._destroyed$))
            .subscribe({ next: result => console.log(result) });

        return true;
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself
        this._destroyed$.complete();
    }

    /**
     * Private method: _routeToSelf.
     *
     * It navigates to itself to set
     * new search parameters.
     *
     * @param {SearchParams} sp The given search parameters.
     * @param {string} [route] Optional route parameter.
     * @returns {void} Navigates to itself.
     */
    private _routeToSelf(sp: SearchParams, route?: string): void {
        const commands = route ? [route] : [];
        const params = this._createRouterQueryParams(sp);
        this.router.navigate(commands, {
            relativeTo: this.route,
            queryParams: params,
        });
    }

    /**
     * Private method: _createRouterQueryParams.
     *
     * It creates Router params from a given SearchParams object.
     *
     * @params {SearchParams} sp The given search params.
     *
     * @returns {Params} The router Params object.
     */
    private _createRouterQueryParams(sp: SearchParams): Params {
        const qp: Params = {};
        const q = this.getSearchQueryType(sp.query);
        if (typeof q === 'string') {
            qp['query'] = sp.query;
        } else if (typeof q === 'object') {
            qp['filterByRestype'] = q.filterByRestype || '';

            if (q.propertyId) {
                qp['propertyId'] = q.propertyId || [];
                qp['compop'] = q.compop || [];
                qp['searchval'] = q.searchval || [];
            }
        }
        qp['nrows'] = sp.nRows;
        qp['startAt'] = sp.startAt;
        qp['view'] = sp.view;

        return qp;
    }

    /**
     * Private method: _isValidTabIdInRoute.
     *
     * It checks if a given route path provides a valid tab id that is included in the searchTabs.
     *
     * @param {ActivatedRoute} r The given activated route
     *
     * @returns {boolean} The boolean result of the check.
     */
    private _isValidTabIdInRoute(r: ActivatedRoute): boolean {
        return (
            r.snapshot.url &&
            r.snapshot.url.length > 0 &&
            Object.values(this.searchTabs).filter(tab => tab.id === r.snapshot.url[0].path).length > 0
        );
    }
}
