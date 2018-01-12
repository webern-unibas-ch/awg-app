import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SideInfoService } from '../side-info-services/side-info.service';
import { SearchInfo } from '../side-info-models';

@Component({
    selector: 'awg-search-info',
    templateUrl: './search-info.component.html',
    styleUrls: ['./search-info.component.css']
})
export class SearchInfoComponent implements OnInit, OnDestroy {

    sideInfoDataSubscription: Subscription;

    searchInfo: SearchInfo = new SearchInfo();

    constructor(
        private sideInfoService: SideInfoService
    ) { }

    ngOnInit() {
        this.getSideInfoData();
    }

    getSideInfoData() {
        // get sideInfoData from service
        this.sideInfoDataSubscription = this.sideInfoService.getSideInfoData()
            .subscribe(
                (data: SearchInfo) => {
                    this.searchInfo.title = data.title;
                    this.searchInfo.nhits = data.nhits;
                    this.searchInfo.query = data.query;
                    },
                error => {
                    console.log('SEARCH-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.sideInfoDataSubscription.unsubscribe();
    }

}
