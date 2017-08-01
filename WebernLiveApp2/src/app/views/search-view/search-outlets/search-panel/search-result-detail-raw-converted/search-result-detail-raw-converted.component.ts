import { Component, Input, OnInit } from '@angular/core';
import { ResourceDetail } from '../../../models';

@Component({
    selector: 'awg-search-result-detail-raw-converted',
    templateUrl: './search-result-detail-raw-converted.component.html',
    styleUrls: ['./search-result-detail-raw-converted.component.css']
})
export class SearchResultDetailRawConvertedComponent implements OnInit {
    @Input() resourceRawConvertedData: ResourceDetail;
    @Input() request: string;

    constructor() { }

    ngOnInit() {
    }

}
