import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgSheet, EditionSvgOverlay, Textcritics } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-accolade',
    templateUrl: './edition-accolade.component.html',
    styleUrls: ['./edition-accolade.component.css']
})
export class EditionAccoladeComponent implements OnInit {
    @Input()
    svgSheetsData: EditionSvgSheet[];
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Input()
    selectedTextcritics: Textcritics[];
    @Input()
    selectedOverlay: EditionSvgOverlay;
    @Input()
    showTkA: boolean;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectTextcriticRequest: EventEmitter<EditionSvgOverlay> = new EventEmitter();

    showAccoladePanel = true;

    constructor() {}

    ngOnInit() {}

    // request function to emit modal id
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }

    // request function to emit selected svg sheet id
    selectSvgSheet(id: string) {
        this.selectSvgSheetRequest.emit(id);
    }

    // request function to emit selected textcritic's type & id
    selectTextcritic($event: EditionSvgOverlay) {
        this.selectTextcriticRequest.emit($event);
    }

    // helper function to toggle panel
    togglePanel(): boolean {
        return (this.showAccoladePanel = !this.showAccoladePanel);
    }
}
