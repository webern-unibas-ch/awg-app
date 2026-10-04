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
 * The EditionFoliosPanel component.
 *
 * It contains the folios panel (convolute overview)
 * of the edition view of the app
 * with the {@link EditionFoliosViewerComponent}.
 */
@Component({
    selector: 'awg-edition-folios-panel',
    templateUrl: './edition-folios-panel.component.html',
    styleUrls: ['./edition-folios-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionFoliosPanelComponent {
    /**
     * Public variable: selectedConvolute.
     *
     * It keeps the selected convolute.
     */
    @Input()
    selectedConvolute: FolioConvolute | undefined;

    /**
     * Public variable: selectedSvgSheet.
     *
     * It keeps the selected svg sheet.
     */
    @Input()
    selectedSvgSheet: EditionSvgSheet | undefined;

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
