import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Sheet } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-sheet-control',
    templateUrl: './edition-sheet-control.component.html',
    styleUrls: ['./edition-sheet-control.component.css']
})
export class EditionSheetControlComponent implements OnInit {
    @Input() sheets: Sheet[];
    @Input() selectedSheet: Sheet;
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();

    constructor( ) {}

    ngOnInit() {

    }

    isSelectedSheet(sheet: Sheet) {
        return sheet.id === this.selectedSheet.id;
    }

    selectSheet(sheet: Sheet) {
        this.selectSheetRequest.emit(sheet.id);
    }

}
