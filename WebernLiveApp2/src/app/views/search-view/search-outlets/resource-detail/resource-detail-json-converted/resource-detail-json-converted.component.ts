import { Component, Input, OnInit } from '@angular/core';
import { ResourceDetail } from '../../../models';

@Component({
    selector: 'awg-resource-detail-json-converted',
    templateUrl: './resource-detail-json-converted.component.html',
    styleUrls: ['./resource-detail-json-converted.component.css']
})
export class ResourceDetailJsonConvertedComponent implements OnInit {
    @Input() resourceJsonConvertedData: ResourceDetail;
    @Input() request: string;

    constructor() { }

    ngOnInit() {
    }

}
