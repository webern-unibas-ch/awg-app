import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Source } from '../../models';

@Component({
    selector: 'awg-edition-report-sources',
    templateUrl: './edition-report-sources.component.html',
    styleUrls: ['./edition-report-sources.component.css']
})
export class EditionReportSourcesComponent implements OnInit {
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
