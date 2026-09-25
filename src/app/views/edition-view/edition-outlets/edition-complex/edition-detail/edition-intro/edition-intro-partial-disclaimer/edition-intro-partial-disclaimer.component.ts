import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EDITION_ROUTE_CONSTANTS } from '@awg-views/edition-view/edition-routes.constants';
import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';

/**
 * The EditionIntroPartialDisclaimer component.
 *
 * It contains the disclaimer for a partial intro
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-intro-partial-disclaimer',
    templateUrl: './edition-intro-partial-disclaimer.component.html',
    styleUrls: ['./edition-intro-partial-disclaimer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
})
export class EditionIntroPartialDisclaimerComponent {
    /**
     * Readonly input signal: editionComplex.
     *
     * It holds the editionComplex for the intro partial disclaimer.
     */
    readonly editionComplex = input.required<EditionComplex | null>();

    /**
     * Readonly variable: introRoute.
     *
     * It keeps the route to the edition intro view.
     */
    readonly introRoute = EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route;
}
