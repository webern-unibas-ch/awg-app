import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { faArrowLeft, faChevronLeft, faChevronRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { DataStreamerService } from '@awg-core/services';
import { SearchQuery, SearchResponseWithQuery } from '@awg-views/data-view/models';
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
    styleUrls: ['./resource-info.component.css'],
})
export class ResourceInfoComponent implements OnInit, OnDestroy {
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
     * Private variable: _destroyed$.
     *
     * Subject to emit a truthy value in the ngOnDestroy lifecycle hook.
     */
    private _destroyed$: Subject<boolean> = new Subject<boolean>();

    /**
     * Constructor of the ResourceInfoComponent.
     *
     * It declares a private FormBuilder instance,
     * a private Router instance and a private
     * DataStreamerService instance
     * to get the streamed search results.
     *
     * @param {FormBuilder} formBuilder Instance of the FormBuilder.
     * @param {Router} router Instance of the Router.
     * @param {DataStreamerService} streamerService Instance of the DataStreamerService.
     */
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private streamerService: DataStreamerService
    ) {}

    /**
     * Getter for the current index position of the form group.
     */
    get resourceInfoIndex(): number {
        return this.resourceInfoFormGroup.get('resourceInfoIndex').value;
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getResourceInfoData();
    }

    /**
     * Public method: getResourceInfoData.
     *
     * It calls the DataStreamerService to get
     * the current resource id and loads it
     * into resourceId. Then it gets the
     * search result data and loads it
     * into resourceInfo data object.
     *
     * @returns {void} Subscribes to StreamerService.
     */
    getResourceInfoData(): void {
        // Subscribe to streamer service
        this.streamerService
            .getResourceId()
            .pipe(
                switchMap(id => {
                    // Update id from streamer service
                    this.resourceId = id;

                    // Return search response with query from streamer service
                    return this.streamerService.getSearchResponseWithQuery();
                }),
                takeUntil(this._destroyed$)
            )
            .subscribe(
                (res: SearchResponseWithQuery) => {
                    // Deep clone search results from streamer service
                    const response = JSON.parse(JSON.stringify(res));

                    // Update resource Info
                    this._updateResourceInfo(this.resourceId, response);

                    // Build the form
                    this._buildForm(this.goToIndex, this.resultSize);
                },
                error => {
                    console.error('RESOURCE-INFO: Got no sideInfoData from Subscription!', error as any);
                }
            );
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
        if (!formIndex || formIndex < 1) {
            return;
        }
        // Find resource id of subject at array position formIndex - 1
        const subjects = this.resourceInfoData.searchResults.data.subjects;
        const id = subjects[formIndex - 1].obj_id;

        // Navigate to resource with resource id
        this.navigateToResource(id);
    }

    /**
     * Public method: navigateToResource.
     *
     * It navigates to the '/data/resource' route
     * with the given id.
     *
     * @param {string} id The given resource id.
     *
     * @returns {void} Navigates to the resource.
     */
    navigateToResource(id: string): void {
        if (!id) {
            return;
        }
        this.router.navigate(['/data/resource', id]);
    }

    /**
     * Public method: navigateToSearchPanel.
     *
     * It navigates back to the '/data/search/' route
     * (search panel) with the current search query if given.
     *
     * @returns {void} Navigates to the search panel.
     */
    navigateToSearchPanel(): void {
        let commands;
        const extras = { queryParams: {} };
        const query: SearchQuery = this.resourceInfoData.searchResults ? this.resourceInfoData.searchResults.query : '';

        if (typeof query === 'string') {
            commands = ['/data/search'];
            extras.queryParams = { query: query };
        }
        if (typeof query === 'object' && typeof this.resourceInfoData.searchResults.query === 'object') {
            commands = ['/data/search/', 'extended'];
            extras.queryParams = { ...this.resourceInfoData.searchResults.query };
        }

        this.router.navigate(commands, {
            queryParams: { query },
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
        // Emit truthy value to end all subscriptions
        this._destroyed$.next(true);

        // Complete the subject itself
        this._destroyed$.complete();
    }

    /**
     * Private method: _updateResourceInfo.
     *
     * It updates the current resource info data.
     *
     * @returns {void} Sets the resourceInfoData.
     */
    private _updateResourceInfo(id: string, response: SearchResponseWithQuery): void {
        // Find index position of resource with given id in search results
        const index = this._findIndexPositionInSearchResultsById(id, response);

        // Shortcuts for indices
        const nextIndex = index + 1;
        const prevIndex = index - 1;

        // Shortcuts for current subject and its neighbours
        const subjects = response.data.subjects;
        const current = subjects[index] ? new ResourceInfoResource(subjects[index], index) : undefined;
        const next = subjects[nextIndex] ? new ResourceInfoResource(subjects[nextIndex], nextIndex) : undefined;
        const previous = subjects[prevIndex] ? new ResourceInfoResource(subjects[prevIndex], prevIndex) : undefined;

        // Set result length and goToIndex
        this.resultSize = subjects.length;
        this.goToIndex = index + 1;

        // Update resourceInfoData (immutable)
        this.resourceInfoData = {
            searchResults: response,
            resources: {
                current,
                next,
                previous,
            },
        };
    }

    /**
     * Private method: _buildForm.
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
    private _buildForm(index: number, resultSize: number): void {
        const regexPattern = /^[1-9]\d{0,9}$/; // Match any up-to 10-digit integer greater 0

        this.resourceInfoFormGroup = this.formBuilder.group({
            resourceInfoIndex: [
                index || '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(regexPattern),
                    Validators.min(1),
                    Validators.max(resultSize),
                ]),
            ],
        });
    }

    /**
     * Private method: _findIndexPositionInSearchResultsById.
     *
     * It looks for the index position of the given resource id
     * in the search response subjects array.
     *
     * @param {string} id The given resource id.
     * @param {SearchResponseWithQuery} response The given search response.
     * @returns {number} The array index position.
     */
    private _findIndexPositionInSearchResultsById(id: string, response: SearchResponseWithQuery): number {
        // Shortcut for search result subjects
        const subjects = response.data.subjects;

        // Compare given id with obj_id of subjects in searchResults.subjects array
        return subjects.findIndex(subject => subject.obj_id === id);
    }
}
