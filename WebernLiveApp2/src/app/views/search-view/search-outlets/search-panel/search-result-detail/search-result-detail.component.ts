import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import { ResourceDetail } from '../../../resource-detail-models';

@Component({
    selector: 'awg-search-result-detail',
    templateUrl: './search-result-detail.component.html',
    styleUrls: ['./search-result-detail.component.css']
})
export class SearchResultDetailComponent implements OnInit {
    @Input() resourceDetail: ResourceDetail;
    @Output() showDetailRequest: EventEmitter<string> = new EventEmitter();

    public metaBreakLine = 'Versionsdatum';

    ref: SearchResultDetailComponent;

    constructor( ) {
        this.ref = this;
    }

    ngOnInit() {

    }

    showDetail(id: string) {
        this.currentId = id;
        this.showDetailRequest.emit(id);
    }

}
