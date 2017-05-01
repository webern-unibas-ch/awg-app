import { Component, Input, OnInit } from '@angular/core';

import { ResourceFullResponseJson, SearchResponseJson } from '../../../../../shared/api-objects';
import { ConversionService } from '../../../../../core/services';
import { SearchService } from '../../../search.service';

@Component({
    selector: 'awg-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
    @Input() searchData: SearchResponseJson;

    public curId: string;
    public errorMessage: string = undefined;
    public resText: string;

    public activeSearchDetail;
    public searchDetailData: ResourceFullResponseJson;

    ref: SearchResultsComponent;

    constructor(
        private conversionService: ConversionService,
        private searchService: SearchService
    ) {
        this.ref = this;
    }

    ngOnInit() {
        this.resText = (this.searchData.subjects.length === 1) ? 'zugängliches Resultat von' : 'zugängliche Resultate von';
    }

    activeDetail(id: string) {
        return this.curId === id;
    }

    showDetail(id: string) {
        this.curId = id;
        // TODO: rm
        console.info('SearchResults#showObject: called id: ', id);

        this.searchService.getSearchDetailData(this.curId)
            .subscribe(
                (data: ResourceFullResponseJson) => {
                    if (data.access === 'OK') {
                        this.searchDetailData = data;
                        this.conversionService.prepareAccessObject(id, this.searchDetailData);
                    }
                    else {
                        this.activeSearchDetail = this.conversionService.prepareRestrictedObject(id);
                    }
                    // this.searchDetailData = this.conversionService.convertObjectProperties(data);
                    // TODO: rm
                    console.info('SearchPanel#DetailData: ', this.searchDetailData);
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

}
