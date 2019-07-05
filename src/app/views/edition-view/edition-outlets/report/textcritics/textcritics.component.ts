import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TextcriticsList } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-textcritics',
    templateUrl: './textcritics.component.html',
    styleUrls: ['./textcritics.component.css']
})
export class TextcriticsComponent implements OnInit {
    @Input()
    textcriticsData: TextcriticsList;
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    ref: TextcriticsComponent;
    showPanel = true;

    constructor() {
        this.ref = this;
    }

    ngOnInit() {}

    openModal(id: string): void {
        this.openModalRequest.emit(id);
    }

    selectSvgSheet(id: string): void {
        this.selectSvgSheetRequest.emit(id);
    }

    togglePanel(): boolean {
        return (this.showPanel = !this.showPanel);
    }
}
