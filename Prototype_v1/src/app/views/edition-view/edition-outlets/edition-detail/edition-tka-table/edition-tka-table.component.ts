import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'awg-edition-tka-table',
    templateUrl: './edition-tka-table.component.html',
    styleUrls: ['./edition-tka-table.component.css']
})
export class EditionTkaTableComponent implements OnInit {
    @Input() selectedTextcritics: string[];
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();

    ref: EditionTkaTableComponent;

    constructor() {
        this.ref = this;
    }


    ngOnInit() {
    }

    openModal(id: string) {
        this.openModalRequest.emit(id);
    }

    selectSheet(id: string): void {
        this.selectSheetRequest.emit(id);
    }

}
