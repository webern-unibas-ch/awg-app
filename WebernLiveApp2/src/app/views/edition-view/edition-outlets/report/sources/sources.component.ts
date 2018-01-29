import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SourceList } from '../../../models';

@Component({
    selector: 'awg-sources',
    templateUrl: './sources.component.html',
    styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {
    @Input() sourceList: SourceList;
    @Output() openModalRequest: EventEmitter<any> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

    scrollTo(id: string) {
        this.scrollRequest.emit(id);
    }

}
