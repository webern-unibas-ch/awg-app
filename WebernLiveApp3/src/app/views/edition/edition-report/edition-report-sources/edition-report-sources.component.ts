import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Source } from '../../models';

@Component({
    selector: 'awg-edition-report-sources',
    templateUrl: './edition-report-sources.component.html',
    styleUrls: ['./edition-report-sources.component.css']
})
export class EditionReportSourcesComponent implements OnInit {

    @Input() sourceList: Source[];
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
