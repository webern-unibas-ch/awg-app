import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SourceList } from '../../../../models';

@Component({
    selector: 'awg-source-list',
    templateUrl: './source-list.component.html',
    styleUrls: ['./source-list.component.css']
})
export class SourceListComponent implements OnInit {
    @Input() sourceList: SourceList;
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<any> = new EventEmitter();

    showPanel: boolean;
    ref: SourceListComponent;

    constructor() {
        this.ref = this;
    }

    ngOnInit() {
    }

    openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

    scrollTo(id: string) {
        this.scrollRequest.emit(id);
    }

    togglePanel(): boolean {
        return this.showPanel = !this.showPanel;
    }

}
