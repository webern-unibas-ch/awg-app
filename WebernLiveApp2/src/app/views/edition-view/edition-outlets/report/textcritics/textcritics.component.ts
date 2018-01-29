import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Textcritics } from '../../../models/textcritics.model';

@Component({
    selector: 'awg-textcritics',
    templateUrl: './textcritics.component.html',
    styleUrls: ['./textcritics.component.css']
})
export class TextcriticsComponent implements OnInit {
    @Input() comments: Textcritics[];
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() selectSheetRequest: EventEmitter<string> = new EventEmitter();

    ref: TextcriticsComponent;
    showPanel: boolean;

    constructor() {
        this.ref = this;
    }

    ngOnInit() {
    }

    openModal(identifier: string): void {
        this.openModalRequest.emit(identifier);
    }

    selectSheet(identifier: string): void {
        this.selectSheetRequest.emit(identifier);
    }

    togglePanel(): boolean {
        return this.showPanel = !this.showPanel;
    }
}
