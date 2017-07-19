import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ConversionService } from '../../../../../core/services';
import { SearchService } from '../../../search.service';
import { ResourceDetail } from '../../../resource-detail-models';
import { ResourceFullResponseJson } from '../../../../../shared/api-objects';

@Component({
    selector: 'awg-search-result-tabs',
    templateUrl: './search-result-tabs.component.html',
    styleUrls: ['./search-result-tabs.component.css']
})
export class SearchResultTabsComponent implements OnInit {

    public currentId: string;
    public errorMessage: string = undefined;
    public request: string;
    public resourceData: ResourceFullResponseJson;
    public resourceDetail: ResourceDetail;
    public resourceRawConvertedData: ResourceDetail;
    public resourceRawData: ResourceFullResponseJson;

    ref: SearchResultTabsComponent;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private conversionService: ConversionService,
        private searchService: SearchService
    ) {
        this.ref = this;
    }

    ngOnInit() {
        this.getResourceData();
    }

    getResourceData() {
        this.route.params
            .switchMap((params: Params) => this.searchService.getResourceData(params['id']))
            .subscribe(
                (data: ResourceFullResponseJson) => {
                    // TODO: get route id
                    // console.log(params['id']);

                    // snapshot of raw json response
                    this.resourceRawData = JSON.parse(JSON.stringify(data));
                    this.resourceData = data;
                    this.resourceDetail = this.conversionService.prepareResourceDetail(this.resourceData);
                    // snapshot of converted json response
                    this.resourceRawConvertedData = JSON.parse(JSON.stringify(this.resourceDetail));
                    this.currentId = this.resourceDetail.header.objID;
                    this.request = 'http://www.salsah.org/api/resources/' + this.currentId + '_-_local';
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    showDetail(id: string) {
        this.currentId = id;
        this.router.navigate(['/search/detail', this.currentId]);
    }

    goBack(): void {
        const resId = this.resourceData ? this.currentId : null;
        // Pass along the resId if available
        // so that the SearchResultList component can select that Resource.
        this.router.navigate(['/search/fulltext', { id: resId }]);
    }

}
