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
     * The state class of the folio legend (state of the content segments).
     */
    stateClass: 'active' | 'selectable' | 'unselectable';

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
    styleUrl: './edition-folios-legend.component.scss',
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
            stateClass: 'active',
            label: 'aktuell ausgewählt',
        },
        {
            stateClass: 'selectable',
            label: 'auswählbar',
        },
        {
            stateClass: 'unselectable',
            label: '(momentan noch) nicht auswählbar',
        },
    ];
}
