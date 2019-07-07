import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { faArrowLeft, faChevronLeft, faChevronRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { DataStreamerService } from '@awg-core/services';
import { SearchResponseWithQuery } from '@awg-views/data-view/models';
import { ResourceInfo, ResourceInfoResource } from '@awg-side-info/side-info-models';

/**
 * The ResourceInfo component.
 *
 * It contains the side-info section of the data (search) view
 * showing information about search results.
 */
@Component({
    selector: 'awg-resource-info',
    templateUrl: './resource-info.component.html',
    styleUrls: ['./resource-info.component.css']
})
export class ResourceInfoComponent implements OnInit, OnDestroy {
    /**
     * Public variable: resourceInfoDataSubscription.
     *
     * It keeps the subscription for the resource info data.
     */
    resourceInfoDataSubscription: Subscription;

    /**
     * Public variable: faArrowLeft.
     *
     * It instantiates fontawesome's faArrowLeft icon.
     */
    faArrowLeft = faArrowLeft;

    /**
     * Public variable: faChevronLeft.
     *
     * It instantiates fontawesome's faChevronLeft icon.
     */
    faChevronLeft = faChevronLeft;

    /**
     * Public variable: faChevronRight.
     *
     * It instantiates fontawesome's faChevronRight icon.
     */
    faChevronRight = faChevronRight;

    /**
     * Public variable: faTimesCircle.
     *
     * It instantiates fontawesome's faTimesCircle icon.
     */
    faTimesCircle = faTimesCircle;

    /**
     * Public variable: goToIndex.
     *
     * It keeps the index position .
     */
    goToIndex: number;

    /**
     * Public variable: resourceId.
     *
     * It keeps the current resource id.
     */
    resourceId: string;

    /**
     * Public variable: resourceInfoData.
     *
     * It keeps the data for the resource info,
     * i.e. search results and current, next & previous resource.
     */
    resourceInfoData: ResourceInfo = new ResourceInfo();

    /**
     * Public variable: resourceInfoFormGroup.
     *
     * It keeps the form group of the resource info.
     */
    resourceInfoFormGroup: FormGroup;

    /**
     * Public variable: resultSize.
     *
     * It keeps a shortcout for the length of the
     * resourceInfoData.searchResults.data.subjects array.
     */
    resultSize: number;

    /**
     * Constructor of the ResourceInfoComponent.
     *
     * It declares a private FormBuilder instance,
     * a private Router instance and a private
     * DataStreamerService instance
     * to get the streamed search results.
     *
     * @param {FormBuilder} fb Instance of the FormBuilder.
     * @param {Router} router Instance of the Router.
     * @param {DataStreamerService} streamerService Instance of the DataStreamerService.
     */
    constructor(private fb: FormBuilder, private router: Router, private streamerService: DataStreamerService) {}

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.subscribeResourceInfoData();
    }

    /**
     * Public method: subscribeResourceInfoData.
     *
     * It calls the DataStreamerService to get
     * the current resource id and loads it
     * into resourceId. Then it gets the
     * search result data and loads it
     * into resourceInfo data object.
     *
     * @returns {void} Subscribes to StreamerService.
     */
    subscribeResourceInfoData(): void {
        // subscribe to streamer service
        this.resourceInfoDataSubscription = this.streamerService
            .getResourceId()
            .pipe(
                switchMap(id => {
                    // update id from streamer service
                    this.resourceId = id;

                    // return search response with query from streamer service
                    return this.streamerService.getSearchResponseWithQuery();
                })
            )
            .subscribe(
                (res: SearchResponseWithQuery) => {
                    // deep clone search results from streamer service
                    const response = { ...res };

                    // update resource Info
                    this.updateResourceInfo(this.resourceId, response);

                    // build the form
                    this.buildForm(this.goToIndex, this.resultSize);
                },
                error => {
                    console.log('RESOURCE-INFO: Got no sideInfoData from Subscription!', error as any);
                }
            );
    }

    /**
     * Public method: updateResourceInfo.
     *
     * It updates the current resource info data.
     *
     * @returns {void} Sets the resourceInfoData.
     */
    updateResourceInfo(id: string, response: SearchResponseWithQuery): void {
        // find index position of resource with given id in search results
        const index = this.findIndexPositionInSearchResultsById(id, response);

        // shortcuts for indices
        const nextIndex = index + 1;
        const prevIndex = index - 1;

        // shortcuts for current subject and its neighbours
        const subjects = response.data.subjects;
        const current = subjects[index];
        const next = subjects[nextIndex];
        const prev = subjects[prevIndex];

        // set result length and goToIndex
        this.resultSize = subjects.length;
        this.goToIndex = index + 1;

        // update resourceInfoData (immutable)
        this.resourceInfoData = {
            searchResults: response,
            resources: {
                current: current ? new ResourceInfoResource(current, index) : undefined,
                next: next ? new ResourceInfoResource(next, nextIndex) : undefined,
                previous: prev ? new ResourceInfoResource(prev, prevIndex) : undefined
            }
        };
    }

    /**
     * Public method: buildForm.
     *
     * It builds the form group to display the resource
     * depending on the given index position and result size.
     *
     * @param {number} index The given index position
     * of the resource to be displayed.
     * @param {number} resultSize The given length of the
     * search result subjects array.
     * @returns {void} Sets the resourceInfoData.resources.
     */
    buildForm(index: number, resultSize: number): void {
        this.resourceInfoFormGroup = this.fb.group({
            resourceInfoIndex: [
                index || '',
                Validators.compose([Validators.required, Validators.min(1), Validators.max(resultSize)])
            ]
        });
    }

    /**
     * Public method: findIndexPositionInSearchResultsById.
     *
     * It looks for the index position of the given resource id
     * in the search response subjects array.
     *
     * @param {string} id The given resource id.
     * @param {SearchResponseWithQuery} response The given search response.
     * @returns {number} The array index position.
     */
    findIndexPositionInSearchResultsById(id: string, response: SearchResponseWithQuery): number {
        // shortcut for search result subjects
        const subjects = response.data.subjects;

        // compare given id with obj_id of subjects in searchResults.subjects array
        return subjects.findIndex(subject => subject.obj_id === id);
    }

    /**
     * Getter for the current index position of the form group.
     */
    public get resourceInfoIndex(): number {
        return this.resourceInfoFormGroup.get('resourceInfoIndex').value;
    }

    /**
     * Public method: navigateToResourceByIndex.
     *
     * It looks for the id of a subject in the search results subjects array
     * at the given index position and triggers the navigation method.
     *
     * @param {string} formIndex The given index position of the form group.
     * @returns {void Triggers the navigation.
     */
    navigateToResourceByIndex(formIndex: number): void {
        // find resource id of subject at array position formIndex - 1
        const subjects = this.resourceInfoData.searchResults.data.subjects;
        const id = subjects[formIndex - 1].obj_id;

        // navigate to resource with resource id
        this.navigateToResource(id);
    }

    /**
     * Public method: navigateToResource.
     *
     * It navigates to the '/data/resource' route
     * with the given id.
     *
     * @param {string} id The given resource id.
     * @returns {void} Navigates to the resource.
     */
    navigateToResource(id: string): void {
        this.router.navigate(['/data/resource', id]);
    }

    /**
     * Public method: navigateToSearchPanel.
     *
     * It navigates back to the '/data/search/fulltext' route
     * (search panel) with the current query string if given.
     *
     * @returns {void} Navigates to the search panel.
     */
    navigateToSearchPanel(): void {
        const queryStr = this.resourceInfoData.searchResults ? this.resourceInfoData.searchResults.query : '';
        this.router.navigate(['/data/search/fulltext'], {
            queryParams: { query: queryStr }
        });
    }

    /**
     * Angular life cycle hook: ngOnDestroy.
     *
     * It calls the containing methods
     * when destroying the component.
     *
     * Destroys subscriptions.
     */
    ngOnDestroy() {
        // prevent memory leak when component destroyed
        if (this.resourceInfoDataSubscription) {
            this.resourceInfoDataSubscription.unsubscribe();
        }
    }
}
