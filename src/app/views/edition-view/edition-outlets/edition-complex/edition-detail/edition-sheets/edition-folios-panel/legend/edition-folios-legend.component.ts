import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

/**
 * The FolioLegend interface.
 *
 * It represents a legend entry for the content segments
 * of the edition folios.
 */
interface FolioLegend {
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
 * The EditionFoliosLegend component.
 *
 * It contains the color legend for the content segments
 * of the folios panel of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-folios-legend',
    templateUrl: './edition-folios-legend.component.html',
    styleUrls: ['./edition-folios-legend.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent],
})
export class EditionFoliosLegendComponent {
    /**
     * Readonly variable: faSquare.
     *
     * It instantiates fontawesome's faSquare icon.
     */
    readonly faSquare = faSquare;

    /**
     * Readonly variable: folioLegends.
     *
     * It keeps the legend entries for the content segments of the folios.
     */
    readonly folioLegends: FolioLegend[] = [
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
