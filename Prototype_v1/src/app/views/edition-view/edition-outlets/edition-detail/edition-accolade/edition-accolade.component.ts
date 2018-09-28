import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgFile, Overlay, Textcritics } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-accolade',
    templateUrl: './edition-accolade.component.html',
    styleUrls: ['./edition-accolade.component.css']
})
export class EditionAccoladeComponent implements OnInit {
    @Input() svgFileData: EditionSvgFile[];
    @Input() selectedSvgFile: EditionSvgFile;
    @Input() selectedTextcritics: Textcritics[];
    @Input() selectedOverlay: Overlay;
    @Input() showTkA: boolean;
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSvgFileRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectTextcriticRequest: EventEmitter<Overlay> = new EventEmitter();

    showAccoladePanel: boolean = true;

    constructor() { }

    ngOnInit() {
    }

    // request function to emit modal id
    openModal(id: string) {
        this.openModalRequest.emit(id);
    }


    // request function to emit selected svg file id
    selectSvgFile(id: string) {
        this.selectSvgFileRequest.emit(id);
    }

    // request function to emit selected textcritic's type & id
    selectTextcritic($event: Overlay) {
        this.selectTextcriticRequest.emit($event);
    }


    // helper function to toggle panel
    togglePanel(): boolean {
        return this.showAccoladePanel = !this.showAccoladePanel;
    }

}
