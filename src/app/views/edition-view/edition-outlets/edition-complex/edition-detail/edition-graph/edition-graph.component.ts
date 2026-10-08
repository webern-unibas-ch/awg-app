import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { EditionGraphDescriptionComponent } from './edition-graph-description/edition-graph-description.component';
import { EditionGraphDynamicComponent } from './edition-graph-dynamic/edition-graph-dynamic.component';
import { EditionGraphStaticComponent } from './edition-graph-static/edition-graph-static.component';

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
    imports: [
        AlertErrorComponent,
        EditionGraphDescriptionComponent,
        EditionGraphDynamicComponent,
        EditionGraphStaticComponent,
        TwelveToneSpinnerComponent,
    ],
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
