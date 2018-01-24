import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ConversionService } from '../../../../core/services';
import { SearchResultStreamerService, SearchService } from '../../services';
import { ResourceData } from '../../models';
import { ResourceFullResponseJson } from '../../../../shared/api-objects';


@Component({
    selector: 'awg-resource-detail',
    templateUrl: './resource-detail.component.html',
    styleUrls: ['./resource-detail.component.css']
})
export class ResourceDetailComponent implements OnInit {


    public resourceData: ResourceData;
    public oldId: string;
    public resourceId: string;
    public resourceUrl: string;

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

                    // snapshot of data.body
                    const resourceBody: ResourceFullResponseJson = {...data['body']};

                    // display data
                    this.displayResourceData(resourceBody);
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }


    displayResourceData(resourceBody: ResourceFullResponseJson) {

        if (!resourceBody) { return; }

        // convert data for displaying resource detail
        const html = this.conversionService.prepareResourceDetail(resourceBody, this.resourceId);

        // load new resource data
        this.resourceData = new ResourceData(resourceBody, html);

    }


    updateResourceParams() {
        // update current id
        this.updateresourceId();

        // update url for resource
        this.updateCurrentUrl();
    }


    updateresourceId() {
        console.warn('resource-detail# id before paramMap: ', this.resourceId);

        // snapshot of resourceId
        this.resourceId = this.route.snapshot.paramMap.get('id');

        console.warn('resource-detail# id after paramMap: ', this.resourceId);

        // share current id via streamer service
        this.streamerService.updateCurrentResourceIdStream(this.resourceId);
    }


    updateCurrentUrl() {
        // get url from search service
        this.resourceUrl = this.searchService.httpGetUrl;
    }


    /*
     * Activate Sidenav: ResourceInfo
     */
    activateSidenav(): void {
        this.router.navigate([{ outlets: { side: 'resourceInfo' }}]);
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
     * Navigate back to SearchPanel
     * pass along the resourceId if available
     * so that the SearchResultList component
     * can select the corresponding Resource.
     */
    navigateToSearch(): void {
        this.router.navigate(['/search/fulltext', { id: this.resourceId, outlets: {side: 'searchInfo'} }]);
    }

}
