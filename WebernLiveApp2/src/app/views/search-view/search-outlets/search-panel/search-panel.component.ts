import { Component, OnInit } from '@angular/core';

import { ConversionService } from '../../../../core/services';
import { SearchService } from '../../services';
import { SearchResponseJson } from '../../../../shared/api-objects';
import {HttpEvent} from '@angular/common/http';


@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit {

    public searchData: SearchResponseJson = new SearchResponseJson();
    public searchval: string = 'Skizzenbuch';
    public searchUrl: string = '';
    private errorMessage: string = undefined;

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

        this.getFulltextSearchData();
    }

    public getFulltextSearchData() {
        // get searchresults from service
        this.searchService.getFulltextSearchData(this.searchval)
            .subscribe(
                (data) => {
                    const searchResultsBody: SearchResponseJson = data['body'];


                    // TODO: rm after test
                    const test = searchResultsBody['subjects'].reduce((x: SubjectItemJson[], y: any) => {
                        console.log('x: ', typeof x);
                        console.log('y: ', y);
                        console.log(y === x[0]);
                        if (x.indexOf(y) === -1) { x.push(y); };
                        return x;
                        }, []);
                    console.log('test: ', test);

                    this.searchUrl = data['url'];
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
}
