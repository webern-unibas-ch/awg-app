import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ConversionService } from '../../../../core/services';
import { SearchResultStreamerService, SearchService } from '../../services';
import { ResourceData, ResourceDetail } from '../../models';
import { ResourceFullResponseJson } from '../../../../shared/api-objects';


@Component({
    selector: 'awg-resource-detail',
    templateUrl: './resource-detail.component.html',
    styleUrls: ['./resource-detail.component.css']
})
export class ResourceDetailComponent implements OnInit {

    public resourceData: ResourceData;
    public resourceId: string;
    public resourceUrl: string;
    public oldId: string;

    public errorMessage: string = undefined;

    public tabTitle = {
        html: 'Detail',
        raw: 'JSON (raw)',
        converted: 'JSON (converted)'
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private conversionService: ConversionService,
        private searchService: SearchService,
        private streamerService: SearchResultStreamerService
    ) { }

    ngOnInit() {
        this.getResourceData();
        this.activateSidenav();
    }


    getResourceData() {
        // fetch data
        this.route.paramMap
            .switchMap((params: ParamMap) => this.searchService.getResourceDetailData(params.get('id')))
            .subscribe(
                (data: ResourceFullResponseJson) => {
                    // update and store current resource params (url and id)
                    this.updateResourceParams();

                    // snapshot of data
                    const resourceBody: ResourceFullResponseJson = {...data};

                    // display data
                    this.displayResourceData(resourceBody);
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
        // snapshot of resourceId
        this.resourceId = this.route.snapshot.paramMap.get('id');

        // share current id via streamer service
        this.streamerService.updateCurrentResourceIdStream(this.resourceId);
    }


    updateCurrentUrl() {
        // get url from search service
        this.resourceUrl = this.searchService.httpGetUrl;
    }


    displayResourceData(resourceBody: ResourceFullResponseJson) {
        if (resourceBody == {}) { return; }

        // TODO: rm
        console.warn('ResourceDetail# resbody: ', resourceBody);

        // convert data for displaying resource detail
        const html: ResourceDetail = this.conversionService.prepareResourceDetail(resourceBody, this.resourceId);

        // load new resource data
        this.resourceData = new ResourceData(resourceBody, html);

        // scroll to Top of Page
        this.scrollToTop();
    }


    /*
     * Navigate to ResourceDetail:
     * if nextId is emitted, use nextId for navigation, else navigate to oldId (backButton)
     * if oldId not exists (first call), use resourceId
     */
    navigateToResource(nextId?: string): void {
        const showId = nextId ? nextId : (this.oldId ? this.oldId : this.resourceId);
        // save resourceId as oldId
        this.oldId = this.resourceId;
        // update resourceId
        this.resourceId = showId;

        // navigate to new resource
        this.router.navigate(['/resource', +this.resourceId]);
    }


    /*
     * Activate Sidenav: ResourceInfo
     */
    activateSidenav(): void {
        this.router.navigate([{ outlets: { side: 'resourceInfo' }}]);
    }

    /*
     * Scroll to Top of Window
     */
    scrollToTop() {
        window.scrollTo(0,0);
    }

}
