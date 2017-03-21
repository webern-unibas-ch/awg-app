import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'awg-edition-detail-tka-table',
    templateUrl: './edition-detail-tka-table.component.html',
    styleUrls: ['./edition-detail-tka-table.component.css']
})
export class EditionDetailTkaTableComponent implements OnInit {
    @Input() items: string[];
    @Output() openDialogRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();

    ref: EditionDetailTkaTableComponent;

    constructor( ) {
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
