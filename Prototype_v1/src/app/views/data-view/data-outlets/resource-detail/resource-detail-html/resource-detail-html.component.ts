import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { ResourceDetail } from '../../../models';

@Component({
    selector: 'awg-resource-detail-html',
    templateUrl: './resource-detail-html.component.html',
    styleUrls: ['./resource-detail-html.component.css']
})
export class ResourceDetailHtmlComponent implements OnInit {
    @Input() resourceDetailData: ResourceDetail;
    @Output() resourceRequest: EventEmitter<string> = new EventEmitter();

    constructor( ) { }

    ngOnInit() {
    }

    navigateToResource(id?: string) {
        if (id) { id.toString(); }
        this.resourceRequest.emit(id);
    }

}
