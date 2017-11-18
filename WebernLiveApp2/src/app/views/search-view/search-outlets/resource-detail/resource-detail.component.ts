import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

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
    public resourceUrl: string;

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
        this.route.params
            .switchMap((params: Params) => this.searchService.getResourceData(params['id']))
            .subscribe(
                (data) => {
                    const resourceBody: ResourceFullResponseJson = data['body'];
                    // snapshot of currentId
                    this.currentId = this.route.snapshot.paramMap.get('id');
                    // url for request
                    this.resourceUrl = data['url'];

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
        this.router.navigate([{ outlets: { side: 'searchInfo' }}]);
    }

    public showDetail(nextId?: string): void {
        /*
         * Navigate to ResultDetail:
         * if nextId is emitted, use nextId for navigation, else navigate to oldId (backButton)
         * if oldId not exists (first call), use currentId
         */
        const showId = nextId ? nextId : (this.oldId ? this.oldId : this.currentId);
        // save currentId as oldId
        this.oldId = this.currentId;
        // update currentId
        this.currentId = showId;
        // navigate to new detail
        this.router.navigate(['/search/detail', +showId]);
    }

    public goBack(): void {
        /*
         * Navigate back to SearchPanel
         * TODO: store query in URL to avoid redoing search
         * pass along the currentId if available
         * so that the SearchResultList component
         * can select the corresponding Resource.
         */
        const resId = this.resourceData['html'] ? +this.currentId : null;
        this.router.navigate(['/search/fulltext', { id: resId }]);
    }

}
