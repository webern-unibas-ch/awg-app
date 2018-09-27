import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Source } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-sources',
    templateUrl: './sources.component.html',
    styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {
    @Input() sourceList: Source[];
    @Output() openModalRequest: EventEmitter<any> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<any> = new EventEmitter();

    showDescriptionPanel: boolean = true;

    constructor() { }

    ngOnInit() {
    }

    openModal(id: string) {
        // emit event to open modal
        this.openModalRequest.emit(id);
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
