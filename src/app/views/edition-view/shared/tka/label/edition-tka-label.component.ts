import { Component, input } from '@angular/core';

import { EDITION_UTILS } from '@awg-views/edition-view/utils/edition-utils';

/**
 * The EditionTkaLabel component.
 *
 * It contains the label for the textcritical comments
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-tka-label',
    templateUrl: './edition-tka-label.component.html',
    styleUrl: './edition-tka-label.component.scss',
    imports: [],
})
export class EditionTkaLabelComponent {
    /**
     * Readonly input variable: id.
     *
     * It holds the id of the sheet or textcritics.
     */
    readonly id = input.required<string>();

    /**
     * Readonly input variable: labelType.
     *
     * It holds the type of the label.
     */
    readonly labelType = input.required<'evaluation' | 'commentary'>();

    /**
     * Protected readonly variable: editionUtils.
     *
     * It keeps the reference to the {@link EDITION_UTILS} methods.
     */
    protected readonly editionUtils = EDITION_UTILS;
}
