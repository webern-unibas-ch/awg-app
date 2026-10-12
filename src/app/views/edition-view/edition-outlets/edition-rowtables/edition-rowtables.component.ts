import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { ButtonMoreComponent } from '@awg-shared/button-more/button-more.component';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

/**
 * The EditionRowtables component.
 *
 * It contains the rowtables overview
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-rowtables',
    templateUrl: './edition-rowtables.component.html',
    styleUrls: ['./edition-rowtables.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AlertErrorComponent, ButtonMoreComponent, TwelveToneSpinnerComponent],
})
export class EditionRowtablesComponent {
    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the rowtables view data from the EditionViewService.
     */
    readonly viewData = inject(EditionViewService).rowtablesViewData;
}
