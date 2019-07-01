import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgSheet, EditionSvgOverlay } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-svg-sheet',
    templateUrl: './edition-svg-sheet.component.html',
    styleUrls: ['./edition-svg-sheet.component.css']
})
export class EditionSvgSheetComponent implements OnInit {
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Input()
    selectedOverlay: EditionSvgOverlay;
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectTextcriticRequest: EventEmitter<EditionSvgOverlay> = new EventEmitter();

    // init sheets
    // TODO: other solution possible?
    svgFile2 = 'Aa:SkI/2';
    svgFile3 = 'Aa:SkI/3';
    svgFile4 = 'Aa:SkI/4';
    svgFile5 = 'Aa:SkI/5';

    constructor() {}

    ngOnInit() {}

    isSelectedSvgSheet(id: string) {
        // compare sheet id's
        return id === this.selectedSvgSheet.id;
    }

    isSelectedTextcritic(type: any, id: string) {
        // compare stringified objects
        const overlay = new EditionSvgOverlay(type, id);
        return JSON.stringify(overlay) === JSON.stringify(this.selectedOverlay);
    }

    // request function to emit svg sheet id
    selectSvgSheet(id: string) {
        this.selectSvgSheetRequest.emit(id);
    }

    // request function to emit selected textcritic's type & id
    selectTextcritic(type: any, id: string) {
        const overlay = new EditionSvgOverlay(type, id);
        this.selectTextcriticRequest.emit(overlay);
    }
}
