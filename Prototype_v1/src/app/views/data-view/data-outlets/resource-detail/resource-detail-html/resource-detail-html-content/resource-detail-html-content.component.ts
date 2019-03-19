import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ResourceDetailContent } from '@awg-views/data-view/models';

@Component({
    selector: 'awg-resource-detail-html-content',
    templateUrl: './resource-detail-html-content.component.html',
    styleUrls: ['./resource-detail-html-content.component.css']
})
export class ResourceDetailHtmlContentComponent implements OnInit {
    @Input()
    content: ResourceDetailContent;
    @Output()
    resourceRequest: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    navigateToResource(id?: string): void {
        if (!id) {
            return;
        }
        id = id.toString();
        this.resourceRequest.emit(id);
    }
}
