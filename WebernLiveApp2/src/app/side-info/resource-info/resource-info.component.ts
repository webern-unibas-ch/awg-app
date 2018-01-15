import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { SearchResultStreamerService } from '../../views/search-view/services';
import { SearchResponseJson, SubjectItemJson } from '../../shared/api-objects';
import { SearchResponseWithQuery } from '../../views/search-view/models';


@Component({
    selector: 'awg-resource-info',
    templateUrl: './resource-info.component.html',
    styleUrls: ['./resource-info.component.css']
})
export class ResourceInfoComponent implements OnInit, OnChanges, OnDestroy {

    searchResponseSubscription: Subscription;

    searchResults: SearchResponseWithQuery;
    searchResultsSubjects: SubjectItemJson[];

    currentEntity: SubjectItemJson;
    nextEntity: SubjectItemJson;
    previousEntity: SubjectItemJson;

    constructor(
        private router: Router,
        private streamerService: SearchResultStreamerService
    ) { }

    ngOnInit() {
        this.getSideInfoData();
        // TODO: rm
        console.log('RESOURCE-INFO: INIT');
    }

    ngOnChanges() {
        this.getSideInfoData();
        // TODO: rm
        console.log('RESOURCE-INFO: CHANGES');
    }

    getSideInfoData() {
        // get searchresults from streamer service
        this.searchResponseSubscription = this.streamerService.getSearchResponse()
            .subscribe(
                (res: SearchResponseWithQuery) => {

                    // TODO: rm
                    console.log('RESOURCE-INFO: res: ', res);
                    this.searchResults = res;

                    this.getCurrentEntity();

                },
                error => {
                    console.log('RESOURCE-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }

    getCurrentEntity(counter?: number) {

        // TODO: continue here / refactor
        this.searchResultsSubjects = this.searchResults.data.subjects;

        let n = 1;
        if (counter) {
            n += counter;
        }
        this.currentEntity = this.searchResultsSubjects[n];
        this.previousEntity = this.searchResultsSubjects[n - 1];
        this.nextEntity = this.searchResultsSubjects[n + 1];

        /*
        console.log('ResInfo# prevItem ', this.previousEntity);
        console.log('ResInfo# currItem ', this.currentEntity);
        console.log('ResInfo# nextItem ', this.nextEntity);
        */

    }

    showPreviousEntity(id: string) {
        const n = -1;
        console.log('ResInfo# clicked showPrevEntity ', id);
        this.getCurrentEntity(n);
    }


    showNextEntity(id: string) {
        const n = 1;
        console.log('ResInfo# clicked showPrevEntity ', id);
        this.getCurrentEntity(n);
    }


    /*
     * Navigate back to SearchPanel
     * pass along the currentId if available
     * so that the SearchResultList component
     * can select the corresponding Resource.
     */
    goBack(): void {
        this.router.navigate(['/search/fulltext', {outlets: {side: 'searchInfo'}}]);
    }


    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.searchResponseSubscription) {
            this.searchResponseSubscription.unsubscribe();
        }
    }



}
