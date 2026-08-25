import { Component, Input } from '@angular/core';

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
    standalone: false,
})
export class EditionIntroPartialDisclaimerComponent {
    /**
     * Input variable: editionComplex.
     *
     * It keeps the editionComplex for the intro partial disclaimer.
     */
    @Input()
    editionComplex: EditionComplex | null = null;

    /**
     * Readonly variable: introRoute.
     *
     * It keeps the route to the edition intro view.
     */
    readonly introRoute = EDITION_ROUTE_CONSTANTS.EDITION_INTRO.route;
}
