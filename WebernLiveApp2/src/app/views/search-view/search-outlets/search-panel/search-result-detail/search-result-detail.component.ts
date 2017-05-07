import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ConversionService } from '../../../../../core/services';
import { SearchService } from '../../../search.service';
import { ResourceDetail } from '../../../resource-detail-models';
import { ResourceFullResponseJson } from '../../../../../shared/api-objects';

@Component({
    selector: 'awg-search-result-detail',
    templateUrl: './search-result-detail.component.html',
    styleUrls: ['./search-result-detail.component.css']
})
export class SearchResultDetailComponent implements OnInit {

    public currentId: string;
    public resourceDetail: ResourceDetail;
    public errorMessage: string = undefined;
    public resourceData: ResourceFullResponseJson;

    ref: SearchResultDetailComponent;

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
                    this.resourceData = data;
                    this.resourceDetail = this.conversionService.prepareResourceDetail(this.resourceData);
                    this.currentId = this.resourceDetail.header.objID;
                    // TODO: rm
                    console.info('SearchPanel#Detail: ', this.resourceDetail);
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
