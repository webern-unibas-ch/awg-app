import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Textcritics } from '../../models';

@Component({
    selector: 'awg-edition-report-textcritics',
    templateUrl: './edition-report-textcritics.component.html',
    styleUrls: ['./edition-report-textcritics.component.css']
})
export class EditionReportTextcriticsComponent implements OnInit {
    @Input('comments') comments: Textcritics[];
    @Output() openDialogRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();

    ref: EditionReportTextcriticsComponent;

    public groupStatus: any = {
        isOpen: false
    };

    constructor() {
        this.ref = this;
    }

    ngOnInit() {
    }

    public openEditionDialog(identifier: string) {
        this.openDialogRequest.emit(identifier);
    }

    public selectSheet(identifier: string): void {
        this.selectSheetRequest.emit(identifier);
    }

}
