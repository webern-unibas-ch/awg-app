import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { ResourceDetail } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-json-converted',
    templateUrl: './resource-detail-json-converted.component.html',
    styleUrls: ['./resource-detail-json-converted.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceDetailJsonConvertedComponent implements OnInit {
    @Input()
    resourceJsonConvertedData: ResourceDetail;

    constructor() {}

    ngOnInit() {}
}
