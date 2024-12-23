import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

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
    styleUrls: ['./search-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SearchInfoComponent implements OnInit {
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
     * Private readonly injection variable: _sideInfoService.
     *
     * It keeps the instance of the injected SideInfoService.
     */
    private readonly _sideInfoService = inject(SideInfoService);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit(): void {
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
        this.searchInfoHeader$ = this._sideInfoService.getSearchInfoTitle();
        this.searchInfoData$ = this._sideInfoService.getSearchInfoData();
    }
}
