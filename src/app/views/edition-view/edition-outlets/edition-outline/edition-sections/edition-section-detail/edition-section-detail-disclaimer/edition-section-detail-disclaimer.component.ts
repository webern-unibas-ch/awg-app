import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AlertInfoComponent } from '@awg-shared/alert-info/alert-info.component';

/**
 * The EditionSectionDetailDisclaimer component.
 *
 * It contains a disclaimer for the section detail
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-section-detail-disclaimer',
    templateUrl: './edition-section-detail-disclaimer.component.html',
    styleUrls: ['./edition-section-detail-disclaimer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AlertInfoComponent],
})
export class EditionSectionDetailDisclaimerComponent {
    // Intentionally left empty
}
