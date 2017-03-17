import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-page-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    public searchTitle: string = 'Datenbank-Abfrage';
    public searchId: string = 'search';

    constructor() { }

    ngOnInit() {
    }

}
