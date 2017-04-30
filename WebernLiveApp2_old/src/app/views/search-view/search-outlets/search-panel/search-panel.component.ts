import { Component, OnInit } from '@angular/core';

import { ConversionService } from '../../../../core/services/conversion-service/conversion.service';
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
    public searchval: string = 'Kantate';

    isFormSubmitted: boolean = false;     // no form submitted
    isDataLoaded: boolean = false;        // no data loaded
    isDetailSelected: boolean = false;    // no object selected
    isDetailLoaded: boolean = false;      // no object loaded
    isEventButtonClicked = false;     // no button clicked
    isEventLoaded = false;       // no event loaded
    isEventCached = false;       //no event cached

    constructor(
        private _searchService: SearchService,
        private _conversionService: ConversionService
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

        // get searchresults from service
        this._searchService.getFulltextSearchData(this.searchval)
            .subscribe(
                (data: SearchResponseJson) => {
                    this.searchData = this._conversionService.convertFullTextSearchResults(data);
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
