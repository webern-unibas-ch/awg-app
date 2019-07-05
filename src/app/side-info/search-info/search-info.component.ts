import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

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
export class SearchInfoComponent implements AfterViewChecked, OnDestroy {
    /**
     * Public variable: searchInfoDataSubscription.
     *
     * It keeps the subscription for the search-info data.
     */
    searchInfoDataSubscription: Subscription;

    /**
     * Public variable: searchInfoHeaderSubscription.
     *
     * It keeps the subscription for the search-info header.
     */
    searchInfoHeaderSubscription: Subscription;

    /**
     * Public variable: searchInfoData.
     *
     * It keeps the information about the search
     * to be displayed, i.e. the query and number of hits.
     */
    searchInfoData: SearchInfo;

    /**
     * Public variable: searchInfoHeader.
     *
     * It keeps the header for the search-info.
     */
    searchInfoHeader: string;

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
     */
    ngAfterViewChecked() {
        this.subscribeSearchInfoHeader();
        this.subscribeSearchInfoData();
    }

    /**
     * Public method: subscribeSearchInfoHeader.
     *
     * It calls the SideInfoService to subscribe
     * to the search-info header.
     *
     * @returns {void} Subscribes to search-info header
     * and sets the searchInfoHeader variable.
     */
    subscribeSearchInfoHeader(): void {
        this.searchInfoHeaderSubscription = this.sideInfoService.getSearchInfoTitle().subscribe(
            (header: string) => {
                this.searchInfoHeader = header;
                console.log('header', header);
            },
            error => {
                console.log('SEARCH-INFO: Got no sideInfoData from Subscription!', error as any);
            }
        );
    }

    /**
     * Public method: subscribeSearchInfoData.
     *
     * It calls the SideInfoService to subscribe
     * to the side-info data for the search-info.
     *
     * @returns {void} Subscribes to search-info data
     * and sets the searchInfoData variable.
     */
    subscribeSearchInfoData(): void {
        // get sideInfoData from service
        this.searchInfoDataSubscription = this.sideInfoService.getSideInfoData().subscribe(
            (searchInfo: SearchInfo) => {
                this.searchInfoData = new SearchInfo(searchInfo.query, searchInfo.nhits);

                // detect changes only if component is not in destroy phase, compare: https://stackoverflow.com/a/46605947
                if (!this.cdRef['destroyed']) {
                    this.cdRef.detectChanges();
                }
            },
            error => {
                console.log('SEARCH-INFO: Got no sideInfoData from Subscription!', error as any);
            }
        );
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     *
     * Destroys subscriptions.
     */
    ngOnDestroy() {
        // prevent memory leak when component gets destroyed
        if (this.searchInfoDataSubscription) {
            this.searchInfoDataSubscription.unsubscribe();
        }
        if (this.searchInfoHeaderSubscription) {
            this.searchInfoHeaderSubscription.unsubscribe();
        }
    }
}
