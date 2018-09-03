import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SourceList } from '../../../models';

@Component({
    selector: 'awg-sources',
    templateUrl: './sources.component.html',
    styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {
    @Input() sourceList: SourceList;
    @Output() openModalRequest: EventEmitter<any> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<any> = new EventEmitter();

    showDescriptionPanel: boolean = false;

    constructor() { }

    ngOnInit() {
    }

    openModal(identifier: string) {
        // emit event to open modal
        this.openModalRequest.emit(identifier);
    }

    scrollTo(id: string) {
        // if description is closed: open it before scrolling
        if (!this.showDescriptionPanel) { this.toggleDescriptionPanel(this.showDescriptionPanel); }
        // emit scroll request event
        this.scrollRequest.emit(id);
    }

    toggleDescriptionPanel(showPanel: boolean): boolean {
        // toggle boolean value of showDescriptionPanel after emitting toggle event
        return this.showDescriptionPanel = this.togglePanel(showPanel);
    }


    togglePanel(showPanel: boolean): boolean {
        return showPanel = !showPanel;
    }

}
