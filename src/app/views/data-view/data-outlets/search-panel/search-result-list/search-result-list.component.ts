import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { faGripHorizontal, faTable } from '@fortawesome/free-solid-svg-icons';

import { SearchInfo } from '@awg-side-info/side-info-models';
import { SearchParams, SearchParamsViewTypes, SearchResponseWithQuery } from '@awg-views/data-view/models';

import { ConversionService, DataStreamerService, SideInfoService } from '@awg-core/services';

@Component({
    selector: 'awg-search-result-list',
    templateUrl: './search-result-list.component.html',
    styleUrls: ['./search-result-list.component.css'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class SearchResultListComponent implements OnInit, OnDestroy {
    @Input()
    searchUrl: string;
    @Input()
    searchParams: SearchParams;
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
    @Output()
    viewChangeRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public variable: errorMessage.
     *
     * It keeps an errorMessage for the searchResponseWithQuery subscription.
     */
    errorMessage: any = undefined;
    currentId: string;

    /**
     * Public variable: searchResultControlForm.
     *
     * It keeps the reactive form group: searchResultControlForm.
     */
    searchResultControlForm: FormGroup;

    page: number;
    pageSize: number;

    streamerServiceSubscription: Subscription;
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

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private conversionService: ConversionService,
        private sideInfoService: SideInfoService,
        private streamerService: DataStreamerService
    ) {}

    ngOnInit() {
        this.streamerServiceSubscription = this.subscribeToStreamerService();

        if (
            this.searchParams.view &&
            (this.searchParams.view === SearchParamsViewTypes.table ||
                this.searchParams.view === SearchParamsViewTypes.grid)
        ) {
            this.createFormGroup(this.searchParams.view);
        }
    }

    /**
     * Public method: createFormGroup.
     *
     * It creates the search result control form
     * using the reactive FormBuilder with a formGroup
     * and a search view control.
     *
     * @param {SearchParamsViewTypes} view The given view type.
     *
     * @returns {void} Creates the search view control form.
     */
    createFormGroup(view: SearchParamsViewTypes): void {
        this.searchResultControlForm = this.formBuilder.group({
            searchResultViewControl: SearchParamsViewTypes[view]
        });

        this.listenToUserInputChange();
    }

    /**
     * Public method: listenToUserInputChange.
     *
     * It listens to the user's input changes
     * in the view control and triggers the
     * onViewChange method with the new view type.
     *
     * @returns {void} Listens to changing view type.
     */
    listenToUserInputChange(): void {
        this.searchResultControlForm.get('searchResultViewControl').valueChanges.subscribe((view: string) => {
            this.onViewChange(view);
        });
    }

    isActiveResource(id: string): boolean {
        return this.currentId === id;
    }

    isGridView(): boolean {
        return this.searchParams.view === SearchParamsViewTypes.grid;
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
        this.currentId = id;
        this.router.navigate(['/data/resource', this.currentId]);
    }

    // emit page change to search panel
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

    // emit view change to search panel
    onViewChange(view: string): void {
        this.viewChangeRequest.emit(view);
    }

    // set values for pagination
    setPagination(): void {
        const nRowsNumber = +this.searchParams.nRows;
        const startAtNumber = +this.searchParams.startAt;

        this.pageSize = nRowsNumber;
        this.page = Math.floor(startAtNumber / nRowsNumber) + 1;
    }

    subscribeToStreamerService(): Subscription {
        // call to streamer service
        const searchResponseWithQuery$: Observable<
            SearchResponseWithQuery
        > = this.streamerService.getSearchResponseWithQuery();

        // subscribe to response to handle changes
        return searchResponseWithQuery$.subscribe(
            (searchResponseWithQuery: SearchResponseWithQuery) => {
                // update current search params (url, text, sideinfo) via streamer service
                this.updateSearchParams(searchResponseWithQuery);

                this.setPagination();
            },
            error => {
                this.errorMessage = error as any;
                console.log('SearchResultList# searchResultData subscription error: ', this.errorMessage);
            }
        );
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

        // store search response and query
        this.searchResponseWithQuery = { ...searchResponseWithQuery };

        // update info message about the search results
        this.searchResultText = this.conversionService.prepareFullTextSearchResultText(
            searchResponseWithQuery,
            this.searchUrl
        );

        // update data for searchInfo via SideInfoService
        const searchInfo: SearchInfo = new SearchInfo(this.searchResponseWithQuery.query, this.searchResultText);
        this.sideInfoService.updateSearchInfoData(searchInfo);
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.streamerServiceSubscription) {
            this.streamerServiceSubscription.unsubscribe();
        }
    }
}
