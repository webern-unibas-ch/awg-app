import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'awg-edition-image-control',
    templateUrl: './edition-image-control.component.html',
    styleUrls: ['./edition-image-control.component.css']
})
export class EditionImageControlComponent implements OnInit {
    @Input() current_sheet: string;
    @Input() sheets: string[];
    @Output() selectSheetRequest: EventEmitter<any> = new EventEmitter();

    // current_sheet: string;

    constructor() { }

    ngOnInit() {
        console.log('sheets: ', this.sheets);
    }

    isActiveSheet(id: string) {
        // TODO: compare id with real input
        console.log('FUNC activeSheet called from ImageControl:');
        return this.current_sheet == id;
    }

    selectSheet(id) {
        this.selectSheetRequest.emit(id);
        this.current_sheet = id;
    }

}
