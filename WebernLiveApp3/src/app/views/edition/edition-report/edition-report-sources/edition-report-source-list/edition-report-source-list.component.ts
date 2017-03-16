import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Source } from '../../../models';

@Component({
    selector: 'awg-edition-report-source-list',
    templateUrl: './edition-report-source-list.component.html',
    styleUrls: ['./edition-report-source-list.component.css']
})
export class EditionReportSourceListComponent implements OnInit {
    @Input() sourceList: Source[];
    @Output() openDialogRequest: EventEmitter<string> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    openEditionDialog(identifier: string) {
        this.openDialogRequest.emit(identifier);
    }

    scrollTo(id: string) {
        this.scrollRequest.emit(id);
    }
}
