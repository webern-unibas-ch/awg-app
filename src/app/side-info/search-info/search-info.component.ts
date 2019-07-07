import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';

import { Observable } from 'rxjs';

import { SideInfoService } from '@awg-core/services';
import { SearchInfo } from '@awg-side-info/side-info-models';

/**
 * The SearchInfo component.
 *
 * It contains the side-info section of the data (search) view
 * showing information about search results.
 */
@Component({
    selector: 'awg-search-info',
    templateUrl: './search-info.component.html',
    styleUrls: ['./search-info.component.css']
})
export class SearchInfoComponent implements AfterViewChecked {
    /**
     * Public variable: searchInfoData$.
     *
     * Observable that keeps the information about the search
     * to be displayed, i.e. the query and number of hits.
     */
    searchInfoData$: Observable<SearchInfo>;

    /**
     * Public variable: searchInfoHeader$.
     *
     * Observable that keeps the header for the search-info.
     */
    searchInfoHeader$: Observable<string>;

    /**
     * Constructor of the SearchInfoComponent.
     *
     * It declares a private SideInfoService instance
     * to get the search results and a private ChangeDetectorRef instance.
     *
     * @param {SideInfoService} sideInfoService Instance of the SideInfoService.
     * @param {ChangeDetectorRef} cdRef Instance of the ChangeDetectorRef.
     */
    constructor(private sideInfoService: SideInfoService, private cdRef: ChangeDetectorRef) {}

    /**
     * Angular life cycle hook: ngAfterViewChecked.
     *
     * It calls the containing methods
     * when the component view was checked.
     *
     * Necessary (instead of OnInit) to update component correctly
     * and to avoid ExpressionChangedAfterItHasBeenCheckedError.
     */
    ngAfterViewChecked() {
        this.getSearchInfoData();
    }

    /**
     * Public method: getSearchInfoData.
     *
     * It calls the SideInfoService to provide
     * the data for the search-info header and data.
     *
     * @returns {void} Sets the searchInfoHeader
     * and searchInfoData observables.
     */
    getSearchInfoData(): void {
        this.searchInfoHeader$ = this.sideInfoService.getSearchInfoTitle();
        this.searchInfoData$ = this.sideInfoService.getSearchInfoData();
    }
}
