import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
     * Input variable: id.
     *
     * It keeps the id of the sheet or textcritics.
     */
    @Input() id: string | undefined;

    /**
     * Input variable: labelType.
     *
     * It keeps the type of the label.
     */
    @Input() labelType: 'evaluation' | 'commentary' | undefined;

    /**
     * Protected readonly variable: EDITION_UTILS.
     *
     * It keeps the reference to the {@link EDITION_UTILS} methods.
     */
    protected readonly EDITION_UTILS = EDITION_UTILS;
}
