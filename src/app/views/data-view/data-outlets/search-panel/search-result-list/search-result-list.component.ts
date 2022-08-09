import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { faGripHorizontal, faTable } from '@fortawesome/free-solid-svg-icons';

import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';
import { ViewHandle, ViewHandleTypes } from '@awg-shared/view-handle-button-group/view-handle.model';
import { SearchInfo } from '@awg-side-info/side-info-models';
import { SearchParams, SearchResponseWithQuery } from '@awg-views/data-view/models';

/**
 * The SearchResultList component.
 *
 * It contains the search result list section
 * of the data (search) view of the app
 * with a control header, a Paginator
 * and the results in table or grid view.
 */
@Component({
    selector: 'awg-search-result-list',
    templateUrl: './search-result-list.component.html',
    styleUrls: ['./search-result-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SearchResultListComponent implements OnInit, OnDestroy {
    /**
     * Input variable: searchUrl.
     *
     * It keeps the url of the search request.
     */
    @Input()
    searchUrl: string;

    /**
     * Input variable: searchParams.
     *
     * It keeps the parameters of the search request.
     */
    @Input()
    searchParams: SearchParams;

    /**
     * Output variable: pageChangeRequest.
     *
     * It keeps an event emitter for the selected
     * start position (startAt) of the paginator
     * of the search result list.
     */
    @Output()
    pageChangeRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: rowNumberChangeRequest.
     *
     * It keeps an event emitter for the selected row number (nRows)
     * to be displayed in the search result list.
     */
    @Output()
    rowNumberChangeRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: viewChangeRequest.
     *
     * It keeps an event emitter for the selected view type of the search result list.
     */
    @Output()
    viewChangeRequest: EventEmitter<ViewHandleTypes> = new EventEmitter();

    /**
     * Public variable: errorMessage.
     *
     * It keeps an errorMessage for the searchResponseWithQuery subscription.
     */
    errorMessage: any = undefined;

    /**
     * Public variable: page.
     *
     * It keeps the current page of the Paginator.
     */
    page: number;

    /**
     * Public variable: pageSize.
     *
     * It keeps the total page size of the Paginator.
     */
    pageSize: number;

    /**
     * Public variable: rowNumbers.
     *
     * It keeps the array of possible row numbers.
     */
    rowNumbers = [5, 10, 25, 50, 100, 200];

    /**
     * Public variable: searchResponseWithQuery.
     *
     * It keeps the query and response of the search request.
     */
    searchResponseWithQuery: SearchResponseWithQuery;

    /**
     * Public variable: searchResultText.
     *
     * It keeps the info message about the search results.
     */
    searchResultText: string;

    /**
     * Public variable: faGripHorizontal.
     *
     * It instantiates fontawesome's faGripHorizontal icon.
     */
    faGripHorizontal = faGripHorizontal;

    /**
     * Public variable: faTable.
     *
     * It instantiates fontawesome's faTable icon.
     */
    faTable = faTable;

    /**
     * Public variable: selectedViewType.
     *
     * It keeps the selected view type.
     */
    selectedViewType: ViewHandleTypes = ViewHandleTypes.TABLE;

    /**
     * Public variable: viewHandles.
     *
     * It keeps the list of view handles.
     */
    viewHandles: ViewHandle[] = [
        new ViewHandle('Table view', ViewHandleTypes.TABLE, faTable),
        new ViewHandle('Grid view', ViewHandleTypes.GRID, faGripHorizontal),
    ];

    /**
     * Private variable: _selectedResourceId.
     *
     * It keeps the id of the selected resource.
     */
    private _selectedResourceId: string;

    /**
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor of the SearchResultListComponent.
     *
     * It declares private instances of the Angular Router,
     * the ConversionService, the DataStreamerService,
     * and the SideInfoService.
     *
     * @param {Router} router Instance of the Angular Router.
     * @param {ConversionService} conversionService Instance of the ConversionService.
     * @param {DataStreamerService} dataStreamerService Instance of the DataStreamerService.
     * @param {SideInfoService} sideInfoService Instance of the SideInfoService.
     */
    constructor(
        private router: Router,
        private conversionService: ConversionService,
        private dataStreamerService: DataStreamerService,
        private sideInfoService: SideInfoService
    ) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getSearchResponseWithQueryData();

        if (
            this.searchParams.viewType &&
            (this.searchParams.viewType === ViewHandleTypes.TABLE ||
                this.searchParams.viewType === ViewHandleTypes.GRID)
        ) {
            this.setViewType(this.searchParams.viewType);
        }
    }

    /**
     * Public method: setViewType.
     *
     * It sets the view type according to the query type.
     *
     * @param {ViewHandleTypes} viewType The view type.
     *
     * @returns {void} Sets the selected view type.
     */
    setViewType(viewType: ViewHandleTypes): void {
        this.selectedViewType = viewType;
    }

    /**
     * Public method: isActiveResource.
     *
     * It compares a given resource id
     * with the current _selectedResourceId.
     *
     * @param {string} id The given resource id.
     *
     * @returns {boolean} The boolean value of the comparison result.
     */
    isActiveResource(id: string): boolean {
        return this._selectedResourceId === id;
    }

    /**
     * Public method: isGridView.
     *
     * It checks if the current view type is 'grid'.
     *
     * @returns {boolean} The boolean value of the check result.
     */
    isGridView(): boolean {
        return this.searchParams.viewType === ViewHandleTypes.GRID;
    }

    /**
     * Public method: isNoResults.
     *
     * It checks if the current search response data has null results.
     *
     * @returns {boolean} The boolean value of the check result.
     */
    isNoResults(): boolean {
        return +this.searchResponseWithQuery.data.nhits === 0;
    }

    /**
     * Public method: navigateToResource.
     *
     * It navigates to the '/data/resource' route
     * with the given id.
     *
     * @param {string} id The given resource id.
     * @returns {void} Navigates to the resource.
     */
    navigateToResource(id: string): void {
        this._selectedResourceId = id;
        this.router.navigate(['/data/resource', this._selectedResourceId]);
    }

    /**
     * Public method: onPageChange.
     *
     * It emits the new start position of the Paginator
     * from a given page number to the {@link pageChangeRequest}.
     *
     * @param {number} pageNumber The given number of the page.
     *
     * @returns {void} Emits the new start position.
     */
    onPageChange(pageNumber: number): void {
        const nRowsNumber = +this.searchParams.nRows;
        const newStartPosition = pageNumber * nRowsNumber - nRowsNumber;

        this.pageChangeRequest.emit(String(newStartPosition));
    }

    /**
     * Public method: onRowNumberChange.
     *
     * It emits the new number of rows to be displayed
     * to the {@link rowNumberChangeRequest}.
     *
     * @param {number} rowNumber The given number of rows.
     *
     * @returns {void} Emits the new number of rows.
     */
    onRowNumberChange(rowNumber: number): void {
        this.rowNumberChangeRequest.emit(String(rowNumber));
    }

    /**
     * Public method: onViewChange.
     *
     * It emits the new view type
     * to the {@link viewChangeRequest}.
     *
     * @param {ViewHandleTypes} view The given view type.
     *
     * @returns {void} Emits the new view type.
     */
    onViewChange(view: ViewHandleTypes): void {
        if (!view) {
            return;
        }
        this.viewChangeRequest.emit(view);
    }

    /**
     * Public method: setPagination.
     *
     * It sets and calculates the page and pageSize
     * values needed for the Paginator.
     *
     * @returns {void} Sets the Paginator values.
     */
    setPagination(): void {
        const nRowsNumber = +this.searchParams.nRows;
        const startAtNumber = +this.searchParams.startAt;

        this.pageSize = nRowsNumber;
        this.page = Math.floor(startAtNumber / nRowsNumber) + 1;
    }

    /**
     * Public method: getSearchResponseWithQueryData.
     *
     * It gets the query and search response data
     * from the {@link DataStreamerService}.
     *
     * @returns {void} Sets the search response with query data.
     */
    getSearchResponseWithQueryData(): void {
        // Cold request to streamer service
        const searchResponseWithQuery$: Observable<SearchResponseWithQuery> = this.dataStreamerService
            .getSearchResponseWithQuery()
            .pipe(takeUntil(this._destroyed$));
        // Subscribe to response to handle changes
        searchResponseWithQuery$.subscribe({
            next: (searchResponseWithQuery: SearchResponseWithQuery) => {
                // Update current search params (url, text, sideinfo) via streamer service
                this.updateSearchParams(searchResponseWithQuery);

                this.setPagination();
            },
            error: err => {
                this.errorMessage = err;
                console.error('SearchResultList# searchResultData subscription error: ', this.errorMessage);
            },
        });
    }

    /**
     * Public method: trackById.
     *
     * It returns a unique identifier of a given item.
     * Angular uses the value returned from
     * tracking function to track items identity.
     *
     * @param {string} item The given item.
     * @returns {string} The identifier of the item.
     */
    trackById(item): string {
        return item.obj_id;
    }

    /**
     * Public method: updateSearchParams.
     *
     * It stores the given query and response of the search request
     * and updates the info message and search info.
     *
     * @param {SearchResponseWithQuery} searchResponseWithQuery
     * The given query and response of the search request.
     *
     * @returns {void} Updates the search params.
     */
    updateSearchParams(searchResponseWithQuery: SearchResponseWithQuery): void {
        if (!searchResponseWithQuery) {
            return;
        }

        // Store search response and query
        this.searchResponseWithQuery = { ...searchResponseWithQuery };

        /* TODO Prepare data for generic table
           const test: SearchResult = {
            head: { vars: ['typ', 'ressource'] },
            body: {
                bindings: [
                    {
                        typ: {
                            type: 'search',
                            icon: '',
                            value: 'test1-typ-value',
                            label: 'test1-typ-label',
                        },
                        ressource: {
                            type: 'search',
                            icon: '',
                            value: 'test1-res-value',
                            label: 'test1-res-label',
                        },
                    },
                ],
            },
        };
        this.searchResponseWithQuery.data?.subjects.map(subject => {
            const r = {
                typ: {
                    type: 'search',
                    icon: subject.iconsrc,
                    value: subject.obj_id,
                    label: subject.iconlabel,
                },
                ressource: {
                    type: 'search',
                    icon: '',
                    value: subject.obj_id,
                    label: subject.value[0],
                },
            };
            this.test.body.bindings.push(r);
        });*/

        // Update info message about the search results
        this.searchResultText = this.conversionService.prepareFullTextSearchResultText(
            searchResponseWithQuery,
            this.searchUrl
        );

        // Update data for searchInfo via SideInfoService
        const searchInfo: SearchInfo = new SearchInfo(this.searchResponseWithQuery.query, this.searchResultText);
        this.sideInfoService.updateSearchInfoData(searchInfo);
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     */
    ngOnDestroy() {
        // Clear search info
        this.sideInfoService.clearSearchInfoData();

        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Now let's also complete the subject itself
        this._destroyed$.complete();
    }
}
