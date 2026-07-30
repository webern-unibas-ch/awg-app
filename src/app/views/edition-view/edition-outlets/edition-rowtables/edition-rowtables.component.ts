import { Component, inject } from '@angular/core';

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
    standalone: false,
})
export class EditionRowtablesComponent {
    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the rowtables view data from the EditionViewService.
     */
    readonly viewData = inject(EditionViewService).rowtablesViewData;
}
