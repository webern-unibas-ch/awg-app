import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionConstants, EditionWorks, SourceDescriptionList } from '@awg-views/edition-view/models';

/**
 * The SourceDescription component.
 *
 * It contains the source description section
 * of the critical report
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
     * Input variable: sourceDescriptionListData.
     *
     * It keeps the source list data.
     */
    @Input()
    sourceDescriptionListData: SourceDescriptionList;

    /**
     * Output variable: openModalRequest.
     *
     * It keeps an event emitter to open the modal
     * with the selected modal text snippet.
     */
    @Output()
    openModalRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Output variable: selectSvgSheetRequest.
     *
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Readonly constant: firmSigns.
     *
     * It keeps the routes to the firm signs.
     */
    readonly firmSigns = {
        op12: {
            A: [EditionConstants.firmJENo9Lin28]
        },
        op25: {
            A: [EditionConstants.firmJENo15Lin16]
        }
    };

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionComponent;

    /**
     * Constructor of the EditionDetailComponent.
     *
     * It declares the self-referring variable
     * needed for CompileHtml library.
     */
    constructor() {
        this.ref = this;
    }

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

    /**
     * Public method: selectSvgSheet.
     *
     * It emits a given id of a selected svg sheet
     * to the {@link selectSvgSheetRequest}.
     *
     * @param {string} id The given sheet id.
     * @returns {void} Emits the id.
     */
    selectSvgSheet(id: string): void {
        this.selectSvgSheetRequest.emit(id);
    }
}
