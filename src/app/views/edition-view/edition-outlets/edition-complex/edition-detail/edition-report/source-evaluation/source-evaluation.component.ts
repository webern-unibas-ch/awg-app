import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { UtilityService } from '@awg-core/services';
import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-route-constants';
import { EditionComplex, SourceEvaluationList } from '@awg-views/edition-view/models';

/**
 * The SourceEvaluation component.
 *
 * It contains the source evaluation section
 * of the critical report
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-source-evaluation',
    templateUrl: './source-evaluation.component.html',
    styleUrls: ['./source-evaluation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceEvaluationComponent {
    /**
     * Input variable:  editionComplex.
     *
     * It keeps the information about the current edition complex.
     */
    @Input()
    editionComplex: EditionComplex;

    /**
     * Input variable: sourceEvaluationListData.
     *
     * It keeps the source evaluation data.
     */
    @Input()
    sourceEvaluationListData: SourceEvaluationList;

    /**
     * Output variable: navigateToReportFragment.
     *
     * It keeps an event emitter for a fragment id of the edition report.
     */
    @Output()
    navigateToReportFragmentRequest: EventEmitter<string> = new EventEmitter();

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
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceEvaluationComponent;

    /**
     * Constructor of the SourceEvaluationComponent.
     *
     * It declares a public instance of the UtilityService and
     * initializes the self-referring ref variable needed for CompileHtml library.
     *
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(public utils: UtilityService) {
        this.ref = this;
    }

    /**
     * Getter variable: editionRouteConstants.
     *
     *  It returns the EDITION_ROUTE_CONSTANTS.
     **/
    get editionRouteConstants(): typeof EDITION_ROUTE_CONSTANTS {
        return EDITION_ROUTE_CONSTANTS;
    }

    /**
     * Public method: navigateToReportFragment.
     *
     * It emits a given id of a fragment of the edition report
     * to the {@link navigateToReportFragmentRequest}.
     *
     * @param {string} id The given fragment id.
     * @returns {void} Navigates to the edition report.
     */
    navigateToReportFragment(id: string) {
        if (!id) {
            return;
        }
        this.navigateToReportFragmentRequest.emit(id);
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
    openModal(id: string): void {
        if (!id) {
            return;
        }
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
        if (!id) {
            return;
        }
        this.selectSvgSheetRequest.emit(id);
    }
}
