import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { SearchInfo } from '@awg-side-info/side-info-models';
import { SideInfoService } from '@awg-core/services';

@Component({
    selector: 'awg-search-info',
    templateUrl: './search-info.component.html',
    styleUrls: ['./search-info.component.css']
})
export class SearchInfoComponent implements AfterViewChecked, OnDestroy {
    sideInfoDataSubscription: Subscription;
    sideInfoTitleSubscription: Subscription;

    searchInfo: SearchInfo;
    searchInfoTitle: string;

    constructor(private sideInfoService: SideInfoService, private cdRef: ChangeDetectorRef) {}

    ngAfterViewChecked() {
        this.getSideInfoTitle();
        this.getSideInfoData();
    }

    getSideInfoTitle() {
        this.sideInfoTitleSubscription = this.sideInfoService.getSearchInfoTitle().subscribe(
            (title: string) => {
                this.searchInfoTitle = title;
            },
            error => {
                console.log('SEARCH-INFO: Got no sideInfoData from Subscription!', error as any);
            }
        );
    }

    getSideInfoData() {
        // get sideInfoData from service
        this.sideInfoDataSubscription = this.sideInfoService.getSideInfoData().subscribe(
            (searchInfo: SearchInfo) => {
                this.searchInfo = new SearchInfo(searchInfo.query, searchInfo.nhits);

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

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.sideInfoDataSubscription) {
            this.sideInfoDataSubscription.unsubscribe();
        }
        if (this.sideInfoTitleSubscription) {
            this.sideInfoTitleSubscription.unsubscribe();
        }
    }
}
