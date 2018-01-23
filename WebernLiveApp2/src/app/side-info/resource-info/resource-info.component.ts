import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { SearchResultStreamerService } from '../../views/search-view/services';
import { SubjectItemJson } from '../../shared/api-objects';
import { SearchResponseWithQuery } from '../../views/search-view/models';


@Component({
    selector: 'awg-resource-info',
    templateUrl: './resource-info.component.html',
    styleUrls: ['./resource-info.component.css']
})
export class ResourceInfoComponent implements OnInit, OnDestroy {

    currentIdSubscription: Subscription;
    searchResponseSubscription: Subscription;

    searchResults: SearchResponseWithQuery;
    searchResultsSubjects: SubjectItemJson[];

    currentId: string;
    currentResourceIndex: number;
    goToIndex: number;
    shownIndex: number;

    currentResource: SubjectItemJson;
    nextResource: SubjectItemJson;
    previousResource: SubjectItemJson;

    constructor(
        private router: Router,
        private streamerService: SearchResultStreamerService
    ) { }

    ngOnInit() {
        this.getCurrentResourceIdBySubscription();
    }


    getCurrentResourceIdBySubscription(): void {
        // subscribe to streamer service
        this.currentIdSubscription = this.streamerService.getCurrentResourceId()
            .subscribe(
                (id: string) => {
                    // update id from streamer service
                    this.currentId = id;
                    console.log('id', id);

                    this.getCurrentSearchResultsBySubscription();
                },
                error => {
                    console.log('RESOURCE-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }


    getCurrentSearchResultsBySubscription(): void {
        // subscribe to streamer service
        this.searchResponseSubscription = this.streamerService.getCurrentSearchResults()
            .subscribe(
                (res: SearchResponseWithQuery) => {
                    // update search results from streamer service
                    this.searchResults = {...res};

                    this.searchResultsSubjects = this.searchResults.data.subjects;

                    this.findResourceInSearchResultsById(this.currentId);

                },
                error => {
                    console.log('RESOURCE-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }


    findResourceInSearchResultsById(id: string): void {

        // get index position of currentSubject in searchResults
        this.currentResourceIndex = this.searchResultsSubjects.findIndex(subject => subject.obj_id === id);
        this.shownIndex = this.currentResourceIndex + 1;
        this.goToIndex = this.shownIndex;

        console.warn('ResourceInfo# subjects ', this.searchResultsSubjects);
        console.warn('ResourceInfo# currentId: ', this.currentId, id);
        console.warn('ResourceInfo# filtered c: ', this.currentResourceIndex);

        if (this.currentResourceIndex === -1) {
            console.log('OOOOOPS. ID is not in searchResult Array.');
        }

        this.updateSideInfoResourcesByIndex(this.currentResourceIndex);

    }


    updateSideInfoResourcesByIndex(index: number): void {
        console.log('currentResourceINDEX', this.currentResourceIndex);
        console.log('searchResultsSubjects.length', this.searchResultsSubjects.length);


        this.currentResource = this.searchResultsSubjects[index];
        this.nextResource = this.searchResultsSubjects[index + 1];
        this.previousResource = this.searchResultsSubjects[index - 1];
    }


    showResource(id: string): void {
        this.goToEntity(id);
        this.findResourceInSearchResultsById(id);
    }


    goToEntity(id): void {
        this.router.navigate(['/resource', id]);
    }


    /*
     * Navigate back to SearchPanel
     * pass along the currentId if available
     * so that the SearchResultList component
     * can select the corresponding Resource.
     */
    goBackToSearchResults(): void {
        this.router.navigate(['/search/fulltext', {outlets: {side: 'searchInfo'}}]);
    }


    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.currentIdSubscription) {
            this.currentIdSubscription.unsubscribe();
        }
        if (this.searchResponseSubscription) {
            this.searchResponseSubscription.unsubscribe();
        }
    }



}
