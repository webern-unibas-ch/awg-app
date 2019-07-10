import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { SourceList } from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-source-list',
    templateUrl: './source-list.component.html',
    styleUrls: ['./source-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceListComponent {
    @Input()
    sourceListData: SourceList;

    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

    showListPanel = true;
    ref: SourceListComponent;

    constructor() {
        this.ref = this;
    }

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

    /**
     * Public method: togglePanel.
     *
     * It toggles the showListPanel flag.
     *
     * @returns {boolean} Sets the showListPanel flag.
     */
    togglePanel(): boolean {
        return (this.showListPanel = !this.showListPanel);
    }
}
