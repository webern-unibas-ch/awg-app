import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgSheet } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-svg-sheet-nav',
    templateUrl: './edition-svg-sheet-nav.component.html',
    styleUrls: ['./edition-svg-sheet-nav.component.css']
})
export class EditionSvgSheetNavComponent implements OnInit {
    @Input()
    svgSheetsData: EditionSvgSheet[];
    @Input()
    selectedSvgSheet: EditionSvgSheet;
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    isSelectedSvgFile(svgFile: EditionSvgSheet) {
        return svgFile.id === this.selectedSvgSheet.id;
    }

    selectSvgFile(svgFile: EditionSvgSheet) {
        this.selectSvgSheetRequest.emit(svgFile.id);
    }
}
