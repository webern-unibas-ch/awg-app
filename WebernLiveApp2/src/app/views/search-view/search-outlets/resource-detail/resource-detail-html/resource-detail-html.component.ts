import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { ResourceDetail } from '../../../models';

@Component({
    selector: 'awg-resource-detail-html',
    templateUrl: './resource-detail-html.component.html',
    styleUrls: ['./resource-detail-html.component.css']
})
export class ResourceDetailHtmlComponent implements OnInit {
    @Input() resourceDetailData: ResourceDetail;
    @Input() requestUrl: string;
    @Output() goBackRequest: EventEmitter<any> = new EventEmitter();
    @Output() showDetailRequest: EventEmitter<string> = new EventEmitter();

    constructor( ) { }

    ngOnInit() {
        console.log('ResourceDetailHtml#onInit.resourceDetailData: ', this.resourceDetailData);
    }

    goBack() {
        this.goBackRequest.emit();
    }

    showDetail(id?: string) {
        if (id) { id.toString(); }
        this.showDetailRequest.emit(id);
    }

}
