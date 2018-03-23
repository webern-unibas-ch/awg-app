import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SideInfoService } from '../../core/services';
import { SearchInfo } from '../side-info-models';

@Component({
    selector: 'awg-search-info',
    templateUrl: './search-info.component.html',
    styleUrls: ['./search-info.component.css']
})
export class SearchInfoComponent implements OnInit, OnDestroy {

    sideInfoDataSubscription: Subscription;
    sideInfoTitleSubscription: Subscription;

    searchInfo: SearchInfo = new SearchInfo('---', '---');
    searchInfoTitle: string;

    constructor(
        private sideInfoService: SideInfoService
    ) { }

    ngOnInit() {
        this.getSideInfoTitle();
        this.getSideInfoData();
    }

    getSideInfoTitle() {
        this.sideInfoTitleSubscription = this.sideInfoService.getSearchInfoTitle()
            .subscribe(
                (title: string) => {
                    this.searchInfoTitle = title;
                },
                error => {
                    console.log('SEARCH-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );

    }

    getSideInfoData() {
        // get sideInfoData from service
        this.sideInfoDataSubscription = this.sideInfoService.getSideInfoData()
            .subscribe(
                (searchInfo: SearchInfo) => {
                    this.searchInfo = searchInfo;
                },
                error => {
                    console.log('SEARCH-INFO: Got no sideInfoData from Subscription!', <any>error);
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
