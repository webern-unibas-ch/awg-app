import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ResourceDetail } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-html',
    templateUrl: './resource-detail-html.component.html',
    styleUrls: ['./resource-detail-html.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceDetailHtmlComponent implements OnInit {
    @Input()
    resourceDetailData: ResourceDetail;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    navigateToResource(id?: string) {
        if (!id) {
            return;
        }
        id = id.toString();
        this.resourceRequest.emit(id);
    }
}
