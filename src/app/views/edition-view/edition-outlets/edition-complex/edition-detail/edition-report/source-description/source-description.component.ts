import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { UtilityService } from '@awg-core/services';
import { EDITION_FIRM_SIGNS_DATA } from '@awg-views/edition-view/data';
import { SourceDescriptionList } from '@awg-views/edition-view/models';

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
    styleUrls: ['./source-description.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceDescriptionComponent {
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
     * It keeps an event emitter for the selected ids of an edition complex and svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<{ complexId: string; sheetId: string }> = new EventEmitter();

    /**
     * Readonly variable: FIRM_SIGNS.
     *
     * It keeps the routes to the firm signs.
     */
    readonly FIRM_SIGNS = {
        OP12: {
            A: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_9_LIN_28],
            B: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_2_LIN_12_B],
        },
        OP25: {
            A: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_15_LIN_16],
            B: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_2_LIN_12],
            C: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_3_LIN_14],
        },
        OP27: {
            B: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_6_LIN_20],
        },
        M30: {
            B: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_B],
        },
        M31: {
            B: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_B],
        },
        M34: {
            A: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_C],
            B: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_D],
        },
        M35_42: {
            A: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_C],
            B: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_C],
            C: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_D],
            D: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_D],
        },
        M37: {
            A: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_C],
            B: [EDITION_FIRM_SIGNS_DATA.FIRM_JE_NO_5_LIN_18_D],
        },
    };

    /**
     * Self-referring variable needed for CompileHtml library.
     */
    ref: SourceDescriptionComponent;

    /**
     * Constructor of the SourceDescriptionComponent.
     *
     * It declares a public instance of the UtilityService and
     * initializes the self-referring variable needed for CompileHtml library.
     *
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(public utils: UtilityService) {
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
    openModal(id: string): void {
        if (!id) {
            return;
        }
        this.openModalRequest.emit(id);
    }

    /**
     * Public method: selectSvgSheet.
     *
     * It emits the given ids of a selected edition complex
     * and svg sheet to the {@link selectSvgSheetRequest}.
     *
     * @param {string} complexId The given complex id.
     * @param {string} sheetId The given sheet id.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(complexId: string, sheetId: string): void {
        if (!sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit({ complexId: complexId, sheetId: sheetId });
    }
}
