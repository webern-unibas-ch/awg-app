import { Component, OnInit } from '@angular/core';

import { SearchResponseJson } from '../../../shared/api-objects';
import { SearchService } from '../search.service';
import { ConversionService } from '../../../core/services/conversion-service/conversion.service';

@Component({
    selector: 'awg-search-fulltext',
    templateUrl: './search-fulltext.component.html',
    styleUrls: ['./search-fulltext.component.css']
})
export class SearchFulltextComponent implements OnInit {

    private errorMessage: string = undefined;
    public searchData: SearchResponseJson = new SearchResponseJson();
    public searchValue: string = 'Kantate';

    isFormSubmitted: boolean = false;     // no form submitted
    isDataLoaded: boolean = false;        // no data loaded
    isDetailSelected: boolean = false;    // no object selected
    isDetailLoaded: boolean = false;      // no object loaded
    isEventButtonClicked = false;     // no button clicked
    isEventLoaded = false;       // no event loaded
    isEventCached = false;       //no event cached

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

        this.searchValue = query;
        console.log('You are searching for: ', this.searchValue);

        // get searchresults from service
        this.searchService.getFulltextSearchData(this.searchValue)
            .subscribe(
                (data: SearchResponseJson) => {
                    this.searchData = this.conversionService.convertFullTextSearchResults(data);
                    // TODO: rm
                    console.info('SearchFulltext#Data: ', this.searchData);
                    this.isFormSubmitted = false;
                    this.isDataLoaded = true;
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

}
