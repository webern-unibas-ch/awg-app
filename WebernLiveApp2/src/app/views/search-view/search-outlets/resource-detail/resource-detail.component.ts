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

    public currentId: string;
    public oldId: string;
    public errorMessage: string = undefined;
    public resourceData: ResourceData = new ResourceData();
    public resourceUrl: string;

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
        this.routeToSidenav();
        this.getResourceData();
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
                    this.displayResourceDetailData(resourceBody);
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }


    displayResourceDetailData(resourceBody: ResourceFullResponseJson) {
        // snapshot of raw json response
        this.resourceData['jsonRaw'] = JSON.parse(JSON.stringify(resourceBody));

        // convert data for displaying resource detail
        this.resourceData['html'] = this.conversionService.prepareResourceDetail(resourceBody, this.currentId);

        // snapshot of converted json response
        this.resourceData['jsonConverted'] = JSON.parse(JSON.stringify(this.resourceData['html']));
    }


    routeToSidenav(): void {
        this.router.navigate([{ outlets: { side: 'resourceInfo' }}]);
    }


    updateResourceParams() {
        // update current id
        this.updateCurrentId();

        // update url for resource
        this.resourceUrl = this.searchService.httpGetUrl;
    }

    updateCurrentId() {
        console.warn('resource-detail# id before paramMap: ', this.currentId);

        // snapshot of currentId
        this.currentId = this.route.snapshot.paramMap.get('id');

        console.warn('resource-detail# id after paramMap: ', this.currentId);

        // share current id via streamer service
        this.streamerService.updateCurrentResourceIdStream(this.currentId);
    }


    /*
     * Navigate to ResourceDetail:
     * if nextId is emitted, use nextId for navigation, else navigate to oldId (backButton)
     * if oldId not exists (first call), use currentId
     */
    showDetail(nextId?: string): void {
        const showId = nextId ? nextId : (this.oldId ? this.oldId : this.currentId);
        // save currentId as oldId
        this.oldId = this.currentId;
        // update currentId
        this.currentId = showId;
        // navigate to new detail
        this.router.navigate(['/resource', +this.currentId]);
    }


    /*
     * Navigate back to SearchPanel
     * pass along the currentId if available
     * so that the SearchResultList component
     * can select the corresponding Resource.
     */
    goBack(): void {
        this.router.navigate(['/search/fulltext', { id: this.currentId, outlets: {side: 'searchInfo'} }]);
    }

}
