import { Component, OnInit } from '@angular/core';

import { SearchService } from '../../search.service';
import { SearchResponseJson } from '../../../../api-service/api-objects';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css'],
    providers: [ SearchService ]
})
export class SearchPanelComponent implements OnInit {

   // eventData: Object = {};
    private errorMessage: string = undefined;
    public searchData: SearchResponseJson = new SearchResponseJson();
    public searchval: string = 'Kantate';

    isFormSubmitted: boolean = false;     // no form submitted
    isDataLoaded: boolean = false;        // no data loaded
    isObjectSelected: boolean = false;    // no object selected
    isObjectLoaded: boolean = false;      // no object loaded
    isEventButtonClicked = false;     // no button clicked
    isEventLoaded = false;       // no event loaded
    isEventCached = false;       //no event cached

    constructor(private _searchService: SearchService) { }

    ngOnInit() {
    }


    // submit (function) USING salsahAPIfactory
    onSubmit(query: string) {
        // init
        this.isFormSubmitted = true;      //NOW FORM WAS SUBMITTED
        this.isDataLoaded = false;        //NO DATA LOADED
        this.isObjectSelected = false;    //NO OBJECT SELECTED
        this.isObjectLoaded = false;      //NO OBJECT LOADED

        this.searchval = query;
        console.log('You are searching for: ', this.searchval);


        // GET SEARCHRESULTS (promise) & THEN SEND searchData TO SCOPE
        this._searchService.getFulltextSearchData(this.searchval)
            .subscribe(
                (data: SearchResponseJson) => {
                    this.searchData = data;
                    console.info(data);
                    //this.isFormSubmitted = false;
                    //this.isDataLoaded = true;
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }
}
