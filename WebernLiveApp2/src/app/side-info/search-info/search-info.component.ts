import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SideInfoService } from '../services/side-info.service';

@Component({
    selector: 'awg-search-info',
    templateUrl: './search-info.component.html',
    styleUrls: ['./search-info.component.css']
})
export class SearchInfoComponent implements OnInit, OnDestroy {

    public subscription: Subscription;

    public label: string;
    public nhits = '29';
    public query = 'Kantate';

    constructor(private sideInfoService: SideInfoService) {
        // get sideInfoData from service
        this.subscription = this.sideInfoService.sideInfoData$
            .subscribe(
                data => {
                    this.label = data.label;
                },
                error => {
                    console.log('SEARCH-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    }

}
