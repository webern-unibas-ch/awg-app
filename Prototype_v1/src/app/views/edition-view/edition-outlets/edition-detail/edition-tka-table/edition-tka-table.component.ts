import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Textcritics } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-tka-table',
    templateUrl: './edition-tka-table.component.html',
    styleUrls: ['./edition-tka-table.component.css']
})
export class EditionTkaTableComponent implements OnInit {
    @Input() selectedTextcritics: Textcritics[];
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSvgFileRequest: EventEmitter<string> = new EventEmitter();

    ref: EditionTkaTableComponent;

    constructor() {
        this.ref = this;
    }


    ngOnInit() {
    }

    openModal(id: string) {
        this.openModalRequest.emit(id);
    }

    selectSvgFile(id: string): void {
        this.selectSvgFileRequest.emit(id);
    }

}
