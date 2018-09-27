import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgFile } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-svg-panel',
    templateUrl: './edition-svg-panel.component.html',
    styleUrls: ['./edition-svg-panel.component.css']
})
export class EditionSvgPanelComponent implements OnInit {
    @Input() selectedSvgFile: EditionSvgFile;
    @Input() selectedTextcriticId: string;
    @Output() selectSvgFileRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectTextcriticRequest: EventEmitter<{field: string, id: string}> = new EventEmitter();

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
        return id === this.selectedSvgFile.id;
    };


    isSelectedTextcritic(id: string) {
        return id === this.selectedTextcriticId;
    }


    selectSvgFile(id: string) {
        this.selectSvgFileRequest.emit(id);
    }


    selectTextcritic(field: string, id: string) {
        this.selectTextcriticRequest.emit({field, id});
    }

}
