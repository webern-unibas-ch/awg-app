import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

/**
 * The EditionReport component.
 *
 * It contains the report section of the edition view of the app.
 */
@Component({
    selector: 'awg-edition-report',
    templateUrl: './edition-report.component.html',
    styleUrls: ['./edition-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class EditionReportComponent {
    /**
     * Readonly signal: selectedEditionComplex.
     *
     * It holds the state of the selected edition complex.
     */
    readonly selectedEditionComplex = inject(EditionStateService).selectedEditionComplex;

    /**
     * Readonly signal: viewData.
     *
     * It holds the state of the report view data.
     */
    readonly viewData = inject(EditionViewService).reportViewData;

    /**
     * Readonly variable: titles.
     *
     * It keeps an object for the titles of the report sections.
     */
    readonly titles = {
        sourceList: '1. Quellenübersicht',
        sourceDescription: '2. Quellenbeschreibung',
        sourceEvaluation: '3. Quellenbewertung',
        tka: '4. Textkritische Anmerkungen',
    };
}
