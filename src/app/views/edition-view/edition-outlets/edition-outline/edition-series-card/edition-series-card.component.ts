import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class EditionSeriesCardComponent {
    /**
     * Readonly input signal: displayedSeries.
     *
     * It holds the data for the series to be displayed.
     */
    readonly displayedSeries = input.required<EditionOutlineSeries | null>();
}
