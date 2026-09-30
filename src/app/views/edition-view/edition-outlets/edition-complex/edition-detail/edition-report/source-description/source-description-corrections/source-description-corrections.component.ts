import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

import { ButtonExpandAllComponent } from '@awg-shared/button-expand-all/button-expand-all.component';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { Textcritics } from '@awg-views/edition-view/models/textcritics.model';

import { EditionTkaEvaluationsComponent } from '../../../edition-tka/edition-tka-evaluations/edition-tka-evaluations.component';
import { EditionTkaTableComponent } from '../../../edition-tka/edition-tka-table/edition-tka-table.component';

/**
 * The SourceDescriptionCorrections component.
 *
 * It contains the source description corrections section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-description-corrections',
    templateUrl: './source-description-corrections.component.html',
    styleUrls: ['./source-description-corrections.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonExpandAllComponent, CompileHtmlDirective, EditionTkaEvaluationsComponent, EditionTkaTableComponent],
})
export class SourceDescriptionCorrectionsComponent {
    /**
     * Readonly input signal: corrections.
     *
     * It holds the corrections data.
     */
    readonly corrections = input.required<Textcritics[]>();

    /**
     * Public signal: openAllCorrectionDetails.
     *
     * It holds the boolean value to set the open state of all details in the source description corrections.
     */
    openAllCorrectionDetails = signal<boolean>(false);
}
