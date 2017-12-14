import { Component, OnInit } from '@angular/core';

import { ConversionService } from '../../../../core/services';
import { SearchService } from '../../services';
import { SearchResponseJson, SubjectItemJson } from '../../../../shared/api-objects';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit {

    searchData: SearchResponseJson = new SearchResponseJson();
    searchval: string = 'Skizzenbuch';
    searchUrl: string = '';
    errorMessage: string = undefined;
    filteredOut: number;

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

    public onSubmit(query: string) {
        // init
        this.isFormSubmitted = true;      // now form is submitted
        this.isDataLoaded = false;        // no data loaded
        this.isDetailSelected = false;    // no detail selected
        this.isDetailLoaded = false;      // no detail loaded

        this.searchval = query;

        this.getFulltextSearchData();
    }

    public getFulltextSearchData() {
        // get searchresults from service
        this.searchService.getFulltextSearchData(this.searchval)
            .subscribe(
                (data) => {
                    this.searchUrl = data['url'];
                    const searchResultsBody: SearchResponseJson = data['body'];

                    // remove duplicates from response subjects
                    searchResultsBody['subjects'] = this.distinctArray(searchResultsBody['subjects']);

                    // conversion of search results for HTML display
                    this.searchData = this.conversionService.convertFullTextSearchResults(searchResultsBody);
                    // TODO: rm
                    console.info('SearchPanel#searchData: ', this.searchData);
                    this.isFormSubmitted = false;
                    this.isDataLoaded = true;
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

    private distinctArray(arrArg) {
        /*
        * see https://gist.github.com/telekosmos/3b62a31a5c43f40849bb#gistcomment-2137855
        *
        * This function checks for every array position (reduce)
        * if the obj_id of the entry at the current position (y) is already in the array (findIndex)
        * and if not pushes y into x that is initalized as empty array []
        *
        */
        this.filteredOut = 0;
        return arrArg.reduce((x, y) => x.findIndex(e => e.obj_id === y.obj_id) < 0 ? [...x, y] : (this.filteredOut += 1, x), []);
    }
}
