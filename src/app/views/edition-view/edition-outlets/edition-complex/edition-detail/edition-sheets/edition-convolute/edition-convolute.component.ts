import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
     * The color class of the folio legend.
     */
    colorClass: string;

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
    standalone: false,
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
            colorClass: 'olivedrab',
            label: 'aktuell ausgewählt',
        },
        {
            colorClass: 'orange',
            label: 'auswählbar',
        },
        {
            colorClass: 'grey',
            label: '(momentan noch) nicht auswählbar',
        },
    ];
}
