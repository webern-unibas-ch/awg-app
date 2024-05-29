import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UtilityService } from '@awg-core/services';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionTkaLabelComponent {
    /**
     * Input variable: id.
     *
     * It keeps the id of the sheet or textcritics.
     */
    @Input() id: string;

    /**
     * Input variable: labelType.
     *
     * It keeps the type of the label.
     */
    @Input() labelType: 'evaluation' | 'comment';

    /**
     * Constructor of the EditionTkaLabelComponent.
     *
     * It declares a public instance of the UtilityService.
     *
     * @param {UtilityService} utils Instance of the UtilityService.
     */
    constructor(public utils: UtilityService) {}
}
