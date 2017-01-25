import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.css']
})
export class SearchPanelComponent implements OnInit {

    APIurl: string = 'http://www.salsah.org';
    eventData: Object = {};

    constructor() { }

    ngOnInit() {
    }

    getTodaysEvents() {
        console.log('SPanel: clicked func getTodaysEvents');
    }

}
