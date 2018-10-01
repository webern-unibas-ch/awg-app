import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Source } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-source-list',
    templateUrl: './source-list.component.html',
    styleUrls: ['./source-list.component.css']
})
export class SourceListComponent implements OnInit {
    @Input() sourceList: Source[];
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<any> = new EventEmitter();

    showListPanel: boolean = true;
    ref: SourceListComponent;

    constructor() {
        this.ref = this;
    }

    ngOnInit() {
    }


    openModal(id: string) {
        this.openModalRequest.emit(id);
    }


    scrollTo(id: string) {
        this.scrollRequest.emit(id);
    }


    togglePanel(): boolean {
        return this.showListPanel = !this.showListPanel;
    }

}
