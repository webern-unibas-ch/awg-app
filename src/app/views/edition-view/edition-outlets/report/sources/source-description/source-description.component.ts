import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';

import { EditionConstants, EditionWork, EditionWorks } from '@awg-views/edition-view/models';

/**
 * The SourceDescription component.
 *
 * It contains the source description section
 * of the criitical report
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description',
    templateUrl: './source-description.component.html',
    styleUrls: ['./source-description.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceDescriptionComponent implements OnInit {
    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Readonly constant: editionWork.
     *
     * It keeps the current composition.
     */
    readonly editionWork: EditionWork = EditionWorks.op12;

    /**
     * Readonly constant: firmSignPath.
     *
     * It keeps the path to the firm sign.
     */
    readonly firmSignPath = EditionConstants.firmJENo9Lin28;

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
    openModal(id: string): void {
        this.openModalRequest.emit(id);
    }
}
