import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'awg-edition-tka-table',
    templateUrl: './edition-tka-table.component.html',
    styleUrls: ['./edition-tka-table.component.css']
})
export class EditionTkaTableComponent implements OnInit {
    @Input() textcritics: string[];
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();

    ref: EditionTkaTableComponent;

    constructor() {
        this.ref = this;
    }


    ngOnInit() {
    }

    public openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

    public selectSheet(identifier: string): void {
        this.selectSheetRequest.emit(identifier);
    }

}
