import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ConvoluteFolio, EditionSvgFile } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-convolute',
    templateUrl: './edition-convolute.component.html',
    styleUrls: ['./edition-convolute.component.css']
})
export class EditionConvoluteComponent implements OnInit {
    @Input()
    convoluteData: ConvoluteFolio[];
    @Input()
    selectedSvgFile: EditionSvgFile;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgFileRequest: EventEmitter<string> = new EventEmitter();

    showConvolutePanel = true;

    constructor() {}

    ngOnInit() {}

    // request function to emit modal id
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }

    // request function to emit selected sheet id
    selectSvgFile(id: string) {
        this.selectSvgFileRequest.emit(id);
    }

    // helper function to toggle panel
    togglePanel(): boolean {
        return (this.showConvolutePanel = !this.showConvolutePanel);
    }
}
