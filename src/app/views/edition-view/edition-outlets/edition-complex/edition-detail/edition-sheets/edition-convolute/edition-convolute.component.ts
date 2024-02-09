import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { faSquare } from '@fortawesome/free-solid-svg-icons';

import { EditionSvgSheet, FolioConvolute } from '@awg-views/edition-view/models';

/**
 * The IFolioLegend interface.
 *
 * It represents the interface for a folio legend
 * of an edition convolute folio.
 */
interface IFolioLegend {
    /**
     * The color of the folio legend.
     */
    color: string;

    /**
     * The label of the folio legend.
     */
    label: string;
}

/**
 * The EditionConvolute component.
 *
 * It contains the edition convolute section
 * of the edition view of the app
 * with the {@link EditionFolioComponent}.
 */
@Component({
    selector: 'awg-edition-convolute',
    templateUrl: './edition-convolute.component.html',
    styleUrls: ['./edition-convolute.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionConvoluteComponent {
    /**
     * Public variable: selectedConvolute.
     *
     * It keeps the selected convolute.
     */
    @Input()
    selectedConvolute: FolioConvolute;

    /**
     * Public variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input()
    selectedSvgSheet: EditionSvgSheet;

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
     * Public variable: faSquare.
     *
     * It instantiates fontawesome's faSquare icon.
     */
    faSquare = faSquare;

    /**
     * Public variable: folioLegends.
     *
     * It keeps the legend for the folios.
     */
    folioLegends: IFolioLegend[] = [
        {
            color: 'olivedrab',
            label: 'aktuell ausgewählt',
        },
        {
            color: 'orange',
            label: 'auswählbar',
        },
        {
            color: 'grey',
            label: '(momentan noch) nicht auswählbar',
        },
    ];

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
     * @param {object} sheetIds The given sheet ids as { complexId: string, sheetId: string }.
     * @returns {void} Emits the ids.
     */
    selectSvgSheet(sheetIds: { complexId: string; sheetId: string }): void {
        if (!sheetIds?.sheetId) {
            return;
        }
        this.selectSvgSheetRequest.emit(sheetIds);
    }
}
