import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { switchMap, map } from 'rxjs/operators';

import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

import { ConversionService, DataStreamerService } from '@awg-core/services';
import { DataApiService } from '@awg-views/data-view/services';
import { ResourceData, ResourceDetail } from '@awg-views/data-view/models';
import { ResourceFullResponseJson } from '@awg-shared/api-objects';

@Component({
    selector: 'awg-resource-detail',
    templateUrl: './resource-detail.component.html',
    styleUrls: ['./resource-detail.component.css'],
    providers: [NgbTabsetConfig]
})
export class ResourceDetailComponent implements OnInit {
    resourceData: ResourceData;
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
        private route: ActivatedRoute,
        private router: Router,
        private conversionService: ConversionService,
        private searchService: DataApiService,
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

    ngOnInit() {
        this.getResourceData();
        this.activateSidenav();
    }

    getResourceData() {
        // observe route params
        this.route.paramMap
            .pipe(
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
                })
            )
            .subscribe(
                (resourceData: ResourceData) => {
                    this.resourceData = resourceData;

                    // scroll to Top of Page
                    ResourceDetailComponent.scrollToTop();
                },
                error => {
                    this.errorMessage = <any>error;
                }
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
        this.streamerService.updateCurrentResourceIdStream(this.resourceId);
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
        return (this.resourceData = new ResourceData(resourceBody, html));
    }

    /*
     * Navigate to ResourceDetail:
     * if nextId is emitted, use nextId for navigation, else navigate to oldId (backButton)
     * if oldId not exists (first call), use resourceId
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

    /*
     * Activate Sidenav: ResourceInfo
     */
    activateSidenav(): void {
        this.router.navigate([{ outlets: { side: 'resourceInfo' } }]);
    }
}
