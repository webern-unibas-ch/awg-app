import { Component, Input, OnInit } from '@angular/core';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';

@Component({
    selector: 'awg-resource-detail-json-raw',
    templateUrl: './resource-detail-json-raw.component.html',
    styleUrls: ['./resource-detail-json-raw.component.css']
})
export class ResourceDetailJsonRawComponent implements OnInit {
    @Input() resourceJsonRawData: ResourceFullResponseJson;

    constructor() { }

    ngOnInit() {
    }

}
