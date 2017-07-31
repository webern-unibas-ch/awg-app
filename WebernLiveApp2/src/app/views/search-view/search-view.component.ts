import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-search-view',
    templateUrl: './search-view.component.html',
    styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent implements OnInit {

    public searchTitle = 'Suche';
    public searchId = 'search';

    constructor() { }

    ngOnInit() {
    }

}
