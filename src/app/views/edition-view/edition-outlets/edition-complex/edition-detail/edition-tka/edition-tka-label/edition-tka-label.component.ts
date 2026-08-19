import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EDITION_UTILS } from '@awg-shared/utils/edition-utils';

/**
 * The EditionTkaLabel component.
 *
 * It contains the label for the textcritical comments
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-tka-label',
    templateUrl: './edition-tka-label.component.html',
    styleUrls: ['./edition-tka-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
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
     * It hols the type of the label.
     */
    readonly labelType = input.required<'evaluation' | 'commentary'>();

    /**
     * Protected readonly variable: EDITION_UTILS.
     *
     * It keeps the reference to the {@link EDITION_UTILS} methods.
     */
    protected readonly EDITION_UTILS = EDITION_UTILS;
}
