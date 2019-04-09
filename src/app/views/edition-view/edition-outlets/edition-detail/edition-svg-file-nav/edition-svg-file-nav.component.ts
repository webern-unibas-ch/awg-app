import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgFile } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-svg-file-nav',
    templateUrl: './edition-svg-file-nav.component.html',
    styleUrls: ['./edition-svg-file-nav.component.css']
})
export class EditionSvgFileNavComponent implements OnInit {
    @Input()
    svgFileData: EditionSvgFile[];
    @Input()
    selectedSvgFile: EditionSvgFile;
    @Output()
    selectSvgFileRequest: EventEmitter<string> = new EventEmitter();

    constructor() {}

    ngOnInit() {}

    isSelectedSvgFile(svgFile: EditionSvgFile) {
        return svgFile.id === this.selectedSvgFile.id;
    }

    selectSvgFile(svgFile: EditionSvgFile) {
        this.selectSvgFileRequest.emit(svgFile.id);
    }
}
