import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgFile, EditionSvgOverlay } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-svg-file',
    templateUrl: './edition-svg-file.component.html',
    styleUrls: ['./edition-svg-file.component.css']
})
export class EditionSvgFileComponent implements OnInit {
    @Input() selectedSvgFile: EditionSvgFile;
    @Input() selectedOverlay: EditionSvgOverlay;
    @Output() selectSvgFileRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectTextcriticRequest: EventEmitter<EditionSvgOverlay> = new EventEmitter();

    // init sheets
    // TODO: other solution possible?
    svgFile2: string ='Aa:SkI/2';
    svgFile3: string ='Aa:SkI/3';
    svgFile4: string ='Aa:SkI/4';
    svgFile5: string ='Aa:SkI/5';

    constructor() { }

    ngOnInit() {
    }


    isSelectedSvgFile(id: string) {
        // compare file ids
        return id === this.selectedSvgFile.id;
    };


    isSelectedTextcritic(type: any, id: string) {
        // compare stringified objects
        const overlay = new EditionSvgOverlay(type, id);
        return JSON.stringify(overlay) === JSON.stringify(this.selectedOverlay);
    }


    // request function to emit svg file id
    selectSvgFile(id: string) {
        this.selectSvgFileRequest.emit(id);
    }


    // request function to emit selected textcritic's type & id
    selectTextcritic(type: any, id: string) {
        const overlay = new EditionSvgOverlay(type, id);
        this.selectTextcriticRequest.emit(overlay);
    }

}
