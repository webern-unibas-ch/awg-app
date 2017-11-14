import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { ResourceDetail } from '../../../models';

@Component({
    selector: 'awg-resource-detail-html',
    templateUrl: './resource-detail-html.component.html',
    styleUrls: ['./resource-detail-html.component.css']
})
export class ResourceDetailHtmlComponent implements OnInit {
    @Input() resourceDetailData: ResourceDetail;
    @Output() goBackRequest: EventEmitter<any> = new EventEmitter();
    @Output() showDetailRequest: EventEmitter<string> = new EventEmitter();

    public metaBreakLine: string = 'Versionsdatum';

    ref: ResourceDetailHtmlComponent;

    constructor( ) {
        this.ref = this;
    }

    ngOnInit() {
        console.log(this.resourceDetailData);
    }


    getFacetContentSize(obj) {
        // sum up length of all arrays nested in object
        let size: number = 0;
        Object.keys(obj).forEach(key => {
            size += obj[key].length;
        });
        return size;
    }

    goBack() {
        this.goBackRequest.emit();
    }

    showDetail(id?: string) {
        if (id) { id.toString(); }
        this.showDetailRequest.emit(id);
    }

}
