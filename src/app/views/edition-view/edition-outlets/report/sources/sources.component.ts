import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { SourceList } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-sources',
    templateUrl: './sources.component.html',
    styleUrls: ['./sources.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourcesComponent {
    @Input()
    sourceListData: SourceList;

    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<any> = new EventEmitter();

    showDescriptionPanel = true;

    /**
     * Public method: openModal.
     *
     * It emits a given id of a modal snippet text
     * to the {@link openModalRequest}.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Emits the id.
     */
    openModal(id: string) {
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
