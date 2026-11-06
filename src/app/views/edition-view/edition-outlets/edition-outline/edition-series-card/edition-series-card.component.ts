import { Component, input } from '@angular/core';

import { ButtonMoreComponent } from '@awg-shared/button-more/button-more.component';
import { ConditionalLinkComponent } from '@awg-shared/conditional-link/conditional-link.component';

import { EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';

/**
 * The EditionSeriesCard component.
 *
 *
 * It contains the card for a single series
 * in the edition view of the app.
 */
@Component({
    selector: 'awg-edition-series-card',
    templateUrl: './edition-series-card.component.html',
    styleUrl: './edition-series-card.component.scss',
    imports: [ButtonMoreComponent, ConditionalLinkComponent],
})
export class EditionSeriesCardComponent {
    /**
     * Readonly input signal: displayedSeries.
     *
     * It holds the data for the series to be displayed.
     */
    readonly displayedSeries = input.required<EditionOutlineSeries | null>();
}
