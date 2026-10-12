import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion';

import { AlertErrorComponent } from '@awg-shared/alert-error/alert-error.component';
import { TwelveToneSpinnerComponent } from '@awg-shared/twelve-tone-spinner/twelve-tone-spinner.component';

import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';
import { EditionViewService } from '@awg-views/edition-view/services/edition-view.service';

import { SourceDescComponent } from './source-desc/source-desc.component';
import { SourceEvaluationComponent } from './source-evaluation/source-evaluation.component';
import { SourceListComponent } from './source-list/source-list.component';
import { TextcriticsListComponent } from './textcritics-list/textcritics-list.component';

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
    imports: [
        NgbAccordionModule,
        AlertErrorComponent,
        SourceDescComponent,
        SourceEvaluationComponent,
        SourceListComponent,
        TextcriticsListComponent,
        TwelveToneSpinnerComponent,
    ],
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
     * Readonly variable: REPORT_TITLES.
     *
     * It keeps an object for the titles of the report sections.
     */
    readonly REPORT_TITLES = {
        sourceList: '1. Quellenübersicht',
        sourceDesc: '2. Quellenbeschreibung',
        sourceEvaluation: '3. Quellenbewertung',
        tka: '4. Textkritische Anmerkungen',
    } as const;
}
