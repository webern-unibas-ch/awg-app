import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { DataStreamerService } from '../../views/data-view/services';
import { SearchResponseWithQuery } from '../../views/data-view/models';
import { ResourceInfo } from '../side-info-models';
import { ResourceInfoResource } from '../side-info-models/resource-info-resources.model';


@Component({
    selector: 'awg-resource-info',
    templateUrl: './resource-info.component.html',
    styleUrls: ['./resource-info.component.css']
})
export class ResourceInfoComponent implements OnInit, OnDestroy {

    currentIdSubscription: Subscription;
    searchResponseSubscription: Subscription;

    resourceInfo: ResourceInfo = new ResourceInfo();

    currentId: string;
    goToIndex: number;
    resultSize: number;
    searchResults: SearchResponseWithQuery;

    constructor(
        private router: Router,
        private streamerService: DataStreamerService
    ) { }

    ngOnInit() {
        this.getCurrentResourceIdFromSubscription();
    }


    getCurrentResourceIdFromSubscription(): void {
        // subscribe to streamer service
        this.currentIdSubscription = this.streamerService.getCurrentResourceId()
            .subscribe(
                (id: string) => {
                    // update id from streamer service
                    this.currentId = id;

                    // get search results
                    this.getCurrentSearchResultsFromSubscription();
                },
                error => {
                    console.log('RESOURCE-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }


    getCurrentSearchResultsFromSubscription(): void {
        // subscribe to streamer service
        this.searchResponseSubscription = this.streamerService.getCurrentSearchResults()
            .subscribe(
                (res: SearchResponseWithQuery) => {
                    // update search results from streamer service
                    this.searchResults = {...res};

                    // load search results into resourceInfo object
                    this.resourceInfo.searchResults = {
                        query: this.searchResults.query,
                        size: this.searchResults.data.subjects.length,
                        subjects: this.searchResults.data.subjects
                    };

                    // find resource with current id in search results
                    this.findResourceInSearchResultsById(this.currentId);

                },
                error => {
                    console.log('RESOURCE-INFO: Got no sideInfoData from Subscription!', <any>error);
                }
            );
    }


    findResourceInSearchResultsById(id: string): void {
        // find index position of currentSubject in searchResults.subjects array
        const arrayIndex = this.resourceInfo.searchResults.subjects.findIndex(subject => subject.obj_id === id);

        // update resource info data
        this.updateSideInfoResources(arrayIndex);
    }


    updateSideInfoResources(index: number): void {
        // some shortcuts
        this.goToIndex = index + 1;
        const nextIndex = index + 1;
        const prevIndex = index - 1;
        const subjects = this.resourceInfo.searchResults.subjects;
        this.resultSize = subjects.length;

        // current subject and its neighbours
        const current = subjects[index];
        const next = subjects[nextIndex];
        const prev = subjects[prevIndex];

        // update resourceInfo.resources
        this.resourceInfo.resources = {
            current: current ? new ResourceInfoResource(current, index) : undefined,
            next: next ? new ResourceInfoResource(next, nextIndex) : undefined,
            previous: prev ? new ResourceInfoResource(prev, prevIndex) : undefined
        };
    }


    findResourceByIndex(index: number): void {
        // find resource id of search result at array position index - 1 ()
        const id = this.resourceInfo.searchResults.subjects[index - 1].obj_id;

        // navigate to resource with resource id
        this.navigateToResource(id);
    }


    /*
     * Navigate to resource id
     */
    navigateToResource(id: string): void {
        this.router.navigate(['/resource', id]);
    }


    /*
     * Navigate back to SearchPanel
     */
    navigateToSearchResults(): void {
        // TODO: send current id - not working
        this.router.navigate(['/search/fulltext', {id: this.currentId, outlets: {side: 'searchInfo'}}]);
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
