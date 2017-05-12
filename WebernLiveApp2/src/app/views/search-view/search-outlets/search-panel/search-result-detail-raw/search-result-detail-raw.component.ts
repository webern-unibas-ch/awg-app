import { Component, Input, OnInit } from '@angular/core';

import { ResourceFullResponseJson } from '../../../../../shared/api-objects';

@Component({
    selector: 'awg-search-result-detail-raw',
    templateUrl: './search-result-detail-raw.component.html',
    styleUrls: ['./search-result-detail-raw.component.css']
})
export class SearchResultDetailRawComponent implements OnInit {
    @Input() resourceRawData: ResourceFullResponseJson;
    @Input() request: string;

    constructor() { }

    ngOnInit() {
    }

}
