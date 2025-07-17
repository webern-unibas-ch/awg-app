import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';

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
    @Input() id: string;

    /**
     * Input variable: labelType.
     *
     * It keeps the type of the label.
     */
    @Input() labelType: 'evaluation' | 'commentary';

    /**
     * Readonly injection variable: UTILS.
     *
     * It keeps the instance of the injected UtilityService.
     */
    readonly UTILS = inject(UtilityService);
}
