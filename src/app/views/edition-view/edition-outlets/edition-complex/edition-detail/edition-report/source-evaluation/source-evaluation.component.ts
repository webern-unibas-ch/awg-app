import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { SourceEvaluationList } from '@awg-views/edition-view/models/source-evaluation.model';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';
import { EditionComplexPlaceholderComponent } from '@awg-views/edition-view/shared/placeholder/edition-complex-placeholder.component';

/**
 * The SourceEvaluation component.
 *
 * It contains the source evaluation section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-evaluation',
    templateUrl: './source-evaluation.component.html',
    styleUrls: ['./source-evaluation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CompileHtmlDirective, EditionComplexPlaceholderComponent],
})
export class SourceEvaluationComponent {
    /**
     * Readonly input signal: editionComplex.
     *
     * It holds the editionComplex for the source evaluation.
     */
    readonly editionComplex = input.required<EditionComplex | null>();

    /**
     * Readonly input signal: sourceEvaluationListData.
     *
     * It holds the source evaluation data.
     */
    readonly sourceEvaluationListData = input.required<SourceEvaluationList | null>();
}
