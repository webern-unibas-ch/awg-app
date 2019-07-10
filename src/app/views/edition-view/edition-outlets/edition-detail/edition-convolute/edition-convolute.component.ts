import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Folio, EditionSvgSheet } from '@awg-views/edition-view/models';
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare';

/**
 * The IFolioLegend interface.
 *
 * It represents the folio legend
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
    styleUrls: ['./edition-convolute.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionConvoluteComponent implements OnInit {
    /**
     * Input variable: folios.
     *
     * It keeps the folios of the edition detail.
     */
    @Input()
    folios: Folio[];

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
     * It keeps an event emitter for the selected id of an svg sheet.
     */
    @Output()
    selectSvgSheetRequest: EventEmitter<string> = new EventEmitter();

    /**
     * Public variable: faSquare.
     *
     * It instantiates fontawesome's faSquare icon.
     */
    faSquare = faSquare;

    /**
     * Public variable: selectedConvolute.
     *
     * It keeps the selected convolute string.
     */
    selectedConvolute: string;

    /**
     * Public variable: convolutes.
     *
     * It keeps the labels for the convolutes.
     */
    convolutes = {
        A: 'A Skizzen (Basel, Paul Sacher Stiftung)',
        B_H: 'B–H (siehe Kritischer Bericht)'
    };

    /**
     * Public variable: folioLegends.
     *
     * It keeps the legend for the folios.
     */
    folioLegends: IFolioLegend[] = [
        {
            color: 'olivedrab',
            label: 'aktuell ausgewählt'
        },
        {
            color: 'orange',
            label: 'auswählbar'
        },
        {
            color: 'grey',
            label: '(momentan noch) nicht auswählbar'
        }
    ];

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.selectedConvolute = this.convolutes.A;
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
        this.openModalRequest.emit(id);
    }

    /**
     * Public method: selectConvolute.
     *
     * It sets a given convolutelabel to the
     * to the {@link selectSvgSheetRequest}.
     *
     * @param {string} convoluteLabel The given label.
     * @returns {void} Sets the selectedConvoluteLabel variable.
     */
    selectConvolute(convoluteLabel: string): void {
        this.selectedConvolute = convoluteLabel;
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
