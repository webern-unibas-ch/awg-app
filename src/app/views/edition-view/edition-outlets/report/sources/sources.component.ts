import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SourceList } from '@awg-views/edition-view/models';

/**
 * The Sources component.
 *
 * It contains the sources section of the critical report
 * of the edition view of the app with a
 * {@link SourceListComponent}, a {@link SourceDescriptionComponent},
 * and the {@link SourceEvaluationComponent}.
 */
@Component({
    selector: 'awg-sources',
    templateUrl: './sources.component.html',
    styleUrls: ['./sources.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourcesComponent implements OnInit {
    /**
     * Input variable: sourceListData.
     *
     * It keeps the source list data.
     */
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

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}

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
}
