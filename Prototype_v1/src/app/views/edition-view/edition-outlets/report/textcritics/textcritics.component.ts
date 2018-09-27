import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Textcritics } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-textcritics',
    templateUrl: './textcritics.component.html',
    styleUrls: ['./textcritics.component.css']
})
export class TextcriticsComponent implements OnInit {
    @Input() comments: Textcritics[];
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSvgFileRequest: EventEmitter<string> = new EventEmitter();

    ref: TextcriticsComponent;
    showPanel: boolean = true;

    constructor() {
        this.ref = this;
    }

    ngOnInit() {
    }

    openModal(id: string): void {
        this.openModalRequest.emit(id);
    }

    selectSvgFile(id: string): void {
        this.selectSvgFileRequest.emit(id);
    }

    togglePanel(): boolean {
        return this.showPanel = !this.showPanel;
    }
}
