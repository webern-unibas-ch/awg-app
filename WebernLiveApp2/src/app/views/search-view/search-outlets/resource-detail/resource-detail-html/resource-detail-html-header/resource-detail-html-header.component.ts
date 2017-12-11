import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceDetailHeader } from '../../../../models';

@Component({
    selector: 'awg-resource-detail-html-header',
    templateUrl: './resource-detail-html-header.component.html',
    styleUrls: [
        './resource-detail-html-header.component.css',
        '../resource-detail-html.component.css'
    ]
})
export class ResourceDetailHtmlHeaderComponent implements OnInit {
    @Input() header: ResourceDetailHeader;
    @Input() requestUrl: string;
    @Output() showDetailRequest: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    showDetail(id?: string) {
        if (id) { id.toString(); }
        this.showDetailRequest.emit(id);
    }

}
