import { Component, Input, OnInit } from '@angular/core';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';
import { ResourceDetail } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-json-viewer',
    templateUrl: './json-viewer.component.html',
    styleUrls: ['./json-viewer.component.css']
})
export class JsonViewerComponent implements OnInit {
    @Input()
    jsonViewerData: ResourceDetail | ResourceFullResponseJson;
    @Input()
    jsonViewerHeader: string;

    constructor() {}

    ngOnInit() {}
}
