import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * The EditionSeriesDetail component.
 *
 * It contains the detail of a series
 * of the edition view of the app
 * with another router outlet for the series detail routes.
 *
 * The selected edition series is set by the {@link editionSeriesResolver}
 * during the navigation.
 */
@Component({
    selector: 'awg-edition-series-detail',
    templateUrl: './edition-series-detail.component.html',
    styleUrl: './edition-series-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet],
})
export class EditionSeriesDetailComponent {
    // Intentionally left empty
}
