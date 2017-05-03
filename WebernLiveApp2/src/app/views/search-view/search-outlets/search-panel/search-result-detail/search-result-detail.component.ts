import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ConversionService } from '../../../../../core/services';
import { SearchService } from '../../../search.service';
import { ResourceFullResponseJson } from '../../../../../shared/api-objects';

@Component({
    selector: 'awg-search-result-detail',
    templateUrl: './search-result-detail.component.html',
    styleUrls: ['./search-result-detail.component.css']
})
export class SearchResultDetailComponent implements OnInit {

    public curId: string;
    public activeSearchDetail;
    public errorMessage: string = undefined;
    public resourceData: ResourceFullResponseJson;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private conversionService: ConversionService,
        private searchService: SearchService
    ) { }

    ngOnInit() {
        this.getResourceData();
    }

    getResourceData() {
        this.route.params
            .switchMap((params: Params) => this.searchService.getResourceData(params['id']))
            .subscribe(
                (data: ResourceFullResponseJson) => {
                    if (data.access === 'OK') {
                        this.resourceData = data;
                        this.curId = data.resdata.res_id;
                        console.log('id: ', this.curId);
                        this.conversionService.prepareAccessObject(this.curId, this.resourceData);
                    }
                    else {
                        this.activeSearchDetail = this.conversionService.prepareRestrictedObject(this.curId);
                    }
                    // this.resourceData = this.conversionService.convertObjectProperties(data);
                    // TODO: rm
                    console.info('SearchPanel#DetailData: ', this.resourceData);
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    goBack(): void {
        let resId = this.resourceData ? this.curId : null;
        // Pass along the resId if available
        // so that the SearchResultList component can select that Resource.
        this.router.navigate(['/search/fulltext', { id: resId }]);
    }

}
