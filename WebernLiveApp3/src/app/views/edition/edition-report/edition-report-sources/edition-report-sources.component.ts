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
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<string> = new EventEmitter();

    public groupStatus: any = {
        isOpen: true
    };

    constructor() { }

    ngOnInit() {
    }

    onOpenEditionDialog(identifier: string) {
        this.openDialogRequest.emit(identifier);
    }

    onSheetSelect(identifier: string) {
        this.selectSheetRequest.emit(identifier);
    }

    scrollTo(id: string) {
        this.scrollRequest.emit(id);
    }

}
