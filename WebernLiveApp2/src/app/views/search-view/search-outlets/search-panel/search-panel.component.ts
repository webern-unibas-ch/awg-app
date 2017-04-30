import { Component, OnInit } from '@angular/core';

import { ConversionService } from '../../../../core/services';
import { SearchService } from '../../search.service';
import { SearchResponseJson } from '../../../../shared/api-objects';


@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit {

    // eventData: Object = {};
    private errorMessage: string = undefined;
    public searchData: SearchResponseJson = new SearchResponseJson();
    public searchval = 'Kantate';

    isFormSubmitted = false;     // no form submitted
    isDataLoaded = false;        // no data loaded
    isDetailSelected = false;    // no object selected
    isDetailLoaded = false;      // no object loaded
    isEventButtonClicked = false;     // no button clicked
    isEventLoaded = false;       // no event loaded
    isEventCached = false;       // no event cached

    constructor(
        private searchService: SearchService,
        private conversionService: ConversionService
    ) { }

    ngOnInit() {
    }

    onSubmit(query: string) {
        // init
        this.isFormSubmitted = true;      // now form is submitted
        this.isDataLoaded = false;        // no data loaded
        this.isDetailSelected = false;    // no detail selected
        this.isDetailLoaded = false;      // no detail loaded

        this.searchval = query;
        console.log('You are searching for: ', this.searchval);

        this.getFulltextSearchData();
    }

    public getFulltextSearchData() {
        // get searchresults from service
        this.searchService.getFulltextSearchData(this.searchval)
            .subscribe(
                (data: SearchResponseJson) => {
                    this.searchData = this.conversionService.convertFullTextSearchResults(data);
                    // TODO: rm
                    console.info('SearchPanel#Data: ', this.searchData);
                    this.isFormSubmitted = false;
                    this.isDataLoaded = true;
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }
}
