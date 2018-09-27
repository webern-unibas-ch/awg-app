import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Folio, Sheet } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-convolute',
    templateUrl: './edition-convolute.component.html',
    styleUrls: ['./edition-convolute.component.css']
})
export class EditionConvoluteComponent implements OnInit {
    @Input() folioData: Folio[];
    @Input() selectedSheet: Sheet;
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();

    showConvolutePanel: boolean = true;

    constructor() { }

    ngOnInit() {
    }


    // request function to emit modal id
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }


    // request function to emit selected sheet id
    selectSheet(id: string) {
        this.selectSheetRequest.emit(id);
    }


    // helper function to toggle panel
    togglePanel(): boolean {
        return this.showConvolutePanel = !this.showConvolutePanel;
    }

}
