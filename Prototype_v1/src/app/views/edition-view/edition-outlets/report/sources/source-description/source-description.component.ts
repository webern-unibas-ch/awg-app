import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'awg-source-description',
    templateUrl: './source-description.component.html',
    styleUrls: ['./source-description.component.css']
})
export class SourceDescriptionComponent implements OnInit {
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();

    showPanel: boolean;

    constructor() { }

    ngOnInit() {
    }

    openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

    togglePanel(): boolean {
        return this.showPanel = !this.showPanel;
    }

}
