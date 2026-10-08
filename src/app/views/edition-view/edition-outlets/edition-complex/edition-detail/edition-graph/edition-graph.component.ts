import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

/**
 * The EditionGraph component.
 *
 * It contains the graph section
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-graph',
    templateUrl: './edition-graph.component.html',
    styleUrls: ['./edition-graph.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionGraphComponent {
    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the graph view data.
     */
    readonly viewData = inject(EditionViewService).graphViewData;

    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = inject(EditionStateService).selectedEditionComplex;
}
