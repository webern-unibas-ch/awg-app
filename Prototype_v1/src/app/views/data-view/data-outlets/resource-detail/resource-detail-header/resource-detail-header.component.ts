import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceDetailHeader } from '../../../models';

@Component({
    selector: 'awg-resource-detail-header',
    templateUrl: './resource-detail-header.component.html',
    styleUrls: ['./resource-detail-header.component.css']
})
export class ResourceDetailHeaderComponent implements OnInit {
    @Input() header: ResourceDetailHeader;
    @Input() resourceUrl: string;
    @Output() resourceRequest: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    navigateToResource(id?: string) {
        if (id) { id.toString(); }
        this.resourceRequest.emit(id);
    }

}
