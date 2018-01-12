import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { SideInfoService } from '../side-info-services/side-info.service';

@Component({
    selector: 'awg-resource-info',
    templateUrl: './resource-info.component.html',
    styleUrls: ['./resource-info.component.css']
})
export class ResourceInfoComponent implements OnInit, OnDestroy {

    sideInfoDataSubscription: Subscription;

    label: string = 'Suchergebnisse';
    nhits: number;
    query: string;

    constructor(
        private router: Router,
        private sideInfoService: SideInfoService
    ) { }

    ngOnInit() {
        this.getSideInfoData();
    }

    private getSideInfoData() {

        // get sideInfoData from service
        this.sideInfoDataSubscription = this.sideInfoService.getSideInfoData()
            .subscribe(
                data => {
                    console.log('RESOURCE-INFO: data: ', data);
                    this.nhits = data.nhits;
                    this.query = data.query;
                },
                error => {
                    console.log('RESOURCE-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }


    private goBack(): void {
        /*
         * Navigate back to SearchPanel
         * pass along the currentId if available
         * so that the SearchResultList component
         * can select the corresponding Resource.
         */
        this.router.navigate(['/search/fulltext']);
    }

    ngOnDestroy() {
        // prevent memory leak when component destroyed
        this.sideInfoDataSubscription.unsubscribe();
    }



}
