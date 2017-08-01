import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { ConversionService } from '../../../../core/services';
import { SearchService } from '../../services/search.service';
import { ResourceDetail } from '../../models';
import { ResourceFullResponseJson } from '../../../../shared/api-objects';

@Component({
    selector: 'awg-search-detail-tabs',
    templateUrl: './search-detail-tabs.component.html',
    styleUrls: ['./search-detail-tabs.component.css']
})
export class SearchDetailTabsComponent implements OnInit {

    public currentId: string;
    public oldId: string;
    public errorMessage: string = undefined;
    public request: string;
    public resourceData: ResourceFullResponseJson;
    public resourceDetail: ResourceDetail;
    public resourceRawConvertedData: ResourceDetail;
    public resourceRawData: ResourceFullResponseJson;

    ref: SearchDetailTabsComponent;

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

    showDetail(nextId?: string): void {
        /*
         * Navigate to ResultDetail
         * if nextId is emitted, use nextId for navigation, else navigate to oldId (backButton)
         * if oldId not exists (first call), use currentId
         */
        const showId = nextId ? nextId : (this.oldId ? this.oldId : this.currentId);
        // save currentId as oldId (currentId is available from every new subscription in getResourceData() )
        this.oldId = this.currentId;
        this.router.navigate(['/search/detail', showId]);
    }

    goBack(): void {
        /*
         * Navigate back to SearchPanel
         * TODO: store query in URL to avoid redoing search
         * pass along the currentId if available
         * so that the SearchResultList component
         * can select the corresponding Resource.
         */
        const resId = this.resourceData ? this.currentId : null;
        this.router.navigate(['/search/fulltext', { id: resId }]);
    }

}
