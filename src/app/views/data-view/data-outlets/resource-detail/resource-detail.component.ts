import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';

import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

import { ConversionService, DataStreamerService, LoadingService } from '@awg-core/services';
import { DataApiService } from '@awg-views/data-view/services';

import { ResourceData, ResourceDetail } from '@awg-views/data-view/models';
import { ResourceFullResponseJson } from '@awg-shared/api-objects';

@Component({
    selector: 'awg-resource-detail',
    templateUrl: './resource-detail.component.html',
    styleUrls: ['./resource-detail.component.css'],
    providers: [NgbTabsetConfig]
})
export class ResourceDetailComponent implements OnInit, OnChanges {
    resourceData$: Observable<ResourceData>;

    resourceId: string;
    resourceUrl: string;
    oldId: string;

    errorMessage: any = undefined;

    tabTitle = {
        html: 'Detail',
        raw: 'JSON (raw)',
        converted: 'JSON (converted)'
    };

    constructor(
        public loadingService: LoadingService,
        private route: ActivatedRoute,
        private router: Router,
        private conversionService: ConversionService,
        private dataApiService: DataApiService,
        private streamerService: DataStreamerService,
        config: NgbTabsetConfig
    ) {
        config.justify = 'justified';
    }

    /*
     * Scroll to Top of Window
     */
    static scrollToTop() {
        window.scrollTo(0, 0);
    }

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.routeToSidenav();
        this.getResourceData();
    }

    /**
     * Angular life cycle hook: ngOnChanges.
     *
     * It checks for changes of the given input.
     *
     * @param {SimpleChanges} changes The changes of the input.
     */
    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
    }

    /**
     * Public method: changeLoadingStatus.
     *
     * It changes the loading status
     * to the given value.
     *
     * @param {boolean} status The given status value.
     * @returns {void} Sets the isLoadingData variable.
     */
    changeLoadingStatus(status: boolean): void {
        this.isLoadingData = status;
    }

    /**
     * Public method: onLoadingStart.
     *
     * It marks the start of a loading activity
     * and calls the changeLoadingStatus method to
     * set the loading status to true.
     *
     * @returns {void} Triggers the change of the loading status.
     */
    onLoadingStart() {
        return (this.isLoadingData = true);
    }

    /**
     * Public method: onLoadingEnd.
     *
     * It marks the end of a loading activity
     * and calls the changeLoadingStatus method to
     * set the loading status to false.
     *
     * @returns {void} Triggers the change of the loading status.
     */
    onLoadingEnd() {
        return (this.isLoadingData = false);
    }

    getResourceData() {
        // observe route params
        this.resourceData$ = this.route.paramMap.pipe(
            tap(() => {
                this.onLoadingStart();
            }),
            switchMap((params: ParamMap) => {
                // store resource id
                this.resourceId = params.get('id');

                // fetch data
                return this.searchService.getResourceDetailData(params.get('id')).pipe(
                    map((resourceBody: ResourceFullResponseJson) => {
                        // update current resource params (url and id) via streamer service
                        this.updateResourceParams();

                        // prepare resource detail
                        return this.prepareResourceDetail(resourceBody);
                    })
                );
            }),
            tap(() => {
                this.onLoadingEnd();
            })
        );
    }

    updateResourceParams() {
        // update current id
        this.updateResourceId();

        // update url for resource
        this.updateCurrentUrl();
    }

    updateResourceId() {
        // share current id via streamer service
        this.streamerService.updateResourceId(this.resourceId);
    }

    updateCurrentUrl() {
        // get url from search service
        this.resourceUrl = this.searchService.httpGetUrl;
    }

    prepareResourceDetail(resourceBody: ResourceFullResponseJson): ResourceData {
        if (Object.keys(resourceBody).length === 0 && resourceBody.constructor === Object) {
            return;
        }

        // convert data for displaying resource detail
        const html: ResourceDetail = this.conversionService.prepareResourceDetail(resourceBody, this.resourceId);

        // return new resource data
        return new ResourceData(resourceBody, html);
    }

    /**
     * Public method: navigateToResource.
     *
     * It navigates to the '/data/resource' route
     * with the given id.
     *
     * If nextId is emitted, use nextId for navigation,
     * else navigate to oldId (backButton). If oldId
     * not exists (first call), use resourceId.
     *
     * @param {string} [nextId] The given resource id.
     * @returns {void} Navigates to the resource.
     */
    navigateToResource(nextId?: string): void {
        const showId = nextId ? nextId : this.oldId ? this.oldId : this.resourceId;
        // save resourceId as oldId
        this.oldId = this.resourceId;
        // update resourceId
        this.resourceId = showId;

        // navigate to new resource
        this.router.navigate(['/data/resource', +this.resourceId]);
    }

    /**
     * Public method: routeToSidenav.
     *
     * It activates the secondary outlet with the resource-info.
     *
     * @returns {void} Activates the resource-info side outlet.
     */
    routeToSidenav(): void {
        this.router.navigate([{ outlets: { side: 'resourceInfo' } }], {
            preserveFragment: true,
            queryParamsHandling: 'preserve'
        });
    }
}
