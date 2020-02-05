import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { EditionSvgSheet, FolioConvolute, FolioConvoluteList } from '@awg-views/edition-view/models';
import { faSquare } from '@fortawesome/free-solid-svg-icons/faSquare';

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
    folioConvoluteData: FolioConvoluteList;

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
     * It keeps the selected convolute.
     */
    selectedConvolute: FolioConvolute;

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
        if (
            this.folioConvoluteData.convolutes &&
            this.folioConvoluteData.convolutes.constructor === Array &&
            this.folioConvoluteData.convolutes.length > 0
        ) {
            this.selectedConvolute = this.folioConvoluteData.convolutes[0];
        }
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
     * It sets a given id to the
     * to the selectedConvolute.
     *
     * @param {string} id The given id.
     * @returns {void} Sets the selectedConvolute variable.
     */
    selectConvolute(id: string): void {
        if (!id) {
            return;
        }
        const convoluteIndex = this.folioConvoluteData.convolutes.findIndex(c => c.convoluteId === id);
        const convolute: FolioConvolute = this.folioConvoluteData.convolutes[convoluteIndex];
        if (convolute.folios && convolute.folios.constructor === Array && convolute.folios.length === 0) {
            // if no folio data provided, open modal
            if (convolute.linkTo) {
                this.openModal(convolute.linkTo);
            }
            return;
        }
        this.selectedConvolute = convolute;
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
