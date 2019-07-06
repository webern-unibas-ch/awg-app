import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SourceList } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-sources',
    templateUrl: './sources.component.html',
    styleUrls: ['./sources.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourcesComponent implements OnInit {
    @Input()
    sourceListData: SourceList;
    @Output()
    openModalRequest: EventEmitter<any> = new EventEmitter();

    showDescriptionPanel = true;

    constructor() {}

    ngOnInit() {}

    openModal(id: string) {
        // emit event to open modal
        this.openModalRequest.emit(id);
    }

    scrollTo(id: string) {
        // if description is closed: open it before scrolling
        // TODO: change calling logic
        if (!this.showDescriptionPanel) {
            this.toggleDescriptionPanel(this.showDescriptionPanel);
        }
    }

    toggleDescriptionPanel(showPanel: boolean): boolean {
        // toggle boolean value of showDescriptionPanel after emitting toggle event
        return (this.showDescriptionPanel = this.togglePanel(showPanel));
    }

    togglePanel(showPanel: boolean): boolean {
        return (showPanel = !showPanel);
    }
}
