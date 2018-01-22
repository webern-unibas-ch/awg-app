import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class ResourceInfoComponent implements OnInit, OnDestroy {

    currentIdSubscription: Subscription;
    searchResponseSubscription: Subscription;

    searchResults: SearchResponseWithQuery;
    searchResultsSubjects: SubjectItemJson[];

    currentId: string;
    currentEntityIndex: number;
    shownIndex: number;

    currentEntity: SubjectItemJson;
    nextEntity: SubjectItemJson;
    previousEntity: SubjectItemJson;

    constructor(
        private router: Router,
        private streamerService: SearchResultStreamerService
    ) { }

    ngOnInit() {
        this.getCurrentResourceIdBySubscription();
    }


    getCurrentResourceIdBySubscription() {
        // subscribe to streamer service
        this.currentIdSubscription = this.streamerService.getCurrentResourceId()
            .subscribe(
                (id: string) => {
                    // update id from streamer service
                    this.currentId = id;

                    this.getCurrentSearchResultsBySubscription();
                },
                error => {
                    console.log('RESOURCE-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }


    getCurrentSearchResultsBySubscription() {
        // subscribe to streamer service
        this.searchResponseSubscription = this.streamerService.getCurrentSearchResults()
            .subscribe(
                (res: SearchResponseWithQuery) => {
                    // update search results from streamer service
                    this.searchResults = {...res};
                    this.searchResultsSubjects = this.searchResults.data.subjects;

                    this.getCurrentEntityById(this.currentId);

                },
                error => {
                    console.log('RESOURCE-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }


    getCurrentEntityById(id: string) {

        // get index position of currentSubject in searchResults
        this.currentEntityIndex = this.searchResultsSubjects.findIndex(subject => subject.obj_id === id);
        this.shownIndex = this.currentEntityIndex + 1;

        console.warn('ResourceInfo# subjects ', this.searchResultsSubjects);
        console.warn('ResourceInfo# currentId: ', this.currentId, id);
        console.warn('ResourceInfo# filtered c: ', this.currentEntityIndex);

        if (this.currentEntityIndex === -1) {
            console.log('OOOOOPS. ID is not in searchResult Array.');
        }

        this.updateDisplayedEntitiesByIndex(this.currentEntityIndex);
    }


    updateDisplayedEntitiesByIndex(index: number) {
        this.currentEntity = this.searchResultsSubjects[index];
        this.previousEntity = this.searchResultsSubjects[index - 1];
        this.nextEntity = this.searchResultsSubjects[index + 1];
    }


    showPreviousEntity(id: string) {
        const n = -1;
        console.log('ResInfo# clicked showPrevEntity ', id);
        this.getCurrentEntityById(id);
    }


    showNextEntity(id: string) {
        const n = 1;
        console.log('ResInfo# clicked showNextEntity ', id);
        this.getCurrentEntityById(id);
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
        if (this.currentIdSubscription) {
            this.currentIdSubscription.unsubscribe();
        }
        if (this.searchResponseSubscription) {
            this.searchResponseSubscription.unsubscribe();
        }
    }



}
