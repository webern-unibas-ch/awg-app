import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';

import { EMPTY, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { SearchResponseJson } from '@awg-shared/api-objects';

import { DataApiService } from '@awg-views/data-view/services';
import { SearchParams, SearchResultsViewTypes, SearchResponseWithQuery } from '@awg-views/data-view/models';

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
    styleUrls: ['./search-panel.component.css'],
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
        view: SearchResultsViewTypes.table,
    };

    /**
     * Public variable: searchTabTitles.
     *
     * It keeps the titles for the tab panels.
     */
    searchTabTitles = {
        fulltext: 'Volltext-Suche',
        extended: 'Erweiterte Suche',
    };

    /**
     * Public variable: selectedTabId.
     *
     * It keeps the id of the selected tab panel.
     */
    selectedTabId: string;

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
     */
    getFulltextSearchData(): void {
        this.router.events
            .pipe(
                takeUntil(this.destroy$),
                filter(event => event instanceof NavigationEnd),
                map(() => this.route),
                map((route: ActivatedRoute) => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    this.activateTab(route.snapshot.url[0].path);
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

                            if (this.searchParams.query && !this.viewChanged) {
                                // Fetch search data
                                return this.dataApiService.getFulltextSearchData(this.searchParams);
                            }
                        }
                    }
                    // In any other cases return empty observable
                    return EMPTY;
                })
            )
            .subscribe(
                (searchResponse: SearchResponseJson) => {
                    // Share search data via streamer service
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
    }

    /**
     * Public method: activateTab.
     *
     * It activates a tab by its id.
     *
     * @param {string} id The given tab id.
     *
     * @returns {void} Activates the tab.
     */
    activateTab(id: string) {
        this.selectedTabId = id;
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
     * @param {string} requestedQuery The given search query.
     *
     * @returns {void} Sets the search params and routes to itself.
     */
    onSearch(requestedQuery: string): void {
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
     * Public method: onTabChange.
     *
     * It triggers the {@link _routeToSelf} method
     * after a tab change request to update the URL.
     *
     * @param {NgbNavChangeEvent} tabEvent The given tabEvent with an id of the next route.
     *
     * @returns {void} Routes to itself with the given id as route.
     */
    onTabChange(tabEvent: NgbNavChangeEvent) {
        // Route to new params
        this._routeToSelf(this.searchParams, tabEvent.nextId);
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

        // Update search params (immutable)
        this.searchParams = {
            query: params.get('query') || this.searchParams.query,
            nRows: params.get('nrows') || this.searchParams.nRows,
            startAt: params.get('startAt') || this.searchParams.startAt,
            view: SearchResultsViewTypes[params.get('view')] || this.searchParams.view,
        };

        if (routing) {
            this._routeToSelf(this.searchParams);
        }
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // Emit truthy value to end all subscriptions
        this.destroy$.next(true);

        // Unsubscribe from the destroy subject itself
        this.destroy$.unsubscribe();
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
    private _routeToSelf(sp: SearchParams, route?: string) {
        const commands = route ? [route] : [];
        this.router.navigate(commands, {
            relativeTo: this.route,
            queryParams: { query: sp.query, nrows: sp.nRows, startAt: sp.startAt, view: sp.view },
            queryParamsHandling: 'merge',
        });
    }
}
