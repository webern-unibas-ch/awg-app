import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgSheet } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-svg-file-nav',
    templateUrl: './edition-svg-file-nav.component.html',
    styleUrls: ['./edition-svg-file-nav.component.css']
})
export class EditionSvgFileNavComponent implements OnInit {
    @Input()
    svgFileData: EditionSvgSheet[];
    @Input()
    selectedSvgFile: EditionSvgSheet;
    @Output()
    selectSvgFileRequest: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    isSelectedSvgFile(svgFile: EditionSvgSheet) {
        return svgFile.id === this.selectedSvgFile.id;
    }

    selectSvgFile(svgFile: EditionSvgSheet) {
        this.selectSvgFileRequest.emit(svgFile.id);
    }
}
