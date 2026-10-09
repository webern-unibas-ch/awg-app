import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ButtonExpandAllComponent } from '@awg-shared/button-expand-all/button-expand-all.component';
import { createExpandAllState } from '@awg-shared/button-expand-all/button-expand-all.utils';
import { CompileHtmlDirective } from '@awg-shared/compile-html/compile-html.directive';

import { Textcritics } from '@awg-views/edition-view/models/textcritics.model';
import { EditionTkaEvaluationsComponent } from '@awg-views/edition-view/shared/tka/evaluations/edition-tka-evaluations.component';
import { EditionTkaTableComponent } from '@awg-views/edition-view/shared/tka/table/edition-tka-table.component';

/**
 * The SourceDescCorrections component.
 *
 * It contains the source description corrections section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-corrections',
    templateUrl: './source-desc-corrections.component.html',
    styleUrls: ['./source-desc-corrections.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonExpandAllComponent, CompileHtmlDirective, EditionTkaEvaluationsComponent, EditionTkaTableComponent],
})
export class SourceDescCorrectionsComponent {
    /**
     * Readonly input signal: corrections.
     *
     * It holds the corrections data.
     */
    readonly corrections = input.required<Textcritics[]>();

    /**
     * Readonly variable: correctionsState.
     *
     * It holds the open state of the correction details (closed by default).
     */
    readonly correctionsState = createExpandAllState(() => this.corrections().map(correction => correction.id), false);
}
