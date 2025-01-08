import { Component, Input } from '@angular/core';

import { EditionComplex } from '@awg-views/edition-view/models';

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
    editionComplex: EditionComplex;

    /**
     * Input variable: editionLabel.
     *
     * It keeps the edition label for the intro partial disclaimer.
     */
    @Input()
    editionLabel: string;

    /**
     * Input variable: editionRoute.
     *
     * It keeps the edition route for the intro partial disclaimer.
     */
    @Input()
    editionRoute: string;

    /**
     * Input variable: seriesRoute.
     *
     * It keeps the series route for the intro partial disclaimer.
     */
    @Input()
    seriesRoute: string;

    /**
     * Input variable: sectionRoute.
     *
     * It keeps the section route for the intro partial disclaimer.
     */
    @Input()
    sectionRoute: string;

    /**
     * Input variable: introRoute.
     *
     * It keeps the intro route for the intro partial disclaimer.
     */
    @Input()
    introRoute: string;
}
