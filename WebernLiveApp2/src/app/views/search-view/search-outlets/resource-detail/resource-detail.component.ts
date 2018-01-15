import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ConversionService } from '../../../../core/services';
import { SearchService } from '../../services';
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
        private searchService: SearchService
    ) { }

    ngOnInit() {
        this.routeToSidenav();
        this.getResourceData();
    }


    public getResourceData() {
        // fetch data
        this.route.paramMap
            .switchMap((params: ParamMap) => this.searchService.getResourceDetailData(params.get('id')))
            .subscribe(
                (data: ResourceFullResponseJson) => {
                    // snapshot of currentId
                    this.currentId = this.route.snapshot.paramMap.get('id');
                    // url for request
                    this.resourceUrl = this.searchService.httpGetUrl;

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


    public displayResourceDetailData(resourceBody: ResourceFullResponseJson) {
        // snapshot of raw json response
        this.resourceData['jsonRaw'] = JSON.parse(JSON.stringify(resourceBody));

        // convert data for displaying resource detail
        this.resourceData['html'] = this.conversionService.prepareResourceDetail(resourceBody, this.currentId);

        // snapshot of converted json response
        this.resourceData['jsonConverted'] = JSON.parse(JSON.stringify(this.resourceData['html']));
    }


    public routeToSidenav(): void {
        this.router.navigate([{ outlets: { side: 'resourceInfo' }}]);
    }


    /*
     * Navigate to ResourceDetail:
     * if nextId is emitted, use nextId for navigation, else navigate to oldId (backButton)
     * if oldId not exists (first call), use currentId
     */
    public showDetail(nextId?: string): void {
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
    public goBack(): void {
        this.router.navigate(['/search/fulltext', { id: this.currentId, outlets: {side: 'searchInfo'} }]);
    }

}
