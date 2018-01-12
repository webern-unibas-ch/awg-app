import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ConversionService } from '../../../../core/services';
import { SearchService } from '../../services/search.service';
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
    public requestUrl: string;

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
            .switchMap((params: ParamMap) => this.searchService.getResourceData(params.get('id')))
            .subscribe(
                (data) => {
                    // snapshot of currentId
                    this.currentId = this.route.snapshot.paramMap.get('id');
                    // url for request
                    this.requestUrl = this.searchService.httpGetUrl;

                    // get data.body
                    const resourceBody: ResourceFullResponseJson = {...data['body']};

                    // snapshot of raw json response
                    this.resourceData['jsonRaw'] = JSON.parse(JSON.stringify(resourceBody));
                    // convert data for displaying resource detail
                    this.resourceData['html'] = this.conversionService.prepareResourceDetail(resourceBody, this.currentId);
                    // snapshot of converted json response
                    this.resourceData['jsonConverted'] = JSON.parse(JSON.stringify(this.resourceData['html']));
                    },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    public routeToSidenav(): void {
        this.router.navigate([{ outlets: { side: 'resourceInfo' }}]);
    }

    public showDetail(nextId?: string): void {
        /*
         * Navigate to ResourceDetail:
         * if nextId is emitted, use nextId for navigation, else navigate to oldId (backButton)
         * if oldId not exists (first call), use currentId
         */
        const showId = nextId ? nextId : (this.oldId ? this.oldId : this.currentId);
        // save currentId as oldId
        this.oldId = this.currentId;
        // update currentId
        this.currentId = showId;
        // navigate to new detail
        this.router.navigate(['/resource', +this.currentId]);
    }

    public goBack(): void {
        /*
         * Navigate back to SearchPanel
         * pass along the currentId if available
         * so that the SearchResultList component
         * can select the corresponding Resource.
         */
        this.router.navigate(['/search/fulltext', { id: this.currentId }]);
    }

}
