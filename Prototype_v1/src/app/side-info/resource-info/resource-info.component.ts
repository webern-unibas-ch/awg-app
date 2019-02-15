import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { faArrowLeft, faChevronLeft, faChevronRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { DataStreamerService } from '@awg-core/services';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';
import { ResourceInfo, ResourceInfoResource } from '@awg-side-info/side-info-models';

@Component({
    selector: 'awg-resource-info',
    templateUrl: './resource-info.component.html',
    styleUrls: ['./resource-info.component.css']
})
export class ResourceInfoComponent implements OnInit, OnDestroy {
    currentIdSubscription: Subscription;
    searchResponseSubscription: Subscription;

    resourceInfo: ResourceInfo = new ResourceInfo();
    resourceInfoForm: FormGroup;

    faArrowLeft = faArrowLeft;
    faChevronLeft = faChevronLeft;
    faChevronRight = faChevronRight;
    faTimesCircle = faTimesCircle;

    currentId: string;
    goToIndex: number;
    resultSize: number;
    searchResults: SearchResponseWithQuery;

    constructor(private router: Router, private streamerService: DataStreamerService, private fb: FormBuilder) {}

    ngOnInit() {
        this.getCurrentResourceIdFromSubscription();
    }

    buildForm(index: number, resultSize: number): void {
        this.resourceInfoForm = this.fb.group({
            resourceInfoIndex: [
                index || '',
                Validators.compose([Validators.required, Validators.min(1), Validators.max(resultSize)])
            ]
        });
    }

    /*
     * Getter function for resource info index
     */
    get resourceInfoIndex() {
        return this.resourceInfoForm.get('resourceInfoIndex');
    }

    getCurrentResourceIdFromSubscription(): void {
        // subscribe to streamer service
        this.currentIdSubscription = this.streamerService.getCurrentResourceId().subscribe(
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
        this.searchResponseSubscription = this.streamerService.getCurrentSearchResults().subscribe(
            (res: SearchResponseWithQuery) => {
                // update search results from streamer service
                this.searchResults = { ...res };

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

        this.buildForm(this.goToIndex, this.resultSize);
    }

    findResourceByIndex(): void {
        // get current form index
        const formIndex = this.resourceInfoIndex.value;

        // find resource id of search result at array position formIndex - 1 ()
        const id = this.resourceInfo.searchResults.subjects[formIndex - 1].obj_id;

        // navigate to resource with resource id
        this.navigateToResource(id);
    }

    /*
     * Navigate to resource id
     */
    navigateToResource(id: string): void {
        this.router.navigate(['/data/resource', id]);
    }

    /*
     * Navigate back to SearchPanel
     */
    navigateToSearchResults(): void {
        const query = this.resourceInfo.searchResults ? this.resourceInfo.searchResults.query : '';
        this.router.navigate(['/data/search/fulltext'], {
            queryParams: { query: query }
        });
    }

    /*
     * Destroy subscriptions
     */
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
